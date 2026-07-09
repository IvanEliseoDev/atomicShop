import { HeaderAdmin } from "@/components/custom/header/HeaderAdmin";
import { motion } from "framer-motion";
import { Lock, MoreVertical, Pencil, SlidersHorizontal, Trash2, Unlock } from "lucide-react";
import { useState } from "react";
import { CustomPaginationPage } from '../../../components/custom/pagination/CustomPaginationPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation, useNavigate } from "react-router";
import { useGetAllCustomers } from "../hooks/useGetAllCustomers";
import { containerVariants } from "@/utils/variants/containerVariants";
import { CustomNotRegister } from "@/components/custom/span/CustomNotRegister";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCustomer } from "../hooks/useDeleteCustomer";
import { useRestrictCustomer } from "../hooks/useRestrictCustomer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import Swal from "sweetalert2";

const STATE_COLORS: Record<string, string> = {
    frecuente: '#1C7F23',
    restringido: '#EF6D6D',
    comun: '#57A4E1',
};

const STATE_LABEL: Record<string, string> = {
    frecuente: 'Frecuente',
    restringido: 'Restringido',
    comun: 'Común',
};

const getInitials = (nombre: string) =>
    nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

export const ClientPage = () => {
    const [querySearch, setQuerySearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('Todos');
    const navigate = useNavigate();
    const location = useLocation();

    const { data, isLoading, isError } = useGetAllCustomers();
    const { mutateAsync: deleteCustomerMutation, isPending: isDeleting } = useDeleteCustomer();
    const { mutateAsync: restrictCustomerMutation, isPending: isRestricting } = useRestrictCustomer();


    const customers = data?.data ?? [];

    const filteredClients = customers.filter((client) => {
        const matchesSearch = client.name.toLowerCase().includes(querySearch.toLowerCase()) ||
            client.mail.toLowerCase().includes(querySearch.toLowerCase());
        const matchesStatus = statusFilter === 'Todos' || client.state.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage) || 1;
    const paginatedClient = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (id: string, name: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar cliente?',
            html: `Esta acción eliminará a <b>${name}</b> de forma permanente y no podrá revertirse.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            focusCancel: true,
        });

        if (!result.isConfirmed) return;

        try {
            await deleteCustomerMutation(id);
        } catch {
            // toast already shown in hook
        }
    };

    const handleRestrict = async (id: string, name: string, currentState: string) => {
        const isCurrentlyRestricted = currentState.toLowerCase() === 'restringido';
        const icon = isCurrentlyRestricted ? 'question' : 'warning';
        const confirmColor = isCurrentlyRestricted ? '#22c55e' : '#f97316';
        const confirmText = isCurrentlyRestricted ? 'Sí, habilitar' : 'Sí, restringir';

        const result = await Swal.fire({
            title: `¿${isCurrentlyRestricted ? 'Habilitar' : 'Restringir'} cliente?`,
            html: isCurrentlyRestricted
                ? `Se habilitará la cuenta de <b>${name}</b> y podrá acceder al sistema.`
                : `Se restringirá la cuenta de <b>${name}</b>. No podrá iniciar sesión hasta que sea habilitado.`,
            icon,
            showCancelButton: true,
            confirmButtonColor: confirmColor,
            cancelButtonColor: '#6b7280',
            confirmButtonText: confirmText,
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) return;

        try {
            await restrictCustomerMutation({
                id,
                state: isCurrentlyRestricted ? 'comun' : 'restringido',
            });
        } catch {
            // toast already shown in hook
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-linear-to-br from-blue-50 to-slate-50 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Skeleton className="h-12 w-full" />
                    <Card>
                        <CardContent className="pt-5">
                            <div className="overflow-x-auto rounded-lg border border-gray-100">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-blue-500">
                                            {Array.from({ length: 6 }).map((_, i) => (
                                                <th key={i} className="px-4 py-3">
                                                    <Skeleton className="h-4 w-full bg-blue-400" />
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                {Array.from({ length: 6 }).map((_, j) => (
                                                    <td key={j} className="px-4 py-4">
                                                        <Skeleton className="h-4 w-full" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-red-500 font-medium">Error al cargar los clientes. Intenta recargar la página.</p>
            </div>
        );
    }

    return (
        <motion.main
            className="w-full min-h-screen bg-linear-to-br from-blue-50 to-slate-50 p-4 md:p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="space-y-6">
                    <HeaderAdmin
                        title="Clientes"
                        amount={customers.length}
                        searchQuery={querySearch}
                        setSearchQuery={setQuerySearch}
                    />

                    {/* Filtros */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-600">Filtros:</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:ml-4">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="border-2 border-gray-300 w-full sm:w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todos">Estado: Todos</SelectItem>
                                    <SelectItem value="comun">Estado: Común</SelectItem>
                                    <SelectItem value="frecuente">Estado: Frecuente</SelectItem>
                                    <SelectItem value="restringido">Estado: Restringido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tabla */}
                    <Card>
                        <CardContent className="pt-5">
                            <div className="overflow-x-auto rounded-lg border border-gray-100">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-blue-500 text-white">
                                            <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Cliente</th>
                                            <th className="text-center font-semibold px-4 py-3">Teléfono</th>
                                            <th className="text-center font-semibold px-4 py-3">Correo</th>
                                            <th className="text-center font-semibold px-4 py-3">Estado</th>
                                            <th className="text-center font-semibold px-4 py-3 rounded-tr-lg">Acciones</th>
                                        </tr>
                                    </thead>
                                    <motion.tbody
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        key={`${currentPage}-${statusFilter}`}
                                    >
                                        {paginatedClient.length === 0 ? (
                                            <CustomNotRegister title="Clientes" />
                                        ) : (
                                            paginatedClient.map((client, index) => (
                                                <motion.tr
                                                    key={client._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                                                <span className="text-xs font-bold text-blue-600">
                                                                    {getInitials(client.name)}
                                                                </span>
                                                            </div>
                                                            <p className="font-medium text-gray-800 truncate max-w-48">{client.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-center text-gray-700">{client.telephone || '—'}</td>
                                                    <td className="px-4 py-4 text-sm text-center text-gray-700">{client.mail}</td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div
                                                                className="w-2 h-2 rounded-full shrink-0"
                                                                style={{ backgroundColor: STATE_COLORS[client.state?.toLowerCase()] ?? '#57A4E1' }}
                                                            />
                                                            <span className="text-sm text-gray-700 font-medium">
                                                                {STATE_LABEL[client.state?.toLowerCase()] ?? client.state}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none">
                                                                    <MoreVertical className="w-5 h-5 text-gray-500" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-100 shadow-md rounded-lg p-1">
                                                                <DropdownMenuLabel className="text-xs text-gray-500 px-2 py-1">Acciones</DropdownMenuLabel>

                                                                <DropdownMenuItem
                                                                    onClick={() => navigate(`${location.pathname}/nuevo?action=update&_id=${client._id}`)}
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-amber-50"
                                                                >
                                                                    <Pencil className="h-4 w-4 text-amber-500" />
                                                                    Editar
                                                                </DropdownMenuItem>

                                                                <DropdownMenuSeparator />

                                                                {client.state?.toLowerCase() === 'restringido' ? (
                                                                    <DropdownMenuItem
                                                                        disabled={isRestricting}
                                                                        onClick={() => handleRestrict(client._id, client.name, client.state)}
                                                                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer text-green-600 hover:bg-green-50 focus:bg-green-50"
                                                                    >
                                                                        <Unlock className="h-4 w-4" />
                                                                        Habilitar cuenta
                                                                    </DropdownMenuItem>
                                                                ) : (
                                                                    <DropdownMenuItem
                                                                        disabled={isRestricting}
                                                                        onClick={() => handleRestrict(client._id, client.name, client.state)}
                                                                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer text-orange-600 hover:bg-orange-50 focus:bg-orange-50"
                                                                    >
                                                                        <Lock className="h-4 w-4" />
                                                                        Restringir cuenta
                                                                    </DropdownMenuItem>
                                                                )}

                                                                <DropdownMenuSeparator />

                                                                <DropdownMenuItem
                                                                    disabled={isDeleting}
                                                                    onClick={() => handleDelete(client._id, client.name)}
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    Eliminar cliente
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </motion.tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <CustomPaginationPage
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </motion.main>
    );
};
