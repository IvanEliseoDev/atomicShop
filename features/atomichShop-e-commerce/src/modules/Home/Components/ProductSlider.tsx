import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useProductSlider } from "../hooks/useProductSlider";

function ProductSlider() {
  const navigate = useNavigate();
  const { products, quantities, favorites, updateQuantity, handleAddToCart, toggleFavorite } =
    useProductSlider();

  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-4 relative">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Lo más buscado
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/productos/${product.id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-col gap-3 relative cursor-pointer"
          >
            {product.isOffer && (
              <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">
                Oferta
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              className="absolute top-3 right-3 z-10 transition"
            >
              <Heart
                size={20}
                className={
                  favorites[product.id]
                    ? "fill-blue-500 text-blue-500"
                    : "text-gray-300 hover:text-blue-300"
                }
              />
            </button>

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-contain rounded-lg mt-4"
            />

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-800 font-semibold text-base">
                ${product.price.toFixed(2)}
              </span>
              {product.isOffer && product.originalPrice && (
                <span className="text-gray-400 text-sm line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-snug mb-2">{product.name}</p>

            <p className={`text-xs mb-2 font-medium ${product.stock === 0 ? 'text-red-500' : 'text-gray-400'}`}>
              {product.stock === 0 ? 'Sin stock' : `Stock: ${product.stock}`}
            </p>

            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden text-sm">
                <button
                  onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, -1); }}
                  className="px-4 py-2 hover:bg-gray-100 transition text-gray-900 cursor-pointer"
                >
                  -
                </button>
                <span className="px-2 py-1 text-gray-700 min-w-8 text-center">
                  {(quantities[product.id] ?? 1)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if ((quantities[product.id] ?? 1) < product.stock) updateQuantity(product.id, 1);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 transition text-gray-900 cursor-pointer disabled:opacity-40"
                  disabled={(quantities[product.id] ?? 1) >= product.stock}
                >
                  +
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                className="bg-blue-500 hover:bg-blue-600 transition p-2 rounded-lg ml-auto"
              >
                <ShoppingCart size={18} className="text-white cursor-pointer" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ProductSlider;
