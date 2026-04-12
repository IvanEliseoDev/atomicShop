import { useState } from 'react';
import { motion} from 'framer-motion';
import {
  Search,
  Plus,
  SlidersHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MOCK_EMPLOYEES } from '../Mock/Employee.mock';

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
  const [searchQuery, setSearchQuery] = useState('');
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
        {/* Section B: Employee List */}
        <motion.div variants={{itemVariants}} className="space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Empleados</h2>
              <p className="text-gray-500 text-sm mt-1">
                Administra y visualiza la informacion de los empleados
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 w-full sm:w-56"
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 w-full sm:w-auto">
                  <Plus className="w-5 h-5" />
                  Agregar
                </Button>
              </motion.div>
            </div>
          </div>

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
                <SelectContent>
                  <SelectItem value="Salvadoreño">Nacionalidad: Salvadoreño</SelectItem>
                  <SelectItem value="Peruano">Nacionalidad: Peruano</SelectItem>
                </SelectContent>
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

          {/* Data Table */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-6 py-4 text-left text-sm font-bold">Lista de empleado</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Correo electrónico</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Nacionalidad</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Cargo</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">
                      Documento de Identificación
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Teléfono Personal</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Fecha de Nacimiento</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.nationality}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.position}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.document}</td>
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
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm font-medium">Mostrar más</span>
              <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(parseInt(val))}>
                <SelectTrigger className="border-2 border-gray-300 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (pageNum > totalPages) return null;
                return (
                  <motion.div key={pageNum} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={pageNum === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={
                        pageNum === currentPage ? 'bg-blue-500 text-white border-0' : ''
                      }
                    >
                      {pageNum}
                    </Button>
                  </motion.div>
                );
              })}

              {totalPages > 5 && <span className="text-gray-400">...</span>}

              {totalPages > 5 && (
                <Button variant="outline" size="sm" disabled>
                  {totalPages}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
