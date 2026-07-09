import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "ID de Mongo inválido",
});

const invoiceProductSchema = z.object({
    id_product: objectIdSchema,
    amount: z.number().min(1, "La cantidad mínima debe ser 1"),
    discount: z.number().min(0, "El descuento no puede ser negativo").default(0),
    subtotal: z.number().min(0, "El subtotal no puede ser negativo"), // Subtotal sin IVA
});

// Esquema para Crédito Fiscal
const taxCreditInvoiceSchema = z.object({
    DTE: z.string().min(1, "El campo DTE es obligatorio"),
    emision_date: z.string().datetime().optional().or(z.date().optional()),
    type_payment: z.string().min(1, "El tipo de pago es requerido"),
    customer_id: objectIdSchema,
    
    // Campos específicos de Crédito Fiscal
    condition_sale: z.string().refine(
        (val) => ["contado", "crédito"].includes(val),
        { message: "La condición de venta debe ser: 'contado' o 'crédito'" }
    ),
    type_sale: z.string().refine(
        (val) => ["gravada", "exenta"].includes(val),
        { message: "El tipo de venta debe ser: 'gravada' o 'exenta'" }
    ),
    details: z.string().optional().default(""),

    // Bloque Contable / Impuestos de El Salvador
    vat_tax: z.number().min(0).default(0),          // IVA 13%
    total_not_taxed: z.number().min(0).default(0),  // Ventas no sujetas / exentas
    total_operations: z.number().min(0).default(0), // Suma de operaciones
    vat_received: z.number().min(0).default(0),     // IVA Percibido (1%)
    vat_detained: z.number().min(0).default(0),     // IVA Retenido (1%)
    rent: z.number().min(0).default(0),             // Retención de Renta

    // Pagos
    payment_received: z.number().min(0, "El pago recibido no puede ser negativo"),
    change: z.number().min(0, "El cambio no puede ser negativo").default(0),
    total_pay: z.number().min(0, "El total a pagar no puede ser negativo"),

    // Lógica condicional de carrito
    id_cart: objectIdSchema.optional(),
    products: z.array(invoiceProductSchema).optional(),
    subtotal_sale: z.number().optional(),
    general_sale_discount: z.number().optional(),
    total_with_discount: z.number().optional(),
});

// Regla de validación cuando no viene un carrito de compras
const validateTaxCreditSchema = taxCreditInvoiceSchema.superRefine((data, ctx) => {
    if (!data.id_cart) {
        if (!data.products || data.products.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["products"],
                message: "El array de productos es obligatorio cuando no se provee un 'id_cart'",
            });
        }
        if (data.subtotal_sale === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["subtotal_sale"], message: "El campo subtotal_sale es requerido si no hay carrito" });
        }
        if (data.general_sale_discount === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["general_sale_discount"], message: "El campo general_sale_discount es requerido si no hay carrito" });
        }
        if (data.total_with_discount === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["total_with_discount"], message: "El campo total_with_discount es requerido si no hay carrito" });
        }
    }
});

// Middleware Express
export const validateTaxCreditRequest = (req: Request, res: Response, next: NextFunction): void => {
    const result = validateTaxCreditSchema.safeParse(req.body);

    if (!result.success) {
        const formattedErrors = result.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));

        res.status(400).json({
            status: 400,
            message: "Error de validación en la factura de crédito fiscal",
            data: formattedErrors,
        });
        return;
    }

    req.body = result.data;
    next();
};