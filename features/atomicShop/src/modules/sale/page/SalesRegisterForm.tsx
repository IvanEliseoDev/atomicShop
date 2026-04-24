'use client';

import { useState, useReducer } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreVertical, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { CustomerSearchModal } from '@/components/custom/modals/CustomerSearchModal';
import { ProductSearchModal } from '@/components/custom/modals/ProductSearchModal';


// Types
interface CartItem {
  id: string;
  productId: number;
  productName: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

interface SalesFormState {
  billingType: 'commercial' | 'taxCredit';
  selectedCustomer: any;
  selectedProduct: any;
  cartItems: CartItem[];
  currentQuantity: number;
  currentDiscount: number;
  dteNumber: string;
  emissionDate: string;
  paymentType: string;
  salesCondition: string;
  details: string;
  generalDiscount: number;
  amountPaid: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: CartItem }
  | { type: 'CLEAR_CART' };

// DTE Counter (sequential numbering)
const generateDTE = (index: number) => `VNT-LOC-${String(index + 1).padStart(3, '0')}`;

// Cart reducer
const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(item => item.productId === action.payload.productId);
      if (existing) {
        return state.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity, totalPrice: (item.quantity + action.payload.quantity) * item.unitPrice * (1 - item.discount / 100) }
            : item
        );
      }
      return [...state, action.payload];
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload);
    case 'UPDATE_ITEM':
      return state.map(item => item.id === action.payload.id ? action.payload : item);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

// Calculate invoice totals
const calculateTotals = (cartItems: CartItem[], generalDiscount: number = 0) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const generalDiscountAmount = (subtotal * generalDiscount) / 100;
  const subtotalAfterDiscount = subtotal - generalDiscountAmount;
  const iva = subtotalAfterDiscount * 0.13;
  const totalOperations = subtotalAfterDiscount + iva;

  return {
    subtotal,
    generalDiscount: generalDiscountAmount,
    subtotalAfterDiscount,
    iva,
    totalOperations,
    ivaPercibido: 0,
    ivaRetenido: 0,
    totalToPay: totalOperations
  };
};

export const SalesRegisterForm =() => {
  const [billingType, setBillingType] = useState<'commercial' | 'taxCredit'>('taxCredit');
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [currentDiscount, setCurrentDiscount] = useState(0);
  
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const [dteNumber, setDteNumber] = useState(generateDTE(0));
  const [emissionDate, setEmissionDate] = useState('DD/MM/AAAA');
  const [paymentType, setPaymentType] = useState('Efectivo');
  const [salesCondition, setSalesCondition] = useState('');
  const [details, setDetails] = useState('');
  const [generalDiscount, setGeneralDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);

  const totals = calculateTotals(cartItems, generalDiscount);
  const change = amountPaid - totals.totalToPay;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const handleAddProduct = () => {
    if (!selectedProduct || currentQuantity <= 0 || currentQuantity > selectedProduct.stock) {
      return;
    }

    const newItem: CartItem = {
      id: `${selectedProduct.id}-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      brand: selectedProduct.brand,
      quantity: currentQuantity,
      unitPrice: selectedProduct.unitPrice,
      discount: currentDiscount,
      totalPrice: currentQuantity * selectedProduct.unitPrice * (1 - currentDiscount / 100)
    };

    dispatch({ type: 'ADD_ITEM', payload: newItem });
    setSelectedProduct(null);
    setCurrentQuantity(0);
    setCurrentDiscount(0);
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 lg:p-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Registro de venta</h1>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="mb-6">
        <Tabs defaultValue="taxCredit" onValueChange={(val: any) => setBillingType(val)} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white border-b border-gray-200 rounded-none h-auto p-0">
            <TabsTrigger
              value="commercial"
              className="rounded-none py-4 px-6 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              Facturación Comercial
            </TabsTrigger>
            <TabsTrigger
              value="taxCredit"
              className="rounded-none py-4 px-6 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              Facturación con Crédito Fiscal
            </TabsTrigger>
          </TabsList>

          {/* Commercial Billing Tab */}
          <TabsContent value="commercial" className="mt-6">
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 p-8">
                <div className="space-y-8">
                  {/* General Data */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-6">DATOS GENERALES</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">DTE de la factura:</label>
                        <Input value={dteNumber} readOnly className="border-2 border-gray-300 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de emisión:</label>
                        <Input value={emissionDate} readOnly className="border-2 border-gray-300 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de pago</label>
                        <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                          <option>Efectivo</option>
                          <option>Tarjeta</option>
                          <option>Cheque</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-6">DETALLE DE LA FACTURA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-600 mb-2">Buscar producto y seleccionarlo</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                          <input
                            type="text"
                            value={selectedProduct?.name || ''}
                            onClick={() => setShowProductModal(true)}
                            readOnly
                            placeholder="Buscar producto y seleccionarlo"
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">STOCK</label>
                        <Input value={selectedProduct?.stock || 0} readOnly className="border-2 border-gray-300 text-center bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">PRECIO U.</label>
                        <Input value={`$${selectedProduct?.unitPrice || 0}`} readOnly className="border-2 border-gray-300 text-center bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">CANTIDAD</label>
                        <Input
                          type="number"
                          value={currentQuantity}
                          onChange={e => setCurrentQuantity(Number(e.target.value))}
                          className="border-2 border-gray-300 text-center"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">DESCUENTO</label>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={currentDiscount}
                            onChange={e => setCurrentDiscount(Number(e.target.value))}
                            className="border-2 border-gray-300 text-center"
                            placeholder="0"
                          />
                          <span className="text-sm text-gray-600">%</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleAddProduct}
                      disabled={!selectedProduct || currentQuantity <= 0 || currentQuantity > (selectedProduct?.stock || 0)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
                    >
                      Agregar
                    </Button>
                  </div>

                  {/* Cart Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-blue-500 text-white">
                          <th className="px-4 py-3 text-left">PRODUCTO</th>
                          <th className="px-4 py-3 text-center">MARCA</th>
                          <th className="px-4 py-3 text-center">CANTIDAD</th>
                          <th className="px-4 py-3 text-center">PRECIO U.</th>
                          <th className="px-4 py-3 text-center">PRECIO T.</th>
                          <th className="px-4 py-3 text-center">DESCUENTO</th>
                          <th className="px-4 py-3 text-center">ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item, idx) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          >
                            <td className="px-4 py-3 text-gray-800">{item.productName}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{item.brand}</td>
                            <td className="px-4 py-3 text-center text-gray-800">{item.quantity}</td>
                            <td className="px-4 py-3 text-center text-gray-800">${item.unitPrice.toFixed(2)}</td>
                            <td className="px-4 py-3 text-center text-gray-800">${item.totalPrice.toFixed(2)}</td>
                            <td className="px-4 py-3 text-center text-gray-800">{item.discount}%</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-700 transition"
                              >
                                <MoreVertical size={18} />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Descuento general</label>
                      <div className="flex gap-2">
                        <span className="text-gray-600">%</span>
                        <Input
                          type="number"
                          value={generalDiscount}
                          onChange={e => setGeneralDiscount(Number(e.target.value))}
                          className="border-2 border-gray-300 flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-800">
                        <span>TOTAL A PAGAR:</span>
                        <span className="font-semibold">${totals.totalToPay.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">PAGA CON:</label>
                          <Input
                            type="number"
                            value={amountPaid}
                            onChange={e => setAmountPaid(Number(e.target.value))}
                            className="border-2 border-gray-300"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">CAMBIO:</label>
                          <Input value={`$${Math.max(0, change).toFixed(2)}`} readOnly className="border-2 border-gray-300 bg-gray-50" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-12 py-3 text-lg font-semibold">
                    Registrar
                  </Button>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Tax Credit Billing Tab */}
          <TabsContent value="taxCredit" className="mt-6">
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Customer Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-6">INFORMACIÓN DEL CLIENTE</h3>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <button
                          onClick={() => setShowCustomerModal(true)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-left hover:border-blue-500 transition bg-white"
                        >
                          Buscar cliente y seleccionarlo
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-700">NOMBRE:</span>
                          <p className="text-gray-600">{selectedCustomer?.name || '-'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-semibold text-gray-700">NCR:</span>
                            <p className="text-gray-600">{selectedCustomer?.nit || '-'}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">NIT:</span>
                            <p className="text-gray-600">{selectedCustomer?.nui || '-'}</p>
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">CORREO ELECTRÓNICO:</span>
                          <p className="text-gray-600">-</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">TELÉFONO:</span>
                          <p className="text-gray-600">-</p>
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-6">DETALLE DE LA FACTURA</h3>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-2">Buscar producto y seleccionarlo</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                              type="text"
                              value={selectedProduct?.name || ''}
                              onClick={() => setShowProductModal(true)}
                              readOnly
                              placeholder="Buscar producto y seleccionarlo"
                              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-2">STOCK</label>
                          <div className="relative">
                            <span className="absolute left-2 top-2 text-gray-600 text-sm">U</span>
                            <Input value={selectedProduct?.stock || 0} readOnly className="border-2 border-gray-300 text-center bg-gray-50 pl-6" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-2">PRECIO U.</label>
                          <div className="relative">
                            <span className="absolute left-2 top-2 text-gray-600 text-sm">$</span>
                            <Input value={selectedProduct?.unitPrice || 0} readOnly className="border-2 border-gray-300 text-center bg-gray-50 pl-6" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-2">CANTIDAD</label>
                          <Input
                            type="number"
                            value={currentQuantity}
                            onChange={e => setCurrentQuantity(Number(e.target.value))}
                            className="border-2 border-gray-300 text-center"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-2">DESCUENTO</label>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={currentDiscount}
                              onChange={e => setCurrentDiscount(Number(e.target.value))}
                              className="border-2 border-gray-300 text-center"
                              placeholder="0"
                            />
                            <span className="text-sm text-gray-600">%</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleAddProduct}
                        disabled={!selectedProduct || currentQuantity <= 0 || currentQuantity > (selectedProduct?.stock || 0)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
                      >
                        Agregar
                      </Button>
                    </div>

                    {/* Cart Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-blue-500 text-white">
                            <th className="px-4 py-3 text-left">PRODUCTO</th>
                            <th className="px-4 py-3 text-center">MARCA</th>
                            <th className="px-4 py-3 text-center">CANTIDAD</th>
                            <th className="px-4 py-3 text-center">PRECIO U.</th>
                            <th className="px-4 py-3 text-center">PRECIO T.</th>
                            <th className="px-4 py-3 text-center">DESCUENTO</th>
                            <th className="px-4 py-3 text-center">ACCIONES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item, idx) => (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            >
                              <td className="px-4 py-3 text-gray-800">{item.productName}</td>
                              <td className="px-4 py-3 text-center text-gray-600">{item.brand}</td>
                              <td className="px-4 py-3 text-center text-gray-800">{item.quantity}</td>
                              <td className="px-4 py-3 text-center text-gray-800">${item.unitPrice.toFixed(2)}</td>
                              <td className="px-4 py-3 text-center text-gray-800">${item.totalPrice.toFixed(2)}</td>
                              <td className="px-4 py-3 text-center text-gray-800">{item.discount}%</td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-red-500 hover:text-red-700 transition"
                                >
                                  <MoreVertical size={18} />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column - General Data & Summary */}
                  <div className="lg:col-span-1 space-y-8">
                    {/* General Data */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">DATOS GENERALES DE LA FACTURA</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">DTE</label>
                          <Input value={dteNumber} readOnly className="border-2 border-gray-300 bg-gray-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de emisión</label>
                          <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                            <option>DD/MM/AAAA</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Condición de venta</label>
                          <Input value={salesCondition} onChange={e => setSalesCondition(e.target.value)} className="border-2 border-gray-300" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de pago</label>
                          <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                            <option>Efectivo</option>
                            <option>Tarjeta</option>
                            <option>Cheque</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Detalles</label>
                          <textarea
                            value={details}
                            onChange={e => setDetails(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Invoice Summary */}
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        RESUMEN DE LA FACTURA
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            Subtotal en Ventas
                          </span>
                          <span className="font-semibold">${totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            Total De Descuento
                          </span>
                          <span className="font-semibold">${totals.generalDiscount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            Subtotal
                          </span>
                          <span className="font-semibold">${totals.subtotalAfterDiscount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            Tributo IVA 13%
                          </span>
                          <span className="font-semibold">${totals.iva.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            Total de Operaciones
                          </span>
                          <span className="font-semibold">${totals.totalOperations.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            Total no Gravado
                          </span>
                          <span className="font-semibold">$0.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            IVA Percibido
                          </span>
                          <span className="font-semibold">${totals.ivaPercibido.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            IVA Retenido
                          </span>
                          <span className="font-semibold">${totals.ivaRetenido.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 flex justify-between items-center font-bold text-lg">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            TOTAL A PAGAR
                          </span>
                          <span>${totals.totalToPay.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-3">
                        <Input
                          type="number"
                          value={amountPaid}
                          onChange={e => setAmountPaid(Number(e.target.value))}
                          placeholder="Paga con"
                          className="border-2 border-gray-300 flex-1"
                        />
                        <Input
                          value={`$${Math.max(0, change).toFixed(2)}`}
                          readOnly
                          placeholder="Cambio"
                          className="border-2 border-gray-300 flex-1 bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Register Button */}
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-semibold">
                      Registrar
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Modals */}
      <CustomerSearchModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSelectCustomer={(customer) => setSelectedCustomer(customer)}
      />

      <ProductSearchModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />
    </motion.div>
  );
}
