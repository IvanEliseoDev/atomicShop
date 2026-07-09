"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Interfaz del producto
export interface Product {
  id: number;
  name: string;
  sku?: string; // era: sku: string
  brand?: string; // era: brand: string
  category?: string; // era: category: string
  price: number;
  originalPrice?: number;
  isOffer?: boolean; // era: isOffer: boolean
  image: string;
  stock?: number;
  description?: string;
  characteristics?: string[];
  shippingInfo?: {
    freeShipping: boolean;
    deliveryTime: string;
    homeDelivery: string;
  };
  reviews?: {
    rating: number;
    comment: string;
  }[];
}

// Interfaz del contexto
interface ProductDetailContextType {
  isOpen: boolean;
  selectedProduct: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
}

// Crear el contexto
const ProductDetailContext = createContext<
  ProductDetailContextType | undefined
>(undefined);

// Provider del contexto
export function ProductDetailProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeProductDetail = () => {
    setIsOpen(false);
    // Esperamos a que termine la animación antes de limpiar el producto
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  };

  return (
    <ProductDetailContext.Provider
      value={{
        isOpen,
        selectedProduct,
        openProductDetail,
        closeProductDetail,
      }}
    >
      {children}
    </ProductDetailContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useProductDetail() {
  const context = useContext(ProductDetailContext);
  if (context === undefined) {
    throw new Error(
      "useProductDetail debe ser usado dentro de un ProductDetailProvider",
    );
  }
  return context;
}
