import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AuthCard } from "../components/AuthCard";
import { EmailInput } from "../components/EmailInput";
import { PasswordInput } from "../components/PasswordInput";
import { registerFirstEmployeeAction } from "@/auth/actions/registerFirstEmployee.action";

interface Props {
  onRegistered: () => void;
}

export const FirstUseRegisterPage = ({ onRegistered }: Props) => {
  const [isPosting, setIsPosting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number_phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const rawPhone = formData.number_phone.replace(/\D/g, "");
    const formattedPhone =
      rawPhone.length === 8
        ? `${rawPhone.slice(0, 4)}-${rawPhone.slice(4)}`
        : formData.number_phone;

    setIsPosting(true);
    const result = await registerFirstEmployeeAction({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      number_phone: formattedPhone, // usar el formateado
    });
    setIsPosting(false);
    if (result.success) {
      toast.success("¡Cuenta administrador creada! Ahora inicia sesión.");
      onRegistered();
    } else {
      toast.error("No se pudo crear la cuenta, intenta de nuevo.");
      // Mostrar más detalles en consola para depuración
      console.error("Error detallado:", result);
    }
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src="../public/logoatomicshop.png"
            alt="AtomicShop"
            className="object-contain w-52 h-24"
          />
          <div className="w-0.5 h-8 bg-gray-300" />
          <div>
            <p className="font-semibold text-gray-800 text-base leading-tight">
              Primer uso
            </p>
            <p className="text-xs text-gray-500">
              Registra la cuenta administrador
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Nombre */}
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Teléfono */}
          <input
            name="number_phone"
            value={formData.number_phone}
            onChange={handleChange}
            placeholder="Número de teléfono"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Email — reutilizamos tu componente existente */}
          <EmailInput
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
          />

          {/* Contraseña */}
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
          />

          {/* Confirmar contraseña */}
          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
          />

          <motion.button
            type="submit"
            disabled={isPosting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-2"
          >
            {isPosting ? "Creando cuenta..." : "Crear cuenta administrador"}
          </motion.button>
        </div>
      </form>
    </AuthCard>
  );
};
