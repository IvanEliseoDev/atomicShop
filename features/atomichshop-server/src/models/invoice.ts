import { model, Schema } from "mongoose";
import { IInvoice } from "../interface/invoice.interface";

// Sub-schema para el detalle de productos de la factura
const invoiceProductSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        unitPrice: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        subtotalLine: {
            type: Number,
            required: true,
        },
    },
    { _id: false } // no genera _id por cada producto, no es necesario
);

// Sub-schema para los datos de entrega capturados en el paso 2
const deliveryDataSchema = new Schema(
    {
        direccion: {
            type: String,
            required: true,
        },
        departamento: {
            type: String,
            required: true,
        },
        municipio: {
            type: String,
            required: true,
        },
        fechaEntrega: {
            type: Date,
            default: null, // opcional segun el formulario
        },
    },
    { _id: false }
);

// Schema principal de la factura — coleccion "sales" (ya existente en la BD)
const invoiceSchema = new Schema<IInvoice>(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true, // el correlativo FCF-XXXXXX no puede repetirse
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customers",
            required: true,
        },
        products: {
            type: [invoiceProductSchema],
            required: true,
        },
        deliveryData: {
            type: deliveryDataSchema,
            required: true,
        },
        subtotal: {
            type: Number,
            required: true,
        },
        discountTotal: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["credito", "debito", "efectivo"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pendiente", "pagado", "rechazado"],
            default: "pendiente",
        },
        wompiTransactionId: {
            type: String,
            default: null,
        },
        state: {
            type: Boolean,
            default: true,
        },
        dateCreation: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "sales", // usa la coleccion existente en la BD
    }
);

export const invoiceModel = model<IInvoice>("Invoice", invoiceSchema);