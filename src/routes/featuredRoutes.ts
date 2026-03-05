import { Router } from "express";
import { addFeatured, getAllFeatured, deleteFeatured } from "../controllers/featuredController";
import { protect, authorize } from "../middleware/authMiddleware";

const featuredRouter = Router();

// Any user can view featured products
featuredRouter.get("/", getAllFeatured);

// Only sellers can add or delete featured products
featuredRouter.post("/", protect, authorize("seller"), addFeatured);
featuredRouter.delete("/:id", protect, authorize("seller"), deleteFeatured);

export default featuredRouter;