import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/AuthContext";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";

const ERROR_MESSAGES: Record<string, string> = {
  "Email not found": "Correo no registrado",
  "Incorrect password": "Contraseña incorrecta",
  "Account blocked": "Cuenta bloqueada, intenta en 15 minutos",
  "Email not verified": "Debes verificar tu correo antes de ingresar",
};

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data.email, data.password);
      if (result.ok) {
        toast.success("Sesión iniciada correctamente");
        navigate("/");
      } else {
        toast.error(ERROR_MESSAGES[result.message] ?? "Error al iniciar sesión");
      }
    } catch {
      toast.error("Ocurrió un error inesperado al conectar con el servidor");
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    handleForgotPassword: () => navigate("/recover-password"),
    handleRegisterNavigation: () => navigate("/register"),
    navigate,
  };
}
