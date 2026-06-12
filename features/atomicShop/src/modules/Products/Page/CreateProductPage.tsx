import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router'; 
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Plus, Minus, Loader2 } from 'lucide-react';
import { containerVariants } from '@/utils/variants/containerVariants';
import { itemVariants } from '@/utils/variants/itemVariants';

// Hooks de React Query
import { useProductMutations } from '../hooks/useProductMutations'; 
import { useGetProductByID } from '../hooks/useGetProductByID';
import { useGetBrands } from '@/hooks/useGetBrands';
import { useGetCategories } from '@/hooks/useGetCategories';
import { useGetProviders } from '@/hooks/useGetProviders';     

interface ProductFormState {
    nombre: string;
    codigo: string;
    tipoUnidad: string;
    marca: string;
    categoria: string;
    stock: number;
    stockMinimo: number;
    precioVenta: number | string; // Permitimos string temporal para la fluidez del input decimal
    precioCoste: number | string;
    discount: number | string; // Descuento del producto
    proveedorPreferido: string;
    descripcion: string;
    imagenes: File[];
}

interface ProductFormProps {
    onSuccessSubmit?: () => void;
}

interface ImagePreview {
    id: string;
    url: string;
    isLocal: boolean;
    fileIndex?: number; // Para mapear al array de archivos locales si es nueva
}

export const ProductRegisterForm = ({ onSuccessSubmit }: ProductFormProps) => {
    // 1. EXTRAER PARÁMETROS DE LA URL
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    const idFromUrl = searchParams.get('id');

    const isEditMode = mode === 'edit' && Boolean(idFromUrl);
    const productId = idFromUrl || '';

    // Hooks de React Query
    const { createProduct, mutateUpdate, isCreating, isUpdating } = useProductMutations();
    const { data: fetchedProduct, isLoading: isLoadingProduct } = useGetProductByID(productId);
    const { data: brands } = useGetBrands();
    const { data: categories } = useGetCategories();
    const { data: providers } = useGetProviders();

    const [formData, setFormData] = useState<ProductFormState>({
        nombre: '',
        codigo: '',
        tipoUnidad: '',
        marca: '',
        categoria: '',
        stock: 0,
        stockMinimo: 0,
        precioVenta: '',
        precioCoste: '',
        discount: '',
        proveedorPreferido: '',
        descripcion: '',
        imagenes: [],
    });

    // Estados para la gestión avanzada de imágenes
    const [previews, setPreviews] = useState<ImagePreview[]>([]);
    const [imagenesEliminadas, setImagenesEliminadas] = useState<string[]>([]); // URLs viejas a borrar en el backend
    const [isDragging, setIsDragging] = useState(false);

    // Rellenar el formulario en Modo Edición
    useEffect(() => {
        if (isEditMode && fetchedProduct?.data) {
            const product = fetchedProduct.data;
            setFormData({
                nombre: product.name || '',
                codigo: product.code || '',
                tipoUnidad: '',
                marca: product.brandId || '',
                categoria: product.categoryId || '',
                stock: product.stock || 0,
                stockMinimo: 0,
                precioVenta: product.price ?? '',
                precioCoste: '',
                discount: product.discount ?? '',
                proveedorPreferido: product.providerId || '',
                descripcion: product.description || '',
                imagenes: [], 
            });

            // Cargar imágenes previas del backend
            if (product.images && Array.isArray(product.images)) {
                setPreviews(product.images.map((url: string) => ({ id: url, url, isLocal: false })));
            }
        }
    }, [isEditMode, fetchedProduct]);

    // --- Manejadores de Cambios ---
    const handleInputChange = (field: keyof ProductFormState, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field: keyof ProductFormState, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Manejo nativo de números enteros (Stock)
    const handleIntegerChange = (field: 'stock' | 'stockMinimo', value: string) => {
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed >= 0) {
            setFormData((prev) => ({ ...prev, [field]: parsed }));
        } else if (value === '') {
            setFormData((prev) => ({ ...prev, [field]: 0 }));
        }
    };

    // Manejo de incremento / decremento manual
    const handleIncrement = (field: 'stock' | 'stockMinimo' | 'precioVenta' | 'precioCoste' | 'discount') => {
        const currentValue = parseFloat(formData[field].toString()) || 0;
        const increment = ['precioVenta', 'precioCoste', 'discount'].includes(field) ? 0.10 : 1;
        const newValue = parseFloat((currentValue + increment).toFixed(2));
        handleInputChange(field, newValue);
    };

    const handleDecrement = (field: 'stock' | 'stockMinimo' | 'precioVenta' | 'precioCoste' | 'discount') => {
        const currentValue = parseFloat(formData[field].toString()) || 0;
        const increment = ['precioVenta', 'precioCoste', 'discount'].includes(field) ? 0.10 : 1;
        const newValue = parseFloat((currentValue - increment).toFixed(2));
        if (newValue >= 0) {
            handleInputChange(field, newValue);
        }
    };

    // --- Lógica de subida de Imágenes ---
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
        const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
        processFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files ? Array.from(e.currentTarget.files) : [];
        processFiles(files);
    };

    const processFiles = (files: File[]) => {
        const startIndex = formData.imagenes.length;
        
        setFormData((prev) => ({
            ...prev,
            imagenes: [...prev.imagenes, ...files],
        }));

        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => [
                    ...prev,
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        url: reader.result as string,
                        isLocal: true,
                        fileIndex: startIndex + index
                    }
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (previewToRemove: ImagePreview) => {
        if (!previewToRemove.isLocal) {
            // Si venía del servidor, la mandamos al pool de eliminación
            setImagenesEliminadas((prev) => [...prev, previewToRemove.url]);
            setPreviews((prev) => prev.filter((p) => p.id !== previewToRemove.id));
        } else {
            // Si es un archivo recién cargado localmente
            setFormData((prev) => ({
                ...prev,
                imagenes: prev.imagenes.filter((_, i) => i !== previewToRemove.fileIndex),
            }));
            setPreviews((prev) => prev.filter((p) => p.id !== previewToRemove.id));
        }
    };

    // --- Submit del Formulario ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nombre || !formData.codigo || !formData.precioVenta) {
            alert('Por favor completa los campos requeridos (*)');
            return;
        }

        // Mapear datos del formulario al formato que espera el backend
        const dataToSubmit = {
            name: formData.nombre,
            code: formData.codigo,
            brandId: formData.marca,
            categoryId: formData.categoria,
            providerId: formData.proveedorPreferido,
            description: formData.descripcion,
            stock: formData.stock,
            price: parseFloat(formData.precioVenta.toString()) || 0,
            discount: parseFloat(formData.discount.toString()) || 0,
            images: formData.imagenes,
            state: true,
            imagenesEliminadas: imagenesEliminadas // Para que el backend sepa cuáles eliminar
        };

        try {
            if (isEditMode && productId) {
                await mutateUpdate({ id: productId, dataProduct: dataToSubmit });
                alert('Producto actualizado exitosamente');
            } else {
                await createProduct({ dataProduct: dataToSubmit });
                alert('Producto registrado exitosamente');
                
                // Reset de estados completo
                setFormData({
                    nombre: '', codigo: '', tipoUnidad: '', marca: '', categoria: '',
                    stock: 0, stockMinimo: 0, precioVenta: '', precioCoste: '', discount: '',
                    proveedorPreferido: '', descripcion: '', imagenes: []
                });
                setPreviews([]);
                setImagenesEliminadas([]);
            }

            if (onSuccessSubmit) onSuccessSubmit();
        } catch (error) {
            console.error("Error al procesar la solicitud del formulario:", error);
            alert("Ocurrió un error al procesar la transacción.");
        }
    };

    if (isEditMode && isLoadingProduct) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Cargando datos del producto...</p>
                </div>
            </div>
        );
    }

    const isSubmitting = isCreating || isUpdating;

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8"
                >
                    {isEditMode ? 'Editar producto' : 'Registro de producto'}
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario Principal */}
                    <div className="lg:col-span-2">
                        <motion.form
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* SECCIÓN: DATOS DEL PRODUCTO */}
                            <motion.div variants={itemVariants}>
                                <Card className="p-6 border-0 shadow-lg">
                                    <h2 className="text-lg font-bold text-gray-700 mb-6">DATOS DEL PRODUCTO</h2>

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
                                                disabled={isSubmitting}
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
                                                disabled={isSubmitting || isEditMode} 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Tipo de unidad</label>
                                            <Input
                                                type="text"
                                                placeholder="ej: Unidad, Caja, etc."
                                                value={formData.tipoUnidad}
                                                onChange={(e) => handleInputChange('tipoUnidad', e.target.value)}
                                                className="border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Marca</label>
                                            <Select 
                                                value={formData.marca} 
                                                onValueChange={(value) => handleSelectChange('marca', value)} 
                                                disabled={isSubmitting}
                                            >
                                                <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg">
                                                    <SelectValue placeholder="Seleccionar marca" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {brands?.map((brand) => (
                                                        <SelectItem key={brand._id} value={brand._id}>
                                                            {brand.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
                                            <Select 
                                                value={formData.categoria} 
                                                onValueChange={(value) => handleSelectChange('categoria', value)} 
                                                disabled={isSubmitting}
                                            >
                                                <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg">
                                                    <SelectValue placeholder="Seleccionar categoría" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories?.map((category) => (
                                                        <SelectItem key={category._id} value={category._id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Stock <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button" size="sm" variant="outline"
                                                    onClick={() => handleDecrement('stock')}
                                                    className="border-2 border-gray-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={formData.stock}
                                                    onChange={(e) => handleIntegerChange('stock', e.target.value)}
                                                    className="border-2 border-gray-300 focus:border-blue-500 rounded-lg text-center flex-1"
                                                    disabled={isSubmitting}
                                                />
                                                <Button
                                                    type="button" size="sm" variant="outline"
                                                    onClick={() => handleIncrement('stock')}
                                                    className="border-2 border-gray-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Stock mínimo</label>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button" size="sm" variant="outline"
                                                    onClick={() => handleDecrement('stockMinimo')}
                                                    className="border-2 border-gray-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={formData.stockMinimo}
                                                    onChange={(e) => handleIntegerChange('stockMinimo', e.target.value)}
                                                    className="border-2 border-gray-300 focus:border-blue-500 rounded-lg text-center flex-1"
                                                    disabled={isSubmitting}
                                                />
                                                <Button
                                                    type="button" size="sm" variant="outline"
                                                    onClick={() => handleIncrement('stockMinimo')}
                                                    className="border-2 border-gray-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>

                            {/* SECCIÓN: DATOS DE VENTA */}
                            <motion.div variants={itemVariants}>
                                <Card className="p-6 border-0 shadow-lg">
                                    <h2 className="text-lg font-bold text-gray-700 mb-6">DATOS DE VENTA</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Precio venta <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 font-bold">$</span>
                                                <Button
                                                    type="button" size="sm" variant="outline"
                                                    onClick={() => handleDecrement('precioVenta')}
                                                    className="border-2 border-gray-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <Input
                                                    type="number" step="0.01"
                                                    value={formData.precioVenta}
                                                    onChange={(e) => handleInputChange('precioVenta', e.target.value)}
                                                    className="border-2 border-gray-300 focus:border-blue-500 rounded-lg text-center flex-1"
                                                    disabled={isSubmitting}
                                                />
                                                <Button
                                                    type="button" size="sm" variant="outline"
                                                    onClick={() => handleIncrement('precioVenta')}
                                                    className="border-2 border-gray-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Precio coste</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 font-bold">$</span>
                                                <Button
                                                    type="button" size="sm" variant="outline"
                                                    onClick={() => handleDecrement('precioCoste')}
                                                    className="border-2 border-gray-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <Input
                                                    type="number" step="0.01"
                                                    value={formData.precioCoste}
                                                    onChange={(e) => handleInputChange('precioCoste', e.target.value)}
                                                    className="border-2 border-gray-300 focus:border-blue-500 rounded-lg text-center flex-1"
                                                    disabled={isSubmitting}
                                                />
                                                <Button
                                                    type="button" size="sm" variant="outline"
                                                    onClick={() => handleIncrement('precioCoste')}
                                                    className="border-2 border-gray-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Descuento (%)</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 font-bold">%</span>
                                                <Button
                                                    type="button" size="sm" variant="outline"
                                                    onClick={() => handleDecrement('discount')}
                                                    className="border-2 border-gray-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <Input
                                                    type="number" step="0.01"
                                                    value={formData.discount}
                                                    onChange={(e) => handleInputChange('discount', e.target.value)}
                                                    className="border-2 border-gray-300 focus:border-blue-500 rounded-lg text-center flex-1"
                                                    disabled={isSubmitting}
                                                />
                                                <Button
                                                    type="button" size="sm" variant="outline"
                                                    onClick={() => handleIncrement('discount')}
                                                    className="border-2 border-gray-300"
                                                    disabled={isSubmitting}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Proveedor preferido</label>
                                        <Select 
                                            value={formData.proveedorPreferido} 
                                            onValueChange={(value) => handleSelectChange('proveedorPreferido', value)} 
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg">
                                                <SelectValue placeholder="Seleccionar proveedor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {providers?.map((provider) => (
                                                    <SelectItem key={provider._id} value={provider._id}>
                                                        {provider.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Descripción del producto</label>
                                        <textarea
                                            placeholder="Información detallada..."
                                            value={formData.descripcion}
                                            onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                            rows={4}
                                            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Botón Submit Dinámico */}
                            <motion.div variants={itemVariants}>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isEditMode ? 'Guardar Cambios' : 'Registrar'}
                                </Button>
                            </motion.div>
                        </motion.form>
                    </div>

                    {/* Zona Lateral de Imágenes */}
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                        <Card className="p-6 border-0 shadow-lg h-fit sticky top-8">
                            <h2 className="text-lg font-bold text-gray-700 mb-6">IMÁGENES DEL PRODUCTO</h2>

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer mb-6 ${
                                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                }`}
                            >
                                <input
                                    type="file" multiple accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden" id="image-upload"
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-600 text-sm">
                                        Arrastra imágenes aquí o haz clic para buscar
                                    </p>
                                </label>
                            </div>

                            {previews.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Vista previa</h3>
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                        {previews.map((preview) => (
                                            <motion.div
                                                key={preview.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="relative group rounded-lg overflow-hidden border border-gray-200"
                                            >
                                                <img src={preview.url} alt="Preview" className="w-full h-32 object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(preview)}
                                                    disabled={isSubmitting}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
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
};