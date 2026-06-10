// DESPUÉS — reemplaza el archivo completo con esto
import { useParams, useNavigate } from "react-router";
import { useCart } from "../../../lib/CartContext";
import { useState, useEffect } from "react";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Clock,
  Store,
  Plus,
  Loader2,
} from "lucide-react";

function StarRating({ rating = 3 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
          }
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
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Fetch producto principal
    fetch(`http://localhost:4000/e-commerce/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);

        // Fetch productos similares usando categoryId del producto
        if (data?.categoryId) {
          const categoryId =
            typeof data.categoryId === "object"
              ? data.categoryId._id
              : data.categoryId;

          fetch(
            `http://localhost:4000/e-commerce/products/similar?categoryId=${categoryId}&currentId=${id}`,
          )
            .then((r) => r.json())
            .then((similar) =>
              setSimilarProducts(Array.isArray(similar) ? similar : []),
            );
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-500" size={36} />
      </div>
    );
  }

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

  const price = product.price ?? 0;
  const discountPercent = product.discount ?? 0;
  const originalPrice = discountPercent
    ? price / (1 - discountPercent / 100)
    : price;
  const image =
    product.images?.[0] ??
    "https://placehold.co/420x280/e8f4fb/4a9bbe?text=Producto";
  const brandName =
    typeof product.brandId === "object"
      ? product.brandId?.name
      : product.brandId;
  const categoryName =
    typeof product.categoryId === "object"
      ? product.categoryId?.name
      : product.categoryId;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product._id,
        name: product.name,
        price,
        originalPrice,
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
            <img
              src={image}
              alt={product.name}
              className="object-contain h-52 w-auto drop-shadow-xl"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 flex-1 text-white">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {product.name}
            </h1>

            <p className="text-sky-100 text-sm">
              Sku: {product.sku ?? "—"} &nbsp;·&nbsp; Marca: {brandName ?? "—"}{" "}
              &nbsp;·&nbsp; Categoría: {categoryName ?? "—"}
            </p>

            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-extrabold">
                ${price.toFixed(2)}
              </span>
              {originalPrice > price && (
                <span className="text-sky-200 line-through text-lg">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
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

              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-white text-sky-500 hover:bg-sky-50 active:scale-95 transition-all rounded-lg px-5 py-2.5 text-sm font-bold shadow cursor-pointer"
              >
                <ShoppingCart size={16} />
                Agregar al carrito
              </button>

              <button
                onClick={() => setWishlisted((w) => !w)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/30 transition-colors cursor-pointer"
              >
                <Heart
                  size={18}
                  className={
                    wishlisted ? "fill-red-400 text-red-400" : "text-white"
                  }
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3 COLUMNAS ─── */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-800 mb-3">
            Descripción
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {product.description || "Sin descripción disponible."}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Pago y envío
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Store size={20} className="text-sky-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600">Retiro en tienda 24hrs</p>
            </div>
            <div className="flex items-start gap-3">
              <Truck size={20} className="text-sky-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600">
                Envío gratis en compras realizadas dentro de los últimos 30 días
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-sky-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600">
                Envío a domicilio (estimado 3-5 días hábiles)
              </p>
            </div>
          </div>
        </div>

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
                  Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PRODUCTOS SIMILARES ─── */}
      {similarProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <h2 className="text-lg font-bold text-gray-800 mb-5 text-center">
            Productos similares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((p) => {
              const pPrice = p.price ?? 0;
              const pDiscount = p.discount ?? 0;
              const pOriginal = pDiscount
                ? pPrice / (1 - pDiscount / 100)
                : pPrice;
              const pImage =
                p.images?.[0] ??
                "https://placehold.co/200x150/e8f4fb/4a9bbe?text=Producto";

              return (
                <div
                  key={p._id}
                  onClick={() => navigate(`/atomicShop/productos/${p._id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg flex items-center justify-center h-28">
                    <img
                      src={pImage}
                      alt={p.name}
                      className="object-contain h-20 w-auto"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-gray-700 line-clamp-2">
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-gray-800">
                        ${pPrice.toFixed(2)}
                      </span>
                      {pOriginal > pPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${pOriginal.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({
                        id: p._id,
                        name: p.name,
                        price: pPrice,
                        originalPrice: pOriginal,
                        image: pImage,
                      });
                    }}
                    className="mt-auto w-full bg-sky-500 hover:bg-sky-600 rounded-lg py-1.5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingCart size={14} className="text-white" />
                    <span className="text-white text-xs font-semibold">
                      Agregar
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
