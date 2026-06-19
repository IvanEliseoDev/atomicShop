import React from "react";
import { AuthCard } from "../../Login/Components/AuthCard";
import { Check } from "lucide-react";
import { useNavigate } from "react-router";
import { LogoYonJob } from "@/components/ui/LogoYonJob";

export const RecoverFinalMessage = () => {
  const navigate = useNavigate();

  return (
    <AuthCard className="max-w-md text-center py-12 px-8">
      <div className="flex justify-center mb-10">
        <LogoYonJob className="h-20 object-contain" />
      </div>

      <h2 className="text-gray-800 font-semibold text-[17px] mb-12">
        ¡Contraseña recuperada exitosamente!
      </h2>

      <div className="flex justify-center mb-10">
        <div className="bg-[#5BA4E1] w-28 h-28 rounded-full flex items-center justify-center shadow-lg shadow-blue-100">
          <Check size={64} className="text-white" strokeWidth={3} />
        </div>
      </div>

      <button
        onClick={() => navigate("/login")}
        className="mt-6 text-[#5BA4E1] text-sm font-medium hover:underline cursor-pointer transition-all"
      >
        Volver al inicio de sesión
      </button>
    </AuthCard>
  );
};
