import mongoose, { Schema, Document } from "mongoose";

interface ICartItem {
  product_id: mongoose.Types.ObjectId;
  quantity: number;
  total_price: number;
}

export interface ICart extends Document {
  user_id: mongoose.Types.ObjectId;
  items: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    total_price: { type: Number, required: true },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", CartSchema);