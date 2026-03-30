import { validateEmail } from '@/auth/mock/authMock';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { AuthCard } from '../components/AuthCard';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export const ForgotPasswordPage = () => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleSendReset = async () => {
        if (!email.trim()) {
            toast.error('Por favor ingresa tu correo electrónico');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Correo no válido');
            return;
        }

        setLoading(true);

        // Simulacion de consulta al Servidor
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success('Enlace de recuperación enviado a tu correo');
        navigate('/admin/createpassword')
        setEmail('');

        setLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendReset();
        }
    };

    return (
        <AuthCard>
            <div className="flex justify-start cursor-pointer ">
                <ArrowLeft color='gray' onClick={() => navigate('/admin/login')} />
            </div>
            {/* Logo - centered */}
            <div className="flex justify-center mb-6">
                <img src="../public/logoatomicshop.png" alt="logo atomicShop" className='object-contain w-42 h-30' tabIndex={1}/>
            </div>

            {/* Text */}
            <div className="text-center mb-6">
                <h2 className="font-semibold text-gray-800 text-xl">
                    ¿Olvidaste tu contraseña?
                </h2>
            </div>

            <div className="text-center mb-5">
                <h4 className="font-light text-gray-400 text-xs">
                    Escribe tu correo electronico para recibir un pin de confirmacion
                    y asi puedas recuperar y cambiar tu contraseña
                </h4>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </div>
                </div>

                {/* Send button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendReset}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-6"
                >
                    {loading ? 'Enviando...' : 'Enviar'}
                </motion.button>
            </div>
        </AuthCard>
    );
}
