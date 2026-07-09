import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { AuthCard } from "../../Login/Components/AuthCard";
import { EmailInput } from "../../Login/Components/EmailInput";
import { PasswordInput } from "../../Login/Components/PasswordInput";
import { TextInput } from "../Components/TextInput";
import { TextAreaInput } from "../Components/TextAreaInput";
import { LogoYonJob } from "@/components/ui/LogoYonJob";
import { DEPARTAMENTOS } from "@/constants/locationData";
import { useRegister } from "../hooks/useRegister";

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    departamento,
    municipiosDisponibles,
    handleUsarMiUbicacion,
    setValue,
    watch,
    user,
    navigate,
    handleTelefonoChange,
    handleDuiChange,
  } = useRegister();

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
            ¡Regístrate en nuestra tienda!
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
          {/* Nombres y apellidos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <TextInput {...register("nombres")} placeholder="Nombres" />
              {errors.nombres && (
                <p className="mt-1 text-xs text-red-500">{errors.nombres.message}</p>
              )}
            </div>
            <div>
              <TextInput {...register("apellidos")} placeholder="Apellidos" />
              {errors.apellidos && (
                <p className="mt-1 text-xs text-red-500">{errors.apellidos.message}</p>
              )}
            </div>
          </div>

          {/* DUI y teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <TextInput
                {...register("dui")}
                placeholder="DUI (ej: 12345678-9)"
                onChange={handleDuiChange}
                value={watch("dui") ?? ""}
              />
              {errors.dui && (
                <p className="mt-1 text-xs text-red-500">{errors.dui.message}</p>
              )}
            </div>
            <div>
              <TextInput
                {...register("telefono")}
                placeholder="Teléfono (ej: 7123-4567)"
                onChange={handleTelefonoChange}
                value={watch("telefono") ?? ""}
              />
              {errors.telefono && (
                <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <EmailInput {...register("email")} />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <TextAreaInput
              {...register("direccion")}
              placeholder="Dirección"
            />
            {errors.direccion && (
              <p className="mt-1 text-xs text-red-500">{errors.direccion.message}</p>
            )}
          </div>

          {/* Ubicación */}
          <div className="flex items-center justify-between">
            {user?.deparmet && (
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
            <div>
              <select
                {...register("departamento")}
                onChange={(e) => {
                  setValue("departamento", e.target.value, { shouldValidate: true });
                  setValue("municipio", "", { shouldValidate: false });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-3.5 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
              >
                <option value="">Departamento...</option>
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.departamento && (
                <p className="mt-1 text-xs text-red-500">{errors.departamento.message}</p>
              )}
            </div>
            <div>
              <select
                {...register("municipio")}
                disabled={!departamento}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Municipio...</option>
                {municipiosDisponibles.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {errors.municipio && (
                <p className="mt-1 text-xs text-red-500">{errors.municipio.message}</p>
              )}
            </div>
          </div>

          {/* Contraseñas */}
          <div>
            <PasswordInput {...register("password")} placeholder="Contraseña" />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <PasswordInput {...register("confirmPassword")} placeholder="Repetir contraseña" />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-2 shadow-md"
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </motion.button>
        </form>
      </AuthCard>
    </div>
  );
};
