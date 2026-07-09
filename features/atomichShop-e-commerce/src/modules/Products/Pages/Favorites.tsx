import { useState } from "react";
import { useCart } from "../../../lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { useWishlistPage } from "../hooks/useWishlist";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function CustomCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange}
      className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer border-2 transition-all flex-shrink-0 ${checked ? "bg-sky-500 border-sky-500" : "bg-white border-gray-300 hover:border-sky-400"}`}>
      {checked && (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
}

function Favorites() {
  const { addItem } = useCart();
  const { user } = useAuth();

  // ← Hook con fetch directo, sin ecommerceService
  const { favorites, setFavorites, loading, remove: removeFromFavorites } = useWishlistPage(user?.id);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null || isNaN(price)) return "0.00";
    return price.toFixed(2);
  };

  const toggleSelect = (id: string) => {
    setFavorites((prev) => prev.map((p) => p._id === id ? { ...p, selected: !p.selected } : p));
  };

  const toggleSelectAll = () => {
    const allSelected = paginatedItems.every((p) => p.selected);
    const pageIds = new Set(paginatedItems.map((p) => p._id));
    setFavorites((prev) => prev.map((p) => pageIds.has(p._id) ? { ...p, selected: !allSelected } : p));
  };

  const addSelectedToCart = () => {
    favorites.filter((p) => p.selected).forEach((p) => {
      addItem({ id: p._id, name: p.name, price: p.price, originalPrice: p.price, image: p.images?.[0] ?? "", stock: p.stock ?? 0 });
    });
  };

  const addSingleToCart = (product: typeof favorites[0]) => {
    addItem({ id: product._id, name: product.name, price: product.price, originalPrice: product.price, image: product.images?.[0] ?? "", stock: product.stock ?? 0 });
    setOpenMenuId(null);
  };

  const handleRemove = async (id: string) => {
    await removeFromFavorites(id);
    setOpenMenuId(null);
  };

  const totalPages = Math.ceil(favorites.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = favorites.slice(startIndex, startIndex + pageSize);
  const allPageSelected = paginatedItems.length > 0 && paginatedItems.every((p) => p.selected);
  const selectedCount = favorites.filter((p) => p.selected).length;

  if (!user?.id && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Inicia sesión</h2>
        <p className="text-gray-500 mb-6">Para ver tus productos favoritos</p>
        <button onClick={() => window.location.href = "/login"}
          className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Cargando favoritos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-28 h-28 bg-sky-400 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-16 h-16 fill-white">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">Tus favoritos</h1>
            <p className="text-gray-500 text-sm mt-1">
              {favorites.length} producto{favorites.length !== 1 ? "s" : ""} guardado{favorites.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={addSelectedToCart} disabled={selectedCount === 0}
            className={`flex items-center gap-2 px-5 py-4 rounded-lg text-sm font-semibold shadow-sm transition-all ${selectedCount > 0 ? "bg-sky-500 hover:bg-sky-600 active:scale-95 text-white cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Agregar al carrito
            {selectedCount > 0 && (
              <span className="bg-white text-sky-600 rounded-full px-2 py-0.5 text-xs font-bold leading-none">{selectedCount}</span>
            )}
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-20 text-center">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 fill-sky-200">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <p className="text-gray-500 text-base">No tienes productos favoritos aún.</p>
            <p className="text-gray-400 text-sm mt-1">Agrega productos desde el catálogo.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-left w-10"><CustomCheckbox checked={allPageSelected} onChange={toggleSelectAll} /></th>
                  <th className="py-3 px-4 text-left w-20"></th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">Nombre de producto</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">Categoría</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">Precio</th>
                  <th className="py-3 px-4 text-left w-10"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((product) => (
                  <tr key={product._id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${product.selected ? "bg-sky-50" : ""}`}>
                    <td className="py-3 px-4"><CustomCheckbox checked={product.selected} onChange={() => toggleSelect(product._id)} /></td>
                    <td className="py-3 px-4">
                      <div className="w-16 h-12 bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img src={product.images?.[0] ?? ""} alt={product.name} className="object-contain h-10 w-auto" />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-gray-500">{product.category?.name ?? "Sin categoría"}</td>
                    <td className="py-3 px-4">
                      <span className="text-gray-800 font-semibold">${formatPrice(product.price)}</span>
                    </td>
                    <td className="py-3 px-4 relative">
                      <button onClick={() => setOpenMenuId(openMenuId === product._id ? null : product._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>
                      {openMenuId === product._id && (
                        <div className="absolute right-4 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[120px]">
                          <button onClick={() => addSingleToCart(product)}
                            className="w-full flex items-center gap-2 px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Agregar
                          </button>
                          <button onClick={() => handleRemove(product._id)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Mostrar</span>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer">
                  {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{startIndex + 1}-{Math.min(startIndex + pageSize, favorites.length)} de {favorites.length}</span>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {openMenuId !== null && <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />}
    </div>
  );
}

export default Favorites;