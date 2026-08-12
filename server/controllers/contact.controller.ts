import { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export const createContactMessage = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = clean(req.body?.name, 100);
      const email = clean(req.body?.email, 254).toLowerCase();
      const phoneNo = clean(req.body?.phoneNo, 30);
      const subject = clean(req.body?.subject, 150);
      const message = clean(req.body?.message, 5000);

      if (
        !name ||
        !subject ||
        !message ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        return next(new ErrorHandler("Please complete all required fields", 400));
      }

      const recipient = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_MAIL;
      if (!recipient || !process.env.SMTP_HOST || !process.env.SMTP_MAIL) {
        return next(new ErrorHandler("Contact email is not configured", 503));
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
        service: process.env.SMTP_SERVICE || undefined,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_MAIL,
        to: recipient,
        replyTo: email,
        subject: `[Website contact] ${subject}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          phoneNo ? `Phone: ${phoneNo}` : "",
          "",
          message,
        ]
          .filter(Boolean)
          .join("\n"),
      });

      res.status(201).json({
        success: true,
        message: "Your message has been sent successfully",
      });
    } catch (error: any) {
      return next(
        error?.statusCode
          ? error
          : new ErrorHandler("Unable to send your message right now", 503)
      );
    }
  }
);
