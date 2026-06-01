import React, { useState } from "react";

import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AuthCard } from "../Components/AuthCard";
import { EmailInput } from "../Components/EmailInput";
import { PasswordInput } from "../Components/PasswordInput";
// import { validateEmail, verifyCredentials } from "@/auth/mock/authMock";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

export const LoginPage = () => {
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
    const result = await login(email, password);
    if (result.ok) {
      toast.success("Sesión iniciada correctamente");
      navigate("/atomicShop");
    } else {
      const messages: Record<string, string> = {
        "Email not found": "Correo no registrado",
        "Incorrect password": "Contraseña incorrecta",
        "Account blocked": "Cuenta bloqueada, intenta en 15 minutos",
        "Email not verified": "Debes verificar tu correo antes de ingresar",
      };
      toast.error(messages[result.message] ?? "Error al iniciar sesión");
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    navigate("/recover-password");
  };

  // Para ir a la página de Registro
  const handleRegisterNavigation = () => {
    navigate("/register");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute cursor-pointer top-4 left-4 flex items-center gap-1 text-gray-600 hover:text-gray-800 transition text-sm font-medium"
      >
        <ChevronLeft size={18} />
        Regresar
      </button>
      <AuthCard>
        {/* Header with logo and divider */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src="../public/logoatomicshop.png"
            alt=""
            className="object-contain w-39 h-24"
          />
          {/*Line divider */}
          <div className="w-0.5 h-8 bg-gray-300" />
          {/*Title login */}
          <div className="font-semibold text-gray-800 text-lg">
            Inicio de sesión
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            onKeyPress={handleKeyPress}
          />

          {/* Forgot password link */}
          <div className="text-right">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 cursor-pointer hover:text-blue-700  transition"
            >
              ¿Olvidó su contraseña?
            </button>
          </div>

          {/* Login button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-1"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </motion.button>

          {/* Create acount */}
          <div className="text-center">
            <button
              onClick={handleRegisterNavigation}
              className="text-sm text-center text-blue-600 cursor-pointer hover:text-blue-700  transition"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </AuthCard>
    </div>
  );
};
