import { Request, Response } from "express";
import featuredService from "../services/featuredService";

/* ================= ADD FEATURED ================= */
export const addFeatured = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const featured = await featuredService.addFeatured(productId);

    res.status(201).json({
      success: true,
      featured,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL FEATURED ================= */
export const getAllFeatured = async (_req: Request, res: Response) => {
  try {
    const featured = await featuredService.getAllFeatured();

    res.status(200).json({
      success: true,
      featured,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE FEATURED ================= */
export const deleteFeatured = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await featuredService.deleteFeatured(id);

    res.status(200).json({
      success: true,
      message: "Featured removed successfully",
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};