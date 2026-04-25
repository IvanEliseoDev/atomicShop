import { useState } from "react";
import { MOCK_ORDERS } from "../mock/mockOrder";
import { motion } from "framer-motion";
import { CustomPaginationPage } from "@/components/custom/pagination/CustomPaginationPage";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeaderAdmin } from "@/components/custom/header/HeaderAdmin";
import { MoreVertical, OctagonX, SlidersHorizontal } from "lucide-react";
import { containerVariants } from "@/utils/variants/containerVariants";
import { itemVariants } from "@/utils/variants/itemVariants";
import { CustomNotRegister } from "@/components/custom/span/CustomNotRegister";
import { useNavigate } from "react-router";


export const OrderPage = () => {
    const [searchQuery, setsearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil(MOCK_ORDERS.length / itemsPerPage);
    const [statusFilter, setStatusFilter] = useState('Todos')
    const [typeDeliveryFilter, setTypeDeliveryFilter] = useState('Todos')
    const [typeShippingFilter, settypeShippingFilter] = useState('Todos')
    const navigate = useNavigate()

    const orderFiltered = MOCK_ORDERS.filter((order) => {
        const clientes = order.cliente.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
        const coincideEstado = statusFilter === 'Todos' || order.estado === statusFilter;
        const coincideEnvio = typeShippingFilter === 'Todos' || order.tipoEnvio === typeShippingFilter;

        
        const coincideEntrega = typeDeliveryFilter === 'Todos' || order.tipoEntrega === typeDeliveryFilter;
        return clientes && coincideEstado && coincideEnvio && coincideEntrega
    }
    )

    const paginatedOrders = orderFiltered.slice(
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
                    <HeaderAdmin title='Pedidos' amount={MOCK_ORDERS.length} searchQuery={searchQuery} setSearchQuery={setsearchQuery}onAddClick={() => navigate("/atomicAdmin/pedidos/nuevo")} />

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
                                                <SelectItem value="Todos">Estado:  Todos</SelectItem>
                                                <SelectItem value="En transito">Estado: En Transito</SelectItem>
                                                <SelectItem value="Cancelado">Estado: Cancelado</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={typeDeliveryFilter} onValueChange={setTypeDeliveryFilter}>
                                            <SelectTrigger className="border-2 border-gray-300 w-full sm:w-60">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Todos">Tipo entrega:  Todos</SelectItem>
                                                <SelectItem value="Pago contra entrega">Tipo Entrega: Pago contra entrega</SelectItem>
                                                <SelectItem value="Entrega con firma">Tipo entrega: Entrega con firma</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={typeShippingFilter} onValueChange={settypeShippingFilter}>
                                            <SelectTrigger className="border-2 border-gray-300 w-full sm:w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Todos">Tipo envio :  Todos</SelectItem>
                                                <SelectItem value="Domicilio">Tipo envio : Domicilio</SelectItem>
                                                <SelectItem value="Sucursal">Tipo envio : Retiro en Sucursal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-gray-100">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-blue-500 text-white">
                                                <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Lista de Pedidos</th>
                                                <th className="text-left font-semibold px-4 py-3">Cliente</th>
                                                <th className="text-left  font-bold px-4 py-3">Fecha de Entrega</th>
                                                <th className="text-center font-semibold px-4 py-3">Tipo de envio</th>
                                                <th className="text-center font-semibold px-4 py-3">Tipo de Entrega</th>
                                                <th className="text-center font-semibold px-4 py-3">Monto</th>
                                                <th className="text-center font-semibold px-4 py-3">Estado</th>
                                                <th className="text-center font-semibold px-4 py-3 rounded-tr-lg">Acciones</th>
                                            </tr>
                                        </thead>
                                        <motion.tbody
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            key={`${currentPage}-${statusFilter}-${typeDeliveryFilter}-${typeShippingFilter}`}
                                        >
                                            {
                                                (paginatedOrders.length <= 0) && (
                                                  <CustomNotRegister title="Ordenes"/>
                                                )
                                            }
                                            {
                                                paginatedOrders.map((order, index) => (
                                                    <motion.tr
                                                        key={order.nroOrden}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                            } hover:bg-blue-50 transition-colors`}
                                                    >
                                                        <td className="px-6 py-4 text-sm text-gray-700">{order.nroOrden}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-800">{order.cliente}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{order.fecha}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{order.tipoEnvio}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{order.tipoEntrega}</td>
                                                        <td className="px-6 py-4 text-center text-sm text-gray-700">{order.montoEnvio}</td>
                                                        <td className="px-6 py-4 text-center text-sm text-gray-700">{order.estado}</td>

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
