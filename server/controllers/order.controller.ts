import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel from "../models/order.Model";
import EbookOrderModel from "../models/bookOrder.Model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import EbookModel from "../models/ebook.model";
import NotificationModel from "../models/notification.Model";
import { getAllOrdersService } from "../services/order.service";
import { redis } from "../utils/redis";
import sendMail from "../utils/sendMail";
import { sanitizeUser } from "../utils/sanitizeUser";
import { hasEntitlement } from "../utils/entitlements";

require("dotenv").config();
const Razorpay = require("razorpay");

type OrderKind = "course" | "book";
type FulfillmentSource = "checkout" | "webhook";

type RazorpayPaymentBody = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

type OrderConfirmation = {
  email: string;
  itemId: unknown;
  itemName: string;
  price: number;
};

type FulfillmentInput = {
  kind: OrderKind;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  source: FulfillmentSource;
  expectedUserId?: string;
  expectedAmount?: number;
  expectedCurrency?: string;
  checkoutSignature?: string;
};

type FulfillmentResult = {
  alreadyProcessed: boolean;
  newlyGranted: boolean;
  userId: string;
  confirmation?: OrderConfirmation;
};

const getAuthenticatedUserId = (req: Request): string => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ErrorHandler("Please login to access this resource", 401);
  }

  return String(userId);
};

const getRazorpayClient = () => {
  const keyId = process.env.KEY_ID;
  const keySecret = process.env.KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new ErrorHandler("Razorpay is not configured", 500);
  }
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.RAZORPAY_WEBHOOK_SECRET?.trim()
  ) {
    throw new ErrorHandler("Razorpay webhook is not configured", 500);
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

const priceToPaise = (price: unknown): number => {
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    throw new ErrorHandler("This item does not have a valid payable price", 400);
  }

  return Math.round(numericPrice * 100);
};

const getOrderConfig = (kind: OrderKind) =>
  kind === "course"
    ? {
        itemLabel: "course",
        requestIdField: "courseId",
        orderItemField: "courseId",
        entitlementField: "courses",
        entitlementIdField: "courseId",
        orderModel: OrderModel as any,
        itemModel: CourseModel as any,
        itemName: (item: any) => String(item.name),
      }
    : {
        itemLabel: "book",
        requestIdField: "bookId",
        orderItemField: "bookId",
        entitlementField: "books",
        entitlementIdField: "bookId",
        orderModel: EbookOrderModel as any,
        itemModel: EbookModel as any,
        itemName: (item: any) => String(item.ebookTitle),
      };

const checkoutKeyFor = (kind: OrderKind, userId: string, itemId: string) =>
  `${kind}:${userId}:${itemId}`;

const isDuplicateKeyError = (error: any) => error?.code === 11000;

const purchasedError = (itemLabel: string) =>
  new ErrorHandler(`You have already purchased this ${itemLabel}`, 400);

const resolveKeyedCheckout = async (
  orderModel: any,
  order: any,
  checkoutKey: string,
  itemLabel: string
) => {
  if (!order) {
    return null;
  }

  if (order.status === "created") {
    return order;
  }

  if (order.status === "paid") {
    throw purchasedError(itemLabel);
  }

  if (order.status === "failed" || order.status === "refunded") {
    await orderModel.updateOne(
      { _id: order._id, checkoutKey, status: order.status },
      { $unset: { checkoutKey: 1 } }
    );
    return null;
  }

  throw new ErrorHandler(`Payment order is ${order.status}`, 409);
};

const findReusableCheckout = async (
  kind: OrderKind,
  userId: string,
  itemId: string
) => {
  const config = getOrderConfig(kind);
  const checkoutKey = checkoutKeyFor(kind, userId, itemId);

  // Await index creation so concurrent cold-start requests are protected by
  // the unique checkout key before either response exposes a Razorpay order.
  await config.orderModel.init();

  const keyedOrder = await config.orderModel.findOne({ checkoutKey });
  const reusableKeyedOrder = await resolveKeyedCheckout(
    config.orderModel,
    keyedOrder,
    checkoutKey,
    config.itemLabel
  );
  if (reusableKeyedOrder) {
    return reusableKeyedOrder;
  }

  // Claim one legacy pending order that predates checkoutKey. This avoids
  // abandoning an already-issued Razorpay order during rollout.
  const legacyOrder = await config.orderModel
    .findOne({
      userId,
      [config.orderItemField]: itemId,
      status: "created",
      checkoutKey: { $exists: false },
    })
    .sort({ createdAt: -1 });

  if (!legacyOrder) {
    return null;
  }

  try {
    const claimedOrder = await config.orderModel.findOneAndUpdate(
      {
        _id: legacyOrder._id,
        status: "created",
        checkoutKey: { $exists: false },
      },
      { $set: { checkoutKey } },
      { new: true }
    );
    if (claimedOrder) {
      return claimedOrder;
    }
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }
  }

  const winner = await config.orderModel.findOne({ checkoutKey });
  return resolveKeyedCheckout(
    config.orderModel,
    winner,
    checkoutKey,
    config.itemLabel
  );
};

const createOrReuseCheckout = async (
  kind: OrderKind,
  userId: string,
  itemId: string,
  amount: number
): Promise<{ order: any; reused: boolean }> => {
  const config = getOrderConfig(kind);
  const checkoutKey = checkoutKeyFor(kind, userId, itemId);
  const existingOrder = await findReusableCheckout(kind, userId, itemId);
  if (existingOrder) {
    return { order: existingOrder, reused: true };
  }

  const razorpayOrder = await getRazorpayClient().orders.create({
    amount,
    currency: "INR",
    receipt: `${kind}_${Date.now()}`,
    payment_capture: 1,
  });
  const storedAmount = Number(razorpayOrder.amount);
  const currency = String(razorpayOrder.currency || "INR").toUpperCase();
  if (!razorpayOrder.id || !Number.isFinite(storedAmount) || !currency) {
    throw new ErrorHandler("Razorpay returned an invalid order", 502);
  }

  try {
    const order = await config.orderModel.create({
      [config.orderItemField]: itemId,
      userId,
      orderId: `order_${Date.now()}`,
      checkoutKey,
      razorpayOrderId: razorpayOrder.id,
      amount: storedAmount,
      currency,
      status: "created",
    });
    return { order, reused: false };
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }

    // Two requests may both create remote orders before the first local insert
    // wins. Only the winning local order is ever returned to either browser.
    const winner = await config.orderModel.findOne({ checkoutKey });
    const reusableWinner = await resolveKeyedCheckout(
      config.orderModel,
      winner,
      checkoutKey,
      config.itemLabel
    );
    if (reusableWinner) {
      return { order: reusableWinner, reused: true };
    }

    throw error;
  }
};

const sendCheckoutResponse = (
  res: Response,
  checkout: { order: any; reused: boolean }
) =>
  res.status(200).json({
    success: true,
    free: false,
    orderId: String(checkout.order.razorpayOrderId),
    currency: String(checkout.order.currency).toUpperCase(),
    amount: Number(checkout.order.amount),
    status: String(checkout.order.status),
    reused: checkout.reused,
  });

const readPaymentBody = (req: Request) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body as RazorpayPaymentBody;

  if (
    !razorpay_order_id?.trim() ||
    !razorpay_payment_id?.trim() ||
    !razorpay_signature?.trim()
  ) {
    throw new ErrorHandler("Razorpay payment details are required", 400);
  }

  return {
    razorpayOrderId: razorpay_order_id.trim(),
    razorpayPaymentId: razorpay_payment_id.trim(),
    razorpaySignature: razorpay_signature.trim(),
  };
};

const copyBytes = (value: ArrayLike<number>) => {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value[index];
  }
  return bytes;
};

const timingSafeBytesEqual = (
  expected: ArrayLike<number>,
  received: ArrayLike<number>
) =>
  expected.length === received.length &&
  crypto.timingSafeEqual(copyBytes(expected), copyBytes(received));

const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const keySecret = process.env.KEY_SECRET;
  if (!keySecret) {
    throw new ErrorHandler("Razorpay is not configured", 500);
  }
  if (!/^[a-f\d]{64}$/i.test(signature)) {
    throw new ErrorHandler(
      "Invalid signature. Payment verification failed",
      400
    );
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const received = Buffer.from(signature, "hex");

  if (!timingSafeBytesEqual(expected, received)) {
    throw new ErrorHandler(
      "Invalid signature. Payment verification failed",
      400
    );
  }
};

const verifyWebhookSignature = (rawBody: Buffer, signature: string) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    throw new ErrorHandler("Razorpay webhook is not configured", 500);
  }
  if (!/^[a-f\d]{64}$/i.test(signature)) {
    throw new ErrorHandler("Invalid Razorpay webhook signature", 401);
  }

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(copyBytes(rawBody))
    .digest();
  const received = Buffer.from(signature, "hex");
  if (!timingSafeBytesEqual(expected, received)) {
    throw new ErrorHandler("Invalid Razorpay webhook signature", 401);
  }
};

const cacheUser = async (userId: string) => {
  const user = await userModel.findById(userId);
  if (user) {
    await redis.set(
      userId,
      JSON.stringify(sanitizeUser(user)),
      "EX",
      604800
    );
  }
};

const sendOrderConfirmation = async (confirmation: OrderConfirmation) => {
  await sendMail({
    email: confirmation.email,
    subject: "Order Confirmation",
    template: "order-confirmation.ejs",
    data: {
      order: {
        _id: String(confirmation.itemId).slice(-6),
        name: confirmation.itemName,
        discountPrice: confirmation.price.toFixed(2),
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    },
  });
};

const refreshUserCacheBestEffort = async (userId: string) => {
  try {
    await cacheUser(userId);
  } catch (error) {
    console.error("Unable to refresh user cache after payment", error);
  }
};

const scheduleConfirmationBestEffort = (result: FulfillmentResult) => {
  // MongoDB is the source of truth. These side effects must never turn an
  // already-committed payment into an HTTP failure that prompts another charge.
  if (result.newlyGranted && result.confirmation) {
    void sendOrderConfirmation(result.confirmation).catch((error) => {
      console.error("Unable to send order confirmation email", error);
    });
  }
};

const grantFreeEntitlement = async (
  kind: OrderKind,
  userId: string,
  itemId: string
): Promise<FulfillmentResult> => {
  const config = getOrderConfig(kind);
  const session = await mongoose.startSession();
  let result: FulfillmentResult = {
    alreadyProcessed: false,
    newlyGranted: false,
    userId,
  };

  try {
    await session.withTransaction(async () => {
      result = {
        alreadyProcessed: false,
        newlyGranted: false,
        userId,
      };

      const user = await userModel.findById(userId).session(session);
      const item = await config.itemModel.findById(itemId).session(session);
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      if (!item) {
        throw new ErrorHandler(
          `${config.itemLabel[0].toUpperCase()}${config.itemLabel.slice(1)} not found`,
          404
        );
      }
      if (Number(item.discountPrice) !== 0) {
        throw new ErrorHandler(`${config.itemLabel} is no longer free`, 409);
      }

      const userDocument = user as any;
      if (hasEntitlement(userDocument[config.entitlementField], item._id)) {
        result.alreadyProcessed = true;
        return;
      }

      userDocument[config.entitlementField].push({
        [config.entitlementIdField]: String(item._id),
      });
      await user.save({ session });

      item.purchased = Number(item.purchased || 0) + 1;
      await item.save({ session });
      await NotificationModel.create(
        [
          {
            user: user._id,
            title: "New Order",
            message: `You have a new order from ${config.itemName(item)}`,
          },
        ],
        { session }
      );

      result.newlyGranted = true;
      result.confirmation = {
        email: user.email,
        itemId: item._id,
        itemName: config.itemName(item),
        price: 0,
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

const fulfillPayment = async (
  input: FulfillmentInput
): Promise<FulfillmentResult> => {
  const config = getOrderConfig(input.kind);
  const session = await mongoose.startSession();
  let result: FulfillmentResult = {
    alreadyProcessed: false,
    newlyGranted: false,
    userId: "",
  };

  try {
    await session.withTransaction(async () => {
      result = {
        alreadyProcessed: false,
        newlyGranted: false,
        userId: "",
      };

      const query: Record<string, unknown> = {
        razorpayOrderId: input.razorpayOrderId,
      };
      if (input.expectedUserId) {
        query.userId = input.expectedUserId;
      }

      const order = await config.orderModel.findOne(query).session(session);
      if (!order) {
        throw new ErrorHandler("Payment order not found", 404);
      }

      result.userId = String(order.userId);
      if (
        input.expectedAmount !== undefined &&
        Number(order.amount) !== input.expectedAmount
      ) {
        throw new ErrorHandler("Payment amount does not match the order", 409);
      }
      if (
        input.expectedCurrency &&
        String(order.currency).toUpperCase() !==
          input.expectedCurrency.toUpperCase()
      ) {
        throw new ErrorHandler("Payment currency does not match the order", 409);
      }

      if (order.status === "paid") {
        if (
          order.razorpayPaymentId &&
          order.razorpayPaymentId !== input.razorpayPaymentId
        ) {
          throw new ErrorHandler("Payment order was already processed", 409);
        }

        let shouldSave = false;
        if (!order.fulfilledBy) {
          order.fulfilledBy = input.source;
          shouldSave = true;
        }
        if (input.checkoutSignature && !order.razorpaySignature) {
          order.razorpaySignature = input.checkoutSignature;
          shouldSave = true;
        }
        if (shouldSave) {
          await order.save({ session });
        }

        result.alreadyProcessed = true;
        return;
      }

      if (order.status !== "created") {
        throw new ErrorHandler(`Payment order is ${order.status}`, 409);
      }

      const user = await userModel.findById(result.userId).session(session);
      const item = await config.itemModel
        .findById(order[config.orderItemField])
        .session(session);
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      if (!item) {
        throw new ErrorHandler(
          `${config.itemLabel[0].toUpperCase()}${config.itemLabel.slice(1)} not found`,
          404
        );
      }

      const userDocument = user as any;
      if (!hasEntitlement(userDocument[config.entitlementField], item._id)) {
        userDocument[config.entitlementField].push({
          [config.entitlementIdField]: String(item._id),
        });
        await user.save({ session });

        item.purchased = Number(item.purchased || 0) + 1;
        await item.save({ session });
        await NotificationModel.create(
          [
            {
              user: user._id,
              title: "New Order",
              message: `You have a new order from ${config.itemName(item)}`,
            },
          ],
          { session }
        );

        result.newlyGranted = true;
        result.confirmation = {
          email: user.email,
          itemId: item._id,
          itemName: config.itemName(item),
          price: Number(item.discountPrice),
        };
      }

      order.status = "paid";
      order.razorpayPaymentId = input.razorpayPaymentId;
      if (input.checkoutSignature) {
        order.razorpaySignature = input.checkoutSignature;
      }
      order.fulfilledBy = input.source;
      order.paidAt = new Date();
      await order.save({ session });
    });

    if (!result.userId) {
      throw new ErrorHandler("Payment fulfillment did not complete", 500);
    }
    return result;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ErrorHandler("Payment has already been processed", 409);
    }
    throw error;
  } finally {
    await session.endSession();
  }
};

const findOrderKind = async (razorpayOrderId: string): Promise<OrderKind> => {
  const [courseOrder, bookOrder] = await Promise.all([
    OrderModel.exists({ razorpayOrderId }),
    EbookOrderModel.exists({ razorpayOrderId }),
  ]);

  if (courseOrder && bookOrder) {
    throw new ErrorHandler("Payment order mapping is ambiguous", 409);
  }
  if (courseOrder) {
    return "course";
  }
  if (bookOrder) {
    return "book";
  }
  throw new ErrorHandler("Payment order not found", 404);
};

const forwardError = (error: any, next: NextFunction) =>
  next(
    error?.statusCode
      ? error
      : new ErrorHandler(error?.message || "Internal server error", 500)
  );

const createCheckoutHandler = (kind: OrderKind) =>
  CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = getOrderConfig(kind);
      const userId = getAuthenticatedUserId(req);
      const itemId = req.body?.[config.requestIdField];
      if (!mongoose.isValidObjectId(itemId)) {
        throw new ErrorHandler(`Invalid ${config.itemLabel} id`, 400);
      }

      const [user, item] = await Promise.all([
        userModel.findById(userId),
        config.itemModel.findById(itemId),
      ]);
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      if (!item) {
        throw new ErrorHandler(
          `${config.itemLabel[0].toUpperCase()}${config.itemLabel.slice(1)} not found`,
          404
        );
      }

      const numericPrice = Number(item.discountPrice);
      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        throw new ErrorHandler(
          `This ${config.itemLabel} does not have a valid price`,
          400
        );
      }
      if (numericPrice === 0) {
        const result = await grantFreeEntitlement(
          kind,
          userId,
          String(item._id)
        );
        await refreshUserCacheBestEffort(result.userId);
        scheduleConfirmationBestEffort(result);

        return res.status(result.newlyGranted ? 201 : 200).json({
          success: true,
          free: true,
          alreadyGranted: result.alreadyProcessed,
          entitlementGranted: result.newlyGranted,
        });
      }

      if (hasEntitlement((user as any)[config.entitlementField], item._id)) {
        throw purchasedError(config.itemLabel);
      }

      const checkout = await createOrReuseCheckout(
        kind,
        userId,
        String(item._id),
        priceToPaise(numericPrice)
      );
      return sendCheckoutResponse(res, checkout);
    } catch (error) {
      return forwardError(error, next);
    }
  });

const validateCheckoutHandler = (kind: OrderKind) =>
  CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getAuthenticatedUserId(req);
      const payment = readPaymentBody(req);
      verifyPaymentSignature(
        payment.razorpayOrderId,
        payment.razorpayPaymentId,
        payment.razorpaySignature
      );

      const result = await fulfillPayment({
        kind,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        checkoutSignature: payment.razorpaySignature,
        expectedUserId: userId,
        source: "checkout",
      });
      await refreshUserCacheBestEffort(result.userId);
      scheduleConfirmationBestEffort(result);

      return res.status(201).json({
        success: true,
        message: "Payment verified successfully",
        alreadyProcessed: result.alreadyProcessed,
        entitlementGranted: result.newlyGranted,
      });
    } catch (error) {
      return forwardError(error, next);
    }
  });

export const createOrder = createCheckoutHandler("course");
export const createBookOrder = createCheckoutHandler("book");
export const valdateOrder = validateCheckoutHandler("course");
export const valdateBookOrder = validateCheckoutHandler("book");

export const razorpayWebhook = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Buffer.isBuffer(req.body)) {
        throw new ErrorHandler("Razorpay webhook body must be raw JSON", 400);
      }

      const signatureHeader = req.headers["x-razorpay-signature"];
      const signature = Array.isArray(signatureHeader)
        ? signatureHeader[0]
        : signatureHeader;
      if (!signature?.trim()) {
        throw new ErrorHandler("Razorpay webhook signature is required", 401);
      }
      verifyWebhookSignature(req.body, signature.trim());

      let eventPayload: any;
      try {
        eventPayload = JSON.parse(req.body.toString("utf8"));
      } catch {
        throw new ErrorHandler("Razorpay webhook body is invalid JSON", 400);
      }

      const event = String(eventPayload?.event || "");
      if (event !== "payment.captured" && event !== "order.paid") {
        return res.status(200).json({
          success: true,
          processed: false,
          ignoredEvent: event || "unknown",
        });
      }

      const payment = eventPayload?.payload?.payment?.entity;
      const razorpayOrderId = String(payment?.order_id || "").trim();
      const razorpayPaymentId = String(payment?.id || "").trim();
      const amount = Number(payment?.amount);
      const currency = String(payment?.currency || "").trim().toUpperCase();
      if (
        !razorpayOrderId ||
        !razorpayPaymentId ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !currency
      ) {
        throw new ErrorHandler("Razorpay webhook payment is incomplete", 400);
      }
      if (payment?.captured !== true && payment?.status !== "captured") {
        throw new ErrorHandler("Razorpay payment is not captured", 409);
      }

      const kind = await findOrderKind(razorpayOrderId);
      const result = await fulfillPayment({
        kind,
        razorpayOrderId,
        razorpayPaymentId,
        expectedAmount: amount,
        expectedCurrency: currency,
        source: "webhook",
      });
      await refreshUserCacheBestEffort(result.userId);
      scheduleConfirmationBestEffort(result);

      return res.status(200).json({
        success: true,
        processed: true,
        alreadyProcessed: result.alreadyProcessed,
        entitlementGranted: result.newlyGranted,
      });
    } catch (error) {
      return forwardError(error, next);
    }
  }
);

export const getAllOrders = CatchAsyncError(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllOrdersService(res);
    } catch (error) {
      return forwardError(error, next);
    }
  }
);

export const getAllBookOrders = CatchAsyncError(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await EbookOrderModel.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return forwardError(error, next);
    }
  }
);
