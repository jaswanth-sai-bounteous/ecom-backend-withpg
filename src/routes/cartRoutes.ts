import { Router } from "express";
import { getCart, addToCart, removeFromCart, updateQuantity } from "../controllers/cartController";
import { protect, authorize } from "../middleware/authMiddleware";

const cartRouter = Router();

// Only buyers can manage their cart
cartRouter.get("/", protect, authorize("buyer"), getCart);
cartRouter.post("/add", protect, authorize("buyer"), addToCart);
cartRouter.post("/remove", protect, authorize("buyer"), removeFromCart);
cartRouter.put("/update", protect, authorize("buyer"), updateQuantity);

export default cartRouter;