import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createOrder,
  getAllOrders,
  createBookOrder,
  valdateOrder,
  valdateBookOrder,
  getAllBookOrders,
} from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAutheticated, createOrder);
orderRouter.post("/create-BookOrder", isAutheticated, createBookOrder);
orderRouter.post("/validateBookOrder", isAutheticated, valdateBookOrder);
orderRouter.post("/validate-order", isAutheticated, valdateOrder);
orderRouter.get(
  "/get-orders",
  isAutheticated,
  authorizeRoles("admin"),
  getAllOrders
);
orderRouter.get(
  "/get-Book-orders",
  isAutheticated,
  authorizeRoles("admin"),
  getAllBookOrders
);

// orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

// orderRouter.post("/payment", isAutheticated, newPayment);

export default orderRouter;
