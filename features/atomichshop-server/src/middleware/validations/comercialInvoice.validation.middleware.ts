import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import mongoose from "mongoose";

// Validador personalizado para asegurarnos de que los strings de IDs sean ObjectIds válidos de Mongo
const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "ID de Mongo inválido",
});

// Esquema del producto individual
const invoiceProductSchema = z.object({
  id_product: objectIdSchema,
  amount: z.number().min(1, "La cantidad mínima debe ser 1"),
  discount: z.number().min(0, "El descuento no puede ser negativo").default(0),
  subtotal: z.number().min(0, "El subtotal no puede ser negativo"),
});

// Esquema Base de la factura (Campos comunes que SIEMPRE deben venir)
const baseInvoiceSchema = z.object({
  DTE: z.string().min(1, "El campo DTE es obligatorio"),
  emision_date: z.string().datetime().optional().or(z.date().optional()), // Acepta strings ISO o fechas

  type_payment: z.string().refine(
    (val) => ["en efectivo", "transferencia", "tarjeta"].includes(val),
    { message: "El método de pago debe ser: 'en efectivo', 'transferencia' o 'tarjeta'" }
  ),
  customer_id: objectIdSchema,
  payment_received: z.number().min(0, "El pago recibido no puede ser negativo"),
  change: z.number().min(0, "El cambio no puede ser negativo").default(0),

  type_sale: z.string().refine(
    (val) => ["gravada", "exenta"].includes(val),
    { message: "El tipo de venta debe ser: 'gravada' o 'exenta'" }
  ),
  
  // Declaramos los opcionales de la unión aquí
  id_cart: objectIdSchema.optional(),
  products: z.array(invoiceProductSchema).optional(),
  subtotal_sale: z.number().optional(),
  general_sale_discount: z.number().optional(),
  total_with_discount: z.number().optional(),
  total_pay: z.number().optional(),
});

// 3. Regla de negocio cruzada (Súper importante)
const validateCommercialInvoiceSchema = baseInvoiceSchema.superRefine((data, ctx) => {

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
    if (data.total_pay === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["total_pay"], message: "El campo total_pay es requerido si no hay carrito" });
    }
  }
});

// 4. El Middleware de Express listo para usar
export const validateInvoiceRequest = (req: Request, res: Response, next: NextFunction): void => {
  const result = validateCommercialInvoiceSchema.safeParse(req.body);

  if (!result.success) {
    
    const formattedErrors = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    res.status(400).json({
      status: 400,
      message: "Error de validación en los datos enviados",
      data: formattedErrors, // Enviamos la lista formateada
    });
    return;
  }

  // Como superRefine puede alterar el tipado de salida, 
  // le asignamos el body directamente indicando que la data es válida
  req.body = result.data;
  next();
};