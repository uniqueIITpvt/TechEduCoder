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
import EbookOrderModel  from "../models/bookOrder.Model"
import EbookModel  ,{IEbook} from "../models/ebook.model"

require("dotenv").config();
const Razorpay = require("razorpay");

// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, currency, courseId, userId } = req.body;

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

      //  const razorpayOrder = await razorpay.orders.create(options)

      const user = await userModel.findById(userId);

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
      if (!razorpayOrder) {
        return next(new ErrorHandler("something went wrong", 400));
      }
      res.status(200).json({
        orderId: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount,
      });

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

          discountPrice: course.discountPrice.toFixed(2),

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


         const order =  await new OrderModel(data);

         console.log(order);
         
         order.save();
       
      course.purchased = course.purchased + 1;

      await course.save();

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
        return next(
          new ErrorHandler(
            "Invalid signature. Payment verification failed",
            400
          )
        );
      }
      res.status(201).json({ success: true, message: "Payment verified successfully" });
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
export const createBookOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount,
        currency,
        bookId,
        userId,} = req.body;
        

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

      //  const razorpayOrder = await razorpay.orders.create(options)

      const user = await userModel.findById(userId);

      const BookExistInUser = user?.books.some(
        (book: any) => book._id.toString() ===  bookId
      );

      if (BookExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this books", 400)
        );
      }

      const book: IEbook | null = await EbookModel.findById(bookId);

      if (!book) {
        return next(new ErrorHandler("book not found", 404));
      }
      const razorpayOrder = await razorpay.orders.create(options);
      if (!razorpayOrder) {
        return next(new ErrorHandler("something went wrong", 400));
      }
      res.status(200).json({
        orderId: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount,
      });
     

      const mailData = {
        order: {
          _id: book._id.toString().slice(0, 6),
          name: book.ebookTitle,

          discountPrice: book.discountPrice,

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

      user?.books.push(book?._id);

       await redis.set(req.user?._id, JSON.stringify(user));

      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${book?.ebookTitle}`,
      });
      

      // const data: any = {
      //   bookId: book._id,
      //   userId: user?._id,
      //   orderId: `order_${Date.now()}`,
      //   razorpayOrderId: razorpayOrder.id,
      //   amount,
      //   currency,
      //   status: "created",
      // };


      const newBookOrder = new EbookOrderModel({
        bookId: book._id,
        userId: user?._id,
        orderId: `order_${Date.now()}`,
        razorpayOrderId: razorpayOrder.id,
        amount,
        currency,
        status: "created",
      });

      await newBookOrder.save();


       
      book.purchased = book.purchased + 1;

      await book.save();

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const valdateBookOrder = CatchAsyncError(
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
        return next(
          new ErrorHandler(
            "Invalid signature. Payment verification failed",
            400
          )
        );
      }
    

      res.status(201).json({ success: true, message: "Payment verified successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get All orders --- only for admin
export const getAllBookOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await EbookOrderModel.find().sort({ createdAt: -1 });
  
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);