import { Schema, model } from "mongoose";

const bannerSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  public_id: { type: String, required: true},
  state: { type: Boolean, default: true }
}, { timestamps: true });

export const modelBanner = model("Banners", bannerSchema);