import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { AuthCard } from "../../Login/Components/AuthCard";
import { EmailInput } from "../../Login/Components/EmailInput";
import { PasswordInput } from "../../Login/Components/PasswordInput";
import { TextInput } from "../Components/TextInput";
import { ecommerceService } from "@/services/ecommerceService";
import { LogoYonJob } from "@/components/ui/LogoYonJob";
import { TextAreaInput } from "../Components/TextAreaInput";
import { useAuth } from "@/lib/AuthContext";
import { DEPARTAMENTOS, MUNICIPIOS } from "@/constants/locationData";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dui: "",
    telefono: "",
    email: "",
    direccion: "",
    departamento: "",
    municipio: "",
    password: "",
    confirmPassword: "",
  });

  const { user } = useAuth();

  const municipiosDisponibles = formData.departamento
    ? (MUNICIPIOS[formData.departamento] ?? [])
    : [];

  const handleUsarMiUbicacion = () => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      departamento: user.deparmet || "",
      municipio: user.municipality || "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleRegister = async () => {
    const {
      nombres,
      apellidos,
      dui,
      telefono,
      email,
      direccion,
      password,
      confirmPassword,
    } = formData;

    if (!email.trim() || !password.trim() || password !== confirmPassword) {
      toast.error("Revisa los datos y la contraseña");
      return;
    }

    setLoading(true);

    const result = await ecommerceService.register({
      name: `${nombres} ${apellidos}`,
      mail: email,
      password,
      telephone: telefono,
      direction: direccion,
      dui,
      deparmet: formData.departamento, // ← agregar
      municipality: formData.municipio, // ← agregar
    });

    if (result.status === "201") {
      toast.success("Cuenta creada. Revisa tu correo para verificarla.");
      navigate("/verify-email"); // pantalla donde ingresan el codigo
    } else if (result.status === "400") {
      toast.error("Este correo ya está registrado");
    } else {
      toast.error("Error al registrar, intenta de nuevo");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative py-10">
      <button
        onClick={() => navigate(-1)}
        className="absolute cursor-pointer top-4 left-4 flex items-center gap-1 text-gray-600 hover:text-gray-800 transition text-sm font-medium"
      >
        <ChevronLeft size={18} />
        Regresar
      </button>

      <AuthCard className="max-w-md">
        <div className="flex flex-col items-center mb-6">
          <LogoYonJob className="h-20" />
          <h2 className="text-gray-800 font-bold text-lg">
            ¡Registrate en nuestra tienda!
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              placeholder="Nombres"
              value={formData.nombres}
              onChange={(e) => handleChange(e, "nombres")}
            />
            <TextInput
              placeholder="Apellidos"
              value={formData.apellidos}
              onChange={(e) => handleChange(e, "apellidos")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              placeholder="DUI"
              value={formData.dui}
              onChange={(e) => handleChange(e, "dui")}
            />
            <TextInput
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleChange(e, "telefono")}
            />
          </div>

          <EmailInput
            value={formData.email}
            onChange={(e) => handleChange(e, "email")}
          />

          <TextAreaInput
            placeholder="Direccion"
            value={formData.direccion}
            onChange={(e) => handleChange(e, "direccion")}
          />

          {/* Departamento y Municipio */}
          <div className="flex items-center justify-between">
            {user && user.deparmet && (
              <button
                type="button"
                onClick={handleUsarMiUbicacion}
                className="text-xs text-blue-500 hover:text-blue-700 hover:underline transition cursor-pointer"
              >
                Utilizar mi ubicación
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={formData.departamento}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  departamento: e.target.value,
                  municipio: "",
                })
              }
              className="border border-gray-300 rounded-lg px-3 py-3.5 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              <option value="">Departamento...</option>
              {DEPARTAMENTOS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={formData.municipio}
              onChange={(e) =>
                setFormData({ ...formData, municipio: e.target.value })
              }
              disabled={!formData.departamento}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Municipio...</option>
              {municipiosDisponibles.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <PasswordInput
            value={formData.password}
            onChange={(e) => handleChange(e, "password")}
            placeholder="Contraseña"
          />

          <PasswordInput
            value={formData.confirmPassword}
            onChange={(e) => handleChange(e, "confirmPassword")}
            placeholder="Repetir contraseña"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-2 shadow-md"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </motion.button>
        </div>
      </AuthCard>
    </div>
  );
};
