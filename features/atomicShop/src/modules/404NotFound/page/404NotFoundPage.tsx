import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ArrowLeftCircle } from 'lucide-react';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center overflow-hidden relative">

            {/* ── Fondo diagonal azul (lado derecho) ───────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, transparent 50%, #e8f4fd 50%)',
                }}
            />

            {/* ── Contenido ────────────────────────────────────────────────── */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-10 flex items-center justify-between gap-8">

                {/* Columna izquierda */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-6 max-w-xs"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img
                            src="/logoatomicshop.png"
                            alt="Atomic Shop"
                            className="h-12 object-contain"
                        />
                    </div>

                    {/* Número 404 */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="text-7xl font-bold text-blue-500 leading-none"
                    >
                        404
                    </motion.div>

                    {/* Título */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                        className="text-2xl font-extrabold text-gray-800 uppercase leading-tight"
                    >
                        OOPS!! PÁGINA NO<br />ENCONTRADA
                    </motion.h1>

                    {/* Subtítulo */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.35 }}
                        className="text-sm font-semibold text-gray-500 uppercase tracking-wide leading-relaxed"
                    >
                        LO SENTIMOS, LA PÁGINA<br />QUE BUSCAS NO EXISTE
                    </motion.p>

                    {/* Botón Regresar */}
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.45 }}
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-600 font-semibold text-base w-fit hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeftCircle size={28} strokeWidth={2} />
                        Regresar
                    </motion.button>
                </motion.div>

                {/* Columna derecha — Ilustración ──────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex-shrink-0 hidden sm:block"
                >
                    {/* Monitor SVG ilustración */}
                    <svg
                        width="280"
                        height="260"
                        viewBox="0 0 280 260"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Monitor body */}
                        <rect x="20" y="30" width="210" height="155" rx="12" fill="#29ABE2" />
                        {/* Pantalla */}
                        <rect x="32" y="42" width="186" height="131" rx="8" fill="white" />

                        {/* Cara triste dentro de círculo */}
                        <circle cx="125" cy="108" r="52" fill="#E0E0E0" />
                        {/* Ojos X izquierdo */}
                        <line x1="108" y1="91" x2="118" y2="101" stroke="#555" strokeWidth="5" strokeLinecap="round" />
                        <line x1="118" y1="91" x2="108" y2="101" stroke="#555" strokeWidth="5" strokeLinecap="round" />
                        {/* Ojos X derecho */}
                        <line x1="132" y1="91" x2="142" y2="101" stroke="#555" strokeWidth="5" strokeLinecap="round" />
                        <line x1="142" y1="91" x2="132" y2="101" stroke="#555" strokeWidth="5" strokeLinecap="round" />
                        {/* Boca triste */}
                        <path d="M108 122 Q125 112 142 122" stroke="#555" strokeWidth="5" strokeLinecap="round" fill="none" />

                        {/* Pie del monitor */}
                        <rect x="100" y="185" width="50" height="14" rx="4" fill="#29ABE2" />
                        <rect x="82" y="199" width="86" height="10" rx="5" fill="#29ABE2" />

                        {/* Círculo rojo con X (badge error) */}
                        <circle cx="210" cy="58" r="38" fill="#E8003D" />
                        <line x1="195" y1="43" x2="225" y2="73" stroke="white" strokeWidth="8" strokeLinecap="round" />
                        <line x1="225" y1="43" x2="195" y2="73" stroke="white" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                </motion.div>

            </div>
        </div>
    );
};