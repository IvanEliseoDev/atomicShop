
import mongoose, { model, Schema } from "mongoose";
import { IProduct } from "../interface/product.interface";
const productsSchema = new Schema<IProduct>(
  {
    code: { type: String },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Providers",
    },
    name: { type: String },
    description: { type: String },
    images: { type: [String] }, // ✅ Corregido: Array tipado
    stock: { type: Number },
    price: { type: Number },
    discount: { type: Number },
    state: { type: Boolean },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export const modelProducts = model<IProduct>("Products", productsSchema)
