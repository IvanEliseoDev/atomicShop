import { useState } from 'react';
import { MOCK_SHOPPING } from '../mock/mockShopping';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HeaderAdmin } from '@/components/custom/header/HeaderAdmin';
import { MOCK_SALES } from '@/modules/sale/mock/mockSale';
import { MoreVertical, SlidersHorizontal } from 'lucide-react';
import { CustomPaginationPage } from '@/components/custom/pagination/CustomPaginationPage';
import { CustomNotRegister } from '@/components/custom/span/CustomNotRegister';

export const ShoppingPage = () => {

  const [searchQuery, setsearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(MOCK_SHOPPING.length / itemsPerPage);
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [originFilter, setOriginFilter] = useState('Todos')

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

  const filteredSales = MOCK_SHOPPING.filter((sale) => {
    const concidenceProvider = sale.proveedor.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
    const concidenceStatus = statusFilter === "Todos" || sale.estado === statusFilter
    const concidenceOrigin = originFilter === "Todos" || sale.origen === originFilter
    return concidenceProvider && concidenceStatus && concidenceOrigin
  })

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
          <HeaderAdmin title='Compras' amount={MOCK_SALES.length} searchQuery={searchQuery} setSearchQuery={setsearchQuery} />

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
                        <SelectItem value="Todos">Estado: Todos</SelectItem>
                        <SelectItem value="Pendiente de pago">Estado: Pendiente de pago</SelectItem>
                        <SelectItem value="Cancelado">Estado: Cancelado</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={originFilter} onValueChange={setOriginFilter}>
                      <SelectTrigger className="border-2 border-gray-300 w-full sm:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Origen: Todos</SelectItem>
                        <SelectItem value="Extranjero">Origen: Extranjero</SelectItem>
                        <SelectItem value="Local">Origen: Local</SelectItem>
                      </SelectContent>
                    </Select>

                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-500 text-white">
                        <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Lista de Compras</th>
                        <th className="text-left font-semibold px-4 py-3">Proveedor</th>
                        <th className="text-center font-semibold px-4 py-3">Fecha</th>
                        <th className="text-center font-semibold px-4 py-3">Origen</th>
                        <th className="text-center font-semibold px-4 py-3">Costos Adicionales</th>
                        <th className="text-left  font-bold px-4 py-3">Compra Total</th>
                        <th className="text-center font-semibold px-4 py-3">Estado</th>
                        <th className="text-center font-semibold px-4 py-3 rounded-tr-lg">Acciones</th>
                      </tr>
                    </thead>
                    <motion.tbody
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      key={`${currentPage}-${statusFilter}-${originFilter}`}
                    >
                      {
                        (paginatedSales.length <= 0) && (
                          <CustomNotRegister title="Compras" />
                        )
                      }
                      {
                        paginatedSales.map((sale, index) => (
                          <motion.tr
                            key={sale.nroPedido}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              } hover:bg-blue-50 transition-colors`}
                          >
                            <td className="px-6 py-4 text-sm text-gray-700">{sale.nroPedido}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{sale.proveedor}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{sale.fecha}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{sale.origen}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{sale.costosAdicionales}</td>
                            <td className="px-6 py-4 text-center text-sm text-gray-700">{sale.compraTotal}</td>
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
