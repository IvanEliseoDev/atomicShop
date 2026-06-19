import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { BASE_URL } from "../../../config/api";

export function useRecoverPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [emailToRecover, setEmailToRecover] = useState("");

  const handleVerifyUser = async (email: string) => {
    try {
      const response = await fetch(`${BASE_URL}/recoveryPassword/requestCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ mail: email }),
      });

      const result = await response.json();

      if (result.status === "200") {
        setEmailToRecover(email);
        setStep(2);
      } else {
        toast.error("Este correo no está registrado.");
      }
    } catch {
      toast.error("Error al enviar el código.");
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    try {
      const response = await fetch(`${BASE_URL}/recoveryPassword/newPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newPassword,
          confirmNewPassword: newPassword,
        }),
      });

      const result = await response.json();

      if (result.status === "200") {
        setStep(4);
      } else {
        toast.error("Error al actualizar contraseña");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate("/login");
    } else {
      setStep((prev) => prev - 1);
    }
  };

  return {
    step,
    setStep,
    emailToRecover,
    handleVerifyUser,
    handleUpdatePassword,
    handleBack,
  };
}
