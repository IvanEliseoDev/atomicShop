import React, { useState } from "react";
import { useCart } from "../../../lib/CartContext"; // ← ajusta la ruta si es necesario

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  brand: string;
  image: string;
  onSale: boolean;
}

const MOCK_PRODUCTS: Product[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "Báscula para pesar cajas petri",
  price: 80.0,
  originalPrice: 80.0,
  brand: "Marca A",
  image: "https://placehold.co/220x160/e8f4fb/4a9bbe?text=Báscula",
  onSale: true,
}));

const BRANDS = ["Todas", "Marca A", "Marca B", "Marca C"];
const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Precio: Menor a Mayor" },
  { value: "price-desc", label: "Precio: Mayor a Menor" },
  { value: "name", label: "Nombre" },
];

function Products() {
  const { addItem } = useCart(); // ← hook del carrito

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [brand, setBrand] = useState<string>("Todas");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [quantities, setQuantities] = useState<Record<number, number>>(
    Object.fromEntries(MOCK_PRODUCTS.map((p) => [p.id, 1]))
  );
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const handleQty = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Agrega al carrito respetando la cantidad seleccionada
  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] ?? 1;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
      });
    }
  };

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const inPrice = p.price >= minPrice && p.price <= maxPrice;
    const inBrand = brand === "Todas" || p.brand === brand;
    return inPrice && inBrand;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
          {/* Price Range */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-700">Por precio:</span>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={minPrice}
                min={0}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <span className="text-gray-400">—</span>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={maxPrice}
                min={0}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Brand */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">Por marca:</span>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 text-sm ml-auto">
            <span className="font-medium text-gray-700">
              Ordenar por relevancia:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">
            No se encontraron productos con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 group"
              >
                {/* Card Top */}
                <div className="relative">
                  {product.onSale && (
                    <span className="absolute top-3 left-3 z-10 bg-sky-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      Oferta
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition-transform"
                    aria-label="Agregar a favoritos"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={`w-5 h-5 transition-colors ${
                        wishlist.has(product.id)
                          ? "fill-red-500 stroke-red-500"
                          : "fill-none stroke-gray-400"
                      }`}
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </button>

                  <div className="bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center h-44 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-contain h-36 w-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <p className="text-lg font-bold text-gray-800">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">
                    {product.name}
                  </p>

                  {/* Cantidad + Carrito */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQty(product.id, -1)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none cursor-pointer"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-sm font-medium text-gray-700 min-w-[2.5rem] text-center">
                        {quantities[product.id]}
                      </span>
                      <button
                        onClick={() => handleQty(product.id, 1)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 active:scale-95 transition-all text-white rounded-lg py-2 text-sm font-semibold shadow-sm cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;