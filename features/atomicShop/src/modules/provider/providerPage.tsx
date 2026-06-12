import { HeaderAdmin } from '@/components/custom/header/HeaderAdmin';
import { CustomPaginationPage } from '@/components/custom/pagination/CustomPaginationPage';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion'
import { MoreVertical, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { containerVariants } from '@/utils/variants/containerVariants';
import { itemVariants } from '@/utils/variants/itemVariants';
import { useGetProviders } from '@/hooks/useGetProviders';
import type { Providers } from './interface/provider.response';

const getStatusDotColor = (status: string) => {
    switch (status) {
        case 'Activo':
            return '#10b981';
        case 'Inabilitado':
            return '#ef4444';
        case 'Inactivo':
            return '#9ca3af';
        default:
            return '#9ca3af';
    }
};

export const ProviderPage = () => {

    const {data:providerResponse} = useGetProviders()

    const [searchQuery, setsearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil((providerResponse?.length ?? 0) / itemsPerPage );
    const [statusFilter, setStatusFilter] = useState('Activo')
    const [nationalityFilter, setNationalityFilter] = useState('Salvadoreño')
    const [performanceArea, setPerformanceArea] = useState('Ventas')
    const navigate = useNavigate()

    

    const filteredProviders = providerResponse?.filter((provider) => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        provider.telephone.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const paginatedProvider = filteredProviders?.slice(
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
                    <HeaderAdmin title='Proveedores' amount={providerResponse?.length ?? 0} searchQuery={searchQuery} setSearchQuery={setsearchQuery} onAddClick={() => navigate('/atomicAdmin/proveedores/nuevo')} />

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
                                                <SelectItem value="Activo">Estado: Activo</SelectItem>
                                                <SelectItem value="Inactivo">Estado: Inactivo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
                                            <SelectTrigger className="border-2 border-gray-300 w-full sm:w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Salvadoreño">Nacionalidad: Salvadoreño</SelectItem>
                                                <SelectItem value="Peruano">Nacionalidad: Peruano</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={performanceArea} onValueChange={setPerformanceArea}>
                                            <SelectTrigger className="border-2 border-gray-300 w-full sm:w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ventas">Area: Ventas</SelectItem>
                                                <SelectItem value="Logistica">Area: Logistica</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>


                                {/*Provider Table */}
                                <div className="overflow-x-auto rounded-lg border border-gray-100">
                                    <table className="w-full text-sm">
                                        <thead>
                                                <tr className="bg-blue-500 text-white">
                                                <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Lista de Proveedores</th>
                                                <th className="text-left font-semibold px-4 py-3">Correo electrónico</th>
                                                <th className="text-left font-semibold px-4 py-3">Identificacion Fiscal</th>
                                                <th className="text-center font-semibold px-4 py-3">Numero Telefonico</th>
                                                <th className="text-center font-semibold px-4 py-3">Representante</th>
                                                <th className="text-center font-semibold px-4 py-3">Nacionalidad</th>
                                                <th className="text-center font-semibold px-4 py-3 rounded-tr-lg">Acciones</th>
                                            </tr>
                                        </thead>
                                        <motion.tbody
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            key={`${currentPage}-${statusFilter}-${nationalityFilter}-${performanceArea}`}
                                        >
                                            {paginatedProvider?.map((provider, index) => (
                                                <motion.tr
                                                    key={provider._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                        } hover:bg-blue-50 transition-colors`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-15 h-15 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                                <img src={provider.imgProvider[0]} alt={`${provider.name} logo`} className='object-cover w-14 h-14' />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 text-sm">{provider.name}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <a href={`mailto:${provider.mail}`} className="text-blue-600 text-sm hover:underline">
                                                            {provider.mail}
                                                        </a>
                                                    </td>

           
                                                    <td className="px-6 py-4 text-sm text-gray-700">{provider._id}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{provider.telephone}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{provider._id}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{provider.direction}</td>


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
