import { useCart } from "../../../lib/CartContext";
import React, { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// Para poder llenar los datos a las targetas de productos
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number; // Opcional, solo si hay oferta
  isOffer: boolean;
  image: string;
}

// Array de objetos de productos, a si van a venir del backend
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Báscula para pesar cajas petri",
    price: 80.0,
    isOffer: true,
    originalPrice: 110.0,
    image: "https://analiticasal.com/wp-content/uploads/2025/07/1-1.png",
  },
  {
    id: 2,
    name: "Báscula para microbios",
    price: 80.0,
    isOffer: false,
    image: "https://analiticasal.com/wp-content/uploads/2025/02/ContrAA1.jpg",
  },
  {
    id: 3,
    name: "Báscula normal científica",
    price: 80.0,
    originalPrice: 90.6,
    isOffer: true,
    image: "https://analiticasal.com/wp-content/uploads/2025/02/ContrAA1.jpg",
  },
  {
    id: 4,
    name: "Báscula para agua",
    price: 120.99,
    isOffer: false,
    image: "https://placehold.co/200x150/dbeafe/93c5fd?text=img",
  },
];

function ProductSlider() {
  const navigate = useNavigate();
  // Cantidad por producto
  const [quantities, setQuantities] = useState<Record<number, number>>(
    Object.fromEntries(mockProducts.map((p) => [p.id, 1])),
  );

  const { addItem } = useCart();

  // Favoritos (solo visual por el momento)
  const [favorites, setFavorites] = useState<Record<number, boolean>>(
    Object.fromEntries(mockProducts.map((p) => [p.id, false])),
  );

  // Actualizar la data de los productos
  const updateQuantity = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] + delta),
    }));
  };

  // Para agregar un producto al carrito
  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] ?? 1;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice ?? product.price,
        image: product.image,
      });
    }
  };

  // Funcionalidad para favoritos
  const toggleFavorite = (id: number) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-4">
      {/* Titulo */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Lo más buscado
      </h2>

      {/* Grid productos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/atomicShop/productos/${product.id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-col gap-3 relative cursor-pointer"
          >
            {/* Badge oferta */}
            {product.isOffer && (
              <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">
                Oferta
              </span>
            )}

            {/* Corazon favorito */}
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

            {/* Imagen */}
            <img
              src={product.image}
              alt={product.image}
              className="w-full h-32 object-contain rounded-lg mt-4"
            />

            {/* Precio */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-800 font-semibold text-base">
                ${product.price.toFixed(2)}
              </span>
              {product.isOffer && product.originalPrice && (
                <span className="text-gray-400 text-sm line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>

            {/* Nombre */}
            <p className="text-gray-600 text-sm leading-snug mb-2">
              {product.name}
            </p>

            {/* Cantidad + Carrito */}
            <div className="flex items-center gap-4 mt-auto">
              {/* Selector de cantidad */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, -1);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 transition text-gray-900 cursor-pointer"
                >
                  -
                </button>
                <span className="px-2 py-1 text-gray-700 min-w-[4rem] text-center">
                  {quantities[product.id].toFixed(2)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, 1);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 transition text-gray-900 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Boton carrito */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                className="bg-blue-500 hover:bg-blue-600 transition p-2 rounded-lg"
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
