import React, { useState, useEffect, useRef } from "react";
import { Mail, MapPin, Phone, CreditCard, Pencil, Check, X, Camera } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/lib/AuthContext"; 

interface EditableFieldProps {
    isEditing: boolean;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = () => {
    const { user, setUser } = useAuth(); 
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [userData, setUserData] = useState({
        nombres: "",
        correo: "",
        telefono: "Sin definir",
        dni: "Sin definir",
        direccion: "Sin definir",
        profilePic: ""
    });

    // ==========================================
    // 1. CARGAR DATOS DESDE LA BASE DE DATO
    // ==========================================
    useEffect(() => {
        if (!user?.id) return; // Si no hay sesión, no hace nada

        axios.get(`http://localhost:4000/e-commerce/profile/${user.id}`, {
            withCredentials: true // Envía la cookie de sesión
        })
            .then(response => {
                const customer = response.data.data;
                if (customer) {
                    setUserData({
                        nombres: customer.name || "",
                        correo: customer.mail || "",
                        telefono: customer.telephone || "Sin definir",
                        dni: customer.dui || "Sin definir",
                        direccion: customer.direction || "Sin definir",
                        profilePic: customer.image || ""
                    });
                }
            })
            .catch(error => {
                console.error("Error al cargar datos del perfil:", error);
                toast.error("No se pudieron cargar los datos del perfil");
            });
    }, [user?.id]); // Se ejecuta cuando el ID del usuario esté disponible

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // ==========================================
    // 2. GUARDAR CAMBIOS EN LA BASE DE DATOS
    // ==========================================
    const handleSave = async () => {
        if (!user?.id) {
            toast.error("No hay sesión activa");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", userData.nombres);
            formDataToSend.append("telephone", userData.telefono);
            formDataToSend.append("direction", userData.direccion);
            formDataToSend.append("dui", userData.dni);

            if (selectedFile) {
                formDataToSend.append("image", selectedFile);
            }

            const response = await axios.put(
                `http://localhost:4000/e-commerce/profile/update/${user.id}`,
                formDataToSend,
                {
                    withCredentials: true, // Envía la cookie
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            if (response.status === 200) {
                const updatedCustomer = response.data.data;

                setUserData({
                    nombres: updatedCustomer.name || "",
                    correo: updatedCustomer.mail || "",
                    telefono: updatedCustomer.telephone || "Sin definir",
                    dni: updatedCustomer.dui || "Sin definir",
                    direccion: updatedCustomer.direction || "Sin definir",
                    profilePic: updatedCustomer.image || ""
                });

                // Actualiza el contexto global para que el navbar u otros componentes
                // reflejen el nuevo nombre/foto sin recargar
                setUser({
                    ...user,
                    name: updatedCustomer.name,
                    profilePic: updatedCustomer.image
                });

                setIsEditing(false);
                setSelectedFile(null);
                toast.success("¡Perfil actualizado correctamente!");
            }
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            toast.error("Hubo un error al guardar los cambios");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUserData({ ...userData, profilePic: URL.createObjectURL(file) });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-10">
            {/* Banner Azul */}
            <div className="bg-[#5BA4E1] h-32 relative flex items-center px-12">
                <div className="absolute -bottom-12 left-12">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-[#E5E7EB] rounded-full border-4 border-white flex items-center justify-center overflow-hidden shadow-sm">
                            {userData.profilePic ? (
                                <img src={userData.profilePic} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <div className="text-gray-400 font-bold text-4xl">
                                    {userData.nombres ? userData.nombres.charAt(0).toUpperCase() : "U"}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute top-2 right-0 bg-white p-1.5 rounded-full shadow-md text-[#5BA4E1]"
                        >
                            <Camera size={14} />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                    </div>
                </div>

                <div className="ml-40 mt-4 flex items-center gap-3">
                    {isEditing ? (
                        <input
                            name="nombres"
                            value={userData.nombres}
                            onChange={handleInputChange}
                            className="bg-white/20 border-b border-white text-white text-2xl font-bold outline-none px-2 rounded w-80"
                        />
                    ) : (
                        <h1 className="text-2xl font-bold text-white">{userData.nombres}</h1>
                    )}
                    <button onClick={() => setIsEditing(!isEditing)} className="text-white/80 hover:text-white">
                        {isEditing ? <X size={20} /> : <Pencil size={18} />}
                    </button>
                </div>
            </div>

            {/* Detalles */}
            <div className="pt-16 pb-8 px-12 relative">
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                    <div className="flex items-center gap-3">
                        <Mail size={18} className="text-gray-400" />
                        <span className="text-gray-600 text-sm">{userData.correo}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-gray-400" />
                        <EditableField isEditing={isEditing} name="direccion" value={userData.direccion} onChange={handleInputChange} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone size={18} className="text-gray-400" />
                        <EditableField isEditing={isEditing} name="telefono" value={userData.telefono} onChange={handleInputChange} />
                    </div>
                    <div className="flex items-center gap-3">
                        <CreditCard size={18} className="text-gray-400" />
                        <EditableField isEditing={isEditing} name="dni" value={userData.dni} onChange={handleInputChange} />
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-8 flex justify-end">
                        <button onClick={handleSave} className="bg-[#5BA4E1] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                            <Check size={18} /> Guardar Cambios
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const EditableField = ({ isEditing, name, value, onChange }: EditableFieldProps) => {
    if (!isEditing) return <span className="text-gray-600 text-sm">{value}</span>;
    return <input name={name} value={value} onChange={onChange} className="text-sm text-gray-700 border-b border-blue-300 outline-none w-full" />;
};