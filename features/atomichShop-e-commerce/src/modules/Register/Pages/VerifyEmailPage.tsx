import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AuthCard } from "@/modules/Login/Components/AuthCard";
import { ecommerceService } from "@/services/ecommerceService";
import { LogoYonJob } from "@/components/ui/LogoYonJob";

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(new Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const newCode = new Array(6).fill("");
    pasted.split("").forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);

    // Mover el foco al ultimo campo llenado
    const lastIndex = Math.min(pasted.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleVerify();
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) return;

    const result = await ecommerceService.verifyRegisterCode(fullCode);
    if (result.status === "200") {
      toast.success("Correo verificado correctamente");
      navigate("/login");
    } else {
      toast.error("Código incorrecto o expirado");
      setCode(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

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
              ref={(el) => {
                if (el) inputRefs.current[i] = el;
              }}
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
