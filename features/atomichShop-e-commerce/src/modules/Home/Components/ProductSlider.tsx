import { useCart } from "../../../lib/CartContext";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { ecommerceService } from "../../../services/ecommerceService";
import { useAuth } from "@/lib/AuthContext";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  isOffer: boolean;
  image: string;
}

function ProductSlider() {
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();
  const { user } = useAuth();
  const [showCartAlert, setShowCartAlert] = useState(false)

  // Cargar productos generales
  useEffect(() => {
    ecommerceService.getHomeProducts().then((data) => {
      const mapped = data.map((p: any) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        originalPrice: p.discount
          ? p.price / (1 - p.discount / 100)
          : undefined,
        isOffer: !!p.discount,
        image: p.images?.[0] ?? "",
      }));
      setProducts(mapped);
    });
  }, []);

  useEffect(() => {
    setQuantities(Object.fromEntries(products.map((p) => [p.id, 1])));
  }, [products]);

  // Cargar favoritos del usuario
  useEffect(() => {
    if (user?.id) {
      ecommerceService.getWishlist(user.id).then((res) => {
        const favsMap: Record<string, boolean> = {};
        res.data.forEach((p: any) => {
          favsMap[p._id] = true;
        });
        setFavorites(favsMap);
      });
    }
  }, [user?.id]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  const handleAddToCart = (product: Product) => {
    // 2. VALIDACIÓN: Si no está logueado, abre el nuevo modal y detiene la función
    if (!user) {
      setShowCartAlert(true);
      return;
    }

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

  const toggleFavorite = async (id: string) => {
    if (!user?.id) {
      setShowAlert(true);
      return;
    }

    const isFavorite = !!favorites[id];
    try {
      if (isFavorite) {
        await ecommerceService.removeFromWishlist(user.id, id);
      } else {
        await ecommerceService.addToWishlist(user.id, id);
      }
      setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    }
  };



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

            <p className="text-gray-600 text-sm leading-snug mb-2">
              {product.name}
            </p>

            <div className="flex items-center gap-4 mt-auto">
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
                <span className="px-2 py-1 text-gray-700 min-w-8 text-center">
                  {(quantities[product.id] ?? 1).toFixed(2)}
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

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="bg-blue-500 hover:bg-blue-600 transition p-2 rounded-lg ml-auto"
              >
                <ShoppingCart size={18} className="text-white cursor-pointer" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL FAVORITO */}
      <AnimatePresence>
        {showAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="text-blue-500 mb-4 flex justify-center">
                <Heart size={50} className="fill-blue-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">¡Atención!</h3>
              <p className="text-gray-600 mt-3">
                Debes iniciar sesión para guardar tus productos favoritos.
              </p>
              <button
                onClick={() => setShowAlert(false)}
                className="mt-8 w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors cursor-pointer shadow-md"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 2: CARRITO DE COMPRAS ================= */}
      <AnimatePresence>
        {showCartAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="text-blue-500 mb-4 flex justify-center">
                <div className="p-3 bg-blue-50 rounded-full">
                  {/* Se eliminó 'animate-bounce' para mantener el icono estático */}
                  <ShoppingCart size={46} className="text-blue-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">¡Atención!</h3>
              <p className="text-gray-600 mt-3">
                Debes iniciar sesión para poder agregar productos a tu carrito de compras.
              </p>
              <button
                onClick={() => setShowCartAlert(false)}
                className="mt-8 w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors cursor-pointer shadow-md"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ProductSlider;