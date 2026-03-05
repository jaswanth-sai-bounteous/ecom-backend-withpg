import { prisma } from "../lib/prisma";

class FeaturedService {
  /* ================= ADD FEATURED PRODUCT ================= */
  async addFeatured(productId: string) {
    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    // Create featured entry
    const featured = await prisma.featured.create({
      data: { productId },
      include: { product: true }, // Include product details if needed
    });

    return featured;
  }

  /* ================= GET ALL FEATURED PRODUCTS ================= */
  async getAllFeatured() {
    return await prisma.featured.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /* ================= DELETE FEATURED PRODUCT ================= */
  async deleteFeatured(id: string) {
    const featured = await prisma.featured.findUnique({ where: { id } });
    if (!featured) throw new Error("Featured entry not found");

    return await prisma.featured.delete({ where: { id } });
  }
}

export default new FeaturedService();