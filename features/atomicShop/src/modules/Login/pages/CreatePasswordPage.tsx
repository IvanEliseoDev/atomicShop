import React, { useState } from 'react';
import { toast } from 'sonner';
import { AuthCard } from '../components/AuthCard';
import { PasswordInput } from '../components/PasswordInput';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

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

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success('Contraseña actualizada correctamente');
        setNewPassword('');
        setConfirmPassword('');
        setLoading(false);

        navigate('/admin/succeschangepassword')
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCreatePassword();
        }
    };

    return (
        <AuthCard>
            {/* Logo - centered */}
            <div className="flex justify-start cursor-pointer">
                <ArrowLeft onClick={() => navigate('/admin/login')} />
            </div>
            <div className="flex justify-center mb-6">
                <img src="public/logoatomicshop.png" alt="" />
            </div>

            {/* Text */}
            <div className="text-center mb-8">
                            {/* Logo - centered */}
            <div className="flex justify-center mb-6">
                <img src="../public/logoatomicshop.png" alt="logo atomicShop" className='object-contain w-30 h-28' tabIndex={1}/>
            </div>
                <p className="text-gray-800 text-lg leading-relaxed">
                    ¡Muchas gracias por tu paciencia! Ahora puedes crear tu contraseña.
                </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    onKeyPress={handleKeyPress}
                />

                <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar nueva contraseña"
                    onKeyPress={handleKeyPress}
                />

                {/* Update button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreatePassword}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-6"
                >
                    {loading ? 'Actualizando...' : 'Actualizar'}
                </motion.button>
            </div>
        </AuthCard>
    );
}
