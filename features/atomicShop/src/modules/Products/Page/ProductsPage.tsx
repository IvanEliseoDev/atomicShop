import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useGetProducts } from '../hooks/useGetProducts';

// ─── Iniciales para el avatar del producto ────────────────────────────────────
const getInitials = (nombre: string) =>
    nombre ? nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '';

const ITEMS_POR_PAGINA = 10;

// ─── Componente principal ──────────────────────────────────────────────────────
export const ProductsPage = () => {
    const [search, setSearch] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
    const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
    const navigate = useNavigate();

    // Obtener datos de la API (asumimos que responde con { data: [...] })
    const { data: products, isLoading } = useGetProducts();
    const listaProductos = products?.data || [];

    // Categorías únicas basadas en los productos REALES de la API
    const categorias = useMemo(() => {
        const cats = listaProductos.map(p => p.categoryId).filter(Boolean);
        return ['Todas', ...Array.from(new Set(cats))];
    }, [listaProductos]);

    const estados = ['Todos', 'Frecuente', 'Común', 'Restringido'];

    // ─── Filtrado Seguro (Memorizado para mejor rendimiento) ───────────────────
    const productosFiltrados = useMemo(() => {
        return listaProductos.filter(p => {
            // Busqueda por texto
            const coincideBusqueda =
                p.name?.toLowerCase().includes(search.toLowerCase()) ||
                p.code?.toLowerCase().includes(search.toLowerCase()) ||
                p.categoryId?.toLowerCase().includes(search.toLowerCase());

            // Filtro por Categoría
            const coincideCategoria = 
                filtroCategoria === 'Todas' || p.categoryId === filtroCategoria;

            // Filtro por Estado (Nota: Ajusta 'p.status' según los campos de tu API)
            const coincideEstado = 
                filtroEstado === 'Todos' || p.state === filtroEstado;

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
                                <SlidersHorizontal size={15} className="text-gray-400 flex-shrink-0" />
                                
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
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer max-w-[180px] truncate"
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
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-gray-400">
                                                Cargando productos...
                                            </td>
                                        </tr>
                                    ) : productosPagina.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-gray-400">
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
                                                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-xs font-bold text-blue-600">
                                                                {getInitials(product.name)}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-800 truncate max-w-[200px]">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-gray-400">{product.code}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Categoría */}
                                                <td className="px-4 py-3 text-gray-600 max-w-[140px]">
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

                                                {/* Acciones */}
                                                <td className="px-4 py-3 text-center">
                                                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700">
                                                        <MoreVertical size={16} />
                                                    </button>
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