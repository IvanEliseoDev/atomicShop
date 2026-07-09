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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
    setFieldErrors({});
    const result = await registerFirstEmployeeAction({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      number_phone: formattedPhone,
    });
    setIsPosting(false);
    if (result.success) {
      toast.success("¡Cuenta administrador creada! Ahora inicia sesión.");
      onRegistered();
    } else {
      if (result.errors && result.errors.length > 0) {
        const errMap: Record<string, string> = {};
        result.errors.forEach(({ field, message }) => { errMap[field] = message; });
        setFieldErrors(errMap);
        toast.error("Corrige los errores del formulario.");
      } else {
        toast.error(result.error ?? "No se pudo crear la cuenta, intenta de nuevo.");
      }
    }
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src="/logoatomicshop.png"
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
          <div>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              required
              className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition ${fieldErrors.name ? "border-red-400" : "border-gray-300"}`}
            />
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <input
              name="number_phone"
              value={formData.number_phone}
              onChange={handleChange}
              placeholder="Número de teléfono (ej: 7777-7777)"
              className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition ${fieldErrors.number_phone ? "border-red-400" : "border-gray-300"}`}
            />
            {fieldErrors.number_phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.number_phone}</p>}
          </div>

          {/* Email */}
          <div>
            <EmailInput
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
            />
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
          </div>

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
