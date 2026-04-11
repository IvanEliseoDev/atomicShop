import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type EstadoProducto = 'Frecuente' | 'Común' | 'Restringido';

interface Producto {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
    marca: string;
    cantidad: number;
    precio: number;
    estado: EstadoProducto;
    imagen?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockProductos: Producto[] = [
    { id: '1', codigo: 'COD-001', nombre: 'Balanza analítica', categoria: 'Equipo de medicion Masa', marca: 'Sonar', cantidad: 100, precio: 10.50, estado: 'Frecuente' },
    { id: '2', codigo: 'COD-002', nombre: 'Balanza para Determinación de Humedad (90g) MB92-110V', categoria: 'Equipo de medicion Masa', marca: 'LB-KKA', cantidad: 0, precio: 12.50, estado: 'Restringido' },
    { id: '3', codigo: 'COD-003', nombre: 'Balanza de precision touch 620g / 0.01g cal. externa', categoria: 'Equipo de medicion Masa', marca: 'LB-KKA', cantidad: 100, precio: 15.50, estado: 'Frecuente' },
    { id: '4', codigo: 'COD-004', nombre: 'Pipeta volumetrica 15ml - Ceslab', categoria: 'Equipo de medicion Volumen', marca: 'LB-KKA', cantidad: 100, precio: 19.50, estado: 'Común' },
    { id: '5', codigo: 'COD-005', nombre: 'Pipeta volumétrica de vidrio 10 mL Clase A – Luzeren', categoria: 'Equipo de medicion Volumen', marca: 'LB-KKA', cantidad: 100, precio: 22.50, estado: 'Común' },
    { id: '6', codigo: 'COD-006', nombre: 'Calibración de Termómetro Digital o Bimetálico por Comparación Directa', categoria: 'Equipo de medicion Temperatura', marca: 'LB-KKA', cantidad: 200, precio: 1.50, estado: 'Común' },
    { id: '7', codigo: 'COD-007', nombre: 'Medidor portátil de turbidez con registro', categoria: 'Equipo de medicion en Química y Física', marca: 'LB-KKA', cantidad: 0, precio: 10.50, estado: 'Restringido' },
    { id: '8', codigo: 'COD-008', nombre: 'Microscopio binocular 1000x con iluminación LED', categoria: 'Equipo de medicion en Química y Física', marca: 'Sonar', cantidad: 45, precio: 89.00, estado: 'Frecuente' },
    { id: '9', codigo: 'COD-009', nombre: 'Bureta de vidrio 50ml graduación 0.1ml', categoria: 'Equipo de medicion Volumen', marca: 'LB-KKA', cantidad: 75, precio: 8.75, estado: 'Común' },
    { id: '10', codigo: 'COD-010', nombre: 'Termómetro digital de inmersión -50 a 300°C', categoria: 'Equipo de medicion Temperatura', marca: 'Sonar', cantidad: 30, precio: 34.00, estado: 'Frecuente' },
];

// ─── Config de estado (color del punto) ───────────────────────────────────────
const estadoConfig: Record<EstadoProducto, { color: string; bg: string; text: string }> = {
    Frecuente:   { color: 'bg-green-500',  bg: 'bg-green-50',  text: 'text-green-700' },
    Común:       { color: 'bg-blue-400',   bg: 'bg-blue-50',   text: 'text-blue-700' },
    Restringido: { color: 'bg-red-500',    bg: 'bg-red-50',    text: 'text-red-700' },
};

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