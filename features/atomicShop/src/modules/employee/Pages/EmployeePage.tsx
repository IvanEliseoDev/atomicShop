import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SlidersHorizontal,
  MoreVertical,
} from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MOCK_EMPLOYEES } from '../Mock/Employee.mock';
import { useFilterEmployee } from '../hooks/useFilterEmployee';
import { HeaderAdmin } from '@/components/custom/header/HeaderAdmin';
import { CustomPaginationPage } from '@/components/custom/pagination/CustomPaginationPage';

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

export const EmployeePage = () => {

  // Table state
  const { searchQuery, setSearchQuery } = useFilterEmployee()
  const [viewFilter, setViewFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Activo');
  const [nationalityFilter, setNationalityFilter] = useState('Salvadoreño');
  const [positionFilter, setPositionFilter] = useState('Ventas');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Filter and paginate employees
  const filteredEmployees = MOCK_EMPLOYEES.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

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
          <HeaderAdmin title='Empleados' amount={MOCK_EMPLOYEES.length} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Card>
              <CardContent className="pt-5 space-y-4">

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Filtros:</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:ml-4">
                    <Select value={viewFilter} onValueChange={setViewFilter}>
                      <SelectTrigger className="border-2 border-gray-300 w-full sm:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Ver: Todos</SelectItem>
                        <SelectItem value="Activos">Ver: Activos</SelectItem>
                      </SelectContent>
                    </Select>
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
                    </Select>
                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger className="border-2 border-gray-300 w-full sm:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ventas">Cargo: Ventas</SelectItem>
                        <SelectItem value="Desarrollo">Cargo: Desarrollo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* ── Tabla ────────────────────────────────────────── */}
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-500 text-white">
                        <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Lista de empleado</th>
                        <th className="text-left font-semibold px-4 py-3">Correo electrónico</th>
                        <th className="text-center font-semibold px-4 py-3">Cargo</th>
                        <th className="text-center font-semibold px-4 py-3">Numero Telefonico</th>
                        <th className="text-center font-semibold px-4 py-3">Fecha de Nacimiento</th>
                        <th className="text-center font-semibold px-4 py-3">Estado</th>
                        <th className="text-center font-semibold px-4 py-3 rounded-tr-lg">Acciones</th>
                      </tr>
                    </thead>
                    <motion.tbody
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      key={`${currentPage}-${statusFilter}-${nationalityFilter}`}
                    >
                      {paginatedEmployees.map((employee, index) => (
                        <motion.tr
                          key={employee.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            } hover:bg-blue-50 transition-colors`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={employee.avatar} alt={employee.name} />
                                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{employee.name}</p>
                                <p className="text-gray-500 text-xs">{employee.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <a href={`mailto:${employee.email}`} className="text-blue-600 text-sm hover:underline">
                              {employee.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{employee.position}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{employee.phone}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{employee.birthDate}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getStatusDotColor(employee.status) }}
                              />
                              <span className="text-sm text-gray-700 font-medium">{employee.status}</span>
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
                </CardContent>
                </Card>
                </motion.div>
           

                {/* Pagination */}
                <CustomPaginationPage  itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}/> 
              </motion.div>
            </div>
          </motion.main>
          );
}
