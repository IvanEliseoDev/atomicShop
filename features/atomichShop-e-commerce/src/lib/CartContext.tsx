import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ecommerceService } from "../services/ecommerceService";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
}

const CartContext = createContext<CartContextType | null>(null);

// Convierte la respuesta del backend al formato local
function mapCartFromBackend(cart: any): CartItem[] {
  if (!cart?.products) return [];
  return cart.products.map((p: any) => {
    const product = p.idProduct;
    const price = product?.price ?? 0;
    const discount = product?.discount ?? 0;
    const originalPrice = discount ? price / (1 - discount / 100) : price;
    return {
      id: product?._id ?? p.idProduct,
      name: product?.name ?? "",
      price,
      originalPrice,
      image: product?.images?.[0] ?? "",
      quantity: p.amount,
    };
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  // Cargar el carrito del backend cuando el usuario inicia sesion
  useEffect(() => {
    if (!user?.id) {
      setItems([]);
      return;
    }
    ecommerceService.getCart(user.id).then((cart) => {
      setItems(mapCartFromBackend(cart));
    });
  }, [user?.id]);

  const addItem = async (product: Omit<CartItem, "quantity">) => {
    if (!user?.id) {
      setIsOpen(true);
      return;
    }

    const updatedCart = await ecommerceService.addToCart(user.id, String(product.id), 1);
    setItems(mapCartFromBackend(updatedCart));
    setIsOpen(true);
  };

  const removeItem = async (id: string) => {
    if (!user?.id) return;

    await ecommerceService.removeFromCart(user.id, id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    if (!user?.id) return;

    // Calcula el delta respecto a la cantidad actual
    const current = items.find((i) => i.id === id);
    const delta = quantity - (current?.quantity ?? 0);

    if (delta !== 0) {
      const updatedCart = await ecommerceService.addToCart(user.id, id, delta);
      setItems(mapCartFromBackend(updatedCart));
    }
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discount = items.reduce(
    (acc, i) =>
      i.originalPrice > i.price
        ? acc + (i.originalPrice - i.price) * i.quantity
        : acc,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}