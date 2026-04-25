'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Package } from 'lucide-react';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Balanza analítica',
    code: 'COD-001',
    brand: 'Sonar',
    category: 'Laboratorio',
    stock: 15,
    unitPrice: 45.50
  },
  {
    id: 2,
    name: 'Balanza para Determinación de Humedad (90g) MB92-110V',
    code: 'COD-002',
    brand: 'LB-KKA',
    category: 'Laboratorio',
    stock: 8,
    unitPrice: 12.50
  },
  {
    id: 3,
    name: 'balanza de precision touch 620g / 0.0lg cal. externa',
    code: 'COD-003',
    brand: 'LB-KKA',
    category: 'Laboratorio',
    stock: 20,
    unitPrice: 10.50
  },
  {
    id: 4,
    name: 'Pipeta volumétrica 15ml - Ceslab',
    code: 'COD-004',
    brand: 'LB-KKA',
    category: 'Laboratorio',
    stock: 50,
    unitPrice: 3.00
  },
  {
    id: 5,
    name: 'Pipeta volumétrica de vidrio 10 mL Clase A - Luzeren',
    code: 'COD-005',
    brand: 'LB-KKA',
    category: 'Laboratorio',
    stock: 35,
    unitPrice: 34.50
  },
  {
    id: 6,
    name: 'Calibración de Termómetro Digital o Bimetálico por Comparación Directa',
    code: 'COD-006',
    brand: 'LB-KKA',
    category: 'Servicios',
    stock: 100,
    unitPrice: 11.50
  },
  {
    id: 7,
    name: 'Medidor portátil de turbidez con registro',
    code: 'COD-007',
    brand: 'LB-KKA',
    category: 'Instrumentos',
    stock: 5,
    unitPrice: 1.50
  }
];

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: typeof mockProducts[0]) => void;
}

export function ProductSearchModal({
  isOpen,
  onClose,
  onSelectProduct
}: ProductSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
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
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Buscar Producto</h2>
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
              placeholder="Buscar producto y seleccionarlo"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Product List */}
        <div className="overflow-y-auto max-h-[calc(80vh-180px)]">
          {filteredProducts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 hover:bg-blue-50 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                      <Package size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.code}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-700 min-w-[80px] text-right">
                      {product.brand}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="ml-4 px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition font-medium text-sm"
                  >
                    Seleccionar
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No se encontraron productos</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
