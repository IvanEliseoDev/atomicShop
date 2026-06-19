// Importamos componentes para la pagina
import Carrousel from "../Components/Carrousel";
import ProductSlider from "../Components/ProductSlider";
import ProviderCarts from "../Components/ProviderCarts";

// Importamos useState para el formulario de contactenos
import { useState } from "react";
// Para validar camopos
import { MapPin, Mail, Phone, Star } from "lucide-react";
// No se para que sirbe 😁
import { toast } from "sonner";
import { motion } from "framer-motion";

function HomePage() {
  // ---------------- Para el formulario de contactanos (inicio)

  const [isSending, setIsSending] = useState(false);

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async () => {
    const { nombre, telefono, correo, mensaje } = contactForm;

    // 1. Validaciones básicas
    if (
      !nombre.trim() ||
      !telefono.trim() ||
      !correo.trim() ||
      !mensaje.trim()
    ) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      toast.error("Ingresa un correo electrónico válido");
      return;
    }

    // 2. Iniciamos el estado de carga
    setIsSending(true);

    try {
      const response = await fetch("http://localhost:4000/api/e-commerce/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        toast.success("¡Mensaje enviado correctamente!");
        setContactForm({ nombre: "", telefono: "", correo: "", mensaje: "" });
        // Si quieres que el botón se reactive después de enviar, ponlo en false.
        // Si quieres que no puedan enviar NADA más, déjalo en true.
        setIsSending(false);
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Error al enviar el mensaje, intenta de nuevo" + error);
      setIsSending(false); // Re-habilitamos el botón para que lo intenten de nuevo
    }
  };

  // ---------------- Para el formulario de contactanos (fin)

  // Estado del formulario — agrégalo dentro de HomePage()
  const [contactForm, setContactForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    mensaje: "",
  });

  return (
    <>
      {/* Navbar junto con el componente de la lista de categorias */}

      <main className="flex-1 bg-gray-100 px-4">
        {/* Carrousel de imagenes (osea banneres) */}
        <Carrousel />

        {/* 4 Prductos, carrousel */}
        <ProductSlider />

        {/* Componente con las targetas de proveedores */}
        <ProviderCarts />

        {/* Section (por que no es necesario hacerlo componente) */}
        <section id="nosotros" className="w-full max-w-5xl mx-auto my-8 px-4">
          {/* Título */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            ¿Quiénes somos?
          </h2>

          {/* Targeta */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4  gap-3 relative flex justify-center">
            <img
              src="../../../../public/logoatomicshop.png"
              alt=""
              className="w-full h-42 object-contain rounded-lg mt-4"
            />

            {/* Texto */}
            <div>
              <p className="text-gray-600 text-accent leading-snug mt-3">
                En AtomicShop distribuimos instrumental para laboratorios de
                control de calidad, ofrecemos soporte técnico y mantenimiento de
                equipos. Nuestro personal está capacitado por los fabricantes
                para garantizar la fiabilidad de los resultados.
              </p>
              <p className="text-gray-600 text-accent leading-snug mb-3">
                Somos representantes exclusivos para la región de las marcas más
                prestigiosas de la industria.
              </p>
              {/* Agrupacion de estrellas */}
              <div className="flex justify-start items-center">
                <Star size={30} className="text-blue-500 fill-blue-500" />
                <Star size={30} className="text-blue-500 fill-blue-500" />
                <Star size={30} className="text-blue-500 fill-blue-500" />
                <Star size={30} className="text-blue-500 fill-blue-500" />
                <Star size={30} className="text-blue-500 fill-blue-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Sección Contáctenos — pégala dentro del <main> */}
        <section id="contacto" className="w-full max-w-5xl mx-auto my-8 px-4">
          {/* Título */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 tracking-wide ">
            Contáctenos
          </h2>

          {/* Tarjeta principal */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6">
            {/* Columna izquierda — info de contacto */}
            <div className="flex flex-col gap-5 md:w-1/3">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Dirección:
                  </p>
                  <p className="text-sm text-gray-500">
                    Avenida Aguilares 218 San Salvador
                  </p>
                  <p className="text-sm text-gray-500">CP, San Salvador 1101</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={20} className="text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Correo electrónico:
                  </p>
                  <p className="text-sm text-gray-500">atomicshop@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={20} className="text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Teléfono:
                  </p>
                  <p className="text-sm text-gray-500">0000-0000</p>
                </div>
              </div>
            </div>

            {/* Divisor vertical */}
            <div className="hidden md:block w-px bg-gray-100" />

            {/* Columna derecha — formulario */}
            <div className="flex flex-col gap-4 flex-1">
              {/* Nombre */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  *Nombre y apellido:
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={contactForm.nombre}
                  onChange={handleContactChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Teléfono y Correo */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-medium text-gray-600">
                    *Teléfono:
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={contactForm.telefono}
                    onChange={handleContactChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-medium text-gray-600">
                    *Correo electrónico:
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={contactForm.correo}
                    onChange={handleContactChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Mensaje */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  *Mensaje:
                </label>
                <textarea
                  name="mensaje"
                  value={contactForm.mensaje}
                  onChange={handleContactChange}
                  rows={4}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                />
              </div>

              <div>
                <motion.button
                  whileHover={!isSending ? { scale: 1.02 } : {}}
                  whileTap={!isSending ? { scale: 0.98 } : {}}
                  onClick={handleContactSubmit}
                  disabled={isSending}
                  className={`transition text-white text-sm font-semibold px-6 py-2 rounded-lg ${
                    isSending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  }`}
                >
                  {isSending ? "Enviando..." : "Enviar"}
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default HomePage;
