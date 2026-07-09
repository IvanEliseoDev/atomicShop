import mongoose, { Schema, model, HydratedDocument } from "mongoose";
import { ICommercialInvoice } from "../interface/comercialInvoice.interface";

// Creamos el esquema diciéndole a Mongoose que use la estructura de ICommercialInvoice
const commercialInvoiceSchema = new Schema<ICommercialInvoice>(
  {
    DTE: {
      type: String,
      required: true,
      unique: true,
    },
    emision_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    type_payment: {
      type: String,
      enum: ["en efectivo","transferencia" ,"tarjeta"],
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },
    // En la base de datos lo dejamos opcional porque si viene id_cart, 
    // tu backend se encargará de extraer o sincronizar estos datos.
    products: [
      {
        id_product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
        amount: { type: Number, default: 1 },
        discount: { type: Number, default: 0 },
        subtotal: { type: Number, default: 0 },
      },
    ],
    subtotal_sale: {
      type: Number,
      default: 0,
    },
    general_sale_discount: {
      type: Number,
      default: 0,
    },
    total_with_discount: {
      type: Number,
      default: 0,
    },
    payment_received: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
      required: true,
      default: 0,
    },
    type_sale: {
      type: String,
      enum: ["gravada", "exenta"],
      required: true,
    },
    total_pay: {
      type: Number,
      default: 0,
    },
    id_cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carts",
      required: false, 
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Tipamos el modelo usando HydratedDocument para que herede los métodos de Mongoose (_id, save(), etc.)
export const modelCommercialInvoice = model<ICommercialInvoice>(
  "CommercialInvoices", 
  commercialInvoiceSchema
);