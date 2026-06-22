import { ShoppingCart, Truck, CreditCard } from "lucide-react";
import { useCart } from "../../../lib/CartContext";
import { useNavigate } from "react-router";

const DISCOUNT_RATE = 0.1;

const DetalleCarritoCompras = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, subtotal } = useCart();

  const discountAmount = subtotal * DISCOUNT_RATE;
  const total = subtotal - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2 text-sky-600 font-semibold">
            <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold">1</div>
            <ShoppingCart size={16} />
            <span>Verificar tu carrito</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2" />
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold">2</div>
            <Truck size={16} />
            <span>Datos de entrega</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2" />
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold">3</div>
            <CreditCard size={16} />
            <span>Datos de pago</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Carrito de compras</h2>

          {items.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center">
              <p className="text-gray-400 text-base">Tu carrito está vacío.</p>
              <button
                onClick={() => navigate("/productos")}
                className="mt-4 text-sky-500 text-sm hover:underline cursor-pointer"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 font-medium">
                    <th className="py-3 px-4 text-left">Detalle</th>
                    <th className="py-3 px-4 text-center">Cantidad</th>
                    <th className="py-3 px-4 text-right">Precio U.</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-12 bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={item.image} alt={item.name} className="object-contain h-10 w-auto" />
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium leading-snug">{item.name}</p>
                            {item.originalPrice > item.price && (
                              <p className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden w-fit mx-auto">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition text-base leading-none cursor-pointer"
                          >−</button>
                          <span className="px-3 py-1 text-sm font-medium text-gray-700 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition text-base leading-none cursor-pointer"
                          >+</button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-700 font-medium">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right text-gray-800 font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 sticky top-6">
              <h3 className="text-base font-semibold text-gray-800 mb-1">Resumen</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sub Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Descuento</span>
                <span>{(DISCOUNT_RATE * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-800 border-t border-gray-100 pt-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => navigate("/carrito/datos-entrega")}
                className="mt-2 w-full bg-sky-500 hover:bg-sky-600 active:scale-95 transition-all text-white text-sm font-semibold py-2.5 rounded-lg cursor-pointer"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleCarritoCompras;