import { ChevronLeft } from "lucide-react";

import { RecoverEmailEntry } from "../Components/RecoverEmailEntry";
import { RecoverVerificationCode } from "../Components/RecoverVerificationCode";
import { RecoverNewPassword } from "../Components/RecoverNewPassword";
import { RecoverFinalMessage } from "../Components/RecoverFinalMessage";

import { useRecoverPasswordPage } from "../hooks/useRecoverPasswordPage";

export const RecoverPasswordPage = () => {

  const {
    step,
    setStep,
    handleVerifyUser,
    handleBack,
    handleUpdatePassword,
  } = useRecoverPasswordPage();

  return (
    <div className="min-h-screen bg-gray-100 relative flex items-center justify-center py-10 px-4">

      <button
        onClick={handleBack}
        className="absolute cursor-pointer top-6 left-6 flex items-center gap-1 text-gray-600 hover:text-gray-800 transition text-sm font-medium"
      >
        <ChevronLeft size={18} />
        Regresar
      </button>

      {step === 1 && (
        <RecoverEmailEntry
          onVerify={handleVerifyUser}
        />
      )}

      {step === 2 && (
        <RecoverVerificationCode
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <RecoverNewPassword
          onConfirm={handleUpdatePassword}
        />
      )}

      {step === 4 && <RecoverFinalMessage />}

    </div>
  );
};