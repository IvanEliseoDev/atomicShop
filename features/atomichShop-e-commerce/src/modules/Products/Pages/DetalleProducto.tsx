import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  Star,
  Truck,
  Clock,
  Home,
  Plus,
  Minus,
  Share2,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useProductDetail,
  type Product,
} from "../../../lib/ProductDetailContext";
import { useFavorites } from "../../../lib/FavoritesContext";
import { useCart } from "../../../lib/CartContext";

// ─── Datos mock ───────────────────────────────────────────────────────────────

const SIMILAR_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "Báscula para pesar cajas petri",
    sku: "000001",
    brand: "Accel",
    category: "Báscula",
    price: 80.0,
    originalPrice: 110.0,
    isOffer: true,
    image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Báscula+1",
  },
  {
    id: 102,
    name: "Báscula para microbios",
    sku: "000002",
    brand: "Accel",
    category: "Báscula",
    price: 80.0,
    isOffer: false,
    image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Báscula+2",
  },
  {
    id: 103,
    name: "Báscula normal científica",
    sku: "000003",
    brand: "Accel",
    category: "Báscula",
    price: 80.0,
    originalPrice: 90.6,
    isOffer: true,
    image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Báscula+3",
  },
  {
    id: 104,
    name: "Báscula para agua",
    sku: "000004",
    brand: "Accel",
    category: "Báscula",
    price: 120.99,
    isOffer: false,
    image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Báscula+4",
  },
];

const DEFAULT_CHARACTERISTICS = [
  "Capacidad máxima de 2000 g con resolución de 0.01 g.",
  "Pantalla LCD retroiluminada de alta visibilidad.",
  "Función de tara automática para mediciones precisas.",
  "Certificado de calibración incluido bajo norma ISO.",
  "Construcción resistente en acero inoxidable grado alimenticio.",
  "Interfaz RS-232 para conectividad con software de laboratorio.",
];

const DEFAULT_REVIEWS = [
  {
    rating: 5,
    author: "Dr. Martínez",
    comment:
      "Excelente precisión, ideal para trabajo en laboratorio. La calibración viene perfecta de fábrica.",
  },
  {
    rating: 4,
    author: "Laboratorio Quimex",
    comment:
      "Muy buen producto, la pantalla es clara y la báscula responde rápido. El envío fue puntual.",
  },
  {
    rating: 5,
    author: "Ing. Rodríguez",
    comment:
      "Cumple con todas las normas requeridas. Lleva 6 meses en uso continuo sin ningún problema.",
  },
  {
    rating: 3,
    author: "Ana Flores",
    comment:
      "Buen producto en general, aunque el manual de usuario podría ser más detallado.",
  },
];

// ─── StarRating ───────────────────────────────────────────────────────────────

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

// ─── SimilarCard ──────────────────────────────────────────────────────────────

function SimilarCard({ product }: { product: Product }) {
  const { openProductDetail } = useProductDetail();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleNavigate = () => {
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
      onClick={handleNavigate}
      className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2 min-w-[170px] max-w-[170px] cursor-pointer relative select-none"
    >
      {product.isOffer && (
        <span className="absolute top-2 left-2 bg-sky-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
          Oferta
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product);
        }}
        className="absolute top-2 right-2 z-10"
      >
        <Heart
          size={15}
          className={
            isFavorite(product.id)
              ? "fill-sky-500 text-sky-500"
              : "text-gray-300 hover:text-sky-400 transition-colors"
          }
        />
      </button>

      <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg flex items-center justify-center h-24 mt-3 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain h-20 w-auto"
        />
      </div>

      <div className="flex items-baseline gap-2 flex-wrap mt-1">
        <span className="text-gray-800 font-bold text-sm">
          ${product.price.toFixed(2)}
        </span>
        {product.isOffer && product.originalPrice && (
          <span className="text-gray-400 text-xs line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      <p className="text-gray-600 text-xs leading-snug line-clamp-2">
        {product.name}
      </p>

      <div className="flex items-center gap-1.5 mt-auto">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQty((q) => Math.max(1, q - 1));
            }}
            className="px-2 py-1 hover:bg-gray-100 transition text-gray-600 cursor-pointer"
          >
            −
          </button>
          <span className="px-2 py-1 text-gray-700 min-w-[2rem] text-center">
            {qty}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQty((q) => q + 1);
            }}
            className="px-2 py-1 hover:bg-gray-100 transition text-gray-600 cursor-pointer"
          >
            +
          </button>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${added ? "bg-green-500 text-white" : "bg-sky-500 hover:bg-sky-600 text-white"}`}
        >
          {added ? <CheckCircle size={12} /> : <ShoppingCart size={12} />}
          {added ? "Añadido" : "Agregar"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "caracteristicas", label: "Características" },
  { key: "pago", label: "Pago y envío" },
  { key: "resenas", label: "Reseñas" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── Página principal ─────────────────────────────────────────────────────────

function DetalleProducto() {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const { selectedProduct } = useProductDetail();
  const { addItem, openCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const product = selectedProduct;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>("caracteristicas");
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  // ── Sin producto seleccionado ────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingCart size={32} className="text-gray-300" />
        </div>
        <p className="text-gray-500 text-lg font-medium">
          Ningún producto seleccionado.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sky-500 hover:underline text-sm cursor-pointer"
        >
          <ChevronLeft size={16} /> Volver al catálogo
        </button>
      </div>
    );
  }

  // ── Datos derivados ──────────────────────────────────────────────────────────
  const characteristics = product.characteristics ?? DEFAULT_CHARACTERISTICS;
  const reviews = product.reviews ?? DEFAULT_REVIEWS;
  const avgRating =
    reviews.reduce((a: number, r: { rating: number }) => a + r.rating, 0) /
    reviews.length;
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;
  const thumbs = [product.image, product.image, product.image];

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice ?? product.price,
        image: product.image,
      });
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 900);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Breadcrumb / header ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-sky-500 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 overflow-hidden">
            <button
              onClick={() => navigate("/atomicShop")}
              className="hover:text-sky-500 transition-colors whitespace-nowrap cursor-pointer"
            >
              Inicio
            </button>
            <span>/</span>
            <button
              onClick={() => navigate(-1)}
              className="hover:text-sky-500 transition-colors whitespace-nowrap cursor-pointer"
            >
              {product.category ?? "Productos"}
            </button>
            <span>/</span>
            <span className="text-gray-600 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* ── Sección principal ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Imagen + miniaturas */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="relative w-full md:w-72">
                {product.isOffer && discount && (
                  <span className="absolute top-3 left-3 z-10 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    -{discount}%
                  </span>
                )}
                <div className="w-full md:w-72 h-64 bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <motion.img
                    key={activeThumb}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    src={thumbs[activeThumb]}
                    alt={product.name}
                    className="object-contain h-52 w-auto"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {thumbs.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`w-14 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${activeThumb === i ? "border-sky-500 shadow-sm" : "border-gray-200 hover:border-sky-300"} bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="object-contain h-9 w-auto opacity-80"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info del producto */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Nombre + botones rápidos */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleShare}
                    title="Copiar enlace"
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-gray-400 hover:text-sky-500 cursor-pointer"
                  >
                    {copied ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Share2 size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => toggleFavorite(product)}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Heart
                      size={16}
                      className={
                        isFavorite(product.id)
                          ? "fill-sky-500 text-sky-500"
                          : "text-gray-400 hover:text-sky-400"
                      }
                    />
                  </button>
                </div>
              </div>

              {/* SKU / Marca / Categoría */}
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                {[
                  { label: "SKU", value: product.sku ?? "000000", mono: true },
                  { label: "Marca", value: product.brand ?? "Accel" },
                  { label: "Categoría", value: product.category ?? "Báscula" },
                ].map(({ label, value, mono }) => (
                  <span key={label} className="text-gray-400">
                    {label}:{" "}
                    <span
                      className={`text-sky-600 font-medium ${mono ? "font-mono" : ""}`}
                    >
                      {value}
                    </span>
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(avgRating)} size={16} />
                <span className="text-sm text-gray-400">
                  {avgRating.toFixed(1)} · {reviews.length} reseñas
                </span>
              </div>

              {/* Precio */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold text-gray-800">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                {discount && (
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                    Ahorras $
                    {(product.originalPrice! - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-600 font-medium">En stock</span>
              </div>

              {/* Cantidad + botón agregar */}
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2.5 hover:bg-gray-100 transition text-gray-600 cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-5 py-2.5 text-gray-800 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2.5 hover:bg-gray-100 transition text-gray-600 cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer ${added ? "bg-green-500 text-white" : "bg-sky-500 hover:bg-sky-600 text-white"}`}
                >
                  {added ? (
                    <>
                      <CheckCircle size={18} /> Agregado
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Agregar al carrito
                    </>
                  )}
                </motion.button>
              </div>

              {quantity > 1 && (
                <p className="text-sm text-gray-400">
                  Total:{" "}
                  <span className="font-semibold text-gray-700">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Tabs de información ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Headers */}
          <div className="flex border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors relative cursor-pointer ${activeTab === tab.key ? "text-sky-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-line"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Contenido animado */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-6"
            >
              {/* Características */}
              {activeTab === "caracteristicas" && (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {characteristics.map((char: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle size={12} className="text-sky-500" />
                      </div>
                      <span className="text-sm text-gray-600 leading-relaxed">
                        {char}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Pago y envío */}
              {activeTab === "pago" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: <Truck size={20} className="text-white" />,
                      title: "Envío sin costo",
                      desc: "En todas tus compras dentro de El Salvador.",
                    },
                    {
                      icon: <Clock size={20} className="text-white" />,
                      title: "Flash Delivery",
                      desc: "Entrega el mismo día para pedidos antes de las 3:00 PM. Solo en San Salvador.",
                    },
                    {
                      icon: <Home size={20} className="text-white" />,
                      title: "Envío a domicilio",
                      desc: "3–5 días hábiles al resto del país.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-sky-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reseñas */}
              {activeTab === "resenas" && (
                <div className="flex flex-col gap-6">
                  {/* Resumen */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 bg-gray-50 rounded-xl">
                    <div className="text-center flex-shrink-0">
                      <p className="text-5xl font-bold text-gray-800">
                        {avgRating.toFixed(1)}
                      </p>
                      <StarRating rating={Math.round(avgRating)} size={18} />
                      <p className="text-xs text-gray-400 mt-1">
                        {reviews.length} reseñas
                      </p>
                    </div>
                    <div className="flex-1 w-full flex flex-col gap-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(
                          (r: { rating: number }) => r.rating === star,
                        ).length;
                        const pct = (count / reviews.length) * 100;
                        return (
                          <div
                            key={star}
                            className="flex items-center gap-2 text-xs text-gray-500"
                          >
                            <span className="w-3 text-right">{star}</span>
                            <Star
                              size={10}
                              className="fill-amber-400 text-amber-400 flex-shrink-0"
                            />
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-4 text-right text-gray-400">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Lista */}
                  <div className="flex flex-col gap-4">
                    {reviews.map(
                      (
                        review: {
                          rating: number;
                          author?: string;
                          comment: string;
                        },
                        i: number,
                      ) => (
                        <div
                          key={i}
                          className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm flex-shrink-0">
                            {(review.author ?? "U")[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-gray-700">
                                {review.author ?? "Usuario"}
                              </p>
                              <StarRating rating={review.rating} size={12} />
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Productos similares ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Productos similares
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
            {SIMILAR_PRODUCTS.filter((p) => p.id !== product.id).map((p) => (
              <SimilarCard key={p.id} product={p} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DetalleProducto;
