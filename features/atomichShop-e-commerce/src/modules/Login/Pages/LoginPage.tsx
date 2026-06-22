import { motion } from "framer-motion";
import { AuthCard } from "../Components/AuthCard";
import { EmailInput } from "../Components/EmailInput";
import { PasswordInput } from "../Components/PasswordInput";
import { LogoYonJob } from "../../../components/ui/LogoYonJob";
import { ChevronLeft } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

export const LoginPage = () => {
  const {
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
  } = useLogin();

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
        <div className="flex items-center gap-4 mb-8">
          <LogoYonJob />
          <div className="w-0.5 h-8 bg-gray-300" />
          <div className="font-semibold text-gray-800 text-lg">
            Inicio de sesión
          </div>
        </div>

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

          <div className="text-right">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 transition"
            >
              ¿Olvidó su contraseña?
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-1"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </motion.button>

          <div className="text-center">
            <button
              onClick={handleRegisterNavigation}
              className="text-sm text-center text-blue-600 cursor-pointer hover:text-blue-700 transition"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </AuthCard>
    </div>
  );
};