import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ShoppingBag } from 'lucide-react';
import { statsData, topProducts, chartData } from '../mocks/DashboardMocks';

export const DashboardPage = () => {
    return (
        <motion.main>
            <div className="p-6 md:p-8 space-y-6">
                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white overflow-hidden"
                >
                    {/* Decorative elements */}
                    <div className="absolute right-4 top-4 opacity-10">
                        <div className="text-6xl">🧪</div>
                    </div>
                    <div className="absolute right-30 top-10 opacity-10">
                        <div className="text-6xl">💊</div>
                    </div>
                    <div className="absolute right-20 bottom-4 opacity-10">
                        <div className="text-6xl"> 💉 </div>
                    </div>

                    <div className="relative z-10 max-w-lg">
                        <h1 className="text-4xl font-bold mb-2">BIENVENIDO, Ivan</h1>
                        <p className="text-blue-100 mb-6">
                            Administra, gestiona, vende, todo desde un mismo lugar.
                            <br />
                            Tu centro de control en <span className="font-semibold">atomicShopAdministration</span>.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2">
                                NUEVA VENTA
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Main Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats and Products */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Datos Generales */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Datos generales</h2>
                                <p className="text-sm text-gray-500">últimos 30 días</p>
                            </div>

                            {/* Stats Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                {statsData.map((stat, idx) => {
                                    const Icon = stat.icon;
                                    const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
                                    const trendColor = stat.trend === 'up' ? 'text-green-500' : 'text-red-500';
                                    const bgColor = stat.trend === 'up' ? 'bg-green-50' : 'bg-red-50';

                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
                                        >
                                            <Card className="hover:shadow-lg transition">
                                                <CardContent className="pt-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <Icon size={24} className="text-blue-600" />
                                                        </div>
                                                        <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded ${bgColor}`}>
                                                            <TrendIcon size={16} className={trendColor} />
                                                            <span className={trendColor}>{stat.percentage}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                                        {stat.value}
                                                    </div>
                                                    <div className="text-sm text-gray-600">{stat.title}</div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Total de Compras Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                <Card className="hover:shadow-lg transition">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm text-gray-600 mb-2">Total de compras</div>
                                                <div className="text-4xl font-bold text-gray-900">0</div>
                                            </div>
                                            <div className="p-3 bg-yellow-100 rounded-lg">
                                                <ShoppingBag size={32} className="text-yellow-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Productos Más Vendidos */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Productos más vendidos</h2>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                                    Ver todos
                                </button>
                            </div>

                            <div className="space-y-3">
                                {topProducts.map((product, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.25 + idx * 0.05 }}
                                    >
                                        <Card className="hover:shadow-md transition">
                                            <CardContent className="pt-4">
                                                <div className="flex items-center gap-4">
                                                    {/* Rank Badge */}
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <span className="font-bold text-blue-600 text-lg">{product.rank}</span>
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                                            {product.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-600">
                                                            Total de ventas: {product.sales} &nbsp; Total de reseñas: {product.orders}
                                                        </p>
                                                    </div>

                                                    {/* Status Dot */}
                                                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Sales Data */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="h-full hover:shadow-lg transition">
                            <CardHeader className="pb-4">
                                <h2 className="text-xl font-bold text-gray-900">Datos de ventas</h2>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Sales Stats */}
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        VENTAS DE LA SEMANA
                                    </div>
                                    <div className="text-3xl font-bold text-blue-600">1000</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        COMPRAS DE LA SEMANA
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">1000</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        TOTAL DE PEDIDOS
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">1000</div>
                                </div>

                                {/* Mini Bar Chart */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-end justify-center gap-1 h-32">
                                        {chartData.map((data, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${data.height}px` }}
                                                transition={{ duration: 0.5, delay: 0.4 + idx * 0.05 }}
                                                className="flex-1 bg-blue-200 rounded-t-lg"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.main>
    );
}
