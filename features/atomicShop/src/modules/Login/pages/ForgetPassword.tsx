import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AuthCard } from '../components/AuthCard';
import { requestRecoveryCode } from '@/auth/actions/recovery/requestRecoveryCode.action';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendReset = async () => {
        if (!email.trim()) {
            toast.error('Por favor ingresa tu correo electrónico');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Ingresa un correo electrónico válido');
            return;
        }

        setLoading(true);
        try {
            await requestRecoveryCode(email.trim());
            toast.success('Código de verificación enviado a tu correo');
            navigate('/verifycode');
        } catch (error: any) {
            const status = error?.response?.status;
            if (status === 404) {
                toast.error('Este correo no está registrado en el sistema');
            } else {
                toast.error('Error al enviar el código. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard>
            <div className="flex justify-start cursor-pointer mb-2">
                <ArrowLeft color="gray" onClick={() => navigate('/login')} />
            </div>

            <div className="flex justify-center mb-6">
                <img src="/logoatomicshop.png" alt="logo AtomicShop" className="object-contain w-42 h-30" />
            </div>

            <div className="text-center mb-4">
                <h2 className="font-semibold text-gray-800 text-xl">¿Olvidaste tu contraseña?</h2>
            </div>

            <div className="text-center mb-5">
                <p className="font-light text-gray-400 text-xs">
                    Ingresa tu correo electrónico y te enviaremos un código de verificación
                    para que puedas restablecer tu contraseña.
                </p>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendReset(); }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendReset}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-6"
                >
                    {loading ? 'Enviando...' : 'Enviar código'}
                </motion.button>
            </div>
        </AuthCard>
    );
};
