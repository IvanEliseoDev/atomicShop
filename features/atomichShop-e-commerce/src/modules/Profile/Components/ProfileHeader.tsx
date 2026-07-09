import { Mail, MapPin, Phone, CreditCard, Pencil, Check, X, Camera, Building2 } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { DEPARTAMENTOS } from "@/constants/locationData";

export const ProfileHeader = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    isEditing,
    setIsEditing,
    profilePic,
    correo,
    values,
    fileInputRef,
    handleImageChange,
    handleCancelEdit,
    handleTelefonoChange,
    handleDniChange,
    handleDepartamentoChange,
    departamento,
    municipiosDisponibles,
  } = useProfile();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-10">
      {/* Banner Azul */}
      <div className="bg-[#5BA4E1] h-32 relative flex items-center px-12">
        {/* Foto de perfil */}
        <div className="absolute -bottom-12 left-12">
          <div className="relative">
            <div className="w-32 h-32 bg-[#E5E7EB] rounded-full border-4 border-white flex items-center justify-center overflow-hidden shadow-sm">
              {profilePic ? (
                <img src={profilePic} className="w-full h-full object-cover" alt="Foto de perfil" />
              ) : (
                <div className="text-gray-400 font-bold text-4xl">
                  {values.nombres ? values.nombres.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-2 right-0 bg-white p-1.5 rounded-full shadow-md text-[#5BA4E1] hover:bg-gray-50 transition"
            >
              <Camera size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        {/* Nombre en el banner */}
        <div className="ml-40 mt-4 flex items-center gap-3">
          {isEditing ? (
            <input
              {...register("nombres")}
              className="bg-white/20 border-b border-white text-white text-2xl font-bold outline-none px-2 rounded w-80 placeholder-white/60"
              placeholder="Tu nombre"
            />
          ) : (
            <h1 className="text-2xl font-bold text-white">
              {values.nombres || "Sin nombre"}
            </h1>
          )}
          <div className="flex gap-2">
            {isEditing ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-white/80 hover:text-white transition"
                title="Cancelar"
              >
                <X size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-white/80 hover:text-white transition"
                title="Editar perfil"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detalles */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="pt-16 pb-8 px-12 relative">
          <div className="grid grid-cols-2 gap-y-6 gap-x-8">

            {/* Correo (solo lectura) */}
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gray-400 shrink-0" />
              <span className="text-gray-600 text-sm">{correo || "Sin correo"}</span>
            </div>

            {/* Dirección */}
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-gray-400 shrink-0" />
              {isEditing ? (
                <div className="flex-1">
                  <input
                    {...register("direccion")}
                    className="text-sm text-gray-700 border-b border-blue-300 outline-none w-full"
                    placeholder="Dirección"
                  />
                  {errors.direccion && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.direccion.message}</p>
                  )}
                </div>
              ) : (
                <span className="text-gray-600 text-sm">{values.direccion || "Sin definir"}</span>
              )}
            </div>

            {/* Teléfono */}
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-gray-400 shrink-0" />
              {isEditing ? (
                <div className="flex-1">
                  <input
                    {...register("telefono")}
                    onChange={handleTelefonoChange}
                    value={values.telefono ?? ""}
                    className="text-sm text-gray-700 border-b border-blue-300 outline-none w-full"
                    placeholder="Teléfono (ej: 7123-4567)"
                  />
                  {errors.telefono && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.telefono.message}</p>
                  )}
                </div>
              ) : (
                <span className="text-gray-600 text-sm">{values.telefono || "Sin definir"}</span>
              )}
            </div>

            {/* DUI */}
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-gray-400 shrink-0" />
              {isEditing ? (
                <div className="flex-1">
                  <input
                    {...register("dni")}
                    onChange={handleDniChange}
                    value={values.dni ?? ""}
                    className="text-sm text-gray-700 border-b border-blue-300 outline-none w-full"
                    placeholder="DUI (ej: 12345678-9)"
                  />
                  {errors.dni && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.dni.message}</p>
                  )}
                </div>
              ) : (
                <span className="text-gray-600 text-sm">{values.dni || "Sin definir"}</span>
              )}
            </div>

            {/* Departamento */}
            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-gray-400 shrink-0" />
              {isEditing ? (
                <div className="flex-1">
                  <select
                    {...register("departamento")}
                    onChange={handleDepartamentoChange}
                    className="text-sm text-gray-700 border-b border-blue-300 outline-none w-full bg-transparent cursor-pointer"
                  >
                    <option value="">Seleccionar departamento...</option>
                    {DEPARTAMENTOS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.departamento && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.departamento.message}</p>
                  )}
                </div>
              ) : (
                <span className="text-gray-600 text-sm">{values.departamento || "Sin definir"}</span>
              )}
            </div>

            {/* Municipio */}
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-gray-400 shrink-0" />
              {isEditing ? (
                <div className="flex-1">
                  <select
                    {...register("municipio")}
                    disabled={!departamento}
                    className="text-sm text-gray-700 border-b border-blue-300 outline-none w-full bg-transparent cursor-pointer disabled:text-gray-400"
                  >
                    <option value="">Seleccionar municipio...</option>
                    {municipiosDisponibles.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {errors.municipio && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.municipio.message}</p>
                  )}
                </div>
              ) : (
                <span className="text-gray-600 text-sm">{values.municipio || "Sin definir"}</span>
              )}
            </div>

          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#5BA4E1] hover:bg-[#4a93d0] disabled:opacity-60 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition"
              >
                <Check size={18} />
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
