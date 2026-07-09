import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AuthCard } from "../components/AuthCard";
import { EmailInput } from "../components/EmailInput";
import { PasswordInput } from "../components/PasswordInput";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/auth/store/auth.store";
import { checkFirstUseAction } from "@/auth/actions/checkFirstUse.action";
import { FirstUseRegisterPage } from "./FirstUseRegisterPage";
import Swal from "sweetalert2";

type View = "checking" | "first-use" | "login";

export const LoginPage = () => {
  const [view, setView] = useState<View>("checking");
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();
  const { login, restrictedMessage, clearRestrictedMessage } = useAuthStore();

  useEffect(() => {
    checkFirstUseAction().then((isFirstUse) => {
      setView(isFirstUse ? "first-use" : "login");
    });
  }, []);

  // Muestra alerta si el usuario fue redirigido por cuenta restringida
  useEffect(() => {
    if (restrictedMessage) {
      Swal.fire({
        icon: "error",
        title: "Cuenta deshabilitada",
        text: restrictedMessage,
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "Entendido",
      });
      clearRestrictedMessage();
    }
  }, [restrictedMessage, clearRestrictedMessage]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPosting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const success = await login(email, password);
    if (success) {
      toast.success("Inicio de sesión exitoso");
      navigate("/atomicAdmin/");
      return;
    }
    const { restrictedMessage: msg, clearRestrictedMessage: clear } = useAuthStore.getState();
    if (msg) {
      Swal.fire({
        icon: "error",
        title: "Cuenta deshabilitada",
        text: msg,
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "Entendido",
      });
      clear();
    } else {
      toast.error("Correo o contraseña no válidos");
    }
    setIsPosting(false);
  };

  // Mientras verifica
  if (view === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm animate-pulse">
          Verificando sistema...
        </p>
      </div>
    );
  }

  // Primer uso: no hay empleados en BD
  if (view === "first-use") {
    return <FirstUseRegisterPage onRegistered={() => setView("login")} />;
  }

  // Login normal
  return (
    <AuthCard>
      <form onSubmit={handleLogin}>
        <div className="flex items-center gap-4 mb-8">
          <img
            src="/logoatomicshop.png"
            alt=""
            className="object-contain w-52 h-24"
          />
          <div className="w-0.5 h-8 bg-gray-300" />
          <div className="font-semibold text-gray-800 text-lg">
            Inicio de sesión
          </div>
        </div>

        <div className="space-y-4">
          <EmailInput placeholder="Correo electrónico" />
          <PasswordInput placeholder="Contraseña" />

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/ForgetPassword")}
              className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 transition"
            >
              ¿Olvidó su contraseña?
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={isPosting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-6"
          >
            {isPosting ? "Iniciando sesión..." : "Iniciar sesión"}
          </motion.button>
        </div>
      </form>
    </AuthCard>
  );
};
