import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.Model";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
import crypto from "crypto";

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Razorpay = require("razorpay");

// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const { courseId, payment_info } = req.body as IOrder;
      const { amount, currency, courseId } = req.body;

      const razorpay = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
      });
      const options = {
        amount: amount * 100, // Razorpay expects the amount in the smallest currency unit (e.g., paise)
        currency,
        receipt: `rcpt_${Date.now()}`,
        payment_capture: 1,
      };
    
      // const response = await razorpay.orders.create(options)

      const user = await userModel.findById(req.user?._id);

      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course: ICourse | null = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const razorpayOrder = await razorpay.orders.create(options);
      const data: any = {
        courseId: course._id,
        userId: user?._id,
        orderId: `order_${Date.now()}`,
        razorpayOrderId: razorpayOrder.id,
        amount,
        currency,
        status: "created",
      };
      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,

          discountPrice: course.discountPrice,

          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push(course?._id);

      await redis.set(req.user?._id, JSON.stringify(user));

      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

      course.purchased = course.purchased + 1;

      await course.save();

      const order = await OrderModel.create(data);

      res.status(201).json({
        succcess: true,
        order,
      });

      //    res.status(201).json({
      //   success: true,
      //   message: 'Order successfully created',
      //   order: newOrder,

      // });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const valdateOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    try {
      // Check if process.env.KEY_SECRET is defined before using it
      if (!process.env.KEY_SECRET) {
        return next(new ErrorHandler("key  secret not found", 500));
      }
      const sha = crypto.createHmac("sha256", process.env.KEY_SECRET);
      //order_id + "|" + razorpay_payment_id
      sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = sha.digest("hex");
      if (digest !== razorpay_signature) {
        return next(new ErrorHandler("Transaction is not legit!", 500));
      }
      res.json({
        msg: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get All orders --- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//  send stripe publishble key
export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// new payment
export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        metadata: {
          company: "TechEduCOder",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
