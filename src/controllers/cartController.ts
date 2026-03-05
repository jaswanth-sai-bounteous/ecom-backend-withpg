import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import cartService from "../services/cartService";

/* ================= GET CART ================= */
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.getCart(req.user!.id);
    res.status(200).json({ success: true, cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= ADD TO CART ================= */
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || Array.isArray(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });
    }

    if (
      quantity === undefined ||
      quantity === null ||
      isNaN(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid quantity" });
    }

    const cart = await cartService.addToCart(
      req.user!.id,
      String(productId),
      Number(quantity)
    );

    res.status(200).json({ success: true, cart });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ================= REMOVE FROM CART ================= */
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;

    if (!productId || Array.isArray(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });
    }

    const cart = await cartService.removeFromCart(
      req.user!.id,
      String(productId)
    );

    res.status(200).json({ success: true, cart });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE QUANTITY ================= */
export const updateQuantity = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || Array.isArray(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });
    }

    if (
      quantity === undefined ||
      quantity === null ||
      isNaN(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid quantity" });
    }

    const cart = await cartService.updateQuantity(
      req.user!.id,
      String(productId),
      Number(quantity)
    );

    res.status(200).json({ success: true, cart });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};