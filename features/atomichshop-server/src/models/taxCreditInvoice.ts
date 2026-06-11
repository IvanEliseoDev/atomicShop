import mongoose, { Schema, model } from "mongoose";
import { ITaxCreditInvoice } from "../interface/taxCreditInvoice.interface";

const taxCreditInvoiceSchema = new Schema<ITaxCreditInvoice>(
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
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },
    condition_sale: {
      type: String,
      enum: ["contado", "crédito"],
      required: true,
    },
    type_sale: {
      type: String,
      enum: ["gravada", "exenta"],
      required: true,
    },
    details: {
      type: String,
      default: "",
    },

    
    vat_tax: {
      type: Number,
      required: true,
      default: 0, // IVA 13%
    },
    total_not_taxed: {
      type: Number,
      required: true,
      default: 0, // Ventas no sujetas
    },
    total_operations: {
      type: Number,
      required: true,
      default: 0, // Suma total operaciones
    },
    vat_received: {
      type: Number,
      default: 0, // IVA Percibido (Normalmente 1%)
    },
    vat_detained: {
      type: Number,
      default: 0, // IVA Retenido (Normalmente 1%)
    },
    rent: {
      type: Number,
      default: 0, // Retención de Renta
    },

    // --- BLOQUE DE PAGOS ---
    payment_received: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
      required: true,
      default: 0,
    },
    total_pay: {
      type: Number,
      required: true,
    },

    // --- LOGICA CONDICIONAL DE CARRITO ---
    id_cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carts",
      required: false, // Opcional en BD
    },
    // Opcionales si viene id_cart, pero tu lógica o Zod se encarga
    products: [
      {
        id_product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
        amount: { type: Number, default: 1 },
        discount: { type: Number, default: 0 },
        subtotal: { type: Number, default: 0 }, // Subtotal sin IVA
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const modelTaxCreditInvoice = model<ITaxCreditInvoice>(
  "TaxCreditInvoices",
  taxCreditInvoiceSchema
);