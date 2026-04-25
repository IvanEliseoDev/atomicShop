import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

// Mock customer data with proper tax credentials
const mockCustomers = [
  {
    id: 1,
    name: 'Ivan Eliseo Hernandez Mauricio',
    nui: 'NUI-12345678',
    nit: 'NIT-98765432',
    giro: 'Comercio al por menor',
    avatar: 'IH',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'Katherine Michelle Torrez Guzman',
    nui: 'NUI-87654321',
    nit: 'NIT-12345678',
    giro: 'Distribución',
    avatar: 'KT',
    color: 'bg-red-500'
  },
  {
    id: 3,
    name: 'Ivan Mario Nolasco Gomez',
    nui: 'NUI-11111111',
    nit: 'NIT-22222222',
    giro: 'Manufactura',
    avatar: 'IN',
    color: 'bg-blue-400'
  },
  {
    id: 4,
    name: 'Fabiola Sofia',
    nui: 'NUI-33333333',
    nit: 'NIT-44444444',
    giro: 'Servicios',
    avatar: 'FS',
    color: 'bg-red-400'
  },
  {
    id: 5,
    name: 'Pepe Edwin Portillo Lopez',
    nui: 'NUI-55555555',
    nit: 'NIT-66666666',
    giro: 'Retail',
    avatar: 'EP',
    color: 'bg-orange-500'
  },
  {
    id: 6,
    name: 'Rodrigo Juan Perez Castillo',
    nui: 'NUI-77777777',
    nit: 'NIT-88888888',
    giro: 'Importación',
    avatar: 'RJ',
    color: 'bg-yellow-500'
  },
  {
    id: 7,
    name: 'Diego David Gomez Gutierrez',
    nui: 'NUI-99999999',
    nit: 'NIT-00000000',
    giro: 'Exportación',
    avatar: 'DG',
    color: 'bg-orange-600'
  }
];

interface CustomerSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: typeof mockCustomers[0]) => void;
}

export function CustomerSearchModal({
  isOpen,
  onClose,
  onSelectCustomer
}: CustomerSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.nui.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.nit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Buscar Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar cliente y seleccionarlo"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="overflow-y-auto max-h-[calc(80vh-180px)]">
          {filteredCustomers.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredCustomers.map(customer => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 hover:bg-blue-50 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 ${customer.color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {customer.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.nui} • {customer.nit}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectCustomer(customer);
                      onClose();
                    }}
                    className="px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition font-medium text-sm"
                  >
                    Seleccionar
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No se encontraron clientes</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
