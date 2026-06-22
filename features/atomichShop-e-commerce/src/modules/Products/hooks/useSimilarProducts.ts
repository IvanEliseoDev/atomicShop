import { useState, useEffect } from "react";
import type { ProductShop } from "./useProductsShop";

const BASE_URL = "http://localhost:4000/api/e-commerce";

export function useSimilarProducts(categoryId: string | undefined, currentId: string | undefined) {
  const [products, setProducts] = useState<ProductShop[]>([]);

  useEffect(() => {
    if (!categoryId || !currentId) return;

    const query = new URLSearchParams({ categoryId, currentId });
    fetch(`${BASE_URL}/products/similar?${query.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setProducts(
          data.map((p: any) => ({
            id: p._id,
            name: p.name,
            price: p.price,
            originalPrice: p.discount ? p.price / (1 - p.discount / 100) : p.price,
            image: p.images?.[0] ?? "",
            onSale: !!p.discount,
          }))
        );
      });
  }, [categoryId, currentId]);

  return { products };
}