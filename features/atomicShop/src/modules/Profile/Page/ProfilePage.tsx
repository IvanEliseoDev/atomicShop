import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Phone, Mail, Building2, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ProfileData {
    nombres: string;
    apellidos: string;
    dui: string;
    fechaNacimiento: string;
    telefono: string;
    correo: string;
    afp: string;
    isss: string;
    direccion: string;
    rol: string;
    panel: string;
}

// ─── Datos mock (reemplaza con tu API cuando tengas el backend listo) ──────────
const mockProfile: ProfileData = {
    nombres: 'IVAN ELISEO',
    apellidos: 'HERNANDEZ MAURICIO',
    dui: '012345678-9',
    fechaNacimiento: '11/11/2007',
    telefono: '+503 7405 9926',
    correo: 'ivancitoLab@gmail.com',
    afp: 'Confia',
    isss: '011214121',
    direccion: 'Poligono T - Casa #12 - Mejicanos - San Salvador',
    rol: 'ADMINISTRADOR',
    panel: 'Panel Central',
};

// ─── Sub-componente: fila de dato ──────────────────────────────────────────────
const DataField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            {label}
        </span>
        <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
);

// ─── Sub-componente: encabezado de sección ────────────────────────────────────
const SectionHeader = ({
    icon: Icon,
    title,
    onEdit,
}: {
    icon: React.ElementType;
    title: string;
    onEdit?: () => void;
}) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-md">
                <Icon size={16} className="text-blue-500" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">{title}</span>
        </div>
        {onEdit && (
            <button
                onClick={onEdit}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
            >
                Editar
            </button>
        )}
    </div>
);

// ─── Componente principal ──────────────────────────────────────────────────────
export const ProfilePage = () => {
    const [profile] = useState<ProfileData>(mockProfile);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <motion.div
            className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* ── Banner de perfil ─────────────────────────────────────────── */}
            <motion.div
                variants={itemVariants}
                className="relative bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl overflow-hidden"
            >
                {/* Decoraciones de fondo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-10 right-20 w-32 h-32 bg-white/5 rounded-full" />
                    <div className="absolute top-4 right-1/3 w-20 h-20 bg-white/5 rounded-full" />
                </div>

                <div className="relative z-10 flex items-center gap-6 p-6 md:p-8">
                    {/* Avatar grande */}
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30">
                            <Avatar className="w-16 h-16 md:w-20 md:h-20">
                                <AvatarFallback className="bg-white/30 text-white font-bold text-2xl md:text-3xl rounded-2xl">
                                    {profile.nombres.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Info del usuario */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                            {profile.nombres} {profile.apellidos}
                        </h1>
                        <p className="text-blue-100 text-sm mt-1">
                            {profile.rol} &bull; {profile.panel}
                        </p>
                    </div>

                    {/* Botón editar perfil */}
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-shrink-0 hidden sm:block"
                    >
                        <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold text-sm gap-2 shadow-sm">
                            <Pencil size={14} />
                            Editar Perfil
                        </Button>
                    </motion.div>
                </div>

                {/* Botón editar perfil (mobile) */}
                <div className="sm:hidden px-6 pb-5">
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold text-sm gap-2">
                        <Pencil size={14} />
                        Editar Perfil
                    </Button>
                </div>
            </motion.div>

            {/* ── Grid de tarjetas ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Datos Personales */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardContent className="pt-5">
                            <SectionHeader
                                icon={User}
                                title="Datos Personales"
                                onEdit={() => console.log('Editar datos personales')}
                            />
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <DataField label="Nombres" value={profile.nombres} />
                                <DataField label="Apellidos" value={profile.apellidos} />
                                <DataField label="N-Identificación (DUI)" value={profile.dui} />
                                <DataField label="Fecha de Nacimiento" value={profile.fechaNacimiento} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contactos */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardContent className="pt-5">
                            <SectionHeader
                                icon={Phone}
                                title="Contactos"
                                onEdit={() => console.log('Editar contactos')}
                            />
                            <div className="space-y-4">
                                {/* Teléfono */}
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                                        <Phone size={14} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            Teléfono
                                        </p>
                                        <p className="text-sm font-medium text-gray-800">{profile.telefono}</p>
                                    </div>
                                </div>
                                {/* Correo */}
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                                        <Mail size={14} className="text-blue-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            Correo Electrónico
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 break-all">{profile.correo}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Afiliaciones */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                    <Card>
                        <CardContent className="pt-5">
                            <SectionHeader
                                icon={Building2}
                                title="Afiliaciones e Información Adicional"
                                onEdit={() => console.log('Editar afiliaciones')}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        AFP Afiliado
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                                        <span className="text-sm font-medium text-gray-800">{profile.afp}</span>
                                    </div>
                                </div>
                                <DataField label="ISSS" value={profile.isss} />
                                <DataField label="Dirección de Casa" value={profile.direccion} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};