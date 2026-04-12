import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockProductos } from '../mock/product.mock';
import { estadoConfig } from '../mock/stateConfig.mock';

// ─── Iniciales para el avatar del producto ────────────────────────────────────
const getInitials = (nombre: string) =>
    nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

const ITEMS_POR_PAGINA = 10;

// ─── Componente principal ──────────────────────────────────────────────────────
export const ProductsPage = () => {
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
    const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');

    // Categorías únicas para el filtro
    const categorias = ['Todas', ...Array.from(new Set(mockProductos.map(p => p.categoria)))];
    const estados = ['Todos', 'Frecuente', 'Común', 'Restringido'];

    // Filtrado
    const productosFiltrados = mockProductos.filter(p => {
        const coincideBusqueda =
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.marca.toLowerCase().includes(busqueda.toLowerCase());
        const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
        const coincideCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
        return coincideBusqueda && coincideEstado && coincideCategoria;
    });

    // Paginación
    const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA);
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const productosPagina = productosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);

    const cambiarPagina = (nueva: number) => {
        if (nueva >= 1 && nueva <= totalPaginas) setPaginaActual(nueva);
    };

    // Animaciones
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

            {/*heADERcOMPONENT */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{mockProductos.length} productos registrados</p>
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold gap-2 shadow-sm" >
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
                                    value={busqueda}
                                    onChange={e => { setBusqueda(e.target.value); setPaginaActual(1); }}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition"
                                />
                            </div>

                            {/* Filtro Estado */}
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={15} className="text-gray-400 flex-shrink-0" />
                                <select
                                    value={filtroEstado}
                                    onChange={e => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer"
                                >
                                    {estados.map(e => <option key={e}>{e}</option>)}
                                </select>

                                {/* Filtro Categoría */}
                                <select
                                    value={filtroCategoria}
                                    onChange={e => { setFiltroCategoria(e.target.value); setPaginaActual(1); }}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer max-w-[180px] truncate"
                                >
                                    {categorias.map(c => <option key={c}>{c}</option>)}
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
                                    key={`${paginaActual}-${busqueda}-${filtroEstado}-${filtroCategoria}`}
                                >
                                    {productosPagina.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-12 text-gray-400">
                                                No se encontraron productos
                                            </td>
                                        </tr>
                                    ) : (
                                        productosPagina.map((producto, idx) => {
                                            const cfg = estadoConfig[producto.estado];
                                            return (
                                                <motion.tr
                                                    key={producto.id}
                                                    variants={rowVariants}
                                                    className={`border-b border-gray-50 hover:bg-blue-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                                >
                                                    {/* Nombre + código + avatar */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-xs font-bold text-blue-600">
                                                                    {getInitials(producto.nombre)}
                                                                </span>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-medium text-gray-800 truncate max-w-[200px]">
                                                                    {producto.nombre}
                                                                </p>
                                                                <p className="text-xs text-gray-400">{producto.codigo}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Categoría */}
                                                    <td className="px-4 py-3 text-gray-600 max-w-[140px]">
                                                        <span className="truncate block">{producto.categoria}</span>
                                                    </td>

                                                    {/* Marca */}
                                                    <td className="px-4 py-3 text-gray-600">{producto.marca}</td>

                                                    {/* Cantidad */}
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`font-semibold ${producto.cantidad === 0 ? 'text-red-500' : 'text-gray-800'}`}>
                                                            {producto.cantidad}
                                                        </span>
                                                    </td>

                                                    {/* Precio */}
                                                    <td className="px-4 py-3 text-center font-medium text-gray-800">
                                                        ${producto.precio.toFixed(2)}
                                                    </td>

                                                    {/* Estado */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.color}`} />
                                                            <span className={`text-xs font-medium ${cfg.text}`}>
                                                                {producto.estado}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Acciones */}
                                                    <td className="px-4 py-3 text-center">
                                                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700">
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
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