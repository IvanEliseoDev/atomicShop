// src/lib/FavoritesContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "./ProductDetailContext";

interface FavoritesContextType {
  favorites: Product[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (product: Product) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  const isFavorite = (id: number) => favorites.some((p) => p.id === id);

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) =>
      isFavorite(product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return ctx;
}