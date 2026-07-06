import { AuthCard } from "@/modules/Login/Components/AuthCard";
import { LogoYonJob } from "@/components/ui/LogoYonJob";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

export const VerifyEmailPage = () => {
  const { code, inputRefs, handleChange, handlePaste, handleKeyDown, handleVerify } = useVerifyEmail();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <AuthCard>
        <div className="flex flex-col items-center mb-6 text-center">
          <LogoYonJob />
          <h2 className="text-gray-800 font-bold text-lg mb-2">
            Verifica tu correo
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Te enviamos un código de verificación. Ingrésalo aquí para activar
            tu cuenta.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {code.map((data, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={data}
              ref={(el) => { if (el) inputRefs.current[i] = el; }}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className="w-10 h-12 border border-gray-300 rounded-xl text-center font-bold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Verificar cuenta
        </button>
      </AuthCard>
    </div>
  );
};
