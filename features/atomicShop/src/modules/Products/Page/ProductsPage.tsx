import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, SlidersHorizontal, Edit2, Trash2, Power, PowerOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useGetProducts } from '../hooks/useGetProducts';
import { useProductMutations } from '../hooks/useProductMutations';
// Importaciones de Shadcn UI para el Dropdown
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Iniciales para el avatar del producto ────────────────────────────────────
const getInitials = (nombre: string) =>
    nombre ? nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '';

const ITEMS_POR_PAGINA = 10;

// ─── Componente principal ──────────────────────────────────────────────────────
export const ProductsPage = () => {
    const [search, setSearch] = useState('');
    const { deleteProduct, isDeleting, toggleProduct, isToggling } = useProductMutations();
    const [paginaActual, setPaginaActual] = useState(1);
    const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
    const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
    const navigate = useNavigate();

    const handleEliminar = async (id: string, nombre: string) => {
        const result = await Swal.fire({
            title: '¿Eliminar producto?',
            html: `Esta acción eliminará <b>${nombre}</b> del inventario de forma permanente.`,
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
            await deleteProduct(id);
            toast.success('Producto eliminado correctamente');
        } catch {
            toast.error('Hubo un error al eliminar el producto');
        }
    };

    const handleToggleEstado = async (id: string, nombre: string, activo: boolean) => {
        const accion = activo ? 'desactivar' : 'activar';
        const result = await Swal.fire({
            title: `¿${activo ? 'Desactivar' : 'Activar'} producto?`,
            html: `Se ${accion}á <b>${nombre}</b> en la tienda.`,
            icon: activo ? 'warning' : 'question',
            showCancelButton: true,
            confirmButtonColor: activo ? '#ef4444' : '#22c55e',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Sí, ${accion}`,
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;
        try {
            await toggleProduct(id);
            toast.success(`Producto ${activo ? 'desactivado' : 'activado'} correctamente`);
        } catch {
            toast.error('No se pudo cambiar el estado del producto');
        }
    };
    
    // Obtener datos de la API (asumimos que responde con { data: [...] })
    const { data: products, isLoading } = useGetProducts();
    const listaProductos = products?.data || [];

    // Categorías únicas basadas en los productos REALES de la API
    const categorias = useMemo(() => {
        const cats = listaProductos.map(p => p.categoryId).filter(Boolean);
        return ['Todas', ...Array.from(new Set(cats))];
    }, [listaProductos]);

    const estados = ['Todos', 'Activo', 'Inactivo'];

    // ─── Filtrado Seguro (Memorizado para mejor rendimiento) ───────────────────
    const productosFiltrados = useMemo(() => {
        return listaProductos.filter(p => {
            const coincideBusqueda =
                p.name?.toLowerCase().includes(search.toLowerCase()) ||
                p.code?.toLowerCase().includes(search.toLowerCase()) ||
                p.categoryId?.toLowerCase().includes(search.toLowerCase());

            const coincideCategoria =
                filtroCategoria === 'Todas' || p.categoryId === filtroCategoria;

            const coincideEstado =
                filtroEstado === 'Todos' ||
                (filtroEstado === 'Activo' && p.state === true) ||
                (filtroEstado === 'Inactivo' && p.state === false);

            return coincideBusqueda && coincideCategoria && coincideEstado;
        });
    }, [listaProductos, search, filtroCategoria, filtroEstado]);

    // ─── Paginación Segura ─────────────────────────────────────────────────────
    const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA) || 1;
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const productosPagina = productosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);

    const cambiarPagina = (nueva: number) => {
        if (nueva >= 1 && nueva <= totalPaginas) setPaginaActual(nueva);
    };

    // Ajustar la página actual si el filtro reduce drásticamente los resultados
    if (paginaActual > totalPaginas) {
        setPaginaActual(totalPaginas);
    }

    // Animaciones de Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
    };
    const rowVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className="p-6 md:p-8 space-y-6">

            {/* ── Encabezado ───────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {isLoading ? 'Cargando...' : `${listaProductos.length} productos registrados`}
                    </p>
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold gap-2 shadow-sm" 
                        onClick={() => navigate('/atomicAdmin/inventario/nuevo')}
                    >
                        <Plus size={16} />
                        Agregar
                    </Button>
                </motion.div>
            </motion.div>

            {/* ── Tarjeta principal ────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
            >
                <Card>
                    <CardContent className="pt-5 space-y-4">

                        {/* Barra de búsqueda y filtros */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Búsqueda */}
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, código o marca..."
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setPaginaActual(1); }}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition"
                                />
                            </div>

                            {/* Filtros */}
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={15} className="text-gray-400 shrink-0" />
                                
                                {/* Filtro Estado */}
                                <select
                                    value={filtroEstado}
                                    onChange={e => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer"
                                >
                                    {estados.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>

                                {/* Filtro Categoría */}
                                <select
                                    value={filtroCategoria}
                                    onChange={e => { setFiltroCategoria(e.target.value); setPaginaActual(1); }}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer max-w-45 truncate"
                                >
                                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* ── Tabla ────────────────────────────────────────── */}
                        <div className="overflow-x-auto rounded-lg border border-gray-100">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-blue-500 text-white">
                                        <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Nombre</th>
                                        <th className="text-left font-semibold px-4 py-3">Categoría</th>
                                        <th className="text-left font-semibold px-4 py-3">Marca</th>
                                        <th className="text-center font-semibold px-4 py-3">Cantidad</th>
                                        <th className="text-center font-semibold px-4 py-3">Precio</th>
                                        <th className="text-center font-semibold px-4 py-3">Estado</th>
                                        <th className="text-center font-semibold px-4 py-3 rounded-tr-lg">Acciones</th>
                                    </tr>
                                </thead>
                                <motion.tbody
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    key={`${paginaActual}-${search}-${filtroEstado}-${filtroCategoria}`}
                                >
                                    {isLoading ? (
                                        <>
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                    {Array.from({ length: 7 }).map((_, j) => (
                                                        <td key={j} className="px-4 py-3">
                                                            <Skeleton className="h-4 w-full" />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </>
                                    ) : productosPagina.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-12 text-gray-400">
                                                No se encontraron productos
                                            </td>
                                        </tr>
                                    ) : (
                                        productosPagina.map((product, idx) => (
                                            <motion.tr
                                                key={product._id}
                                                variants={rowVariants}
                                                className={`border-b border-gray-50 hover:bg-blue-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                            >
                                                {/* Nombre + código + avatar */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                                            <span className="text-xs font-bold text-blue-600">
                                                                {getInitials(product.name)}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-800 truncate max-w-50">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-gray-400">{product.code}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Categoría */}
                                                <td className="px-4 py-3 text-gray-600 max-w-35">
                                                    <span className="truncate block">{product.categoryId}</span>
                                                </td>

                                                {/* Marca */}
                                                <td className="px-4 py-3 text-gray-600">{product.brandId || 'N/A'}</td>

                                                {/* Cantidad / Stock */}
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`font-semibold ${product.stock === 0 ? 'text-red-500' : 'text-gray-800'}`}>
                                                        {product.stock ?? 0}
                                                    </span>
                                                </td>

                                                {/* Precio */}
                                                <td className="px-4 py-3 text-center font-medium text-gray-800">
                                                    ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                                                </td>

                                                {/* Estado */}
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.state ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                        {product.state ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>

                                                {/* Acciones con Dropdown */}
                                                <td className="px-4 py-3 text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700 focus:outline-none">
                                                                <MoreVertical size={16} />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40 bg-white border border-gray-100 shadow-md rounded-lg p-1">
                                                            <DropdownMenuItem
                                                                onClick={() => navigate(`/atomicAdmin/inventario/nuevo?mode=edit&id=${product._id}`)}
                                                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                                                            >
                                                                <Edit2 size={14} className="text-gray-400" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleToggleEstado(product._id, product.name, product.state)}
                                                                disabled={isToggling}
                                                                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                                                                    product.state
                                                                        ? 'text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600'
                                                                        : 'text-green-600 hover:bg-green-50 focus:bg-green-50 focus:text-green-600'
                                                                }`}
                                                            >
                                                                {product.state
                                                                    ? <><PowerOff size={14} /> Desactivar</>
                                                                    : <><Power size={14} /> Activar</>
                                                                }
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleEliminar(product._id, product.name)}
                                                                disabled={isDeleting}
                                                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-colors focus:bg-red-50 focus:text-red-600"
                                                            >
                                                                <Trash2 size={14} className="text-red-400" />
                                                                Eliminar
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

                        {/* ── Paginación ───────────────────────────────────── */}
                        {totalPaginas > 1 && (
                            <div className="flex items-center justify-between pt-2">
                                <p className="text-xs text-gray-500">
                                    Mostrando {inicio + 1}–{Math.min(inicio + ITEMS_POR_PAGINA, productosFiltrados.length)} de {productosFiltrados.length}
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => cambiarPagina(paginaActual - 1)}
                                        disabled={paginaActual === 1}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                                        <button
                                            key={num}
                                            onClick={() => cambiarPagina(num)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                                                num === paginaActual
                                                    ? 'bg-blue-500 text-white shadow-sm'
                                                    : 'hover:bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => cambiarPagina(paginaActual + 1)}
                                        disabled={paginaActual === totalPaginas}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};