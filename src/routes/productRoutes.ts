import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController";
import { protect, authorize } from "../middleware/authMiddleware";

const productRouter = Router();

/* ================= PUBLIC ROUTES ================= */
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);

/* ================= PROTECTED ROUTES ================= */
// Only sellers can create, update, or delete products
productRouter.post("/", protect, authorize("seller"), createProduct);
productRouter.put("/:id", protect, authorize("seller"), updateProduct);
productRouter.delete("/:id", protect, authorize("seller"), deleteProduct);

export default productRouter;