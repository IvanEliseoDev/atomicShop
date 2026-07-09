import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AuthCard } from '../components/AuthCard';
import { verifyRecoveryCode } from '@/auth/actions/recovery/verifyRecoveryCode.action';

export const VerifyCodePage = () => {
    const [code, setCode] = useState(new Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const navigate = useNavigate();

    const handleChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'Enter') handleVerify();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const newCode = new Array(6).fill('');
        pasted.split('').forEach((char, i) => { newCode[i] = char; });
        setCode(newCode);
        const lastIndex = Math.min(pasted.length - 1, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleVerify = async () => {
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            toast.error('Ingresa el código completo de 6 dígitos');
            return;
        }

        setLoading(true);
        try {
            await verifyRecoveryCode(fullCode);
            toast.success('Código verificado correctamente');
            navigate('/createpassword');
        } catch (error: any) {
            const msg = error?.response?.data?.message;
            toast.error(msg || 'Código incorrecto o expirado');
            setCode(new Array(6).fill(''));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard>
            <div className="flex justify-start cursor-pointer mb-2">
                <ArrowLeft color="gray" onClick={() => navigate('/ForgetPassword')} />
            </div>

            <div className="flex justify-center mb-6">
                <img src="/logoatomicshop.png" alt="logo AtomicShop" className="object-contain w-42 h-30" />
            </div>

            <div className="text-center mb-4">
                <h2 className="font-semibold text-gray-800 text-xl">Verificación de código</h2>
            </div>

            <div className="text-center mb-6">
                <p className="font-light text-gray-400 text-xs">
                    Ingresa el código de 6 dígitos que enviamos a tu correo electrónico.
                    El código expira en 15 minutos.
                </p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
                {code.map((digit, i) => (
                    <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        ref={(el) => { if (el) inputRefs.current[i] = el; }}
                        onChange={(e) => handleChange(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onPaste={handlePaste}
                        className="w-10 h-12 border border-gray-300 rounded-xl text-center font-bold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerify}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
                {loading ? 'Verificando...' : 'Verificar código'}
            </motion.button>
        </AuthCard>
    );
};
