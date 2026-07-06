import { motion } from 'framer-motion';
import { Phone, Mail, Building2, User, CalendarDays, BadgeCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/auth/store/auth.store';
import { useGetEmployeeByID } from '@/modules/employee/hooks/useGetEmployeeByID';

const POSITION_LABEL: Record<string, string> = {
    Admin: 'Administrador',
    Empleado: 'Empleado',
};

const DataField = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-medium text-gray-800">{value || '—'}</span>
    </div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-50 rounded-md">
            <Icon size={16} className="text-blue-500" />
        </div>
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
    </div>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const ProfilePage = () => {
    const { name, email, position, _id } = useAuthStore();
    const { data: employeeResponse, isLoading } = useGetEmployeeByID(_id ?? '');

    const employee = employeeResponse?.data;
    const initials = name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?';
    const positionLabel = POSITION_LABEL[position ?? ''] ?? position ?? '—';

    if (isLoading) {
        return (
            <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-36 w-full rounded-xl" />
                    <Skeleton className="h-36 w-full rounded-xl" />
                    <Skeleton className="h-28 w-full rounded-xl md:col-span-2" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Banner de perfil */}
            <motion.div
                variants={itemVariants}
                className="relative bg-linear-to-r from-blue-400 to-blue-500 rounded-2xl overflow-hidden"
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-10 right-20 w-32 h-32 bg-white/5 rounded-full" />
                    <div className="absolute top-4 right-1/3 w-20 h-20 bg-white/5 rounded-full" />
                </div>

                <div className="relative z-10 flex items-center gap-6 p-6 md:p-8">
                    <div className="shrink-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30">
                            <Avatar className="w-16 h-16 md:w-20 md:h-20">
                                <AvatarFallback className="bg-white/30 text-white font-bold text-2xl md:text-3xl rounded-2xl">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl md:text-2xl font-bold text-white truncate">{name ?? '—'}</h1>
                        <p className="text-blue-100 text-sm mt-1">
                            {positionLabel} &bull; Panel Administrativo
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                            <BadgeCheck size={14} className={employee?.isVerified ? 'text-green-300' : 'text-gray-300'} />
                            <span className="text-xs text-blue-100">
                                {employee?.isVerified ? 'Cuenta verificada' : 'Cuenta pendiente de verificación'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Información del cargo */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardContent className="pt-5">
                            <SectionHeader icon={User} title="Información del Cargo" />
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <DataField label="Nombre completo" value={name} />
                                <DataField label="Cargo" value={positionLabel} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contacto */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardContent className="pt-5">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                                        <Phone size={14} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Teléfono</p>
                                        <p className="text-sm font-medium text-gray-800">{employee?.number_phone || '—'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                                        <Mail size={14} className="text-blue-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Correo Electrónico</p>
                                        <p className="text-sm font-medium text-gray-800 break-all">{email ?? '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Dirección e información adicional */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                    <Card>
                        <CardContent className="pt-5">
                            <SectionHeader icon={Building2} title="Información Adicional" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                <DataField label="Dirección" value={employee?.direction} />
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                        Estado de cuenta
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${employee?.isVerified ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        <span className="text-sm font-medium text-gray-800">
                                            {employee?.isVerified ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Fecha de ingreso destacada */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                    <Card className="bg-blue-50 border-blue-100">
                        <CardContent className="pt-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <CalendarDays size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider">
                                        Miembro desde
                                    </p>
                                    <p className="text-sm font-semibold text-blue-800">
                                        {employee?.payroll_month ?? '—'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};
