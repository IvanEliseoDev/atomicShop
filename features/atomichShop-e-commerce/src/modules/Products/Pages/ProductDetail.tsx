import { useParams, useNavigate } from "react-router";
import { useCart } from "../../../lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";
import { Heart, ShoppingCart, Star, Truck, Clock, Store, Plus } from "lucide-react";
import { useProductDetail } from "../hooks/useProductDetail";
import { useSimilarProducts } from "../hooks/useSimilarProducts";
import { useWishlistToggle } from "../hooks/useWishlist";

function StarRating({ rating = 3 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14}
          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);

  // ← Hooks con fetch directo a la API
  const { product, loading, error } = useProductDetail(id);
  const { products: similarProducts } = useSimilarProducts(
    product?.categoryId?._id,
    id,
  );
  const { wishlist, toggle: toggleWishlist } = useWishlistToggle(user?.id);

  // ─── Estados de carga y error ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-4">
        <p className="text-lg">Producto no encontrado.</p>
        <button onClick={() => navigate("/productos")}
          className="text-sky-500 hover:underline text-sm">
          Volver al catálogo
        </button>
      </div>
    );
  }

  // ─── Datos del backend mapeados ───
  // El backend devuelve _id, images[], brandId.name, categoryId.name, discount
  const image = product.images?.[0] ?? "";
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;
  const hasDiscount = !!product.discount && product.discount > 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product._id,
        name: product.name,
        price: discountedPrice,
        originalPrice: product.price,
        image,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ─── HERO ─── */}
      <div className="bg-sky-400 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-10 py-12 flex flex-col md:flex-row items-center gap-8">

          {/* Imagen */}
          <div className="flex-shrink-0 flex items-center justify-center md:w-80">
            <img src={image} alt={product.name}
              className="object-contain h-52 w-auto drop-shadow-xl" />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 flex-1 text-white">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>

            {/* Meta: marca y categoría desde el backend */}
            <p className="text-sky-100 text-sm">
              {product.brandId && <>Marca: {product.brandId.name}</>}
              {product.brandId && product.categoryId && <> &nbsp;·&nbsp; </>}
              {product.categoryId && <>Categoría: {product.categoryId.name}</>}
            </p>

            {/* Precio */}
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-extrabold">${discountedPrice.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-sky-200 line-through text-lg">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Controles */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {/* Cantidad */}
              <div className="flex items-center bg-white/20 backdrop-blur rounded-lg overflow-hidden border border-white/30">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-white hover:bg-white/20 transition-colors text-lg leading-none cursor-pointer">−</button>
                <span className="px-4 py-2 text-sm font-semibold text-white min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-white hover:bg-white/20 transition-colors text-lg leading-none cursor-pointer">+</button>
              </div>

              {/* Agregar al carrito */}
              <button onClick={handleAddToCart}
                className="flex items-center gap-2 bg-white text-sky-500 hover:bg-sky-50 active:scale-95 transition-all rounded-lg px-5 py-2.5 text-sm font-bold shadow cursor-pointer">
                <ShoppingCart size={16} />
                Agregar al carrito
              </button>

              {/* Wishlist — conectada al backend */}
              <button
                onClick={() => toggleWishlist(product._id)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/30 transition-colors cursor-pointer">
                <Heart size={18}
                  className={wishlist.has(product._id) ? "fill-red-400 text-red-400" : "text-white"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3 COLUMNAS ─── */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Características / descripción */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-800 mb-3">Características</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {product.description ?? "Sin descripción disponible."}
          </p>
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
                Envío gratis en compras en línea dentro de los últimos 30 días
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-sky-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600">Envío a domicilio (estimado 3-5 días hábiles)</p>
            </div>
          </div>
        </div>

        {/* Reseñas (estáticas por ahora) */}
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
                  Excelente producto, muy buena calidad y entrega rápida.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PRODUCTOS SIMILARES ─── */}
      {similarProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <h2 className="text-lg font-bold text-gray-800 mb-5 text-center">Productos similares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((p) => (
              <div key={p.id} onClick={() => navigate(`/productos/${p.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all">

                <div className="flex items-center justify-between">
                  {p.onSale
                    ? <span className="bg-sky-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Oferta</span>
                    : <span />}
                  <button onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:border-red-300 transition-colors">
                    <Heart size={13} className="text-gray-400" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg flex items-center justify-center h-28">
                  <img src={p.image} alt={p.name} className="object-contain h-20 w-auto" />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-gray-700 line-clamp-2">{p.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-gray-800">${p.price.toFixed(2)}</span>
                    {p.originalPrice > p.price && (
                      <span className="text-xs text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({ id: p.id, name: p.name, price: p.price, originalPrice: p.originalPrice, image: p.image });
                    }}
                    className="w-full flex items-center justify-center gap-1 bg-sky-500 hover:bg-sky-600 rounded-lg py-1.5 text-xs text-white font-semibold transition-colors cursor-pointer">
                    <ShoppingCart size={13} />
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;