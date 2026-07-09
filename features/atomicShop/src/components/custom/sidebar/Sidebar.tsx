import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Home, BarChart3, Users, UserCheck, FileText } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';

interface SidebarProps {
    onMobileClose?: () => void;
    isMobileOpen?: boolean;
}

const menuItems = [
    {
        section: 'Principal',
        items: [
            { label: 'Inicio',     icon: Home,      path: '/atomicAdmin',            adminOnly: false },
            { label: 'Ventas',     icon: FileText,  path: '/atomicAdmin/ventas',     adminOnly: false },
            { label: 'Inventario', icon: BarChart3, path: '/atomicAdmin/inventario', adminOnly: false },
        ],
    },
    {
        section: 'Usuarios',
        adminOnly: true,
        items: [
            { label: 'Empleados', icon: Users,     path: '/atomicAdmin/empleados', adminOnly: true },
            { label: 'Clientes',  icon: UserCheck, path: '/atomicAdmin/clientes',  adminOnly: true },
        ],
    },
];

const UserBadge = ({ name, position, collapsed }: { name: string | null; position: string | null; collapsed: boolean }) => {
    const initials = name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?';
    const positionLabel = position === 'Admin' ? 'Administrador' : position === 'Empleado' ? 'Empleado' : position;
    if (collapsed) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mx-4 mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3"
        >
            <Avatar className="w-10 h-10 bg-blue-400">
                <AvatarFallback className="bg-blue-400 text-white font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{name ?? '—'}</div>
                <div className="text-xs text-gray-600 truncate capitalize">{positionLabel ?? '—'}</div>
            </div>
        </motion.div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ onMobileClose, isMobileOpen = false }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isAdmin, name, position } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const filteredMenu = menuItems
        .filter(section => !section.adminOnly || isAdmin)
        .map(section => ({
            ...section,
            items: section.items.filter(item => !item.adminOnly || isAdmin),
        }));

    const NavItem = ({ item, collapsed, onClickExtra }: { item: typeof menuItems[0]['items'][0]; collapsed: boolean; onClickExtra?: () => void }) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
            <motion.button
                whileHover={{ x: collapsed ? 0 : 4 }}
                onClick={() => { navigate(item.path); onClickExtra?.(); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition relative group ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                {isActive && (
                    <motion.div
                        layoutId="active-indicator"
                        className="absolute right-3 w-2 h-2 bg-blue-500 rounded-full"
                    />
                )}
            </motion.button>
        );
    };

    return (
        <>
            {/* ── Desktop Sidebar ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hidden md:flex flex-col bg-white border-r border-gray-200/15 h-screen overflow-y-auto"
                style={{ width: isCollapsed ? '80px' : '250px' }}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200/20">
                    {!isCollapsed && (
                        <div className='flex flex-row justify-center items-center'>
                            <button onClick={() => navigate("/atomicAdmin")} className='cursor-pointer'>
                                <img src="/logoatomicshop_blanco.png" alt="logoAtomicShop" className='w-15 h-15 object-cover' />
                            </button>
                            <p className='text-sm font-bold'>AtomicShop</p>
                        </div>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-gray-600 hover:text-gray-900 transition"
                    >
                        <ChevronLeft
                            size={20}
                            style={{
                                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s',
                            }}
                        />
                    </motion.button>
                </div>

                <UserBadge name={name} position={position} collapsed={isCollapsed} />

                <nav className="flex-1 px-3 py-6">
                    {filteredMenu.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="mb-6">
                            {!isCollapsed && (
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">
                                    {section.section}
                                </div>
                            )}
                            <div className="space-y-2">
                                {section.items.map((item, itemIdx) => (
                                    <NavItem key={itemIdx} item={item} collapsed={isCollapsed} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </motion.div>

            {/* ── Mobile Sidebar ──────────────────────────────────── */}
            {isMobileOpen && (
                <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-40 md:hidden"
                >
                    <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
                    <div className="absolute left-0 top-0 h-full w-64 bg-white overflow-y-auto">
                        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onMobileClose}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <ChevronLeft size={20} />
                            </motion.button>
                        </div>

                        <div className="mx-4 mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
                            <Avatar className="w-10 h-10 bg-blue-400">
                                <AvatarFallback className="bg-blue-400 text-white font-bold">
                                    {name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">{name ?? '—'}</div>
                                <div className="text-xs text-gray-600 truncate capitalize">
                                    {position === 'Admin' ? 'Administrador' : position === 'Empleado' ? 'Empleado' : position ?? '—'}
                                </div>
                            </div>
                        </div>

                        <nav className="px-3 py-6">
                            {filteredMenu.map((section, sectionIdx) => (
                                <div key={sectionIdx} className="mb-6">
                                    <div className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">
                                        {section.section}
                                    </div>
                                    <div className="space-y-2">
                                        {section.items.map((item, itemIdx) => (
                                            <NavItem key={itemIdx} item={item} collapsed={false} onClickExtra={onMobileClose} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </div>
                </motion.div>
            )}
        </>
    );
};
