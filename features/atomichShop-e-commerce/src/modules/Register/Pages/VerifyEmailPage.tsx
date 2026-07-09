import { AuthCard } from "@/modules/Login/Components/AuthCard";
import { LogoYonJob } from "@/components/ui/LogoYonJob";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

export const VerifyEmailPage = () => {
  const {
    code,
    inputRefs,
    handleChange,
    handlePaste,
    handleKeyDown,
    handleVerify,
    handleResend,
    cooldown,
    isResending,
    pendingEmail,
  } = useVerifyEmail();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <AuthCard>
        <div className="flex flex-col items-center mb-6 text-center">
          <LogoYonJob />
          <h2 className="text-gray-800 font-bold text-lg mb-2">
            Verifica tu correo
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Te enviamos un código de verificación
            {pendingEmail && (
              <> a <span className="font-medium text-gray-700">{pendingEmail}</span></>
            )}
            . Ingrésalo aquí para activar tu cuenta.
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
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition mb-4"
        >
          Verificar cuenta
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">¿No recibiste el código?</p>
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className={`text-sm font-semibold transition ${
              cooldown > 0 || isResending
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-500 hover:text-blue-700 cursor-pointer"
            }`}
          >
            {isResending
              ? "Enviando..."
              : cooldown > 0
              ? `Reenviar código (${cooldown}s)`
              : "Reenviar código"}
          </button>
        </div>
      </AuthCard>
    </div>
  );
};
