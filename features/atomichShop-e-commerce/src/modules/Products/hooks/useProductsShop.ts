import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:4000/api/e-commerce";

export interface ProductShop {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  brandId?: { _id: string; name: string };
  categoryId?: { _id: string; name: string };
  image: string;
  onSale: boolean;
}

interface Filters {
  minPrice?: number;
  maxPrice?: number;
  brandId?: string;
  categoryId?: string;
  sort?: string;
}

export function useProductsShop(filters: Filters) {
  const [products, setProducts] = useState<ProductShop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.minPrice !== undefined)
      query.append("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined)
      query.append("maxPrice", String(filters.maxPrice));
    if (filters.brandId && filters.brandId !== "Todas")
      query.append("brandId", filters.brandId);
    if (filters.sort && filters.sort !== "relevance")
      query.append("sort", filters.sort);
    if (filters.categoryId && filters.categoryId !== "Todas")
      query.append("categoryId", filters.categoryId);

    setLoading(true);
    fetch(`${BASE_URL}/products/shop?${query.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setProducts(
          data.map((p: any) => ({
            id: p._id,
            name: p.name,
            price: p.price,
            originalPrice: p.discount ? p.price / (1 - p.discount / 100) : p.price,
            brandId: p.brandId,
            categoryId: p.categoryId,
            image: p.images?.[0] ?? "",
            onSale: !!p.discount,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [
    filters.minPrice,
    filters.maxPrice,
    filters.brandId,
    filters.categoryId,
    filters.sort,
  ]);

  return { products, loading };
}