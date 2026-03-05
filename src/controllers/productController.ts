import { Request, Response } from "express";
import productService from "../services/productService";
/* ================= CREATE PRODUCT ================= */

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL PRODUCTS ================= */

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAll();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET PRODUCT BY ID ================= */

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const product = await productService.getById(id);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE PRODUCT ================= */

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const product = await productService.update(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE PRODUCT ================= */

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await productService.delete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};