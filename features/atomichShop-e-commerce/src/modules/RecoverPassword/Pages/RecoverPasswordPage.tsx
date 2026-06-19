import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { RecoverEmailEntry } from "../Components/RecoverEmailEntry";
import { RecoverVerificationCode } from "../Components/RecoverVerificationCode";
import { RecoverNewPassword } from "../Components/RecoverNewPassword";
import { RecoverFinalMessage } from "../Components/RecoverFinalMessage";
import { ecommerceService } from "@/services/ecommerceService";

export const RecoverPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [emailToRecover, setEmailToRecover] = useState("");

  const handleVerifyUser = async (email: string) => {
    const result = await ecommerceService.requestRecoveryCode(email);
    if (result.status === "200") {
      setEmailToRecover(email);
      setStep(2);
    } else {
      toast.error("Este correo no está registrado en Atomic Shop.");
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    const result = await ecommerceService.newPassword(newPassword, newPassword);
    if (result.status === "200") {
      setStep(4);
    } else {
      toast.error("Error al actualizar contraseña, intenta de nuevo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative flex items-center justify-center py-10 px-4">
      <button
        onClick={() => (step === 1 ? navigate("/login") : setStep(step - 1))}
        className="absolute cursor-pointer top-6 left-6 flex items-center gap-1 text-gray-600 hover:text-gray-800 transition text-sm font-medium"
      >
        <ChevronLeft size={18} /> Regresar
      </button>

      {step === 1 && <RecoverEmailEntry onVerify={handleVerifyUser} />}
      {step === 2 && <RecoverVerificationCode onNext={() => setStep(3)} />}
      {step === 3 && <RecoverNewPassword onConfirm={handleUpdatePassword} />}
      {step === 4 && <RecoverFinalMessage />}
    </div>
  );
};
