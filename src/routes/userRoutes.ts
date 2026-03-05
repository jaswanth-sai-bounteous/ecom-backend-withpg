import { Router } from "express";
import { register, login, refresh, logout, getProfile, addAddress } from "../controllers/userController";
import { protect, authorize } from "../middleware/authMiddleware";

const userRouter = Router();

/* ================= PUBLIC ROUTES ================= */
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/refresh", refresh);

/* ================= PROTECTED ROUTES ================= */
userRouter.post("/logout", protect, logout);
userRouter.get("/profile", protect, authorize("buyer"), getProfile);
userRouter.post("/address", protect, authorize("buyer"), addAddress);

export default userRouter;