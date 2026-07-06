import { ShoppingCart, Truck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useDatosPago } from "../hooks/useDatosPago";
import type { DatosPagoFormData } from "../schemas/datosPagoSchema";

type MetodoPago = DatosPagoFormData["metodo"];

const DatosPago = () => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    metodo,
    numeroTarjeta,
    nombreTitular,
    vigencia,
    loading,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvvChange,
    setValue,
    navigate,
  } = useDatosPago();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Stepper */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <div
            className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-sky-500 transition"
            onClick={() => navigate("/carrito")}
          >
            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">1</div>
            <ShoppingCart size={16} />
            <span>Verificar tu carrito</span>
          </div>
          <div className="flex-1 h-px bg-sky-300 mx-2" />
          <div
            className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-sky-500 transition"
            onClick={() => navigate("/carrito/datos-entrega")}
          >
            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">2</div>
            <Truck size={16} />
            <span>Datos de entrega</span>
          </div>
          <div className="flex-1 h-px bg-sky-300 mx-2" />
          <div className="flex items-center gap-2 text-sky-600 font-semibold">
            <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold">3</div>
            <CreditCard size={16} />
            <span>Datos de pago</span>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-5xl mx-auto px-4 py-10 flex justify-center">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 w-full max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
              <CreditCard size={16} className="text-sky-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-800">Datos de pago</h2>
          </div>

          {/* Tabs método de pago */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6 text-sm">
            {(["credito", "debito", "efectivo"] as MetodoPago[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setValue("metodo", m, { shouldValidate: true })}
                className={`flex-1 py-2 font-medium capitalize transition cursor-pointer ${
                  metodo === m ? "bg-sky-500 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {m === "credito" ? "Tarjeta de crédito" : m === "debito" ? "Tarjeta de débito" : "En efectivo"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Ilustración tarjeta */}
            {metodo !== "efectivo" && (
              <div className="flex justify-center mb-6">
                <div className="w-64 h-40 bg-gradient-to-br from-sky-500 to-blue-700 rounded-2xl shadow-lg p-5 text-white relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-8 -left-4 w-36 h-36 bg-white/10 rounded-full" />
                  <p className="text-xs font-light opacity-80 mb-4">BANK</p>
                  <p className="text-lg font-mono tracking-widest">
                    {numeroTarjeta || "•••• •••• •••• ••••"}
                  </p>
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p className="text-xs opacity-70">Titular</p>
                      <p className="text-sm font-medium uppercase truncate max-w-[130px]">
                        {nombreTitular || "NOMBRE APELLIDO"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-70">Vigencia</p>
                      <p className="text-sm font-medium">{vigencia || "MM/AA"}</p>
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
                  <label className="text-xs font-medium text-gray-600">*Número de tarjeta</label>
                  <input
                    type="text"
                    value={numeroTarjeta}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className={`border rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition font-mono ${errors.numeroTarjeta ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.numeroTarjeta && (
                    <p className="text-xs text-red-500">{errors.numeroTarjeta.message}</p>
                  )}
                </div>

                {/* Nombre del titular */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">*Nombre y apellido del titular</label>
                  <input
                    type="text"
                    {...register("nombreTitular")}
                    placeholder="Como aparece en la tarjeta"
                    className={`border rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition uppercase ${errors.nombreTitular ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.nombreTitular && (
                    <p className="text-xs text-red-500">{errors.nombreTitular.message}</p>
                  )}
                </div>

                {/* Vigencia y CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">*Vigencia</label>
                    <input
                      type="text"
                      value={vigencia}
                      onChange={handleExpiryChange}
                      placeholder="MM/AA"
                      className={`border rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition w-full ${errors.vigencia ? "border-red-400" : "border-gray-300"}`}
                    />
                    {errors.vigencia && (
                      <p className="text-xs text-red-500">{errors.vigencia.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">
                      *CVV <span className="text-gray-400 font-normal">(3-4 dígitos)</span>
                    </label>
                    <input
                      type="password"
                      {...register("cvv")}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      className={`border rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition w-full ${errors.cvv ? "border-red-400" : "border-gray-300"}`}
                    />
                    {errors.cvv && (
                      <p className="text-xs text-red-500">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-sky-700 text-center">
                Podrás pagar en efectivo al momento de recibir tu pedido.
              </div>
            )}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition cursor-pointer"
            >
              {loading ? "Procesando..." : "Finalizar compra"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DatosPago;
