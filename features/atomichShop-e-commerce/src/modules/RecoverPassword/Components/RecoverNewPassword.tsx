import React, { useState } from "react";
import { AuthCard } from "../../Login/Components/AuthCard";
import { PasswordInput } from "../../Login/Components/PasswordInput";
import { toast } from "sonner";

export const RecoverNewPassword = ({ onConfirm }: { onConfirm: (pass: string) => void }) => {
    const [pass, setPass] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleAction = () => {
        if (pass !== confirm || pass.length < 6) {
            return toast.error("Revisa que las contraseñas coincidan y tengan al menos 6 caracteres.");
        }
        onConfirm(pass);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAction();
        }
    };

    return (
        <AuthCard className="max-w-md">
            <div className="flex flex-col items-center mb-6 text-center">
                <img src="/logoatomicshop.png" alt="Logo" className="h-20 mb-4" />
                <p className="text-sm text-gray-700 font-medium px-4">¡Muchas gracias por tu paciencia! Ahora puedes crear tu contraseña.</p>
            </div>
            {/* El onKeyDown se coloca aquí para que funcione en ambos inputs */}
            <div className="flex flex-col gap-3" onKeyDown={handleKeyDown}>
                <PasswordInput 
                    value={pass} 
                    onChange={(e) => setPass(e.target.value)} 
                    placeholder="Contraseña" 
                />
                <PasswordInput 
                    value={confirm} 
                    onChange={(e) => setConfirm(e.target.value)} 
                    placeholder="Confirmar contraseña" 
                />
            </div>
            <button 
                onClick={handleAction} 
                className="w-full bg-[#5BA4E1] text-white font-bold py-3 rounded-xl mt-8 shadow-md"
            >
                Confirmar
            </button>
        </AuthCard>
    );
};