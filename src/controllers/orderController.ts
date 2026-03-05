import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import orderService from "../services/orderService";

/* ================= CREATE ORDER ================= */
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { payment_method, expected_delivery } = req.body;

    if (!payment_method || !expected_delivery) {
      return res.status(400).json({
        success: false,
        message: "Payment method and expected delivery date are required",
      });
    }

    const order = await orderService.createOrder(
      req.user!.id,
      String(payment_method),
      new Date(expected_delivery)
    );

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ================= GET USER ORDERS ================= */
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await orderService.getUserOrders(req.user!.id);
    res.status(200).json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET SINGLE ORDER ================= */
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    // Ensure orderId is a string
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    const order = await orderService.getOrderById(id, req.user!.id);
    res.status(200).json({ success: true, order });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};