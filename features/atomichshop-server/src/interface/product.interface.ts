import mongoose, { Document, Types } from "mongoose";

// Como haremos una API con TypeScript, la forma de hacer el model y en general la API es algo diferente pero la misma logica pedorra de simpre 😈😈😈
export interface IProduct extends Document {
  code: string;
  brandId: Types.ObjectId;
  categoryId: Types.ObjectId;
  providerId: Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  stock: number;
  price: number;
  discount: number;
  state: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}