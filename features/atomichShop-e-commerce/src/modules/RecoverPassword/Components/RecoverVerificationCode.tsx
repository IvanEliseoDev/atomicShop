import { toast } from "sonner";
import React, { useState, useRef } from "react";
import { AuthCard } from "../../Login/Components/AuthCard";
import { ecommerceService } from "@/services/ecommerceService";
import { LogoYonJob } from "@/components/ui/LogoYonJob";

export const RecoverVerificationCode = ({ onNext }: { onNext: () => void }) => {
  const [code, setCode] = useState(new Array(6).fill(""));

  // Usamos referencias para controlar los cuadritos de el codigo de verificación sin usar el mouse
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // Solo números

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Solo guardar el último dígito
    setCode(newCode);

    // Si escribió un número, pasar al siguiente cuadrito automáticamente
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Si presiona borrar (Backspace) y el cuadro está vacío, regresar al anterior
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Si presiona Enter, enviamos el formulario
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      return;
    }
    const result = await ecommerceService.verifyRecoveryCode(fullCode);
    if (result.status === "200") {
      onNext();
    } else {
      toast.error("Código incorrecto o expirado");
      setCode(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
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

    const lastIndex = Math.min(pasted.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <AuthCard className="max-w-md">
      <div className="flex flex-col items-center mb-6 text-center">
        <LogoYonJob className="mb-4 h-22" />
        <p className="text-sm text-gray-700 px-4 leading-relaxed">
          Te enviamos un código a tu correo para una confirmación, agrega el
          código aquí:
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
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            className="w-10 h-12 border border-gray-300 rounded-xl text-center font-bold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        ))}
      </div>

      <div className="text-center mb-6">
        <button className="text-[#5BA4E1] text-xs font-semibold hover:underline cursor-pointer">
          Reenviar código
        </button>
      </div>

      <button
        onClick={handleVerify} // <-- Permite ingresar cualquier código de verificación, por el momento lo dejamos asi porque aun no se conecta a la API
        className="w-full bg-[#5BA4E1] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#4a93d0] transition-all"
      >
        Verificar
      </button>
    </AuthCard>
  );
};
