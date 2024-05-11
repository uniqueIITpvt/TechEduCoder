import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createOrder,
  getAllOrders,
  createBookOrder,
  valdateOrder,
  valdateBookOrder,
} from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order",  createOrder);
orderRouter.post("/create-BookOrder",  createBookOrder);
  orderRouter.post("/validateBookOrder" , valdateBookOrder)


orderRouter.post('/validate-order', valdateOrder)
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
  getAllOrders
);

// orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

// orderRouter.post("/payment", isAutheticated, newPayment);

export default orderRouter;
