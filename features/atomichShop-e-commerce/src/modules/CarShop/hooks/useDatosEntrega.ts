import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/AuthContext";
import { MUNICIPIOS } from "@/constants/locationData";
import {
  datosEntregaSchema,
  type DatosEntregaFormData,
} from "../schemas/datosEntregaSchema";

export function useDatosEntrega() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DatosEntregaFormData>({
    resolver: zodResolver(datosEntregaSchema),
    defaultValues: {
      direccion: "",
      departamento: "",
      municipio: "",
      fechaEntrega: "",
    },
  });

  const departamento = watch("departamento");
  const municipiosDisponibles = departamento ? (MUNICIPIOS[departamento] ?? []) : [];
  const today = new Date().toISOString().split("T")[0];

  const handleUsarMisDatos = () => {
    if (!user) return;
    setValue("direccion", user.direction || "", { shouldValidate: true });
    setValue("departamento", user.deparmet || "", { shouldValidate: true });
    setValue("municipio", user.municipality || "", { shouldValidate: true });
  };

  const onSubmit = (data: DatosEntregaFormData) => {
    sessionStorage.setItem("deliveryData", JSON.stringify(data));
    navigate("/carrito/datos-pago");
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    departamento,
    municipiosDisponibles,
    handleUsarMisDatos,
    setValue,
    today,
    user,
    navigate,
  };
}
