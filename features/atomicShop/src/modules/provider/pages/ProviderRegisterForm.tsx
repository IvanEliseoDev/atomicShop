'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SupplierFormState {
  // Common fields
  nombre: string;
  email: string;
  telefono: string;
  nombreRepresentante: string;
  tipoProveedor: string;
  origenProveedor: 'salvadoreño' | 'extranjero';
  logo: File | null;

  // Salvadoreño fields
  nit: string;
  duiRepresentante: string;
  ncr: string;

  // Extranjero fields
  pais: string;
  direccionFisica: string;
  registroFiscal: string;
}

export const ProviderForm =() => {
  const [formData, setFormData] = useState<SupplierFormState>({
    nombre: '',
    email: '',
    telefono: '',
    nombreRepresentante: '',
    tipoProveedor: '',
    origenProveedor: 'salvadoreño',
    logo: null,
    nit: '',
    duiRepresentante: '',
    ncr: '',
    pais: '',
    direccionFisica: '',
    registroFiscal: '',
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleLogoFile(files[0]);
    }
  };

  const handleLogoClick = () => {
    const input = document.getElementById('logo-input') as HTMLInputElement;
    input?.click();
  };

  const handleLogoFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoFile(e.target.files[0]);
    }
  };

  const handleLogoFile = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      logo: file,
    }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
    }));
    setLogoPreview(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your submission logic here
  };

  const isSalvadoreño = formData.origenProveedor === 'salvadoreño';

  // Animation variants
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
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 md:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={{itemVariants}} className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Registro de proveedor
          </h1>
        </motion.div>

        {/* Main Card */}
        <motion.div variants={{itemVariants}}>
          <Card className="shadow-lg border-0 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Form Data (75% on desktop) */}
                <div className="lg:col-span-3">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Section Header */}
                    <motion.h2
                      variants={{itemVariants}}
                      className="text-lg font-bold text-gray-700 mb-6 uppercase tracking-wide"
                    >
                      Datos del Proveedor
                    </motion.h2>

                    {/* Common Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Nombre */}
                      <motion.div variants={{itemVariants}}>
                        <Label htmlFor="nombre" className="text-gray-700 font-medium mb-2 block">
                          Nombre:
                        </Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder="Nombre del proveedor"
                          className="border-2 border-gray-300 focus:border-blue-500 rounded-md"
                        />
                      </motion.div>

                      {/* Email */}
                      <motion.div variants={{itemVariants}}>
                        <Label htmlFor="email" className="text-gray-700 font-medium mb-2 block">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="correo@ejemplo.com"
                          className="border-2 border-gray-300 focus:border-blue-500 rounded-md"
                        />
                      </motion.div>

                      {/* Teléfono */}
                      <motion.div variants={{itemVariants}}>
                        <Label htmlFor="telefono" className="text-gray-700 font-medium mb-2 block">
                          Número Telefónico
                        </Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="+503 0000-0000"
                          className="border-2 border-gray-300 focus:border-blue-500 rounded-md"
                        />
                      </motion.div>

                      {/* Nombre del Representante */}
                      <motion.div variants={{itemVariants}}>
                        <Label
                          htmlFor="nombreRepresentante"
                          className="text-gray-700 font-medium mb-2 block"
                        >
                          Nombre del Representante
                        </Label>
                        <Input
                          id="nombreRepresentante"
                          name="nombreRepresentante"
                          type="text"
                          value={formData.nombreRepresentante}
                          onChange={handleInputChange}
                          placeholder="Nombre del representante"
                          className="border-2 border-gray-300 focus:border-blue-500 rounded-md"
                        />
                      </motion.div>

                      {/* Tipo de Proveedor */}
                      <motion.div variants={{itemVariants}}>
                        <Label htmlFor="tipoProveedor" className="text-gray-700 font-medium mb-2 block">
                          Tipo de proveedor
                        </Label>
                        <Select
                          value={formData.tipoProveedor}
                          onValueChange={(value) => handleSelectChange('tipoProveedor', value)}
                        >
                          <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gran-contribuyente">Gran Contribuyente</SelectItem>
                            <SelectItem value="pequeno">Pequeño</SelectItem>
                            <SelectItem value="mediano">Mediano</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* Origen del Proveedor */}
                      <motion.div variants={{itemVariants}}>
                        <Label htmlFor="origen" className="text-gray-700 font-medium mb-2 block">
                          Origen del Proveedor
                        </Label>
                        <Select
                          value={formData.origenProveedor}
                          onValueChange={(value) =>
                            handleSelectChange(
                              'origenProveedor',
                              value as 'salvadoreño' | 'extranjero'
                            )
                          }
                        >
                          <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Selecciona el origen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salvadoreño">Salvadoreño</SelectItem>
                            <SelectItem value="extranjero">Extranjero</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </div>

                    {/* Conditional Fields - Salvadoreño */}
                    {isSalvadoreño && (
                      <motion.div
                        variants={{fieldVariants}}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                      >
                        {/* NIT */}
                        <motion.div variants={{itemVariants}}>
                          <Label htmlFor="nit" className="text-gray-700 font-medium mb-2 block">
                            N° de Identificación Tributaria
                          </Label>
                          <Input
                            id="nit"
                            name="nit"
                            type="text"
                            value={formData.nit}
                            onChange={handleInputChange}
                            placeholder="NIT"
                            className="border-2 border-gray-300 focus:border-blue-500 rounded-md"
                          />
                        </motion.div>

                        {/* DUI and NCR in 2 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* DUI del Representante */}
                          <motion.div variants={{itemVariants}}>
                            <Label
                              htmlFor="dui"
                              className="text-gray-700 font-medium mb-2 block"
                            >
                              DUI del Representante
                            </Label>
                            <Input
                              id="dui"
                              name="duiRepresentante"
                              type="text"
                              value={formData.duiRepresentante}
                              onChange={handleInputChange}
                              placeholder="DUI"
                              className="border-2 border-gray-300 focus:border-blue-500 rounded-md"
                            />
                          </motion.div>

                          {/* NCR */}
                          <motion.div variants={{itemVariants}}>
                            <Label htmlFor="ncr" className="text-gray-700 font-medium mb-2 block">
                              N° Registro de Contribuyente (NCR)
                            </Label>
                            <Input
                              id="ncr"
                              name="ncr"
                              type="text"
                              value={formData.ncr}
                              onChange={handleInputChange}
                              placeholder="NCR"
                              className="border-2 border-gray-300 focus:border-blue-500 rounded-md"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* Conditional Fields - Extranjero */}
                    {!isSalvadoreño && (
                      <motion.div
                        variants={{fieldVariants}}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                      >
                        {/* País de Origen */}
                        <motion.div variants={{itemVariants}}>
                          <Label htmlFor="pais" className="text-gray-700 font-medium mb-2 block">
                            País de Origen
                          </Label>
                          <Select
                            value={formData.pais}
                            onValueChange={(value) => handleSelectChange('pais', value)}
                          >
                            <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                              <SelectValue placeholder="Selecciona un país" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mexico">México</SelectItem>
                              <SelectItem value="guatemala">Guatemala</SelectItem>
                              <SelectItem value="honduras">Honduras</SelectItem>
                              <SelectItem value="nicaragua">Nicaragua</SelectItem>
                              <SelectItem value="costa-rica">Costa Rica</SelectItem>
                              <SelectItem value="panama">Panamá</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>

                        {/* Dirección Física */}
                        <motion.div variants={{itemVariants}}>
                          <Label
                            htmlFor="direccion"
                            className="text-gray-700 font-medium mb-2 block"
                          >
                            Dirección Física
                          </Label>
                          <Input
                            id="direccion"
                            name="direccionFisica"
                            type="text"
                            value={formData.direccionFisica}
                            onChange={handleInputChange}
                            placeholder="Dirección completa"
                            className="border-2 border-gray-300 focus:border-blue-500 rounded-md"
                          />
                        </motion.div>

                        {/* Registro Fiscal */}
                        <motion.div variants={{itemVariants}}>
                          <Label
                            htmlFor="registro"
                            className="text-gray-700 font-medium mb-2 block"
                          >
                            Registro Fiscal
                          </Label>
                          <Input
                            id="registro"
                            name="registroFiscal"
                            type="text"
                            value={formData.registroFiscal}
                            onChange={handleInputChange}
                            placeholder="Número de registro fiscal"
                            className="border-2 border-gray-300 focus:border-blue-500 rounded-md"
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Right Column - Logo Upload (25% on desktop) */}
                <motion.div variants={{itemVariants}} className="lg:col-span-1">
                  <Card className="border-2 border-gray-200 p-6 h-full flex flex-col items-center justify-center">
                    <motion.h3 className="text-base font-bold text-gray-700 mb-6 text-center uppercase tracking-wide">
                      Logo del Proveedor
                    </motion.h3>

                    {/* Logo Preview or Upload Area */}
                    {logoPreview ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full"
                      >
                        <div className="relative w-full bg-gray-50 rounded-md overflow-hidden">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-full h-48 object-contain p-4"
                          />
                          <motion.button
                            type="button"
                            onClick={removeLogo}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                          >
                            <X size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        onDrop={handleLogoDrop}
                        onDragOver={() => setIsDragging(true)}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={handleLogoClick}
                        whileHover={{ borderColor: '#2563EB' }}
                        className={`w-full border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer transition ${
                          isDragging ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-2">
                          Adjunta una imagen del logo aquí
                        </p>
                        <input
                          id="logo-input"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileInput}
                          className="hidden"
                        />
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              </div>

              {/* Register Button */}
              <motion.div variants={{itemVariants}} className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded-md transition"
                >
                  Registrar
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}
