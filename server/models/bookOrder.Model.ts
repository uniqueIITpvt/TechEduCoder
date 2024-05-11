import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBookOrder extends Document {
  bookId: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  userId?: mongoose.Schema.Types.ObjectId;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed" | "refunded";
}

const bookOrderSchema = new Schema<IBookOrder>(
  {
    bookId: { 
      type: String,
      required: true,
    },
    orderId: { type: String, required: true },
    razorpayOrderId: { type: String, required: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
  },
  { timestamps: true }
);

const EbookOrderModel: Model<IBookOrder> = mongoose.model("BookOrder", bookOrderSchema);

export default EbookOrderModel;