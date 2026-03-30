import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface HeaderProps{

    mockProductos: []
}

export const HeaderComponent = ({mockProductos}:HeaderProps) => {
  return (
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
  )
}
