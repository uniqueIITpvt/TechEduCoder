import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createOrder,
  getAllOrders,

  valdateOrder,
} from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order",  createOrder);


orderRouter.post('/validate-order', valdateOrder)
orderRouter.get(
  "/get-orders",
  isAutheticated,
  authorizeRoles("admin"),
  getAllOrders
);

// orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

// orderRouter.post("/payment", isAutheticated, newPayment);

export default orderRouter;
