import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { RecoverEmailEntry } from "../Components/RecoverEmailEntry";
import { RecoverVerificationCode } from "../Components/RecoverVerificationCode";
import { RecoverNewPassword } from "../Components/RecoverNewPassword";
import { RecoverFinalMessage } from "../Components/RecoverFinalMessage";

export const RecoverPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [emailToRecover, setEmailToRecover] = useState("");

  const handleVerifyUser = (email: string) => {
    const users = JSON.parse(localStorage.getItem("usuarios_registrados") || "[]");
    const userExists = users.find((u: any) => u.email === email);

    if (userExists) {
      setEmailToRecover(email);
      setStep(2);
    } else {
      toast.error("Este correo no está registrado en Atomic Shop.");
    }
  };

  const handleUpdatePassword = (newPassword: string) => {
    const users = JSON.parse(localStorage.getItem("usuarios_registrados") || "[]");
    const updatedUsers = users.map((u: any) => 
      u.email === emailToRecover ? { ...u, password: newPassword } : u
    );
    localStorage.setItem("usuarios_registrados", JSON.stringify(updatedUsers));
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative flex items-center justify-center py-10 px-4">
      <button
        onClick={() => step === 1 ? navigate("/login") : setStep(step - 1)}
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