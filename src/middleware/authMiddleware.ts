import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/* ================= Extend Request ================= */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "seller" | "buyer";
  };
}

/* ================= PROTECT ================= */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET is not set in environment");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check that decoded token has id and role
    if (typeof decoded === "object" && decoded !== null && "id" in decoded && "role" in decoded) {
      req.user = {
        id: (decoded as any).id,
        role: (decoded as any).role,
      };
    } else {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, message: "Invalid or expired token", error: err.message });
  }
};

/* ================= AUTHORIZE ================= */
export const authorize = (...roles: ("seller" | "buyer")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};