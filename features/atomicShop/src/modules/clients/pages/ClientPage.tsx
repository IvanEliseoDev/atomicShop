import { HeaderAdmin } from "@/components/custom/header/HeaderAdmin";
import { motion } from "framer-motion"
import { Eye, Lock, MoreVertical, Pencil, SlidersHorizontal, Trash2, Unlock } from "lucide-react";
import { useState } from "react";
import { CustomPaginationPage } from '../../../components/custom/pagination/CustomPaginationPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation, useNavigate } from "react-router";
import { useGetAllCustomers } from "../hooks/useGetAllCustomers";
import { containerVariants } from "@/utils/variants/containerVariants";
import { itemVariants } from "@/utils/variants/itemVariants";
import { CustomNotRegister } from "@/components/custom/span/CustomNotRegister";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDeleteCustomer } from "../hooks/useDeleteCustomer";
const getStatusDotColor = (status: string) => {
    switch (status) {
        case 'frecuente':
            return '#1C7F23';
        case 'restringido':
            return '#EF6D6D';
        case 'comun':
            return '#57A4E1';
        default:
            return '#57A4E1';
    }
};
export const ClientPage = () => {
    const [querySearch, setquerySearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('comun')
    const [typeClientFilter, settypeClientFilter] = useState('Natural')
    const navigate = useNavigate()
    const location  = useLocation()

    // 1. Llamada correcta al hook en el nivel superior
    const { data, isLoading, isError } = useGetAllCustomers();
    const { mutate: deleteCustomerMutation } = useDeleteCustomer();

    // 2. Extraer los datos de la respuesta (ajusta según tu interfaz CustomerResponse)
    const customers = data?.data || [];
    

    const totalPages = Math.ceil(customers.length / itemsPerPage);

    const filteredClients = customers.filter((client, index) => {
        const concidenceNameCustomer = client.name.toLowerCase().includes(querySearch.toLowerCase())
        const concidenceStatus = statusFilter === "comun" || client.state === statusFilter
        return concidenceNameCustomer && concidenceStatus
    })

    const paginatedClient = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const getInitials = (nombre: string) =>
        nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();


    const handleDelete = (id: string) => {
        if (!id) return toast.error("Error al intentar eliminar el cliente, no se envió ningún ID");

        // Opcional: Añadir confirmación nativa o un modal
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");

        if (confirmed) {
            deleteCustomerMutation(id);
        }
    };
    // Manejo de estados de carga
    if (isLoading) return <div>Cargando clientes...</div>;
    if (isError) return <div>Error al cargar datos.</div>;

    return (
        <motion.main
            className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 md:p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div variants={{ itemVariants }} className="space-y-6">

                    {/*Custom Header */}
                    <HeaderAdmin title="Clientes" amount={customers.length} searchQuery={querySearch} setSearchQuery={setquerySearch} onAddClick={() => navigate('/atomicAdmin/clientes/nuevo')} />

                    {/*Filters */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-600">Filtros:</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:ml-4">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="border-2 border-gray-300 w-full sm:w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="comun">Estado: Comun</SelectItem>
                                    <SelectItem value="restringido">Estado: Restringido</SelectItem>
                                    <SelectItem value="frecuente">Estado: Frecuente</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeClientFilter} onValueChange={settypeClientFilter}>
                                <SelectTrigger className="border-2 border-gray-300 w-full sm:w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mayorista">Tipo: Mayorista</SelectItem>
                                    <SelectItem value="Proveedor">Tipo: Proveedor</SelectItem>
                                    <SelectItem value="Natural">Tipo: Natural</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/*ClientsTable */}
                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-blue-500 text-white">
                                    <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Lista de Clientes</th>
                                    <th className="text-center font-semibold px-4 py-3">Numero Telefonico</th>
                                    <th className="text-center font-semibold px-4 py-3">Correo Electronico</th>
                                    <th className="text-center font-semibold px-4 py-3">Tipo de Cliente</th>
                                    <th className="text-center font-semibold px-4 py-3">Estado</th>
                                    <th className="text-center font-semibold px-4 py-3 rounded-tr-lg">Acciones</th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                key={`${currentPage}-${statusFilter}-${typeClientFilter}`}
                            >
                                {
                                    (paginatedClient.length <= 0) && (
                                        <CustomNotRegister title="Clientes" />
                                    )
                                }
                                {paginatedClient.map((client, index) => (
                                    <motion.tr
                                        key={client._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            } hover:bg-blue-50 transition-colors`}
                                    >

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-bold text-blue-600">
                                                        {getInitials(client.name)}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-800 truncate max-w-[200px]">
                                                        {client.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-center text-gray-700">{client.telephone}</td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-700">{client.mail}</td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-700">{client.typeCustomer}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: getStatusDotColor(client.state.toLowerCase()) }}
                                                />
                                                <span className="text-sm text-gray-700 font-medium">{client.state}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none">
                                                        <MoreVertical className="w-5 h-5 text-gray-500" />
                                                    </button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                                                    <DropdownMenuItem onClick={() => {
                                                        navigate(`${location.pathname}/nuevo?action=view&_id=${client._id}`)
                                                    }}>
                                                        <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                                        <span>Ver detalles</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem onClick={() =>  navigate(`${location.pathname}/nuevo?action=update&_id=${client._id}`)}>
                                                        <Pencil className="mr-2 h-4 w-4 text-amber-500" />
                                                        <span>Editar</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />

                                                    {/* Lógica Condicional de Restricción */}
                                                    {client.state.toLowerCase() === "restringido" ? (
                                                        <DropdownMenuItem
                                                            className="text-green-600 focus:text-green-700"
                                                            onClick={() => console.log("Quitar restricción", client._id)}
                                                        >
                                                            <Unlock className="mr-2 h-4 w-4" />
                                                            <span>Habilitar</span>
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            className="text-orange-600 focus:text-orange-700"
                                                            onClick={() => console.log('restirngido')}
                                                        >
                                                            <Lock className="mr-2 h-4 w-4" />
                                                            <span>Restringir</span>
                                                        </DropdownMenuItem>
                                                    )}

                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-700"
                                                        onClick={() => handleDelete(client._id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Eliminar</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </motion.tr>
                                ))}
                            </motion.tbody>
                        </table>
                    </div>
                    <CustomPaginationPage currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />
                </motion.div>
            </div>
        </motion.main>
    )
}
