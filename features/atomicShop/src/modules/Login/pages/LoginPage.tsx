
import  { useState, type FormEvent } from 'react';

import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AuthCard } from '../components/AuthCard';
import { EmailInput } from '../components/EmailInput';
import { PasswordInput } from '../components/PasswordInput';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';


export const LoginPage = () => {
    const [IsPosting, setIsPosting] = useState(false)
    const navigate = useNavigate()
    const { login} = useAuthStore() //desestructuro la funcion login de mi store
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const email = formData.get('email') as string; //accedemos a su valor mediante el name del elemento
        const password = formData.get('password') as string;
        const hashSucces = await login(email, password)
        if (hashSucces) {
            toast.success("Inicio de sesion Exitoso")
            navigate('/atomicAdmin/')
            return
        }
        toast.error("Correo o/y contraseña no validos")
        setIsPosting(false)
    };

    const handleForgotPassword = () => {
        navigate('/admin/ForgetPassword')
    };




    return (
        <AuthCard>
            <form onSubmit={handleLogin}>


                {/* Header with logo and divider */}
                <div className="flex items-center gap-4 mb-8">
                    <img src='../public/logoatomicshop.png' alt="" className='object-contain w-52 h-24' />
                    <div className="w-0.5 h-8 bg-gray-300" />
                    <div className="font-semibold text-gray-800 text-lg">
                        Inicio de sesión
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <EmailInput
                        placeholder="Correo electrónico"
                    />

                    <PasswordInput
                        placeholder="Contraseña"
                    />

                    {/* Forgot password link */}
                    <div className="text-right">
                        <button
                            onClick={handleForgotPassword}
                            className="text-sm text-blue-600 cursor-pointer hover:text-blue-700  transition"
                        >
                            ¿Olvidó su contraseña?
                        </button>
                    </div>

                    {/* Login button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-6"
                    >
                        {IsPosting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </motion.button>
                </div>
            </form>
        </AuthCard>
    );
}
