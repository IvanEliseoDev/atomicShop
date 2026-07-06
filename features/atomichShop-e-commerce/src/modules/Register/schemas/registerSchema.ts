import { z } from "zod";

export const registerSchema = z
  .object({
    nombres: z.string().min(1, "El nombre es requerido"),
    apellidos: z.string().min(1, "Los apellidos son requeridos"),
    dui: z.string().optional(),
    telefono: z.string().optional(),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .email("Ingresa un correo electrónico válido"),
    direccion: z.string().min(1, "La dirección es requerida"),
    departamento: z.string().min(1, "Selecciona un departamento"),
    municipio: z.string().min(1, "Selecciona un municipio"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
