import React, { useState, useEffect } from "react";
// Esto son como los iconos creo
import { Heart, ShoppingCart, User, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router"; // Para poder mandar al usuario a diferentes interfases
import CategoriesBar from "./CategoriesBar";
import { toast } from "sonner"; // 


const Navbar = () => {
  // Para poder mandar al usuario a diferentes interfases
  const navigate = useNavigate();

  // Para poder utilizar useState
  const [searchQuery, setSearchQuery] = useState("");

  // Y para poder enseñarle al usuario cuantos productos lleva en el carrito
  const [cartCount] = useState(0);

  const [user, setUser] = useState<{ nombres: string } | null>(null);


  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controla el dropdown

  useEffect(() => {
    const session = localStorage.getItem("usuario_sesion");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario_sesion");
    setUser(null);
    setIsMenuOpen(false);
    
    // Mostramos el mensaje antes o después de navegar
    toast.info("Has cerrado sesión correctamente", {
      description: "¡Vuelve pronto a Atomic Shop!",
      position: "bottom-right", // Opcional: para que no estorbe arriba
    });

    navigate("/atomicShop");
  };

  // Funcion para scroll para las secciones de contactanos y nosotros en la pagina principal del proyecto
  const handleScroll = (id: string) => {
    // Si no estamos en la pagina principal, navegamos primero
    if (window.location.pathname !== "/atomicShop") {
      navigate("/atomicShop");
      // Esperamos a que cargue la pagina antes de scrollear
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100); // Tiempo de espera
    } else {
      // Si ya estamos en Home, scrolleamos directamente
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full shadow-sm border-b">
      <div className="bg-white px-10 py-3, flex items-center justify-between gap-4">
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
        <div className="flex items-center justify-evenly px-2 p-0 gap-15 ">
          {/* Favoritos */}
          <button
            onClick={() => navigate("/atomicShop/favoritos")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition cursor-pointer"
          >
            <Heart size={22} />
            <span className="text-xs mt-0.5"> Favoritos</span>
          </button>

          {/* Carrito */}
          <button
            onClick={() => navigate("/carrito")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition relative cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-0.5">Carrito</span>
          </button>

          {/* Lógica de Sesión con Menú Desplegable */}
          {user ? (
            <div className="relative">
              {/* Burbuja con Inicial */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 p-1 pr-3 rounded-full border border-blue-200 transition cursor-pointer"
              >
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  {user.nombres.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-blue-700 hidden lg:block">
                  Mi cuenta
                </span>
              </button>

              {/* Menú que aparece al dar clic */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 mb-1">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Sesión activa</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user.nombres}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/atomicShop/perfil"); // Ajusta a tu ruta real de perfil
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
            /* Si no hay nadie, tu botón original de Crear Cuenta */
            <button
              onClick={() => navigate("/login")}
              className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition cursor-pointer"
            >
              <User size={22} />
              <span className="text-xs mt-0.5"> Crear cuenta</span>
            </button>
          )}
        </div>
      </div>
      <CategoriesBar />
    </header>
  );
};

export default Navbar;
