import mongoose, { Schema, Document } from "mongoose";

export interface IFeatured extends Document {
  product_id: mongoose.Types.ObjectId;
}

const FeaturedSchema = new Schema<IFeatured>(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFeatured>("Featured", FeaturedSchema);