import { useNavigate } from "react-router";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../../lib/CartContext"; // ← ajusta la ruta si es necesario

function CartSidebar() {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    totalItems,
  } = useCart();

  const handleCheckout = () => {
    closeCart();
    navigate("/atomicShop/carrito"); // Ruta a DetalleCarritoCompras
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* ── Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-800">
                  Carrito de compra
                </h2>
                {totalItems > 0 && (
                  <span className="bg-sky-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {items.length === 0 ? (
                /* Estado vacío */
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingCart size={36} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">Tu carrito está vacío</p>
                  <button
                    onClick={closeCart}
                    className="text-xs text-sky-500 hover:underline cursor-pointer"
                  >
                    Regresar a la tienda
                  </button>
                </div>
              ) : (
                /* Lista de productos */
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 border-b border-gray-50 pb-4 last:border-0"
                    >
                      {/* Imagen */}
                      <div
                        onClick={() => {
                          closeCart();
                          navigate(`/atomicShop/producto/${item.id}`, {
                            state: { product: item },
                          });
                        }}
                        className="w-16 h-14 bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-contain h-12 w-auto"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">
                          ${item.price.toFixed(2)}
                        </p>
                        {item.originalPrice > item.price && (
                          <p className="text-xs text-gray-400 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </p>
                        )}

                        {/* Cantidad */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition text-base leading-none cursor-pointer"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-xs font-medium text-gray-700 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition text-base leading-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Eliminar */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-400 transition mt-0.5 cursor-pointer shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer — solo visible si hay productos */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100 flex flex-col gap-3">
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Total de descuento:</span>
                    <span className="text-green-500 font-medium">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold text-gray-800">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-lg transition cursor-pointer"
                >
                  Comprar ya
                </motion.button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default CartSidebar;
