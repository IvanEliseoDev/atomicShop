import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SlidersHorizontal, MoreVertical, Pencil, Lock, Unlock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetEmployees } from '../hooks/useGetEmployees';
import { useFilterEmployee } from '../hooks/useFilterEmployee';
import { useRestrictEmployee } from '../hooks/useRestrictEmployee';
import { HeaderAdmin } from '@/components/custom/header/HeaderAdmin';
import { CustomPaginationPage } from '@/components/custom/pagination/CustomPaginationPage';
import { CustomNotRegister } from '@/components/custom/span/CustomNotRegister';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const POSITION_LABEL: Record<string, string> = {
  Admin: 'Administrador',
  Empleado: 'Empleado',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const EmployeePage = () => {
  const { searchQuery, setSearchQuery } = useFilterEmployee();
  const [positionFilter, setPositionFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  const { data: employeesResponse, isLoading } = useGetEmployees();
  const { mutateAsync: restrictEmployee, isPending: isRestricting } = useRestrictEmployee();

  const employees = employeesResponse?.data ?? [];

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPosition =
      positionFilter === 'Todos' || emp.position === positionFilter;

    const matchesStatus =
      statusFilter === 'Todos' ||
      (statusFilter === 'Activo' && emp.isVerified) ||
      (statusFilter === 'Inactivo' && !emp.isVerified);

    return matchesSearch && matchesPosition && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleToggleStatus = async (id: string, name: string, isActive: boolean) => {
    const result = await Swal.fire({
      title: isActive ? '¿Restringir empleado?' : '¿Habilitar empleado?',
      html: isActive
        ? `Se deshabilitará la cuenta de <b>${name}</b>. No podrá iniciar sesión.`
        : `Se habilitará la cuenta de <b>${name}</b> y podrá iniciar sesión nuevamente.`,
      icon: isActive ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isActive ? '#f97316' : '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: isActive ? 'Sí, restringir' : 'Sí, habilitar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await restrictEmployee(id);
    } catch {
      // toast already shown in hook
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-blue-50 to-slate-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-500">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <th key={i} className="px-4 py-3">
                          <Skeleton className="h-4 w-full bg-blue-400" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Array.from({ length: 7 }).map((_, j) => (
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
            title="Empleados"
            amount={employees.length}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddClick={() => navigate('/atomicAdmin/empleados/nuevo')}
          />

          {/* Filtros */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Filtros:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:ml-4">
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="border-2 border-gray-300 w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Cargo: Todos</SelectItem>
                  <SelectItem value="Admin">Cargo: Administrador</SelectItem>
                  <SelectItem value="Empleado">Cargo: Empleado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-2 border-gray-300 w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Estado: Todos</SelectItem>
                  <SelectItem value="Activo">Estado: Activo</SelectItem>
                  <SelectItem value="Inactivo">Estado: Restringido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Card>
              <CardContent className="pt-5 space-y-4">
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-500 text-white">
                        <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Empleado</th>
                        <th className="text-left font-semibold px-4 py-3">Correo</th>
                        <th className="text-center font-semibold px-4 py-3">Teléfono</th>
                        <th className="text-center font-semibold px-4 py-3">Cargo</th>
                        <th className="text-center font-semibold px-4 py-3">Ingreso</th>
                        <th className="text-center font-semibold px-4 py-3">Estado</th>
                        <th className="text-center font-semibold px-4 py-3 rounded-tr-lg">Acciones</th>
                      </tr>
                    </thead>
                    <motion.tbody
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      key={`${currentPage}-${statusFilter}-${positionFilter}`}
                    >
                      {paginated.length === 0 ? (
                        <CustomNotRegister title="Empleados" />
                      ) : (
                        paginated.map((employee, index) => (
                          <motion.tr
                            key={employee._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                          >
                            {/* Nombre */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-9 h-9">
                                  <AvatarFallback className="text-xs font-bold">
                                    {employee.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">{employee.name}</p>
                                  <p className="text-gray-400 text-xs">{POSITION_LABEL[employee.position] ?? employee.position}</p>
                                </div>
                              </div>
                            </td>

                            {/* Correo */}
                            <td className="px-4 py-4">
                              <a href={`mailto:${employee.email}`} className="text-blue-600 text-sm hover:underline">
                                {employee.email}
                              </a>
                            </td>

                            {/* Teléfono */}
                            <td className="px-4 py-4 text-center text-sm text-gray-700">
                              {employee.number_phone || '—'}
                            </td>

                            {/* Cargo */}
                            <td className="px-4 py-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                employee.position === 'Admin'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {POSITION_LABEL[employee.position] ?? employee.position}
                              </span>
                            </td>

                            {/* Fecha ingreso */}
                            <td className="px-4 py-4 text-center text-sm text-gray-700">
                              {employee.payroll_month || '—'}
                            </td>

                            {/* Estado */}
                            <td className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: employee.isVerified ? '#10b981' : '#ef4444' }}
                                />
                                <span className="text-sm text-gray-700 font-medium">
                                  {employee.isVerified ? 'Activo' : 'Restringido'}
                                </span>
                              </div>
                            </td>

                            {/* Acciones */}
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
                                    onClick={() => navigate(`/atomicAdmin/empleados/nuevo?mode=edit&id=${employee._id}`)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-blue-50"
                                  >
                                    <Pencil className="h-4 w-4 text-blue-500" />
                                    Editar
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  {employee.isVerified ? (
                                    <DropdownMenuItem
                                      disabled={isRestricting}
                                      onClick={() => handleToggleStatus(employee._id, employee.name, true)}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer text-orange-600 hover:bg-orange-50 focus:bg-orange-50"
                                    >
                                      <Lock className="h-4 w-4" />
                                      Restringir cuenta
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      disabled={isRestricting}
                                      onClick={() => handleToggleStatus(employee._id, employee.name, false)}
                                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer text-green-600 hover:bg-green-50 focus:bg-green-50"
                                    >
                                      <Unlock className="h-4 w-4" />
                                      Habilitar cuenta
                                    </DropdownMenuItem>
                                  )}
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
          </motion.div>

          <CustomPaginationPage
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </motion.main>
  );
};
