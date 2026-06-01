import { Schema, model, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  state: boolean;
}

const brandSchema = new Schema<IBrand>({
  name: { type: String, required: true },
  state: { type: Boolean, default: true }
}, { timestamps: true });

export const modelBrands = model<IBrand>("Brands", brandSchema);