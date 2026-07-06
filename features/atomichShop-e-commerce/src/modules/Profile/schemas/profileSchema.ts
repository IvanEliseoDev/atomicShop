import { z } from "zod";

export const profileSchema = z.object({
  nombres: z.string().min(1, "El nombre es requerido"),
  telefono: z.string().optional(),
  dni: z.string().optional(),
  direccion: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
