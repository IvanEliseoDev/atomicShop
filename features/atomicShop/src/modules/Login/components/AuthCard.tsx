import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';

//Porpiedades de las tarjetas de Authenticacion
//es obligatorio que debe de venir el contenido que se quiera mostrar en la tarjeta
interface AuthCardProps {
    children: ReactNode;
    className?: string;
}

//Carta customizable, esta aparece en cada interfaz de authenticacion, simula un formulario
export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`bg-white rounded-2xl shadow-2xl p-8 sm:p-10 max-w-md w-full ${className}`}
        >
            {/*Colocamos el contenido que le enviemos al componente, este varia dependiendo la ruta */}
            {children}
        </motion.div>
    );
};
