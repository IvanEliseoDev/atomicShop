import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "../../Login/Components/AuthCard";
import { EmailInput } from "../../Login/Components/EmailInput";
import { LogoYonJob } from "@/components/ui/LogoYonJob";
import {
  recoverEmailSchema,
  type RecoverEmailFormData,
} from "../schemas/recoverPasswordSchema";

interface Props {
  onVerify: (email: string) => void;
}

export const RecoverEmailEntry = ({ onVerify }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoverEmailFormData>({
    resolver: zodResolver(recoverEmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: RecoverEmailFormData) => onVerify(data.email);

  return (
    <AuthCard className="max-w-md">
      <div className="flex flex-col items-center mb-6 text-center">
        <LogoYonJob />
        <h2 className="text-gray-800 font-bold text-lg">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Ingresa tu correo y te enviaremos un código de verificación.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <EmailInput {...register("email")} placeholder="Correo electrónico" />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#5BA4E1] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#4a93d0] disabled:opacity-60 transition-all"
        >
          {isSubmitting ? "Enviando..." : "Enviar código"}
        </button>
      </form>
    </AuthCard>
  );
};
