import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/AuthContext";
import { ecommerceService } from "@/services/ecommerceService";
import { registerSchema, type RegisterFormData } from "../schemas/registerSchema";
import { MUNICIPIOS } from "@/constants/locationData";

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
      toast.error("Este correo ya está registrado");
    } else {
      toast.error("Error al registrar, intenta de nuevo");
    }
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
    user,
    navigate,
  };
}
