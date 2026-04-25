import { Facebook, Youtube, Instagram } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L.057 23.486a.5.5 0 00.609.61l5.718-1.451A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 01-5.031-1.378l-.36-.214-3.733.947.988-3.63-.235-.374A9.865 9.865 0 012.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z" />
  </svg>
);

// ✅ Interface explícita para los social links — esto soluciona el error de TSX
interface SocialLink {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navLinks = [
  { label: "Inicio", path: "/" },
  { label: "Nosotros", path: "/nosotros" },
  { label: "Contáctanos", path: "/contactanos" },
];

const socialLinks: SocialLink[] = [
  { icon: <Facebook className="w-6 h-6" />, label: "Facebook", href: "#" },
  { icon: <WhatsAppIcon />, label: "WhatsApp", href: "#" },
  { icon: <Instagram className="w-6 h-6" />, label: "Instagram", href: "#" },
  { icon: <Youtube className="w-6 h-6" />, label: "YouTube", href: "#" },
];

function Footer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-4">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-700">
          {/* Columna 1 — Logo y slogan */}
          <div className="flex flex-col gap-4">
            <img
              src="/logoatomicshop_blanco.png"
              alt="Atomic Shop"
              className="h-25 w-auto object-contain brightness-0 invert"
            />
            <p className="text-sm text-gray-400 italic leading-snug">
              "Equipamos tu aprendizaje, impulsamos tu futuro."
            </p>

            {/* Redes sociales */}
            {/* ✅ .map con parámetro tipado explícitamente */}
            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map((social: SocialLink) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-gray-400 hover:text-white transition"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2 — Links de navegación */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              Navegación
            </h3>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="text-sm text-gray-400 hover:text-white transition text-left"
              >
                {link.label}
              </button>
            ))}
            <div className="w-full h-px bg-gray-700 mt-2" />
          </div>

          {/* Columna 3 — Descarga la app */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
              ¡Descarga la app!
            </h3>
            <div className="flex items-center gap-3">
              <img
                src="/QR_APP_AtomicShop.png"
                alt="QR App"
                className="w-16 h-16 rounded-lg object-contain"
              />
              <span className="text-sm text-gray-400">
                Escanea el código para descargar nuestra app
              </span>
            </div>
            <div className="flex gap-2 mt-1 justify-center">
              {/* Google Play Badge */}
              <a href="#" target="_blank" rel="noopener noreferrer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 135 40"
                  className="h-11 w-auto"
                >
                  <rect width="135" height="40" rx="5" fill="#000000" />
                  <text
                    x="44"
                    y="13"
                    fill="white"
                    fontSize="7"
                    fontFamily="Arial, sans-serif"
                  >
                    GET IT ON
                  </text>
                  <text
                    x="44"
                    y="28"
                    fill="white"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                  >
                    Google Play
                  </text>
                  {/* Ícono Play Store */}
                  <g transform="translate(10, 8)">
                    {/* Triángulo izquierdo verde */}
                    <path d="M1.5 1.5 L1.5 22.5 L13.5 12 Z" fill="#00C853" />
                    {/* Triángulo superior azul */}
                    <path
                      d="M1.5 1.5 L13.5 12 L17.5 8 L4.5 0.5 Z"
                      fill="#00B0FF"
                    />
                    {/* Triángulo inferior rojo */}
                    <path
                      d="M1.5 22.5 L13.5 12 L17.5 16 L4.5 23.5 Z"
                      fill="#FF3D00"
                    />
                    {/* Triángulo derecho amarillo */}
                    <path
                      d="M13.5 12 L17.5 8 L20.5 12 L17.5 16 Z"
                      fill="#FFD600"
                    />
                  </g>
                </svg>
              </a>
              {/* App Store Badge */}
              <a href="#" target="_blank" rel="noopener noreferrer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 135 40"
                  className="h-11 w-auto"
                >
                  <rect width="135" height="40" rx="5" fill="#000000" />
                  <text
                    x="44"
                    y="13"
                    fill="white"
                    fontSize="7"
                    fontFamily="Arial, sans-serif"
                  >
                    Download on the
                  </text>
                  <text
                    x="44"
                    y="28"
                    fill="white"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                  >
                    App Store
                  </text>
                  {/* Ícono Apple */}
                  <g transform="translate(12, 6)" fill="white">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.39.07 2.35.77 3.17.8 1.21-.24 2.37-.97 3.67-.84 1.57.17 2.75.8 3.52 2.02-3.23 1.93-2.46 5.96.52 7.15-.61 1.64-1.42 3.25-2.88 4.75zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} AtomicShop.{" "}
          <p
          className="cursor-pointer text-gray-400 p-4 rounded-lg"
            onClick={() => {
              navigate("/atomicShop/terminos y condiciones");
              setShowDropdown(false);
              setSearchQuery("");
            }}
          >
            Términos y condiciones
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
