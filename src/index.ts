// src/index.ts
import express from "express";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
dotenv.config();
import cors from "cors";


// Import route modules
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import cartRouter from "./routes/cartRoutes";
import orderRouter from "./routes/orderRoutes";
import featuredRouter from "./routes/featuredRoutes";


const app = express();
app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json());

// ================= Prisma Connection =================
prisma.$connect()
  .then(() => console.log("✅ Postgres via Prisma Connected"))
  .catch((err: unknown) => {
    if (err instanceof Error) console.error("❌ Prisma Connection Error:", err.message);
    else console.error("❌ Prisma Connection Error:", err);
  });

// ================= Routes =================
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
app.use("/featured", featuredRouter);

// Root route
app.get("/", (_req, res) => res.send("🚀 E-commerce API Running"));

// ================= Start Server =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ================= Graceful Shutdown =================
const gracefulExit = async () => {
  console.log("🛑 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", gracefulExit);
process.on("SIGTERM", gracefulExit);