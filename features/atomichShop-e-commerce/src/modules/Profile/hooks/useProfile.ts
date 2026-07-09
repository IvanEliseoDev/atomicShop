import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { ecommerceService } from "@/services/ecommerceService";
import { profileSchema, type ProfileFormData } from "../schemas/profileSchema";
import { formatPhone, formatDUI } from "@/utils/inputFormatters";
import { MUNICIPIOS } from "@/constants/locationData";

export function useProfile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [correo, setCorreo] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombres: "",
      telefono: "",
      dni: "",
      direccion: "",
      departamento: "",
      municipio: "",
    },
  });

  const departamento = watch("departamento");
  const municipiosDisponibles = departamento ? (MUNICIPIOS[departamento] ?? []) : [];

  const loadProfile = (id: string) =>
    ecommerceService.getProfile(id).then((res) => {
      const customer = res.data;
      if (customer) {
        reset({
          nombres: customer.name || "",
          telefono: customer.telephone || "",
          dni: customer.dui || "",
          direccion: customer.direction || "",
          departamento: customer.deparmet || "",
          municipio: customer.municipality || "",
        });
        setProfilePic(customer.image || "");
        setCorreo(customer.mail || "");
      }
    });

  useEffect(() => {
    if (!user?.id) return;
    loadProfile(user.id).catch(() =>
      toast.error("No se pudieron cargar los datos del perfil")
    );
  }, [user?.id]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) {
      toast.error("No hay sesión activa");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.nombres);
    formData.append("telephone", data.telefono || "");
    formData.append("direction", data.direccion || "");
    formData.append("dui", data.dni || "");
    formData.append("deparmet", data.departamento || "");
    formData.append("municipality", data.municipio || "");
    if (selectedFile) formData.append("image", selectedFile);

    toast.promise(
      ecommerceService.updateProfile(user.id, formData).then((res) => {
        const updated = res.data;
        if (!updated) throw new Error("Sin datos en la respuesta");
        reset({
          nombres: updated.name || "",
          telefono: updated.telephone || "",
          dni: updated.dui || "",
          direccion: updated.direction || "",
          departamento: updated.deparmet || "",
          municipio: updated.municipality || "",
        });
        setProfilePic(updated.image || "");
        setUser({
          ...user,
          name: updated.name,
          profilePic: updated.image,
          deparmet: updated.deparmet,
          municipality: updated.municipality,
        });
        setIsEditing(false);
        setSelectedFile(null);
      }),
      {
        loading: "Guardando cambios...",
        success: "¡Perfil actualizado correctamente!",
        error: "Hubo un error al guardar los cambios",
      },
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedFile(null);
    if (user?.id) {
      loadProfile(user.id).catch(() => {});
    }
  };

  const values = watch();

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("telefono", formatPhone(e.target.value), { shouldValidate: true });
  };

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("dni", formatDUI(e.target.value), { shouldValidate: true });
  };

  const handleDepartamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("departamento", e.target.value, { shouldValidate: true });
    setValue("municipio", "", { shouldValidate: false });
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    isEditing,
    setIsEditing,
    profilePic,
    correo,
    values,
    fileInputRef,
    handleImageChange,
    handleCancelEdit,
    handleTelefonoChange,
    handleDniChange,
    handleDepartamentoChange,
    departamento,
    municipiosDisponibles,
  };
}
