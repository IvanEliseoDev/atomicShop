import { z } from "zod";

export const datosPagoSchema = z
  .object({
    metodo: z.enum(["credito", "debito", "efectivo"]),
    numeroTarjeta: z.string().default(""),
    nombreTitular: z.string().default(""),
    vigencia: z.string().default(""),
    cvv: z.string().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.metodo === "efectivo") return;

    if (data.numeroTarjeta.replace(/\s/g, "").length < 16) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Número de tarjeta inválido",
        path: ["numeroTarjeta"],
      });
    }
    if (!data.nombreTitular.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El nombre del titular es requerido",
        path: ["nombreTitular"],
      });
    }
    if (data.vigencia.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vigencia inválida (MM/AA)",
        path: ["vigencia"],
      });
    }
    if (data.cvv.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CVV inválido (3-4 dígitos)",
        path: ["cvv"],
      });
    }
  });

export type DatosPagoFormData = z.infer<typeof datosPagoSchema>;
