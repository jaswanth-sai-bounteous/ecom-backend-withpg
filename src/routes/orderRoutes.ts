import { Router } from "express";
import { createOrder, getUserOrders, getOrderById } from "../controllers/orderController";
import { protect, authorize } from "../middleware/authMiddleware";

const orderRouter = Router();

// Only buyers can create and view orders
orderRouter.post("/", protect, authorize("buyer"), createOrder);
orderRouter.get("/", protect, authorize("buyer"), getUserOrders);
orderRouter.get("/:id", protect, authorize("buyer"), getOrderById);

export default orderRouter;