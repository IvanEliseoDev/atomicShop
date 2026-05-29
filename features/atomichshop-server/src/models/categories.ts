import { model, Schema, Types } from "mongoose";
import { ICategorie } from "../interface/categories.interface";

export const categorieSchema = new Schema<ICategorie>(
  {
    name: {
      type: String,
      required: true,
    },
    state: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export const categorieModel = model("Categories", categorieSchema);
