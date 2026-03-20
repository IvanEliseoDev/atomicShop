import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Array de imagenes
const slides = [
  {
    id: 1,
    image: "https://www.shutterstock.com/image-photo/scientist-beakers-water-chemistry-science-260nw-2475262401.jpg",
    title: "Excelencia",
    subtitle: "Te ofrecemos los mejores productos de laboratorio del país",
  },
  {
    id: 2,
    image: "https://www.shutterstock.com/image-photo/panorama-background-health-care-researchers-260nw-1974611666.jpg",
    title: "Calidad Garantizada",
    subtitle: "Instrumentos certificados por los mejores fabricantes del mundo",
  },
  {
    id: 3,
    image: "https://www.shutterstock.com/image-photo/flask-test-tune-science-research-600nw-2524509389.jpg",
    title: "Soporte Técnico",
    subtitle: "Nuestro equipo está disponible para ayudarte en todo momento",
  },
];
function Carrousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = derecha, -1 = izquierda

  // Avance automatico cada 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Para avanzar entre banners
  function goNext() {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }

  // Para regresar entre banners
  function goPrev() {
    setDirection(1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100" : "-100", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100" : "100", opacity: 0 }),
  };
  return (
    <div className="relative w-full overflow-hidden rounded-xl mx-auto max-w-5xl my-6 shadow-md">
      {/**Slides */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={slides[current].id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative w-full"
        >
          {/* Imagenes */}
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-64 md:h-80 object-cover"
          />

          {/* Texto encima de la imagen */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-white/60 to-transparent">
            <h2 className="text-2xl md:text-3xl front-semibold text-gray-800">
              {slides[current].title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {slides[current].subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Flecha izquierda */}
      <button
        onClick={goPrev}
        className="absolute left-3 top-1/2 -trasnlate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-2 transition z-10"
      >
        <ChevronLeft size={22} className="text-gray-700 cursor-pointer"/>
      </button>

      {/* Flecha derecha */}
      <button
        onClick={goNext}
        className="absolute right-3 top-1/2 -trasnlate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-2 transition z-10"
      >
        <ChevronRight size={22} className="text-gray-700 cursor-pointer"/>
      </button>

      {/* Indicadores (dots) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-blue-500 w-5" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carrousel;
