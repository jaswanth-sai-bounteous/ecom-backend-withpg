import { prisma } from "../lib/prisma";

interface CreateProductDTO {
  title: string;
  description: string;
  product_img: string;
  price: number;
}

interface UpdateProductDTO {
  title?: string;
  description?: string;
  product_img?: string;
  price?: number;
}

class ProductService {
  /* ================= CREATE PRODUCT ================= */

  async create(data: CreateProductDTO) {
    return await prisma.product.create({
      data,
    });
  }

  /* ================= GET ALL PRODUCTS ================= */

  async getAll() {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /* ================= GET PRODUCT BY ID ================= */

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new Error("Product not found");

    return product;
  }

  /* ================= UPDATE PRODUCT ================= */

  async update(id: string, data: UpdateProductDTO) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new Error("Product not found");

    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  /* ================= DELETE PRODUCT ================= */

  async delete(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new Error("Product not found");

    return await prisma.product.delete({
      where: { id },
    });
  }
}

export default new ProductService();