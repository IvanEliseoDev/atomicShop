import { motion } from "framer-motion";
import { AuthCard } from "../components/AuthCard";
import { Check } from "lucide-react";
import { useNavigate } from "react-router";


export default function SuccessPage() {

    const navigate = useNavigate()

    const handleBackToLogin = () => {
        navigate("/admin/login")
    };

    return (
        <AuthCard>
            {/* Logo */}
            <div className="flex justify-center mb-6">

            </div>

            {/* Success text */}
            <div className="text-center mb-8">
                <h2 className="font-semibold text-gray-800 text-xl">
                    ¡Contraseña recuperada exitosamente!
                </h2>
            </div>

            {/* Checkmark circle with animation */}
            <div className="flex justify-center mb-8">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2,
                    }}
                    className="flex items-center justify-center w-24 h-24 bg-blue-500 rounded-full"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 20,
                            delay: 0.4,
                        }}
                    >
                        <Check size={48} className="text-white stroke-3" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Back to login button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBackToLogin}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
                Volver al inicio
            </motion.button>
        </AuthCard>
    );
}
