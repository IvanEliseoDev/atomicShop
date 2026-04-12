import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select"
import { motion} from "framer-motion"
import { Upload, X } from "lucide-react"
import { useState } from "react"

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
} as const;


interface RegistrationFormState {
    nombre: string;
    numeroTelefonico: string;
    correoElectronico: string;
    fechaNacimiento: string;
    documentoIdentificacion: string;
    afpAfiliado: string;
    isss: string;
    direccion: string;
    fechaIngreso: string;
    salarioActual: string;
    cargo: string;
    duiImages: File[];
}


export const EmployeeForm = () => {

    // Form state
    const [formData, setFormData] = useState<RegistrationFormState>({
        nombre: '',
        numeroTelefonico: '',
        correoElectronico: '',
        fechaNacimiento: '',
        documentoIdentificacion: '',
        afpAfiliado: '',
        isss: '',
        direccion: '',
        fechaIngreso: '',
        salarioActual: '$0.00',
        cargo: '',
        duiImages: [],
    });

    // Handlers
    const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, cargo: value }));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        setFormData((prev) => ({ ...prev, duiImages: [...prev.duiImages, ...files] }));
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData((prev) => ({ ...prev, duiImages: [...prev.duiImages, ...files] }));
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            duiImages: prev.duiImages.filter((_, i) => i !== index),
        }));
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


    return (
        <motion.main
            className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 md:p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Section A: Registration Form */}
                <motion.div variants={{ itemVariants }}>
                    <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                        Registro de empleado
                    </h1>

                    <Card className="shadow-lg border-0 bg-white">
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left: Personal Data Section */}
                                <div className="space-y-6">
                                    <div className="pb-6 border-b border-gray-200">
                                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                            Datos Personales
                                        </h2>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Nombre
                                        </label>
                                        <Input
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleFormInputChange}
                                            placeholder="Nombre completo"
                                            className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                Número Telefónico
                                            </label>
                                            <Input
                                                name="numeroTelefonico"
                                                value={formData.numeroTelefonico}
                                                onChange={handleFormInputChange}
                                                placeholder="+503"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                Correo Electrónico
                                            </label>
                                            <Input
                                                name="correoElectronico"
                                                type="email"
                                                value={formData.correoElectronico}
                                                onChange={handleFormInputChange}
                                                placeholder="correo@ejemplo.com"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                Fecha de nacimiento
                                            </label>
                                            <Input
                                                name="fechaNacimiento"
                                                type="date"
                                                value={formData.fechaNacimiento}
                                                onChange={handleFormInputChange}
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                Documento de identificación
                                            </label>
                                            <Input
                                                name="documentoIdentificacion"
                                                value={formData.documentoIdentificacion}
                                                onChange={handleFormInputChange}
                                                placeholder="DUI"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                AFP Afiliado
                                            </label>
                                            <Input
                                                name="afpAfiliado"
                                                value={formData.afpAfiliado}
                                                onChange={handleFormInputChange}
                                                placeholder="AFP"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                ISSS
                                            </label>
                                            <Input
                                                name="isss"
                                                value={formData.isss}
                                                onChange={handleFormInputChange}
                                                placeholder="ISSS"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Dirección
                                        </label>
                                        <Input
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleFormInputChange}
                                            placeholder="Dirección completa"
                                            className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                Fecha de ingreso
                                            </label>
                                            <Input
                                                name="fechaIngreso"
                                                type="date"
                                                value={formData.fechaIngreso}
                                                onChange={handleFormInputChange}
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                Salario actual
                                            </label>
                                            <Input
                                                name="salarioActual"
                                                value={formData.salarioActual}
                                                onChange={handleFormInputChange}
                                                placeholder="$0.00"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Cargo
                                        </label>
                                        <Select value={formData.cargo} onValueChange={handleSelectChange}>
                                            <SelectTrigger className="border-2 border-gray-300 rounded-lg focus:border-blue-500">
                                                <SelectValue placeholder="Seleccionar cargo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ventas">Ventas</SelectItem>
                                                <SelectItem value="desarrollo">Desarrollo</SelectItem>
                                                <SelectItem value="limpieza">Limpieza</SelectItem>
                                                <SelectItem value="administracion">Administración</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Right: DUI Images Section */}
                                <div className="space-y-6">
                                    <div className="pb-6 border-b border-gray-200">
                                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                            Imágenes del DUI
                                        </h2>
                                    </div>

                                    {/* Drag & Drop Area */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="flex flex-col items-center space-y-4">
                                            <Upload className="w-12 h-12 text-blue-400" />
                                            <p className="text-gray-600 text-sm">
                                                Arrastra la imagen del documento aquí o{' '}
                                                <label className="text-blue-500 font-medium cursor-pointer hover:underline">
                                                    click para buscar
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={handleFileInput}
                                                        className="hidden"
                                                        accept="image/*"
                                                    />
                                                </label>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Images Preview */}
                                    {formData.duiImages.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-700 uppercase">
                                                Imágenes Actuales
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {formData.duiImages.map((file, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="flex items-center justify-between border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                <Upload className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {file.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {(file.size / 1024).toFixed(2)} KB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeImage(index)}
                                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                        >
                                                            <X className="w-5 h-5 text-red-500" />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {formData.duiImages.length === 0 && (
                                        <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50 text-center">
                                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-400 text-2xl">📄</span>
                                            </div>
                                            <p className="text-sm text-gray-500">No hay imágenes cargadas</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8 flex justify-start">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-base">
                                        Registrar
                                    </Button>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.main>
    )
}
