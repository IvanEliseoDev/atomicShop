import React, { useState } from "react";
import { ShoppingCart, Truck, CreditCard } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

// Datos de ejemplo para los selectores
const DEPARTAMENTOS = [
  "San Salvador",
  "Santa Ana",
  "San Miguel",
  "La Libertad",
  "Sonsonate",
  "Chalatenango",
  "Cuscatlán",
  "La Paz",
  "Cabañas",
  "San Vicente",
  "Usulután",
  "Morazán",
  "La Unión",
  "Ahuachapán",
];

const MUNICIPIOS: Record<string, string[]> = {
  "San Salvador": [
    "San Salvador",
    "Mejicanos",
    "Soyapango",
    "Apopa",
    "Ilopango",
    "San Marcos",
  ],
  "Santa Ana": ["Santa Ana", "Chalchuapa", "Metapán", "Texistepeque"],
  "San Miguel": ["San Miguel", "Moncagua", "Quelepa", "Chirilagua"],
  "La Libertad": [
    "Santa Tecla",
    "Antiguo Cuscatlán",
    "Colón",
    "Zaragoza",
    "La Libertad",
  ],
  Sonsonate: ["Sonsonate", "Acajutla", "Nahuizalco", "Izalco"],
  Chalatenango: ["Chalatenango", "La Palma", "San Ignacio"],
  Cuscatlán: ["Cojutepeque", "Suchitoto", "San Pedro Perulapán"],
  "La Paz": ["Zacatecoluca", "San Luis Talpa", "Olocuilta"],
  Cabañas: ["Sensuntepeque", "Ilobasco"],
  "San Vicente": ["San Vicente", "Apastepeque"],
  Usulután: ["Usulután", "Jiquilisco", "Santa Elena"],
  Morazán: ["San Francisco Gotera", "Corinto", "Jocoaitique"],
  "La Unión": ["La Unión", "Santa Rosa de Lima", "Pasaquina"],
  Ahuachapán: ["Ahuachapán", "Atiquizaya", "Tacuba"],
};

interface FormData {
  direccion: string;
  departamento: string;
  municipio: string;
  fechaEntrega: string;
}

const DatosEntrega = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    direccion: "",
    departamento: "",
    municipio: "",
    fechaEntrega: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const municipiosDisponibles = form.departamento
    ? (MUNICIPIOS[form.departamento] ?? [])
    : [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Resetear municipio si cambia departamento
      ...(name === "departamento" ? { municipio: "" } : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!form.direccion.trim())
      newErrors.direccion = "La dirección es requerida";
    if (!form.departamento)
      newErrors.departamento = "Selecciona un departamento";
    if (!form.municipio) newErrors.municipio = "Selecciona un municipio";
    return newErrors;
  };

  const handleContinuar = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    sessionStorage.setItem("deliveryData", JSON.stringify(form));
    navigate("/carrito/datos-pago");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Stepper ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          {/* Paso 1 — completado */}
          <div
            className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-sky-500 transition"
            onClick={() => navigate("/carrito")}
          >
            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
              1
            </div>
            <ShoppingCart size={16} />
            <span>Verificar tu carrito</span>
          </div>
          <div className="flex-1 h-px bg-sky-300 mx-2" />
          {/* Paso 2 — activo */}
          <div className="flex items-center gap-2 text-sky-600 font-semibold">
            <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <Truck size={16} />
            <span>Datos de entrega</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2" />
          {/* Paso 3 */}
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <CreditCard size={16} />
            <span>Datos de pago</span>
          </div>
        </div>
      </div>

      {/* ── Formulario ── */}
      <div className="max-w-5xl mx-auto px-4 py-10 flex justify-center">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 w-full max-w-md">
          {/* Header tarjeta */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
              <Truck size={16} className="text-sky-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-800">
              Datos de envío
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* Dirección */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                *Dirección
              </label>
              <textarea
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                rows={3}
                placeholder="Calle, número, colonia, referencias..."
                className={`border rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition resize-none ${
                  errors.direccion ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.direccion && (
                <p className="text-xs text-red-500">{errors.direccion}</p>
              )}
            </div>

            {/* Departamento */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                *Departamento
              </label>
              <select
                name="departamento"
                value={form.departamento}
                onChange={handleChange}
                className={`border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition cursor-pointer ${
                  errors.departamento ? "border-red-400" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar...</option>
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.departamento && (
                <p className="text-xs text-red-500">{errors.departamento}</p>
              )}
            </div>

            {/* Municipio */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                *Municipio
              </label>
              <select
                name="municipio"
                value={form.municipio}
                onChange={handleChange}
                disabled={!form.departamento}
                className={`border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 ${
                  errors.municipio ? "border-red-400" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar...</option>
                {municipiosDisponibles.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {errors.municipio && (
                <p className="text-xs text-red-500">{errors.municipio}</p>
              )}
            </div>

            {/* Fecha de entrega (opcional) */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Fecha de entrega{" "}
                <span className="text-gray-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="date"
                name="fechaEntrega"
                value={form.fechaEntrega}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
              />
            </div>

            {/* Botón */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleContinuar}
              className="mt-2 w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-lg transition cursor-pointer"
            >
              Continuar
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosEntrega;
