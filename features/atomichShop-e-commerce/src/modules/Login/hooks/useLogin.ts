import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    
    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.ok) {
        toast.success("Sesión iniciada correctamente");
        navigate("/");
      } else {
        const messages: Record<string, string> = {
          "Email not found": "Correo no registrado",
          "Incorrect password": "Contraseña incorrecta",
          "Account blocked": "Cuenta bloqueada, intenta en 15 minutos",
          "Email not verified": "Debes verificar tu correo antes de ingresar",
        };
        toast.error(messages[result.message] ?? "Error al iniciar sesión");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => navigate("/recover-password");
  const handleRegisterNavigation = () => navigate("/register");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleForgotPassword,
    handleRegisterNavigation,
    handleKeyPress,
    navigate,
  };
}