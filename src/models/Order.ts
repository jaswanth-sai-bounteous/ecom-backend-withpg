import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem {
  product_id: mongoose.Types.ObjectId;
  quantity: number;
  total_price: number;
}

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  payment_method: string;
  expected_delivery: Date;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  items: IOrderItem[];
}

const OrderItemSchema = new Schema<IOrderItem>(
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

const ShippingAddressSchema = new Schema(
  {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment_method: { type: String, required: true },
    expected_delivery: { type: Date, required: true },
    shipping_address: { type: ShippingAddressSchema, required: true },
    items: [OrderItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);