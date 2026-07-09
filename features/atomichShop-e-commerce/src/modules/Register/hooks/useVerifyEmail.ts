import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ecommerceService } from "@/services/ecommerceService";

export function useVerifyEmail() {
  const navigate = useNavigate();
  const [code, setCode] = useState(new Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pendingEmail = sessionStorage.getItem("pendingVerificationEmail") ?? "";

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = useCallback(() => {
    setCooldown(60);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleChange = (value: string, index: number) => {
    const char = value.replace(/[^a-zA-Z0-9]/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6);
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
      sessionStorage.removeItem("pendingVerificationEmail");
      toast.success("Correo verificado correctamente");
      navigate("/login");
    } else {
      toast.error("Código incorrecto o expirado");
      setCode(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    if (!pendingEmail) {
      toast.error("No se encontró el correo. Vuelve a registrarte.");
      return;
    }
    setIsResending(true);
    try {
      const result = await ecommerceService.resendVerificationCode(pendingEmail);
      if (result.status === "200") {
        toast.success("Código reenviado. Revisa tu bandeja (o spam).");
        setCode(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
        startCooldown();
      } else {
        toast.error(result.message ?? "No se pudo reenviar el código");
      }
    } catch {
      toast.error("Error de conexión al reenviar el código");
    } finally {
      setIsResending(false);
    }
  };

  return {
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
  };
}
