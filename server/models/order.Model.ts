import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
  courseId: string;
  orderId: string;
  checkoutKey?: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  userId: mongoose.Types.ObjectId | string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed" | "refunded";
  fulfilledBy?: "checkout" | "webhook";
  paidAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      required: true,
    },
    orderId: { type: String, required: true },
    checkoutKey: { type: String },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
    fulfilledBy: {
      type: String,
      enum: ["checkout", "webhook"],
    },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

// New records keep this key through payment completion. That makes concurrent
// checkout creation converge on one Razorpay order and closes the race where a
// second order is created while the first payment is being fulfilled. Legacy
// records do not have the key, so this index can be introduced safely.
orderSchema.index(
  { checkoutKey: 1 },
  {
    unique: true,
    partialFilterExpression: { checkoutKey: { $type: "string" } },
  }
);

orderSchema.index(
  { razorpayPaymentId: 1 },
  {
    unique: true,
    partialFilterExpression: { razorpayPaymentId: { $type: "string" } },
  }
);

const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);

export default OrderModel;
