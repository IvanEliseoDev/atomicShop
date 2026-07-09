import { z } from "zod";

export const profileSchema = z.object({
  nombres: z.string().min(1, "El nombre es requerido"),
  telefono: z
    .string()
    .refine((v) => !v || /^\d{4}-\d{4}$/.test(v), "Formato inválido (ej: 7123-4567)")
    .optional(),
  dni: z
    .string()
    .refine((v) => !v || /^\d{8}-\d$/.test(v), "Formato inválido (ej: 12345678-9)")
    .optional(),
  direccion: z.string().optional(),
  departamento: z.string().optional(),
  municipio: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
