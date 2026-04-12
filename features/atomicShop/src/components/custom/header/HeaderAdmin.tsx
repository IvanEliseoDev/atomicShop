import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Plus, Search } from "lucide-react"

interface PageHeaderProps {
    title: string;
    amount: number;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    onAddClick?: () => void; // Prop para la acción del botón
    labelAdd?: string;       // Por si quieres que diga algo distinto a "Agregar"
}

export const HeaderAdmin = ({ title, amount, searchQuery, setSearchQuery }: PageHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {(amount <= 0 || !amount) ? <p className="text-sm text-gray-500 mt-0.5">No hay ningun registro</p>
                    : <p className="text-sm text-gray-500 mt-0.5">{amount} {title.toLowerCase()} registrados</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Buscar"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 w-full sm:w-56"
                    />
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 w-full sm:w-auto">
                        <Plus className="w-5 h-5" />
                        Agregar
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}
