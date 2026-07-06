import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "../../Login/Components/AuthCard";
import { PasswordInput } from "../../Login/Components/PasswordInput";
import { LogoYonJob } from "@/components/ui/LogoYonJob";
import { useRecoverNewPassword } from "../hooks/useRecoverNewPassword";
import {
  recoverNewPasswordSchema,
  type RecoverNewPasswordFormData,
} from "../schemas/recoverPasswordSchema";

interface Props {
  onConfirm: (pass: string) => void;
}

export const RecoverNewPassword = ({ onConfirm }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoverNewPasswordFormData>({
    resolver: zodResolver(recoverNewPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { updatePassword } = useRecoverNewPassword(() => {});

  const onSubmit = async (data: RecoverNewPasswordFormData) => {
    await updatePassword(data.password);
    onConfirm(data.password);
  };

  return (
    <AuthCard className="max-w-md">
      <div className="flex flex-col items-center mb-6 text-center">
        <LogoYonJob className="h-20 mb-4" />
        <p className="text-sm text-gray-700 font-medium px-4">
          ¡Muchas gracias por tu paciencia! Ahora puedes crear tu nueva contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
        <div>
          <PasswordInput {...register("password")} placeholder="Nueva contraseña" />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <PasswordInput
            {...register("confirmPassword")}
            placeholder="Confirmar contraseña"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#5BA4E1] text-white font-bold py-3 rounded-xl mt-4 shadow-md hover:bg-[#4a93d0] disabled:opacity-60 transition-all"
        >
          {isSubmitting ? "Guardando..." : "Confirmar nueva contraseña"}
        </button>
      </form>
    </AuthCard>
  );
};
