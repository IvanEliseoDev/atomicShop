import React, { useState, useEffect, useRef } from "react";
// Esto son como los iconos creo
import { Heart, ShoppingCart, User, Search, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router"; // Para poder mandar al usuario a diferentes interfases
import CategoriesBar from "./CategoriesBar";
import { toast } from "sonner"; //
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { ecommerceService } from "@/services/ecommerceService";
import { LogoYonJob } from "@/components/ui/LogoYonJob";

const Navbar = () => {
  // const SEARCH_MOCK_PRODUCTS = Array.from({ length: 6 }, (_, i) => ({
  //   id: i + 1,
  //   name: "Báscula para pesar cajas petri",
  //   price: 80.0,
  //   originalPrice: 99.0,
  //   image: "https://placehold.co/100x80/e8f4fb/4a9bbe?text=Báscula",
  //   onSale: true,
  // }));

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { toggleCart, totalItems, addItem } = useCart();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length >= 3) {
      const data = await ecommerceService.searchProducts(value);
      setSearchResults(data.slice(0, 3));
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controla el dropdown

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    toast.info("Has cerrado sesión correctamente", {
      description: "¡Vuelve pronto a Atomic Shop!",
      position: "bottom-right",
    });
    navigate("/atomicShop");
  };

  // Funcion para scroll para las secciones de contactanos y nosotros en la pagina principal del proyecto
  const handleScroll = (id: string) => {
    if (window.location.pathname !== "/atomicShop") {
      navigate("/atomicShop");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full shadow-sm border-b">
      <div className="bg-white px-10 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => navigate("/atomicShop")}
        >
          <LogoYonJob className="h-20" />
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <button
            onClick={() => navigate("/atomicShop")}
            className="hover:text-blue-500 transition cursor-pointer"
          >
            Inicio
          </button>
          <button
            onClick={() => handleScroll("nosotros")}
            className="hover:text-blue-500 transition cursor-pointer"
          >
            Nosotros
          </button>
          <button
            onClick={() => handleScroll("contacto")}
            className="hover:text-blue-500 transition cursor-pointer"
          >
            Contáctanos
          </button>
          <button
            onClick={() => navigate("/atomicShop/productos")}
            className="hover:text-blue-500 transition cursor-pointer"
          >
            Productos
          </button>
        </nav>

        {/* Buscador con dropdown */}
        <div ref={wrapperRef} className="relative w-full max-w-sm">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Buscar un producto"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchQuery.trim().length >= 3) setShowDropdown(true);
              }}
              className="flex-1 px-4 py-2 text-sm text-gray-700 outline-none"
            />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="px-2 py-2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
            <button className="bg-blue-500 hover:bg-blue-600 transition px-3 py-3 cursor-pointer">
              <Search size={18} className="text-white" />
            </button>
          </div>

          {/* Dropdown de resultados */}
          {showDropdown && (
            <div
              className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
              style={{ width: "480px" }}
            >
              {/* Título */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm text-gray-600">
                  Productos para{" "}
                  <span className="text-sky-500 font-semibold">
                    "{searchQuery}"
                  </span>
                </p>
              </div>

              {/* Grid de 3 productos */}
              <div className="grid grid-cols-3 gap-3 p-4">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => {
                      navigate(`/atomicShop/productos/${product._id}`);
                      setShowDropdown(false);
                      setSearchQuery("");
                    }}
                    className="flex flex-col gap-2 cursor-pointer group"
                  >
                    {/* Badge + wishlist */}
                    <div className="flex items-center justify-between">
                      {!!product.discount ? (
                        <span className="bg-sky-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Oferta
                        </span>
                      ) : (
                        <span />
                      )}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Heart size={14} />
                      </button>
                    </div>

                    {/* Imagen */}
                    <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg flex items-center justify-center h-20">
                      <img
                        src={product.images?.[0] ?? ""}
                        alt={product.name}
                        className="object-contain h-14 w-auto group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Nombre */}
                    <p className="text-xs text-gray-700 font-medium line-clamp-2 leading-snug">
                      {product.name}
                    </p>

                    {/* Cantidad + carrito */}
                    <div className="flex items-center gap-1 mt-auto">
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden text-xs flex-1">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="px-1.5 py-1 text-gray-500 hover:bg-gray-50 cursor-pointer"
                        >
                          −
                        </button>
                        <span className="flex-1 text-center text-gray-700 font-medium text-[11px]">
                          100
                        </span>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="px-1.5 py-1 text-gray-500 hover:bg-gray-50 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            originalPrice: product.discount
                              ? product.price / (1 - product.discount / 100)
                              : product.price, // Calculado igual que en ProductSlider
                            image: product.images?.[0] ?? "",
                          });
                        }}
                        className="w-7 h-7 bg-sky-500 hover:bg-sky-600 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <ShoppingCart size={12} className="text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer — ver todos */}
              <div className="border-t border-gray-100 px-4 py-2.5 text-center">
                <button
                  onClick={() => {
                    navigate("/atomicShop/productos");
                    setShowDropdown(false);
                    setSearchQuery("");
                  }}
                  className="text-xs text-gray-500 hover:text-sky-500 transition-colors cursor-pointer"
                >
                  <span className="text-sky-500 font-semibold underline underline-offset-2">
                    Ver todos los productos
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Iconos de accion */}
        <div className="flex items-center justify-evenly px-2 p-0 gap-15">
          <button
            onClick={() => navigate("/atomicShop/favoritos")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition cursor-pointer"
          >
            <Heart size={22} />
            <span className="text-xs mt-0.5">Favoritos</span>
          </button>

          <button
            onClick={toggleCart}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition relative cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-xs mt-0.5">Carrito</span>
          </button>

          {/* Lógica de Sesión con Menú Desplegable */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 p-1 pr-3 rounded-full border border-blue-200 transition cursor-pointer"
              >
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm overflow-hidden">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <span className="text-sm font-semibold text-blue-700 hidden lg:block">
                  {user?.name?.split(" ")[0]}
                </span>
              </button>

              {/* Menú que aparece al dar clic */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 mb-1">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                      Sesión activa
                    </p>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {user.name}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/atomicShop/perfil");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-3"
                  >
                    <User size={18} />
                    Ver mi perfil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3 border-t border-gray-50"
                  >
                    <LogOut size={18} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition cursor-pointer"
            >
              <User size={22} />
              <span className="text-xs mt-0.5"> Iniciar sesión</span>
            </button>
          )}
        </div>
      </div>
      <CategoriesBar />
    </header>
  );
};

export default Navbar;
