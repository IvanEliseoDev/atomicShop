import { z } from "zod";

export const datosEntregaSchema = z.object({
  direccion: z.string().min(1, "La dirección es requerida"),
  departamento: z.string().min(1, "Selecciona un departamento"),
  municipio: z.string().min(1, "Selecciona un municipio"),
  fechaEntrega: z.string().optional(),
});

export type DatosEntregaFormData = z.infer<typeof datosEntregaSchema>;
