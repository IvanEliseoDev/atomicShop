import { HeaderAdmin } from "@/components/custom/header/HeaderAdmin";
import { motion } from "framer-motion"
import { MoreVertical, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { CustomPaginationPage } from '../../../components/custom/pagination/CustomPaginationPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MOCK_CLIENTS = [
    {
        _id: 1,
        name: "Ivan Eliseo Hernandez Mauricio",
        numberPhone: "+503 7118-1201",
        email: "20212192@gmail.com",
        typeClient: "Normal",
        status: "Comun"
    },
    {
        _id: 2,
        name: "Oscar Abel Joyar Lopez",
        numberPhone: "+503 7118-1201",
        email: "20212192@gmail.com",
        typeClient: "Mayorista",
        status: "Restringido"
    },
    {
        _id: 3,
        name: "Camila Granados Tovar Menjivar",
        numberPhone: "+503 7118-1201",
        email: "Rodas123@gmail.com",
        typeClient: "Comun",
        status: "Frecuente"
    }
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
};

const getStatusDotColor = (status: string) => {
    switch (status) {
        case 'Frecuente':
            return '#1C7F23';
        case 'Restringido':
            return '#EF6D6D';
        case 'Comun':
            return '#57A4E1';
        default:
            return '#57A4E1';
    }
};

export const ClientPage = () => {
    const [querySearch, setquerySearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil(MOCK_CLIENTS.length / itemsPerPage);
    const [statusFilter, setStatusFilter] = useState('Comun')
    const [typeClientFilter, settypeClientFilter] = useState('Natural')

    const filteredClients = MOCK_CLIENTS.filter((client, index) =>
        client.status.toLowerCase().includes(querySearch.toLowerCase()) ||
        client.name.toLowerCase().includes(querySearch.toLowerCase())
    )

    const paginatedClient = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const getInitials = (nombre: string) =>
        nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();


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
                    <HeaderAdmin title="Clientes" amount={MOCK_CLIENTS.length} searchQuery={querySearch} setSearchQuery={setquerySearch} />

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
                                    <SelectItem value="Comun">Estado: Comun</SelectItem>
                                    <SelectItem value="Restringido">Estado: Restringido</SelectItem>
                                    <SelectItem value="Frecuente">Estado: Frecuente</SelectItem>
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
                                {(paginatedClient.length <= 0) && <span className="flex items-center justify-center text-3xl"> No Hay</span>}

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

                                        <td className="px-6 py-4 text-sm text-center text-gray-700">{client.numberPhone}</td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-700">{client.email}</td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-700">{client.typeClient}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: getStatusDotColor(client.status) }}
                                                />
                                                <span className="text-sm text-gray-700 font-medium">{client.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                <MoreVertical className="w-5 h-5 text-gray-500" />
                                            </button>
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
