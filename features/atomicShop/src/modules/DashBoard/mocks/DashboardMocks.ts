import { Package, ShoppingCart, Truck, Users } from "lucide-react";

// Stat Cards Data
export const statsData = [
    {
        title: 'Productos',
        value: '4',
        icon: Package,
        percentage: 12,
        trend: 'up',
    },
    {
        title: 'Clientes',
        value: '2',
        icon: Users,
        percentage: 5,
        trend: 'up',
    },
    {
        title: 'Proveedores',
        value: '0',
        icon: Truck,
        percentage: 0,
        trend: 'down',
    },
    {
        title: 'Ventas',
        value: '1',
        icon: ShoppingCart,
        percentage: 2,
        trend: 'down',
    },
];

// Top Products Data
export const topProducts = [
    {
        rank: 1,
        title: 'Bascula para cajas petri',
        sales: 1000,
        orders: 20,
    },
    {
        rank: 2,
        title: 'Bascula para cajas petri',
        sales: 1000,
        orders: 20,
    },
    {
        rank: 3,
        title: 'Bascula para cajas petri',
        sales: 1000,
        orders: 20,
    },
];

// Sales Chart Data
export const chartData = [
    { height: 60 },
    { height: 40 },
    { height: 75 },
    { height: 50 },
    { height: 85 },
    { height: 65 },
    { height: 45 },
];