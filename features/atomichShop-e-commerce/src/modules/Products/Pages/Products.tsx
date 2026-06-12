import { useEffect, useState } from "react";
import { useCart } from "../../../lib/CartContext";
import { useNavigate, useSearchParams } from "react-router";
import { ecommerceService } from "../../../services/ecommerceService";
import { useAuth } from "@/lib/AuthContext";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  brandId?: { _id: string; name: string };
  categoryId: { _id: string; name: string };
  image: string;
  onSale: boolean;
}

interface Brand {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "price_asc", label: "Precio: Menor a Mayor" },
  { value: "price_desc", label: "Precio: Mayor a Menor" },
];

function Products() {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [categoryId, setCategoryId] = useState<string>(
    () => searchParams.get("categoria") ?? "Todas",
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categorys, setCategorys] = useState<Category[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [brandId, setBrandId] = useState<string>("Todas");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  // Leer categoría desde la URL al cargar o al cambiar la URL
  useEffect(() => {
    const categoriaFromUrl = searchParams.get("categoria");
    if (categoriaFromUrl) {
      setCategoryId(categoriaFromUrl);
    } else {
      setCategoryId("Todas");
    }
  }, [searchParams]);

  // Carga inicial de marcas
  useEffect(() => {
    ecommerceService.getBrands().then((data) => {
      if (Array.isArray(data)) setBrands(data);
    });
    ecommerceService.getCategories().then((data) => {
      if (Array.isArray(data)) setCategorys(data);
    });
  }, []);

  // Carga de productos cada vez que cambian los filtros
  useEffect(() => {
    const sort = sortBy === "relevance" ? undefined : sortBy;
    ecommerceService
      .getProductsShop({ minPrice, maxPrice, brandId, categoryId, sort })
      .then((data) => {
        if (!Array.isArray(data)) return;
        const mapped = data.map((p: any) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          originalPrice: p.discount
            ? p.price / (1 - p.discount / 100)
            : p.price,
          brandId: p.brandId,
          categoryId: p.category,
          image: p.images?.[0] ?? "",
          onSale: !!p.discount,
        }));
        setProducts(mapped);
        setQuantities(Object.fromEntries(mapped.map((p) => [p.id, 1])));
      });
  }, [minPrice, maxPrice, brandId, categoryId, sortBy]);

  const handleQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  // Cargar wishlist del backend al montar
  useEffect(() => {
    if (!user?.id) return;
    ecommerceService.getWishlist(user.id).then((data) => {
      if (data.data && Array.isArray(data.data)) {
        const ids = data.data.map((p: any) => p._id || p);
        setWishlist(new Set(ids));
      }
    });
  }, [user?.id]);

  const toggleWishlist = async (id: string) => {
    if (!user?.id) return;

    if (wishlist.has(id)) {
      await ecommerceService.removeFromWishlist(user.id, id);
      setWishlist((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      await ecommerceService.addToWishlist(user.id, id);
      setWishlist((prev) => new Set(prev).add(id));
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3">
          {/* Price Range — ocupa las 2 columnas en móvil */}
          <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-700 whitespace-nowrap">
              Por precio:
            </span>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={minPrice}
                min={0}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
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
                className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Brand */}
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">Por marca:</span>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer w-full"
            >
              <option value="Todas">Todas</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">Por categoría:</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer w-full"
            >
              <option value="Todas">Todas</option>
              {categorys.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort — ocupa las 2 columnas en móvil, se va al final en desktop */}
          <div className="col-span-2 flex flex-col gap-1 text-sm sm:ml-auto sm:flex-row sm:items-center sm:gap-2">
            <span className="font-medium text-gray-700 whitespace-nowrap">
              Ordenar por:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer w-full sm:w-auto"
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
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">
            No se encontraron productos con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 group cursor-pointer"
                onClick={() => navigate(`/atomicShop/productos/${product.id}`)}
              >
                {/* Card Top */}
                <div className="relative">
                  {product.onSale && (
                    <span className="absolute top-3 left-3 z-10 bg-sky-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      Oferta
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition-transform"
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
                  {product.onSale && (
                    <p className="text-sm text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">
                    {product.name}
                  </p>

                  {/* Cantidad + Carrito */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQty(product.id, -1);
                        }}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none cursor-pointer"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-sm font-medium text-gray-700 min-w-[2.5rem] text-center">
                        {quantities[product.id] ?? 1}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQty(product.id, 1);
                        }}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
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
