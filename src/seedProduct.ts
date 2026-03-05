import axios from "axios";
import { prisma } from "./lib/prisma";
async function seedProducts() {
  try {
    const res = await axios.get("https://fakestoreapi.com/products");

    const products = res.data;

    for (const p of products) {
      await prisma.product.create({
        data: {
          title: p.title,
          description: p.description,
          price: p.price,
          product_img: p.image,
        },
      });
    }

    console.log("Products seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();