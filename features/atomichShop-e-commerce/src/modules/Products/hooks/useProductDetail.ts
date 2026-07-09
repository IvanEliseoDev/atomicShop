import { useState, useEffect } from "react";

const BASE_URL = `${import.meta.env.VITE_API_URL}/e-commerce`;

export interface ProductDetail {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  description?: string;
  features?: string;
  brandId?: { _id: string; name: string };
  categoryId?: { _id: string; name: string };
  stock: number;
  state: boolean;
}

export function useProductDetail(id: string | undefined) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.message) setError(data.message);
        else setProduct(data);
      })
      .catch(() => setError("Error al cargar el producto"))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}