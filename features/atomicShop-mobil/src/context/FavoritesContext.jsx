import { createContext, useCallback, useMemo, useState } from "react";
import { apiFetch } from "../config/api";

const FavoritesContext = createContext(null);

function idOf(productOrId) {
  if (!productOrId) return "";
  if (typeof productOrId === "string") return productOrId;
  return String(productOrId._id ?? productOrId.id ?? "");
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/api/e-commerce/wishlist/${id}`);
      if (res.ok) {
        const json = await res.json();
        setFavorites(Array.isArray(json.data) ? json.data : []);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, []);

  const initFavorites = useCallback((id) => {
    setCustomerId(id);
    if (id) fetchFavorites(id);
    else setFavorites([]);
  }, [fetchFavorites]);

  const isFavorite = useCallback((productOrId) => {
    const pid = idOf(productOrId);
    if (!pid) return false;
    return favorites.some((p) => idOf(p) === pid);
  }, [favorites]);

  const addFavorite = useCallback(async (product) => {
    if (!customerId) return;
    const productId = idOf(product);
    if (!productId) return;

    setFavorites((prev) => (prev.some((p) => idOf(p) === productId) ? prev : [...prev, product]));

    try {
      const res = await apiFetch("/api/e-commerce/wishlist/add", {
        method: "POST",
        body: JSON.stringify({ customerId, productId }),
      });
      if (!res.ok) await fetchFavorites(customerId);
    } catch (_) {
      await fetchFavorites(customerId);
    }
  }, [customerId, fetchFavorites]);

  const removeFavorite = useCallback(async (productOrId) => {
    if (!customerId) return;
    const productId = idOf(productOrId);
    if (!productId) return;

    setFavorites((prev) => prev.filter((p) => idOf(p) !== productId));

    try {
      const res = await apiFetch("/api/e-commerce/wishlist/remove", {
        method: "DELETE",
        body: JSON.stringify({ customerId, productId }),
      });
      if (!res.ok) await fetchFavorites(customerId);
    } catch (_) {
      await fetchFavorites(customerId);
    }
  }, [customerId, fetchFavorites]);

  const toggleFavorite = useCallback(async (product) => {
    const productId = idOf(product);
    if (!productId) return;
    const exists = favorites.some((p) => idOf(p) === productId);
    if (exists) await removeFavorite(product);
    else await addFavorite(product);
  }, [favorites, addFavorite, removeFavorite]);

  const value = useMemo(() => ({
    favorites,
    loading,
    count: favorites.length,
    initFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites: () => fetchFavorites(customerId),
  }), [
    favorites, loading, initFavorites, isFavorite,
    addFavorite, removeFavorite, toggleFavorite, fetchFavorites, customerId,
  ]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export default FavoritesContext;
