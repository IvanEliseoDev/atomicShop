import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCarrousel } from "../hooks/useCarrousel";

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100" : "-100", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100" : "100", opacity: 0 }),
};

function Carrousel() {
  const { slides, current, direction, goNext, goPrev, goTo } = useCarrousel();

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-xl mx-auto max-w-5xl my-6 shadow-md">
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
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-64 md:h-80 object-cover"
          />
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

      <button
        onClick={goPrev}
        className="absolute left-3 top-1/2 -trasnlate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-2 transition z-10"
      >
        <ChevronLeft size={22} className="text-gray-700 cursor-pointer" />
      </button>

      <button
        onClick={goNext}
        className="absolute right-3 top-1/2 -trasnlate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-2 transition z-10"
      >
        <ChevronRight size={22} className="text-gray-700 cursor-pointer" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
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
