import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  product_img: string;
  price: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    product_img: { type: String, required: true, trim: true },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);