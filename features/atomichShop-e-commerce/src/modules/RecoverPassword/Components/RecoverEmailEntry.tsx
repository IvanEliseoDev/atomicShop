import React, { useState } from "react";
import { AuthCard } from "../../Login/Components/AuthCard";
import { EmailInput } from "../../Login/Components/EmailInput";

export const RecoverEmailEntry = ({ onVerify }: { onVerify: (email: string) => void }) => {
    const [email, setEmail] = useState("");

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && email.trim()) {
            onVerify(email);
        }
    };
    
    return (
        <AuthCard className="max-w-md">
            <div className="flex flex-col items-center mb-6 text-center">
                <img src="/logoatomicshop.png" alt="Logo" className="h-20 mb-4" />
                <h2 className="text-gray-800 font-bold text-lg">¿Olvidaste tu contraseña?</h2>
            </div>
            {/* Agregado onKeyPress aquí */}
            <div onKeyPress={handleKeyPress}>
                <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button
                onClick={() => onVerify(email)}
                className="w-full bg-[#5BA4E1] text-white font-bold py-3 rounded-xl mt-6 shadow-md hover:bg-[#4a93d0] transition-all"
            >
                Enviar
            </button>
        </AuthCard>
    );
};