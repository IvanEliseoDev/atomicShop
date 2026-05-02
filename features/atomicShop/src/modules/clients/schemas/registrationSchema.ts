import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .nonempty("El nombre es obligatorio"),
  
  mail: z.string()
    .email("Correo electrónico no válido")
    .nonempty("El correo es obligatorio"),
  
  numberPhone: z.string()
    .regex(/^\d{4}-\d{4}$/, "Formato de teléfono inválido (0000-0000)"),

  direction: z.string().min(5, "La dirección es muy corta"),
  
  typeClient: z.string().nonempty("Seleccione un tipo de cliente"),

  whitCreditFiscal: z.boolean(),

  // Validaciones condicionales para DUI y NIT
  dui: z.string().optional().or(z.literal("")),
  nit: z.string().optional().or(z.literal("")),
  typeGiro: z.string().optional().or(z.literal("")),
}).superRefine((values, ctx) => {

  if (values.whitCreditFiscal) {
    if (!/^\d{8}-\d{1}$/.test(values.dui || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Formato de DUI inválido (00000000-0)",
        path: ["dui"],
      });
    }
    if (!/^\d{4}-\d{6}-\d{3}-\d{1}$/.test(values.nit || "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Formato de NIT inválido (0000-000000-000-0)",
        path: ["nit"],
      });
    }
    if (!values.typeGiro) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El tipo de giro es obligatorio",
          path: ["typeGiro"],
        });
      }
  }
});