import { useState } from "react";
import { MOCK_SALES } from "../mock/mockSale";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CustomPaginationPage } from "@/components/custom/pagination/CustomPaginationPage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeaderAdmin } from "@/components/custom/header/HeaderAdmin";
import { MOCK_PROVIDERS } from "@/modules/provider/mock/mockProvider";
import { MoreVertical, OctagonX, SlidersHorizontal } from "lucide-react";

export const SalePage = () => {
    const [searchQuery, setsearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil(MOCK_SALES.length / itemsPerPage);
    const [statusFilter, setStatusFilter] = useState('Ninguno')
    const [documentFilter, setDocumentFIlter] = useState('Comercial')
    const [dateFilter, setDateFilter] = useState('Default')

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

    const filteredSales = MOCK_SALES.filter((sale) =>
        sale.id.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        sale.cliente.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )

    const paginatedSales = filteredSales.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <motion.main
            className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 md:p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto space-y-8">

                <motion.div variants={{ itemVariants }} className="space-y-6">
                    {/* Header & Search */}
                    <HeaderAdmin title='Ventas' amount={MOCK_SALES.length} searchQuery={searchQuery} setSearchQuery={setsearchQuery} />

                    {/*Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                    >
                        <Card>
                            <CardContent className="pt-5 space-y-4">

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
                                                <SelectItem value="Ninguno">Estado: Ninguno</SelectItem>
                                                <SelectItem value="Cancelado">Estado: Cancelado</SelectItem>
                                                <SelectItem value="Pendiente">Estado: Pendiente de pago</SelectItem>
                                                <SelectItem value="Vencido">Estado: Vencido</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={documentFilter} onValueChange={setDocumentFIlter}>
                                            <SelectTrigger className="border-2 border-gray-300 w-full sm:w-50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Comercial">Tipo Factura: Comercial</SelectItem>
                                                <SelectItem value="Credito Fiscal">Tipo Factura: Credito Fiscal</SelectItem>
                                                <SelectItem value="Todas">Tipo Factura: Todas</SelectItem>
                                            </SelectContent>
                                        </Select>


                                        <Select value={dateFilter} onValueChange={setDateFilter}>
                                            <SelectTrigger className="border-2 border-gray-300 w-full sm:w-50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Default">Fecha: dd-mm-yyyy</SelectItem>

                                            </SelectContent>
                                        </Select>


                                    </div>
                                </div>


                                {/*Sales Table */}
                                <div className="overflow-x-auto rounded-lg border border-gray-100">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-blue-500 text-white">
                                                <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Lista de Ventas</th>
                                                <th className="text-left font-semibold px-4 py-3">Cliente</th>
                                                <th className="text-left font-semibold px-4 py-3">Venta Total</th>
                                                <th className="text-center font-semibold px-4 py-3">Metodo de Pago</th>
                                                <th className="text-center font-semibold px-4 py-3">Fecha</th>
                                                <th className="text-center font-semibold px-4 py-3">Hora</th>
                                                <th className="text-center font-semibold px-4 py-3">Tipo de Documento</th>
                                                <th className="text-center font-semibold px-4 py-3">Estado</th>
                                                <th className="text-center font-semibold px-4 py-3 rounded-tr-lg">Acciones</th>
                                            </tr>
                                        </thead>
                                        <motion.tbody
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            key={`${currentPage}-${statusFilter}-${documentFilter}`}
                                        >
                                            {
                                                (paginatedSales.length <= 0) && <span className="text-2xl font-bold"> <OctagonX />Sin Ventas Registadas</span>
                                            }

                                            {
                                                paginatedSales.map((sale, index) => (
                                                    <motion.tr
                                                        key={sale.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                            } hover:bg-blue-50 transition-colors`}
                                                    >
                                                        <td className="px-6 py-4 text-sm text-gray-700">{sale.id}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-800">{sale.cliente}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{sale.ventaTotal}</td>
                                                        <td className="px-6 py-4 text-center text-sm text-gray-700">{sale.metodoPago}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{sale.fecha}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{sale.hora}</td>
                                                        <td className="px-6 py-4 text-center text-sm text-gray-700">{sale.tipoDocumento}</td>
                                                        <td className="px-6 py-4 text-center text-sm text-gray-700">{sale.estado}</td>

                                                        <td className="px-6 py-4">
                                                            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                                <MoreVertical className="w-5 h-5 text-gray-500" />
                                                            </button>
                                                        </td>

                                                    </motion.tr>
                                                ))
                                            }

                                        </motion.tbody>
                                    </table>
                                </div>

                            </CardContent>
                        </Card>
                    </motion.div>


                    {/*Custom Pagination */}
                    <CustomPaginationPage itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                </motion.div>
            </div>
        </motion.main>
    )
}
