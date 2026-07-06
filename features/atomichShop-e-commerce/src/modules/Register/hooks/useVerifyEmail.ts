import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ecommerceService } from "@/services/ecommerceService";

export function useVerifyEmail() {
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
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newCode = new Array(6).fill("");
    pasted.split("").forEach((char, i) => { newCode[i] = char; });
    setCode(newCode);
    inputRefs.current[Math.min(pasted.length - 1, 5)]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleVerify();
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      toast.error("Ingresa los 6 dígitos del código");
      return;
    }
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

  return { code, inputRefs, handleChange, handlePaste, handleKeyDown, handleVerify };
}
