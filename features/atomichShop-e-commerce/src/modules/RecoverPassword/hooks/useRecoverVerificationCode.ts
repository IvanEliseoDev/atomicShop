import { useState, useRef } from "react";
import { toast } from "sonner";
import {BASE_URL} from "../../../config/api" 

export function useRecoverVerificationCode(onNext: () => void) {
  const [code, setCode] = useState(new Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) return;

    try {
      const response = await fetch(`${BASE_URL}/recoveryPassword/verifyCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeRequest: fullCode }),
        credentials: "include"
      });
      const result = await response.json();

      if (result.status === "200") {
        onNext();
      } else {
        toast.error("Código incorrecto o expirado");
        setCode(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Error al validar el código.");
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newCode = new Array(6).fill("");
    pasted.split("").forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);

    const lastIndex = Math.min(pasted.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  return {
    code,
    inputRefs,
    handleChange,
    handleKeyDown,
    handleVerify,
    handlePaste,
  };
}