import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:4000/api/e-commerce";

export interface FavoriteProduct {
  _id: string;
  name: string;
  category?: { name: string };
  price: number;
  images?: string[];
  selected: boolean;
}

// Hook para la página Favorites (lista completa)
export function useWishlistPage(customerId: string | undefined) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) { setLoading(false); return; }
    setLoading(true);
    fetch(`${BASE_URL}/wishlist/${customerId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setFavorites(data.data.map((p: any) => ({ ...p, selected: false })));
        } else {
          setFavorites([]);
        }
      })
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, [customerId]);

  const remove = async (productId: string) => {
    if (!customerId) return;
    await fetch(`${BASE_URL}/wishlist/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ customerId, productId }),
    });
    setFavorites((prev) => prev.filter((p) => p._id !== productId));
  };

  return { favorites, setFavorites, loading, remove };
}

// Hook para la página Products (toggle corazón por ID)
export function useWishlistToggle(customerId: string | undefined) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!customerId) return;
    fetch(`${BASE_URL}/wishlist/${customerId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setWishlist(new Set(data.data.map((p: any) => p._id || p)));
        }
      });
  }, [customerId]);

  const toggle = async (productId: string) => {
    if (!customerId) return;
    if (wishlist.has(productId)) {
      await fetch(`${BASE_URL}/wishlist/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ customerId, productId }),
      });
      setWishlist((prev) => { const next = new Set(prev); next.delete(productId); return next; });
    } else {
      await fetch(`${BASE_URL}/wishlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ customerId, productId }),
      });
      setWishlist((prev) => new Set(prev).add(productId));
    }
  };

  return { wishlist, toggle };
}