import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { ecommerceService } from "@/services/ecommerceService";
import { profileSchema, type ProfileFormData } from "../schemas/profileSchema";
import { formatPhone, formatDUI } from "@/utils/inputFormatters";

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
    defaultValues: { nombres: "", telefono: "", dni: "", direccion: "" },
  });

  useEffect(() => {
    if (!user?.id) return;
    ecommerceService.getProfile(user.id)
      .then((res) => {
        const customer = res.data;
        if (customer) {
          reset({
            nombres: customer.name || "",
            telefono: customer.telephone || "",
            dni: customer.dui || "",
            direccion: customer.direction || "",
          });
          setProfilePic(customer.image || "");
          setCorreo(customer.mail || "");
        }
      })
      .catch(() => toast.error("No se pudieron cargar los datos del perfil"));
  }, [user?.id, reset]);

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
    if (selectedFile) formData.append("image", selectedFile);

    await toast.promise(
      ecommerceService.updateProfile(user.id, formData).then((res) => {
        const updated = res.data;
        if (!updated) throw new Error("Sin datos en la respuesta");
        reset({
          nombres: updated.name || "",
          telefono: updated.telephone || "",
          dni: updated.dui || "",
          direccion: updated.direction || "",
        });
        setProfilePic(updated.image || "");
        setUser({ ...user, name: updated.name, profilePic: updated.image });
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
      ecommerceService.getProfile(user.id).then((res) => {
        const customer = res.data;
        if (customer) {
          reset({
            nombres: customer.name || "",
            telefono: customer.telephone || "",
            dni: customer.dui || "",
            direccion: customer.direction || "",
          });
          setProfilePic(customer.image || "");
        }
      });
    }
  };

  const values = watch();

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("telefono", formatPhone(e.target.value), { shouldValidate: true });
  };

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("dni", formatDUI(e.target.value), { shouldValidate: true });
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
  };
}
