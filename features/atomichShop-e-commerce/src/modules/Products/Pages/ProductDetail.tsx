import { useParams, useNavigate } from "react-router";
import { useCart } from "../../../lib/CartContext";
import { useState } from "react";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";

// Reutiliza los mismos mock data que ya tienes, o expórtalos desde Products.tsx
const MOCK_PRODUCTS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "Báscula para pesar cajas petri",
  price: 80.0,
  originalPrice: 80.0,
  brand: "Marca A",
  image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Báscula",
  onSale: true,
  description:
    "Báscula de alta precisión ideal para laboratorios de control de calidad. Compatible con cajas petri de distintos tamaños.",
}));

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-4">
        <p className="text-lg">Producto no encontrado.</p>
        <button
          onClick={() => navigate("/atomicShop/productos")}
          className="text-sky-500 hover:underline text-sm"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-sky-500 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Volver
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-8">
          {/* Imagen */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl flex items-center justify-center md:w-80 h-64 shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="object-contain h-48 w-auto"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 flex-1">
            {product.onSale && (
              <span className="w-fit bg-sky-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Oferta
              </span>
            )}

            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.description}</p>
            <p className="text-sm text-gray-400">Marca: {product.brand}</p>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-800">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-gray-400 line-through text-lg">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Cantidad */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none cursor-pointer"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 active:scale-95 transition-all text-white rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm cursor-pointer"
              >
                <ShoppingCart size={16} />
                Agregar al carrito
              </button>

              <button
                onClick={() => setWishlisted((w) => !w)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-red-300 transition-colors"
              >
                <Heart
                  size={18}
                  className={
                    wishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;