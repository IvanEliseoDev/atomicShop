import { AuthCard } from "../../Login/Components/AuthCard";
import { LogoYonJob } from "@/components/ui/LogoYonJob";

import { useRecoverVerificationCode }
  from "../hooks/useRecoverVerificationCode";

export const RecoverVerificationCode = ({
  onNext,
}: {
  onNext: () => void;
}) => {

  const {
    code,
    inputRefs,
    handleChange,
    handleKeyDown,
    handleVerify,
    handlePaste,
  } = useRecoverVerificationCode(onNext);

  return (
    <AuthCard className="max-w-md">

      <div className="flex flex-col items-center mb-6 text-center">
        <LogoYonJob className="mb-4 h-22" />

        <p className="text-sm text-gray-700 px-4 leading-relaxed">
          Te enviamos un código a tu correo para una confirmación,
          agrega el código aquí:
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {code.map((data, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            value={data}
            ref={(el) => {
              if (el) inputRefs.current[i] = el;
            }}
            onChange={(e) =>
              handleChange(e.target.value, i)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, i)
            }
            onPaste={handlePaste}
            className="w-10 h-12 border border-gray-300 rounded-xl text-center font-bold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="w-full bg-[#5BA4E1] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#4a93d0] transition-all"
      >
        Verificar
      </button>

    </AuthCard>
  );
};