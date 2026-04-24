// src/modules/Products/Components/ProductCard.tsx
import React, { useState } from "react";
import { Heart, ShoppingCart, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useProductDetail, type Product } from "../../lib/ProductDetailContext";
import { useCart } from "../../lib/CartContext";
import { useFavorites } from "../../lib/FavoritesContext";
import { useNavigate } from "react-router";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { openProductDetail } = useProductDetail();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleCardClick = () => {
    openProductDetail(product);
    navigate("/atomicShop/detalleProducto");
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice ?? product.price,
        image: product.image,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.18 }}
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2 w-[200px] cursor-pointer relative select-none"
    >
      {/* Badge oferta */}
      {product.isOffer && (
        <span className="absolute top-2 left-2 bg-sky-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
          Oferta
        </span>
      )}

      {/* Favorito */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
        className="absolute top-2 right-2 z-10"
      >
        <Heart
          size={15}
          className={isFavorite(product.id)
            ? "fill-sky-500 text-sky-500"
            : "text-gray-300 hover:text-sky-400 transition-colors"}
        />
      </button>

      {/* Imagen */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg flex items-center justify-center h-28 mt-3 overflow-hidden">
        <img src={product.image} alt={product.name} className="object-contain h-24 w-auto" />
      </div>

      {/* Precio */}
      <div className="flex items-baseline gap-2 flex-wrap mt-1">
        <span className="text-gray-800 font-bold text-sm">${product.price.toFixed(2)}</span>
        {product.isOffer && product.originalPrice && (
          <span className="text-gray-400 text-xs line-through">${product.originalPrice.toFixed(2)}</span>
        )}
      </div>

      {/* Nombre */}
      <p className="text-gray-600 text-xs leading-snug line-clamp-2">{product.name}</p>

      {/* Cantidad + agregar */}
      <div className="flex items-center gap-1.5 mt-auto">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-xs">
          <button
            onClick={(e) => { e.stopPropagation(); setQty((q) => Math.max(1, q - 1)); }}
            className="px-2 py-1 hover:bg-gray-100 transition text-gray-600 cursor-pointer"
          >−</button>
          <span className="px-2 py-1 text-gray-700 min-w-[2rem] text-center">{qty}</span>
          <button
            onClick={(e) => { e.stopPropagation(); setQty((q) => q + 1); }}
            className="px-2 py-1 hover:bg-gray-100 transition text-gray-600 cursor-pointer"
          >+</button>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            added ? "bg-green-500 text-white" : "bg-sky-500 hover:bg-sky-600 text-white"
          }`}
        >
          {added ? <CheckCircle size={12} /> : <ShoppingCart size={12} />}
          {added ? "Añadido" : "Agregar"}
        </motion.button>
      </div>
    </motion.div>
  );
}