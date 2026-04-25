import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Plus, Minus } from 'lucide-react';
import { containerVariants } from '@/utils/variants/containerVariants';
import { itemVariants } from '@/utils/variants/itemVariants';

interface ProductFormState {
    nombre: string;
    codigo: string;
    tipoUnidad: string;
    marca: string;
    categoria: string;
    stock: number;
    stockMinimo: number;
    precioVenta: number;
    precioCoste: number;
    proveedorPreferido: string;
    descripcion: string;
    imagenes: File[];
}

export const ProductRegisterForm = () => {
    const [formData, setFormData] = useState<ProductFormState>({
        nombre: '',
        codigo: '',
        tipoUnidad: '',
        marca: '',
        categoria: '',
        stock: 0,
        stockMinimo: 0,
        precioVenta: 0,
        precioCoste: 0,
        proveedorPreferido: '',
        descripcion: '',
        imagenes: [],
    });

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);


    const handleInputChange = (field: keyof ProductFormState, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSelectChange = (field: keyof ProductFormState, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNumericChange = (field: keyof ProductFormState, value: number) => {
        if (value >= 0) {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleIncrement = (field: 'stock' | 'stockMinimo' | 'precioVenta' | 'precioCoste') => {
        const increment = ['precioVenta', 'precioCoste'].includes(field) ? 0.1 : 1;
        handleNumericChange(field, formData[field] + increment);
    };

    const handleDecrement = (field: 'stock' | 'stockMinimo' | 'precioVenta' | 'precioCoste') => {
        const increment = ['precioVenta', 'precioCoste'].includes(field) ? 0.1 : 1;
        const newValue = formData[field] - increment;
        if (newValue >= 0) {
            handleNumericChange(field, newValue);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith('image/')
        );
        processFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files ? Array.from(e.currentTarget.files) : [];
        processFiles(files);
    };

    const processFiles = (files: File[]) => {
        const newFiles = [...formData.imagenes, ...files];
        setFormData((prev) => ({
            ...prev,
            imagenes: newFiles,
        }));

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index),
        }));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.nombre || !formData.codigo || !formData.stock || !formData.precioVenta) {
            alert('Por favor completa los campos requeridos');
            return;
        }

        console.log('Producto registrado:', formData);
        alert('Producto registrado exitosamente');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8"
                >
                    Registro de producto
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        <motion.form
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* DATOS DEL PRODUCTO Section */}
                            <motion.div variants={{ itemVariants }}>
                                <Card className="p-6 border-0 shadow-lg">
                                    <h2 className="text-lg font-bold text-gray-700 mb-6">DATOS DEL PRODUCTO</h2>

                                    {/* Nombre & Código */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Nombre <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Nombre del producto"
                                                value={formData.nombre}
                                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                                                className="border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Código <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Código único"
                                                value={formData.codigo}
                                                onChange={(e) => handleInputChange('codigo', e.target.value)}
                                                className="border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Tipo de Unidad & Marca */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Tipo de unidad</label>
                                            <Input
                                                type="text"
                                                placeholder="ej: Unidad, Caja, etc."
                                                value={formData.tipoUnidad}
                                                onChange={(e) => handleInputChange('tipoUnidad', e.target.value)}
                                                className="border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Marca</label>
                                            <Select value={formData.marca} onValueChange={(value) => handleSelectChange('marca', value)}>
                                                <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg">
                                                    <SelectValue placeholder="Seleccionar marca" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sonar">Sonar</SelectItem>
                                                    <SelectItem value="lb-kka">LB-KKA</SelectItem>
                                                    <SelectItem value="generic">Genérico</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Categoría & Stock */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
                                            <Select value={formData.categoria} onValueChange={(value) => handleSelectChange('categoria', value)}>
                                                <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg">
                                                    <SelectValue placeholder="Seleccionar categoría" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="balanzas">Balanzas</SelectItem>
                                                    <SelectItem value="pipetas">Pipetas</SelectItem>
                                                    <SelectItem value="medidores">Medidores</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Stock <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDecrement('stock')}
                                                    className="border-2 border-gray-300"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={formData.stock}
                                                    onChange={(e) => handleNumericChange('stock', parseInt(e.target.value) || 0)}
                                                    className="border-2 border-gray-300 focus:border-blue-500 rounded-lg text-center flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleIncrement('stock')}
                                                    className="border-2 border-gray-300"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stock Mínimo */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Stock mínimo</label>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDecrement('stockMinimo')}
                                                className="border-2 border-gray-300"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <Input
                                                type="number"
                                                value={formData.stockMinimo}
                                                onChange={(e) => handleNumericChange('stockMinimo', parseInt(e.target.value) || 0)}
                                                className="border-2 border-gray-300 focus:border-blue-500 rounded-lg text-center flex-1"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleIncrement('stockMinimo')}
                                                className="border-2 border-gray-300"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>

                            {/* DATOS DE VENTA Section */}
                            <motion.div variants={{ itemVariants }}>
                                <Card className="p-6 border-0 shadow-lg">
                                    <h2 className="text-lg font-bold text-gray-700 mb-6">DATOS DE VENTA</h2>

                                    {/* Precio Venta & Precio Coste */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Precio venta <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">$</span>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDecrement('precioVenta')}
                                                    className="border-2 border-gray-300"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.precioVenta.toFixed(2)}
                                                    onChange={(e) => handleNumericChange('precioVenta', parseFloat(e.target.value) || 0)}
                                                    className="border-2 border-gray-300 focus:border-blue-500 rounded-lg text-center flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleIncrement('precioVenta')}
                                                    className="border-2 border-gray-300"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Precio coste</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">$</span>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDecrement('precioCoste')}
                                                    className="border-2 border-gray-300"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.precioCoste.toFixed(2)}
                                                    onChange={(e) => handleNumericChange('precioCoste', parseFloat(e.target.value) || 0)}
                                                    className="border-2 border-gray-300 focus:border-blue-500 rounded-lg text-center flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleIncrement('precioCoste')}
                                                    className="border-2 border-gray-300"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Proveedor Preferido */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Proveedor preferido</label>
                                        <Select
                                            value={formData.proveedorPreferido}
                                            onValueChange={(value) => handleSelectChange('proveedorPreferido', value)}
                                        >
                                            <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg">
                                                <SelectValue placeholder="Seleccionar proveedor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="proveedor1">Proveedor 1</SelectItem>
                                                <SelectItem value="proveedor2">Proveedor 2</SelectItem>
                                                <SelectItem value="proveedor3">Proveedor 3</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Descripción del producto</label>
                                        <textarea
                                            placeholder="Información detallada del producto..."
                                            value={formData.descripcion}
                                            onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                            rows={4}
                                            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 focus:outline-none"
                                        />
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div variants={{ itemVariants }}>
                                <Button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg transition-colors"
                                >
                                    Registrar
                                </Button>
                            </motion.div>
                        </motion.form>
                    </div>

                    {/* Image Upload Area */}
                    <motion.div variants={{ itemVariants }} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                        <Card className="p-6 border-0 shadow-lg h-fit sticky top-8">
                            <h2 className="text-lg font-bold text-gray-700 mb-6">IMÁGENES DEL PRODUCTO</h2>

                            {/* Drag & Drop Area */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer mb-6 ${isDragging
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                    }`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-600 text-sm">
                                        Arrastra la imagen del producto aquí o haz clic para buscar
                                    </p>
                                </label>
                            </div>

                            {/* Image Preview */}
                            {previewUrls.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Imágenes actuales</h3>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {previewUrls.map((url, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="relative group rounded-lg overflow-hidden border border-gray-200"
                                            >
                                                <img src={url} alt={`Preview ${index}`} className="w-full h-32 object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
