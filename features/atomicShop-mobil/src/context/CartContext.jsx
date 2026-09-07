import { createContext, useCallback, useMemo, useState } from "react";
import { apiFetch } from "../config/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [clientId, setClientId] = useState(null);

  const itemCount = useMemo(() => {
    if (!cart?.products?.length) return 0;
    return cart.products.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  }, [cart]);

  const fetchCart = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await apiFetch(`/api/e-commerce/carts/${id}`);
      if (res.ok) setCart(await res.json());
      else if (res.status === 404) setCart(null);
    } catch (_) {}
  }, []);

  const initCart = useCallback((id) => {
    setClientId(id);
    if (id) fetchCart(id);
  }, [fetchCart]);

  const addToCart = useCallback(async (idProduct, amount = 1) => {
    if (!clientId) return;
    try {
      const res = await apiFetch("/api/e-commerce/carts", {
        method: "POST",
        body: JSON.stringify({ clientId, idProduct, amount }),
      });
      if (res.ok) setCart(await res.json());
    } catch (_) {}
  }, [clientId]);

  const removeFromCart = useCallback(async (idProduct) => {
    if (!clientId) return;
    try {
      const res = await apiFetch("/api/e-commerce/carts/remove", {
        method: "DELETE",
        body: JSON.stringify({ clientId, idProduct }),
      });
      // After removal, re-fetch cart to get updated state
      if (res.ok) await fetchCart(clientId);
    } catch (_) {}
  }, [clientId, fetchCart]);

  // Sets absolute quantity: removes then re-adds with new amount
  const updateQuantity = useCallback(async (idProduct, newAmount) => {
    if (!clientId) return;
    if (newAmount <= 0) { await removeFromCart(idProduct); return; }

    // Remove first, then re-add with exact amount
    await apiFetch("/api/e-commerce/carts/remove", {
      method: "DELETE",
      body: JSON.stringify({ clientId, idProduct }),
    }).catch(() => {});

    const res = await apiFetch("/api/e-commerce/carts", {
      method: "POST",
      body: JSON.stringify({ clientId, idProduct, amount: newAmount }),
    }).catch(() => null);

    if (res?.ok) setCart(await res.json());
    else await fetchCart(clientId);
  }, [clientId, removeFromCart, fetchCart]);

  const clearCart = useCallback(() => setCart(null), []);

  const value = useMemo(() => ({
    cart, itemCount, initCart, addToCart, removeFromCart, updateQuantity, clearCart,
    refreshCart: () => fetchCart(clientId),
  }), [cart, itemCount, initCart, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart, clientId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
