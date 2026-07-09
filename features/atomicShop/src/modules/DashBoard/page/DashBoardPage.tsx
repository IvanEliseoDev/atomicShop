import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Package, Users, ShoppingBag, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';
import { useGetProducts } from '@/modules/Products/hooks/useGetProducts';
import { useGetAllCustomers } from '@/modules/clients/hooks/useGetAllCustomers';
import { useGetInvoices } from '@/modules/sale/hooks/useGetInvoices';

const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    isLoading,
}: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    trend: 'up' | 'down' | 'neutral';
    isLoading: boolean;
}) => {
    const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
    const bgColor = trend === 'up' ? 'bg-green-50' : trend === 'down' ? 'bg-red-50' : 'bg-gray-50';

    return (
        <Card className="hover:shadow-lg transition">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon size={24} className="text-blue-600" />
                    </div>
                    {trend !== 'neutral' && (
                        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${bgColor}`}>
                            <TrendIcon size={14} className={trendColor} />
                            <span className={trendColor}>En línea</span>
                        </div>
                    )}
                </div>
                {isLoading ? (
                    <Skeleton className="h-9 w-20 mb-1" />
                ) : (
                    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                )}
                <div className="text-sm text-gray-600">{title}</div>
            </CardContent>
        </Card>
    );
};

const chartData = [
    { height: 60 }, { height: 40 }, { height: 75 },
    { height: 50 }, { height: 85 }, { height: 65 }, { height: 45 },
];

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { name } = useAuthStore();

    const { data: productsData, isLoading: loadingProducts } = useGetProducts();
    const { data: customersData, isLoading: loadingCustomers } = useGetAllCustomers();
    const { data: invoicesData, isLoading: loadingInvoices } = useGetInvoices();

    const products = productsData?.data ?? [];
    const customers = customersData?.data ?? [];
    const invoices = invoicesData?.data ?? [];

    const totalSales = invoices.filter(inv => inv.state).length;
    const totalRevenue = invoices
        .filter(inv => inv.paymentStatus === 'pagado')
        .reduce((sum, inv) => sum + (inv.total ?? 0), 0);

    const topProducts = products.slice(0, 3).map((p, i) => ({
        rank: i + 1,
        title: p.name,
        code: p.code ?? '—',
        stock: p.stock ?? 0,
    }));

    const displayName = name ? name.split(' ')[0] : 'Bienvenido';

    return (
        <motion.main>
            <div className="p-6 md:p-8 space-y-6">
                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white overflow-hidden"
                >
                    <div className="absolute right-4 top-4 opacity-10">
                        <div className="text-6xl">🧪</div>
                    </div>
                    <div className="absolute right-30 top-10 opacity-10">
                        <div className="text-6xl">💊</div>
                    </div>
                    <div className="absolute right-20 bottom-4 opacity-10">
                        <div className="text-6xl">💉</div>
                    </div>

                    <div className="relative z-10 max-w-lg">
                        <h1 className="text-4xl font-bold mb-2 uppercase">
                            Bienvenido, {displayName}
                        </h1>
                        <p className="text-blue-100 mb-6">
                            Administra, gestiona y vende todo desde un mismo lugar.
                            <br />
                            Tu centro de control en <span className="font-semibold">AtomicShop</span>.
                        </p>
                    </div>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Resumen general</h2>
                                <p className="text-sm text-gray-500">Datos en tiempo real</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <StatCard
                                    title="Productos en inventario"
                                    value={products.length}
                                    icon={Package}
                                    trend="up"
                                    isLoading={loadingProducts}
                                />
                                <StatCard
                                    title="Clientes registrados"
                                    value={customers.length}
                                    icon={Users}
                                    trend="up"
                                    isLoading={loadingCustomers}
                                />
                                <StatCard
                                    title="Facturas activas"
                                    value={totalSales}
                                    icon={FileText}
                                    trend={totalSales > 0 ? 'up' : 'neutral'}
                                    isLoading={loadingInvoices}
                                />
                                <StatCard
                                    title="Total facturado (pagado)"
                                    value={`$${totalRevenue.toFixed(2)}`}
                                    icon={ShoppingBag}
                                    trend={totalRevenue > 0 ? 'up' : 'neutral'}
                                    isLoading={loadingInvoices}
                                />
                            </div>
                        </motion.div>

                        {/* Top Products */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Productos en inventario</h2>
                                <button
                                    onClick={() => navigate('/atomicAdmin/inventario')}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                                >
                                    Ver todos
                                </button>
                            </div>

                            <div className="space-y-3">
                                {loadingProducts ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <Card key={i}>
                                            <CardContent className="pt-4">
                                                <Skeleton className="h-12 w-full" />
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : topProducts.length === 0 ? (
                                    <Card>
                                        <CardContent className="pt-4 text-center text-gray-500 text-sm py-8">
                                            No hay productos registrados aún.
                                        </CardContent>
                                    </Card>
                                ) : (
                                    topProducts.map((product) => (
                                        <motion.div
                                            key={product.rank}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.25 + product.rank * 0.05 }}
                                        >
                                            <Card className="hover:shadow-md transition">
                                                <CardContent className="pt-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                                            <span className="font-bold text-blue-600 text-lg">{product.rank}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                                                                {product.title}
                                                            </h3>
                                                            <p className="text-xs text-gray-500">
                                                                Código: {product.code} &bull; Stock: {product.stock}
                                                            </p>
                                                        </div>
                                                        <div className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column — Ventas */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="h-full hover:shadow-lg transition">
                            <CardHeader className="pb-4">
                                <h2 className="text-xl font-bold text-gray-900">Resumen de ventas</h2>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        TOTAL DE FACTURAS
                                    </div>
                                    {loadingInvoices ? (
                                        <Skeleton className="h-9 w-20 mx-auto" />
                                    ) : (
                                        <div className="text-3xl font-bold text-blue-600">{invoices.length}</div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        FACTURAS PAGADAS
                                    </div>
                                    {loadingInvoices ? (
                                        <Skeleton className="h-9 w-20 mx-auto" />
                                    ) : (
                                        <div className="text-3xl font-bold text-green-600">
                                            {invoices.filter(i => i.paymentStatus === 'pagado').length}
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        FACTURAS PENDIENTES
                                    </div>
                                    {loadingInvoices ? (
                                        <Skeleton className="h-9 w-20 mx-auto" />
                                    ) : (
                                        <div className="text-3xl font-bold text-yellow-500">
                                            {invoices.filter(i => i.paymentStatus === 'pendiente').length}
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        INGRESOS TOTALES
                                    </div>
                                    {loadingInvoices ? (
                                        <Skeleton className="h-9 w-24 mx-auto" />
                                    ) : (
                                        <div className="text-2xl font-bold text-gray-900">
                                            ${totalRevenue.toFixed(2)}
                                        </div>
                                    )}
                                </div>

                                {/* Mini bar chart decorativo */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-end justify-center gap-1 h-20">
                                        {chartData.map((data, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${data.height * 0.8}px` }}
                                                transition={{ duration: 0.5, delay: 0.4 + idx * 0.05 }}
                                                className="flex-1 bg-blue-200 rounded-t-sm"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 text-center mt-2">Actividad reciente</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.main>
    );
};
