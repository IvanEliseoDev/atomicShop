import React from 'react';
import { Mail } from 'lucide-react';

interface EmailInputProps {
    placeholder?: string;
    label?: string;
}

//Componente customizable de un input, este aparacere siempre que sea necesario colocar el correo electronico del usuario ya sea para iniciar sesion, registrarse, o cambiar su contraseña
export const EmailInput: React.FC<EmailInputProps> = ({
    placeholder = 'Correo electrónico',
    label,
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">
                    <Mail size={20} />
                </div>
            </div>
        </div>
    );
};
