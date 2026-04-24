import { useState } from "react";
import { Heart, ShoppingCart, User, Search } from "lucide-react";
import { useNavigate } from "react-router";
import CategoriesBar from "./CategoriesBar";
import { useCart } from "../../../lib/CartContext"; // ← ajusta la ruta si es necesario

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleCart, totalItems } = useCart(); // ← usamos el contexto

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
          <img
            src="/logoatomicshop.png"
            alt="Atomic Shop"
            className="h-20 w-auto object-contain"
          />
        </div>

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

        {/* Buscador */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full max-w-sm">
          <input
            type="text"
            placeholder="Buscar un producto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 text-sm text-gray-700 outline-none"
          />
          <button className="bg-blue-500 hover:bg-blue-600 transition px-3 py-3 cursor-pointer">
            <Search size={18} className="text-white" />
          </button>
        </div>

        {/* Iconos de accion */}
        <div className="flex items-center justify-evenly px-2 p-0 gap-15">
          {/* Favoritos */}
          <button
            onClick={() => navigate("/atomicShop/favoritos")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition cursor-pointer"
          >
            <Heart size={22} />
            <span className="text-xs mt-0.5">Favoritos</span>
          </button>

          {/* Carrito — abre el sidebar */}
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

          {/* Iniciar sesion */}
          <button
            onClick={() => navigate("/login")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition cursor-pointer"
          >
            <User size={22} />
            <span className="text-xs mt-0.5">Iniciar sesion</span>
          </button>
        </div>
      </div>
      <CategoriesBar />
    </header>
  );
};

export default Navbar;