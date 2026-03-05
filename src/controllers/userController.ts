import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import userService from "../services/userService";

/* ================= Cookie Config ================= */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* ================= REGISTER ================= */

export const register = async (req: Request, res: Response) => {
  try {
    const { user, accessToken, refreshToken } =
      await userService.register(req.body);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(201).json({
      success: true,
      user,
      accessToken,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= LOGIN ================= */

export const login = async (req: Request, res: Response) => {
  try {
    const { user, accessToken, refreshToken } =
      await userService.login(req.body);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      user,
      accessToken,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= REFRESH ================= */

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    const { accessToken } = await userService.refresh(token);

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= LOGOUT ================= */

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    await userService.logout(req.user!.id);

    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= PROFILE ================= */

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.getProfile(req.user!.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADD ADDRESS ================= */

export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.addAddress(
      req.user!.id,
      req.body
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};