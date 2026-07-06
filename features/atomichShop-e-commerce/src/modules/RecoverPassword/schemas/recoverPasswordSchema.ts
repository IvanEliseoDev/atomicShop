import { z } from "zod";

export const recoverEmailSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Ingresa un correo electrónico válido"),
});

export const recoverNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RecoverEmailFormData = z.infer<typeof recoverEmailSchema>;
export type RecoverNewPasswordFormData = z.infer<typeof recoverNewPasswordSchema>;
