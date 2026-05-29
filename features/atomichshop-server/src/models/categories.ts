import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  state: boolean;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  state: { type: Boolean, default: true }
}, { timestamps: true });

export const modelCategories = model<ICategory>("Categories", categorySchema);