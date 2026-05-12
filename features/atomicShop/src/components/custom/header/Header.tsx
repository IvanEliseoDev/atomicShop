import React from 'react';      
import { useNavigate } from 'react-router';         // ← agrega esto
import { Menu, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/auth/store/auth.store';

interface HeaderProps {
    onMobileMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuClick }) => {
    const navigate = useNavigate();
    const {logOut} = useAuthStore()
    return (
        <header className="bg-white max-h-15 px-6 py-4 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
                onClick={onMobileMenuClick}
                className="md:hidden text-gray-600 hover:text-gray-900 transition"
            >
                <Menu size={24} />
            </button>

            {/* Right side - User dropdown */}
            <div className="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition">
                            <Avatar className="w-8 h-8 bg-blue-400">
                                <AvatarFallback className="bg-blue-400 text-white font-bold text-sm">I</AvatarFallback>
                            </Avatar>
                            <ChevronDown size={16} className="text-gray-600" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => navigate('/atomicAdmin/profile')}> {/* ← agrega onClick */}
                            Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={logOut}>
                            Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
