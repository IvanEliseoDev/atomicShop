import React, { useState } from "react";
import { ShoppingCart, Truck, CreditCard } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../../../lib/AuthContext";
import { useCart } from "../../../lib/CartContext";
import { ecommerceService } from "../../../services/ecommerceService";

type MetodoPago = "credito" | "debito" | "efectivo";

interface FormPago {
  numeroTarjeta: string;
  nombreTitular: string;
  vigencia: string;
  cvv: string;
}

// Formatea el número de tarjeta con espacios cada 4 dígitos
const formatCard = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

// Formatea la vigencia MM/AA
const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

const DatosPago = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { clearCart, subtotal, discount } = useCart();

  const [metodo, setMetodo] = useState<MetodoPago>("credito");
  const [form, setForm] = useState<FormPago>({
    numeroTarjeta: "",
    nombreTitular: "",
    vigencia: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Partial<FormPago>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "numeroTarjeta") formatted = formatCard(value);
    if (name === "vigencia") formatted = formatExpiry(value);
    if (name === "cvv") formatted = value.replace(/\D/g, "").slice(0, 4);
    setForm((prev) => ({ ...prev, [name]: formatted }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    if (metodo === "efectivo") return {};
    const newErrors: Partial<FormPago> = {};
    if (form.numeroTarjeta.replace(/\s/g, "").length < 16)
      newErrors.numeroTarjeta = "Número de tarjeta inválido";
    if (!form.nombreTitular.trim())
      newErrors.nombreTitular = "El nombre es requerido";
    if (form.vigencia.length < 5)
      newErrors.vigencia = "Vigencia inválida (MM/AA)";
    if (form.cvv.length < 3) newErrors.cvv = "CVV inválido";
    return newErrors;
  };

  const handleFinalizar = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!user?.id) {
      toast.error("Debes iniciar sesion para finalizar la compra");
      navigate("/login");
      return;
    }

    const rawDelivery = sessionStorage.getItem("deliveryData");
    if (!rawDelivery) {
      toast.error("Faltan los datos de entrega");
      navigate("/carrito/datos-entrega");
      return;
    }

    setLoading(true);
    try {
      const deliveryData = JSON.parse(rawDelivery);
      let wompiTransactionId: string | null = null;

      // Solo procesar pago con Wompi si el metodo es tarjeta
      if (metodo === "credito" || metodo === "debito") {
        // 1. Obtener token Bearer de Wompi desde nuestro backend
        const tokenResponse = await ecommerceService.getWompiToken();
        if (!tokenResponse?.access_token) {
          toast.error("No se pudo conectar con el procesador de pagos");
          setLoading(false);
          return;
        }

        // 2. Ejecutar el cargo con los datos de tarjeta del formulario
        const wompiResponse = await ecommerceService.payWithWompi(
          tokenResponse.access_token,
          {
            monto: subtotal - discount,
            emailCliente: user.mail ?? "",
            nombreCliente: user.name ?? "",
            tokenTarjeta: form.numeroTarjeta.replace(/\s/g, ""),
            cvv: form.cvv,
            vigencia: form.vigencia,
            nombreTitular: form.nombreTitular,
            nombreProducto: "Compra en AtomicShop",
          },
        );

        // 3. Verificar que Wompi haya aprobado el pago
        if (!wompiResponse?.codigoAutorizacion && !wompiResponse?.id) {
          toast.error(
            "El pago fue rechazado. Verifica los datos de tu tarjeta.",
          );
          setLoading(false);
          return;
        }

        wompiTransactionId =
          wompiResponse.codigoAutorizacion ?? wompiResponse.id;
      }

      // 4. Crear la factura en nuestro backend con el ID de transaccion (o null si es efectivo)
      const result = await ecommerceService.createInvoice({
        customerId: user.id,
        deliveryData,
        paymentMethod: metodo,
        wompiTransactionId,
      });

      if (result.status === "201") {
        sessionStorage.removeItem("deliveryData");
        clearCart();
        toast.success(
          "Compra finalizada. Revisa tu correo para ver tu factura.",
        );
        navigate("/");
      } else {
        toast.error(result.message ?? "Ocurrio un error al procesar la compra");
      }
    } catch {
      toast.error("Error de conexion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
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
          {/* Paso 2 — completado */}
          <div
            className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-sky-500 transition"
            onClick={() => navigate("/carrito/datos-entrega")}
          >
            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <Truck size={16} />
            <span>Datos de entrega</span>
          </div>
          <div className="flex-1 h-px bg-sky-300 mx-2" />
          {/* Paso 3 — activo */}
          <div className="flex items-center gap-2 text-sky-600 font-semibold">
            <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold">
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
              <CreditCard size={16} className="text-sky-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-800">
              Datos de pago
            </h2>
          </div>

          {/* Tabs método de pago */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6 text-sm">
            {(["credito", "debito", "efectivo"] as MetodoPago[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetodo(m)}
                className={`flex-1 py-2 font-medium capitalize transition cursor-pointer ${
                  metodo === m
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {m === "credito"
                  ? "Tarjeta de crédito"
                  : m === "debito"
                    ? "Tarjeta de débito"
                    : "En efectivo"}
              </button>
            ))}
          </div>

          {/* Ilustración tarjeta */}
          {metodo !== "efectivo" && (
            <div className="flex justify-center mb-6">
              <div className="w-64 h-40 bg-gradient-to-br from-sky-500 to-blue-700 rounded-2xl shadow-lg p-5 text-white relative overflow-hidden">
                {/* Círculos decorativos */}
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
                <div className="absolute -bottom-8 -left-4 w-36 h-36 bg-white/10 rounded-full" />
                <p className="text-xs font-light opacity-80 mb-4">BANK</p>
                <p className="text-lg font-mono tracking-widest">
                  {form.numeroTarjeta || "•••• •••• •••• ••••"}
                </p>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-xs opacity-70">Titular</p>
                    <p className="text-sm font-medium uppercase truncate max-w-[130px]">
                      {form.nombreTitular || "NOMBRE APELLIDO"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-70">Vigencia</p>
                    <p className="text-sm font-medium">
                      {form.vigencia || "MM/AA"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campos de tarjeta */}
          {metodo !== "efectivo" ? (
            <div className="flex flex-col gap-4">
              {/* Número de tarjeta */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  *Número de tarjeta
                </label>
                <input
                  type="text"
                  name="numeroTarjeta"
                  value={form.numeroTarjeta}
                  onChange={handleChange}
                  placeholder="0000 0000 0000 0000"
                  className={`border rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition font-mono ${
                    errors.numeroTarjeta ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.numeroTarjeta && (
                  <p className="text-xs text-red-500">{errors.numeroTarjeta}</p>
                )}
              </div>

              {/* Nombre del titular */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  *Nombre y apellido del titular de la tarjeta
                </label>
                <input
                  type="text"
                  name="nombreTitular"
                  value={form.nombreTitular}
                  onChange={handleChange}
                  placeholder="Como aparece en la tarjeta"
                  className={`border rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition uppercase ${
                    errors.nombreTitular ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.nombreTitular && (
                  <p className="text-xs text-red-500">{errors.nombreTitular}</p>
                )}
              </div>

              {/* Vigencia y CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    *Vigencia
                  </label>
                  <input
                    type="text"
                    name="vigencia"
                    value={form.vigencia}
                    onChange={handleChange}
                    placeholder="MM/AA"
                    className={`border rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition w-full ${
                      errors.vigencia ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.vigencia && (
                    <p className="text-xs text-red-500">{errors.vigencia}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    *CVV{" "}
                    <span className="text-gray-400 font-normal">
                      (3-4 dígitos)
                    </span>
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={form.cvv}
                    onChange={handleChange}
                    placeholder="•••"
                    className={`border rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition w-full ${
                      errors.cvv ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.cvv && (
                    <p className="text-xs text-red-500">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Mensaje efectivo */
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-sky-700 text-center">
              Podrás pagar en efectivo al momento de recibir tu pedido.
            </div>
          )}

          {/* Botón finalizar */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            onClick={handleFinalizar}
            disabled={loading}
            className="mt-6 w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition cursor-pointer"
          >
            {loading ? "Procesando..." : "Finalizar compra"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default DatosPago;
