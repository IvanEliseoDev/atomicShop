import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/AuthContext";
import { ecommerceService } from "@/services/ecommerceService";
import { registerSchema, type RegisterFormData } from "../schemas/registerSchema";
import { MUNICIPIOS } from "@/constants/locationData";
import { formatPhone, formatDUI } from "@/utils/inputFormatters";

export function useRegister() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      dui: "",
      telefono: "",
      email: "",
      direccion: "",
      departamento: "",
      municipio: "",
      password: "",
      confirmPassword: "",
    },
  });

  const departamento = watch("departamento");
  const municipiosDisponibles = departamento ? (MUNICIPIOS[departamento] ?? []) : [];

  const handleUsarMiUbicacion = () => {
    if (!user) return;
    setValue("departamento", user.deparmet || "", { shouldValidate: true });
    setValue("municipio", user.municipality || "", { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterFormData) => {
    const result = await ecommerceService.register({
      name: `${data.nombres} ${data.apellidos}`,
      mail: data.email,
      password: data.password,
      telephone: data.telefono || "",
      direction: data.direccion,
      dui: data.dui || "",
      deparmet: data.departamento,
      municipality: data.municipio,
    });

    if (result.status === "201") {
      toast.success("Cuenta creada. Revisa tu correo para verificarla.");
      navigate("/verify-email");
    } else if (result.status === "400") {
      const msg = result.message ?? "";
      if (msg.includes("employee")) {
        toast.error("Este correo pertenece a un empleado y no puede usarse para crear una cuenta.");
      } else {
        toast.error("Este correo ya está registrado. Intenta con otro.");
      }
    } else {
      toast.error("Error al registrar, intenta de nuevo");
    }
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("telefono", formatPhone(e.target.value), { shouldValidate: true });
  };

  const handleDuiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("dui", formatDUI(e.target.value), { shouldValidate: true });
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    departamento,
    municipiosDisponibles,
    handleUsarMiUbicacion,
    setValue,
    watch,
    user,
    navigate,
    handleTelefonoChange,
    handleDuiChange,
  };
}
