import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AuthCard } from '../components/AuthCard';
import { PasswordInput } from '../components/PasswordInput';
import { changeRecoveryPassword } from '@/auth/actions/recovery/changeRecoveryPassword.action';

export default function CreatePasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreatePassword = async () => {
        if (!newPassword.trim() || !confirmPassword.trim()) {
            toast.error('Por favor completa todos los campos');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            await changeRecoveryPassword(newPassword);
            toast.success('Contraseña actualizada correctamente');
            navigate('/succeschangepassword');
        } catch (error: any) {
            const status = error?.response?.status;
            const msg = error?.response?.data?.message;
            if (status === 400) {
                toast.error(msg || 'El proceso expiró. Vuelve a solicitar el código.');
                navigate('/ForgetPassword');
            } else {
                toast.error('Error al actualizar la contraseña. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard>
            <div className="flex justify-start cursor-pointer mb-2">
                <ArrowLeft onClick={() => navigate('/verifycode')} />
            </div>

            <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                    <img src="../public/logoatomicshop.png" alt="logo AtomicShop" className="object-contain w-30 h-28" />
                </div>
                <h2 className="font-semibold text-gray-800 text-xl mb-2">Nueva contraseña</h2>
                <p className="text-gray-400 text-xs">
                    Crea una nueva contraseña segura para tu cuenta.
                </p>
            </div>

            <div className="space-y-4">
                <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    onKeyPress={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleCreatePassword(); }}
                />

                <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar nueva contraseña"
                    onKeyPress={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleCreatePassword(); }}
                />

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreatePassword}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-6"
                >
                    {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </motion.button>
            </div>
        </AuthCard>
    );
}
