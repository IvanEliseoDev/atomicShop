import { motion } from "framer-motion";

// Cambia este número por el real de AtomicShop
const WHATSAPP_NUMBER = "50300000000";
const WHATSAPP_MESSAGE = "¡Hola! Me gustaría obtener más información sobre sus productos.";

function ButtonWhatsapp() {
  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank");
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 bg-gray-500 hover:bg-gray-600 transition rounded-full w-15 h-15 flex items-center justify-center shadow-lg cursor-pointer"
      aria-label="Contactar por WhatsApp"
    >
      <img
        src="/Logo_Whatsapp.png"
        alt="WhatsApp"
        className="w-8 h-8 object-contain text-white"
      />
    </motion.button>
  );
}

export default ButtonWhatsapp;