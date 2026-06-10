import { useParams, useNavigate } from "react-router";
import { useCart } from "../../../lib/CartContext";
import { useState } from "react";
import { Heart, ShoppingCart, Star, Truck, Clock, Store, Plus } from "lucide-react";

const MOCK_PRODUCTS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "Báscula para pesar cajas petri",
  price: 80.0,
  originalPrice: 99.0,
  brand: "Accel",
  sku: "DOO200",
  category: "Báscula",
  image: "https://placehold.co/420x280/e8f4fb/4a9bbe?text=Báscula",
  onSale: i % 2 === 0,
  isNew: i % 3 === 0,
  description:
    "Báscula de alta precisión ideal para laboratorios de control de calidad. Compatible con cajas petri de distintos tamaños.",
  features:
    "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
}));

function StarRating({ rating = 3 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));
  const similarProducts = MOCK_PRODUCTS.filter((p) => p.id !== Number(id)).slice(0, 4);

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
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ─── HERO ─── */}
      <div className="bg-sky-400 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-10 py-12 flex flex-col md:flex-row items-center gap-8">

          {/* Badge Nuevo */}
          {product.isNew && (
            <div
              className="absolute top-0 left-1 top-18 bg-green-500 text-white text-xs font-bold px-16 py-1 rotate-[-45deg] translate-x-[-20px] translate-y-[18px] shadow"
              style={{ transformOrigin: "top left" }}
            >
              {/* diagonal ribbon */}
              <span className="block rotate-0 translate-x-0 translate-y-0">Nuevo</span>
            </div>
          )}

          {/* Imagen */}
          <div className="flex-shrink-0 flex items-center justify-center md:w-80">
            <img
              src={product.image}
              alt={product.name}
              className="object-contain h-52 w-auto drop-shadow-xl"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 flex-1 text-white">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>

            {/* meta */}
            <p className="text-sky-100 text-sm">
              Sku: {product.sku} &nbsp;·&nbsp; Marca: {product.brand} &nbsp;·&nbsp; Categoría: {product.category}
            </p>

            {/* precio */}
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-extrabold">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-sky-200 line-through text-lg">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* cantidad + carrito + wishlist */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {/* Quantity control */}
              <div className="flex items-center bg-white/20 backdrop-blur rounded-lg overflow-hidden border border-white/30">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-white hover:bg-white/20 transition-colors text-lg leading-none cursor-pointer"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-white min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-white hover:bg-white/20 transition-colors text-lg leading-none cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-white text-sky-500 hover:bg-sky-50 active:scale-95 transition-all rounded-lg px-5 py-2.5 text-sm font-bold shadow cursor-pointer"
              >
                <ShoppingCart size={16} />
                Agregar al carrito
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/30 transition-colors cursor-pointer"
              >
                <Heart
                  size={18}
                  className={wishlisted ? "fill-red-400 text-red-400" : "text-white"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3 COLUMNAS ─── */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Características */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-800 mb-3">Características</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{product.features}</p>
        </div>

        {/* Pago y envío */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">Pago y envío</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Store size={20} className="text-sky-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600">Retiro en tienda 24hrs</p>
            </div>
            <div className="flex items-start gap-3">
              <Truck size={20} className="text-sky-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600">
                Envío gratis en compras realizadas dentro de los últimos 30 días para compras en línea
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-sky-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600">Envío a domicilio (estimado 3-5 días hábiles)</p>
            </div>
          </div>
        </div>

        {/* Reseñas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">Reseñas</h2>
            <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-sky-400 hover:text-sky-400 transition-colors cursor-pointer">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {[3, 4, 2].map((rating, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <StarRating rating={rating} />
                <p className="text-sm text-gray-500 leading-relaxed">
                  Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PRODUCTOS SIMILARES ─── */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-lg font-bold text-gray-800 mb-5 text-center">Productos similares</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {similarProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/atomicShop/productos/${p.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {/* Badges */}
              <div className="flex items-center justify-between">
                {p.onSale ? (
                  <span className="bg-sky-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    Oferta
                  </span>
                ) : (
                  <span />
                )}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:border-red-300 transition-colors"
                >
                  <Heart size={13} className="text-gray-400" />
                </button>
              </div>

              {/* Image */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg flex items-center justify-center h-28">
                <img src={p.image} alt={p.name} className="object-contain h-20 w-auto" />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-gray-700 line-clamp-2">{p.name}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-gray-800">${p.price.toFixed(2)}</span>
                  {p.originalPrice > p.price && (
                    <span className="text-xs text-gray-400 line-through">
                      ${p.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity + Cart */}
              <div className="flex items-center gap-2 mt-auto">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-xs flex-1">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1.5 text-gray-500 hover:bg-gray-50 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-gray-700 font-medium">100</span>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1.5 text-gray-500 hover:bg-gray-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem({ id: String(p.id), name: p.name, price: p.price, originalPrice: p.originalPrice, image: p.image });
                  }}
                  className="w-8 h-8 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <ShoppingCart size={14} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;