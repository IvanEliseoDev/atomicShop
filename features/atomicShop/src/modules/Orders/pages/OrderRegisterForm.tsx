'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OrderFormState {
  // Customer Data
  searchClient: string;
  nombre: string;
  direccion: string;
  telefono: string;
  departamento: string;
  correoElectronico: string;
  municipio: string;
  // Order Data
  tipoEnvio: string;
  tipoEntrega: string;
  tipoBulto: string;
  cantidadPaquetes: number;
  seleccionarFactura: string;
  valorCobrar: string;
}

export const  OrderRegisterForm = () =>  {
  const [formData, setFormData] = useState<OrderFormState>({
    searchClient: '',
    nombre: '',
    direccion: '',
    telefono: '',
    departamento: '',
    correoElectronico: '',
    municipio: '',
    tipoEnvio: '',
    tipoEntrega: '',
    tipoBulto: '',
    cantidadPaquetes: 1,
    seleccionarFactura: '',
    valorCobrar: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      cantidadPaquetes: Math.max(1, prev.cantidadPaquetes + delta),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order Form Data:', formData);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8"
      >
        <h1 className="text-center text-3xl md:text-4xl font-bold text-gray-800">
          Registro de pedido
        </h1>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        <Card className="border-0 shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* DATOS DEL CLIENTE SECTION */}
            <motion.div variants={{itemVariants}}>
              <h2 className="text-xl font-bold text-gray-800 mb-6">DATOS DEL CLIENTE</h2>

              {/* Search Bar */}
              <motion.div variants={{itemVariants}} className="mb-6">
                <Label htmlFor="searchClient" className="text-sm text-gray-700 font-semibold mb-2 block">
                  Seleccionar cliente
                </Label>
                <div className="relative">
                  <Input
                    id="searchClient"
                    name="searchClient"
                    type="text"
                    placeholder="Buscar cliente y seleccionar"
                    value={formData.searchClient}
                    onChange={handleInputChange}
                    className="border-2 border-gray-300 focus:border-blue-500 rounded-lg pl-4 pr-12 py-3 transition-colors"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </motion.div>

              {/* Divider */}
              <hr className="my-6 border-gray-200" />

              {/* Customer Fields Grid */}
              <motion.div variants={{itemVariants}} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Nombre */}
                  <div>
                    <Label htmlFor="nombre" className="text-sm text-gray-700 font-semibold mb-2 block">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      placeholder=""
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-3 transition-colors"
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <Label htmlFor="telefono" className="text-sm text-gray-700 font-semibold mb-2 block">
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="text"
                      placeholder=""
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-3 transition-colors"
                    />
                  </div>

                  {/* Correo Electrónico */}
                  <div>
                    <Label htmlFor="correoElectronico" className="text-sm text-gray-700 font-semibold mb-2 block">
                      Correo electrónico
                    </Label>
                    <Input
                      id="correoElectronico"
                      name="correoElectronico"
                      type="email"
                      placeholder=""
                      value={formData.correoElectronico}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-3 transition-colors"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Dirección */}
                  <div>
                    <Label htmlFor="direccion" className="text-sm text-gray-700 font-semibold mb-2 block">
                      Dirección
                    </Label>
                    <textarea
                      id="direccion"
                      name="direccion"
                      placeholder=""
                      value={formData.direccion}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg p-3 transition-colors focus:outline-none font-sans"
                    />
                  </div>

                  {/* Departamento */}
                  <div>
                    <Label htmlFor="departamento" className="text-sm text-gray-700 font-semibold mb-2 block">
                      Departamento
                    </Label>
                    <Select value={formData.departamento} onValueChange={(value) => handleSelectChange('departamento', value)}>
                      <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-3">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sonsonate">Sonsonate</SelectItem>
                        <SelectItem value="santa-ana">Santa Ana</SelectItem>
                        <SelectItem value="san-salvador">San Salvador</SelectItem>
                        <SelectItem value="cuscatlan">Cuscatlán</SelectItem>
                        <SelectItem value="la-paz">La Paz</SelectItem>
                        <SelectItem value="chalatenango">Chalatenango</SelectItem>
                        <SelectItem value="cabanas">Cabañas</SelectItem>
                        <SelectItem value="la-libertad">La Libertad</SelectItem>
                        <SelectItem value="morazan">Morazán</SelectItem>
                        <SelectItem value="usulutan">Usulután</SelectItem>
                        <SelectItem value="san-miguel">San Miguel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Municipio */}
                  <div>
                    <Label htmlFor="municipio" className="text-sm text-gray-700 font-semibold mb-2 block">
                      Municipio
                    </Label>
                    <Select value={formData.municipio} onValueChange={(value) => handleSelectChange('municipio', value)}>
                      <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-3">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Opción 1</SelectItem>
                        <SelectItem value="option2">Opción 2</SelectItem>
                        <SelectItem value="option3">Opción 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* DATOS DEL PEDIDO SECTION */}
            <motion.div variants={{itemVariants}}>
              <h2 className="text-xl font-bold text-gray-800 mb-6">DATOS DEL PEDIDO</h2>

              {/* Order Fields Grid */}
              <motion.div variants={{itemVariants}} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tipo de envío */}
                <div>
                  <Label htmlFor="tipoEnvio" className="text-sm text-gray-700 font-semibold mb-2 block">
                    Tipo de envío <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.tipoEnvio} onValueChange={(value) => handleSelectChange('tipoEnvio', value)}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-3">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Estándar</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="delayed">Diferido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo de entrega */}
                <div>
                  <Label htmlFor="tipoEntrega" className="text-sm text-gray-700 font-semibold mb-2 block">
                    Tipo de entrega <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.tipoEntrega} onValueChange={(value) => handleSelectChange('tipoEntrega', value)}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-3">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domicilio">A domicilio</SelectItem>
                      <SelectItem value="retiro">Retiro en local</SelectItem>
                      <SelectItem value="sucursal">En sucursal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo de bulto */}
                <div>
                  <Label htmlFor="tipoBulto" className="text-sm text-gray-700 font-semibold mb-2 block">
                    Tipo de bulto <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.tipoBulto} onValueChange={(value) => handleSelectChange('tipoBulto', value)}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-3">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caja">Caja</SelectItem>
                      <SelectItem value="bolsa">Bolsa</SelectItem>
                      <SelectItem value="paquete">Paquete</SelectItem>
                      <SelectItem value="sobre">Sobre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cantidad de paquetes */}
                <div>
                  <Label htmlFor="cantidadPaquetes" className="text-sm text-gray-700 font-semibold mb-2 block">
                    Cantidad de paquetes <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                    <input
                      id="cantidadPaquetes"
                      type="number"
                      min="1"
                      value={formData.cantidadPaquetes}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) - formData.cantidadPaquetes)}
                      className="flex-1 px-3 py-3 focus:outline-none text-center font-semibold"
                    />
                    <div className="flex flex-col border-l border-gray-300">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        className="px-2 py-1 hover:bg-gray-100 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        className="px-2 py-1 hover:bg-gray-100 transition-colors border-t border-gray-300"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Seleccionar factura */}
                <div>
                  <Label htmlFor="seleccionarFactura" className="text-sm text-gray-700 font-semibold mb-2 block">
                    Seleccionar factura <span className="text-gray-500 text-xs">(opcional)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="seleccionarFactura"
                      name="seleccionarFactura"
                      type="text"
                      placeholder="Buscar factura y seleccionar"
                      value={formData.seleccionarFactura}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 focus:border-blue-500 rounded-lg pl-4 pr-12 py-3 transition-colors"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                {/* Valor a cobrar */}
                <div>
                  <Label htmlFor="valorCobrar" className="text-sm text-gray-700 font-semibold mb-2 block">
                    Valor a cobrar
                  </Label>
                  <Select value={formData.valorCobrar} onValueChange={(value) => handleSelectChange('valorCobrar', value)}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-3">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15000">$15,000.00</SelectItem>
                      <SelectItem value="25000">$25,000.00</SelectItem>
                      <SelectItem value="35000">$35,000.00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={{itemVariants}} className="pt-4">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
              >
                Registrar
              </Button>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
