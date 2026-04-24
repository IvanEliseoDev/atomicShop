import React, { useState, useEffect, useRef } from "react";
import { Mail, MapPin, Phone, CreditCard, Pencil, Check, X, Camera } from "lucide-react";
import { toast } from "sonner"; 

export const ProfileHeader = () => {
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Estado inicial vacío (se llenará con el localStorage)
    const [userData, setUserData] = useState({
        nombres: "",
        apellidos: "",
        correo: "",
        telefono: "Sin definir",
        dni: "Sin definir",
        direccion: "Sin definir",
        profilePic: ""
    });

    // 2. Cargar datos al montar el componente
    useEffect(() => {
        const session = localStorage.getItem("usuario_sesion");
        if (session) {
            const data = JSON.parse(session);
            setUserData({
                // Usamos los nombres exactos que vienen del formulario de registro
                nombres: data.nombres || "",
                apellidos: data.apellidos || "",
                correo: data.email || data.correo || "", 
                telefono: data.telefono || "",
                dni: data.dui || data.dni || "", 
                direccion: data.direccion || "Tu dirección aquí",
                profilePic: data.profilePic || ""
            });
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSave = () => {
        // Guardamos la sesión 
        localStorage.setItem("usuario_sesion", JSON.stringify(userData));

        const usuarios = JSON.parse(localStorage.getItem("usuarios_registrados") || "[]");
        const nuevosUsuarios = usuarios.map((u: any) =>
            (u.email === userData.correo || u.correo === userData.correo) ? { ...u, ...userData } : u
        );
        localStorage.setItem("usuarios_registrados", JSON.stringify(nuevosUsuarios));

        // Lanzamos este evento para que el Navbar lo escuche y se refresque solo
        window.dispatchEvent(new Event("profileUpdate"));

        setIsEditing(false);
        toast.success("Perfil actualizado correctamente");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData({ ...userData, profilePic: reader.result as string });
            };
            reader.readAsDataURL(file);
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
                                <img src={userData.profilePic} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400 font-bold text-4xl">
                                    {userData.nombres.charAt(0).toUpperCase()}
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
                        <div className="flex gap-2">
                            <input name="nombres" value={userData.nombres} onChange={handleInputChange} className="bg-white/20 border-b border-white text-white text-2xl font-bold outline-none px-2 rounded" />
                            <input name="apellidos" value={userData.apellidos} onChange={handleInputChange} className="bg-white/20 border-b border-white text-white text-2xl font-bold outline-none px-2 rounded" />
                        </div>
                    ) : (
                        <h1 className="text-2xl font-bold text-white">
                            {userData.nombres} {userData.apellidos}
                        </h1>
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

const EditableField = ({ isEditing, name, value, onChange }: any) => {
    if (!isEditing) return <span className="text-gray-600 text-sm">{value}</span>;
    return <input name={name} value={value} onChange={onChange} className="text-sm text-gray-700 border-b border-blue-300 outline-none w-full" />;
};