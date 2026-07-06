import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ecommerceService } from "@/services/ecommerceService";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  isOffer: boolean;
  image: string;
}

export function useProductSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    ecommerceService.getHomeProducts().then((data) => {
      setProducts(
        data.map((p: any) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          originalPrice: p.discount ? p.price / (1 - p.discount / 100) : undefined,
          isOffer: !!p.discount,
          image: p.images?.[0] ?? "",
        }))
      );
    });
  }, []);

  useEffect(() => {
    setQuantities(Object.fromEntries(products.map((p) => [p.id, 1])));
  }, [products]);

  useEffect(() => {
    if (!user?.id) return;
    ecommerceService.getWishlist(user.id).then((res) => {
      const favsMap: Record<string, boolean> = {};
      res.data.forEach((p: any) => { favsMap[p._id] = true; });
      setFavorites(favsMap);
    });
  }, [user?.id]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] ?? 1) + delta) }));
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.");
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
      toast.error("Debes iniciar sesión para guardar productos favoritos.");
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
    } catch {
      toast.error("Error al actualizar favoritos. Intenta de nuevo.");
    }
  };

  return { products, quantities, favorites, updateQuantity, handleAddToCart, toggleFavorite };
}
