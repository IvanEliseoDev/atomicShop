
import React, { useState } from 'react';

import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AuthCard } from '../components/AuthCard';
import { EmailInput } from '../components/EmailInput';
import { PasswordInput } from '../components/PasswordInput';
import { validateEmail, verifyCredentials } from '@/auth/mock/authMock';
import { useNavigate } from 'react-router';


export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Correo no válido');
            return;
        }

        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (verifyCredentials(email, password)) {
            toast.success('Sesión iniciada correctamente');
            setEmail('');
            setPassword('');

        } else {
            toast.error('Credenciales incorrectas');
        }

        setLoading(false);
    };

    const handleForgotPassword = () => {
        navigate('/admin/ForgetPassword')
    };

    const handleRegister = () => {

    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <AuthCard>
            {/* Header with logo and divider */}
            <div className="flex items-center gap-4 mb-8">
                <img src='public/logoatomicshop.png' alt="" className='object-contain w-30 h-16' />
                <div className="w-0.5 h-8 bg-gray-300" />
                <div className="font-semibold text-gray-800 text-lg">
                    Inicio de sesión
                </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <EmailInput
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                />

                <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    onKeyPress={handleKeyPress}
                />

                {/* Forgot password link */}
                <div className="text-right">
                    <button
                        onClick={handleForgotPassword}
                        className="text-sm text-blue-600 hover:text-blue-700 transition"
                    >
                        ¿Olvidó su contraseña?
                    </button>
                </div>

                {/* Login button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogin}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-6"
                >
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </motion.button>
            </div>

            {/* Register link */}
            <div className="text-center mt-6">
                <button
                    onClick={handleRegister}
                    className="text-blue-600 hover:text-blue-700 transition"
                >
                    Registrarse
                </button>
            </div>
        </AuthCard>
    );
}
