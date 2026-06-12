import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Upload, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Controller, useForm } from "react-hook-form"
import { useAddEmployee, useUpdateEmployee } from "../hooks/useEmployeeMutate"
import { useGetEmployeeByID } from "../hooks/useGetEmployeeByID"

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
} as const;

interface EmployeeFormValues {
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
}

export const EmployeeForm = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const mode = searchParams.get('mode')
    const employeeId = searchParams.get('id') || ''
    const isEditMode = mode === 'edit' && Boolean(employeeId)

    const createEmployeeMutation = useAddEmployee()
    const updateEmployeeMutation = useUpdateEmployee()
    const { mutateAsync: createEmployee } = createEmployeeMutation
    const { mutateAsync: updateEmployee } = updateEmployeeMutation
    const { data: employeeResponse } = useGetEmployeeByID(employeeId)

    const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm<EmployeeFormValues>({
        defaultValues: {
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
        },
    })

    const [duiImages, setDuiImages] = useState<File[]>([])
    const [defaultDuiImage, setDefaultDuiImage] = useState('default.png')

    useEffect(() => {
        if (!isEditMode || !employeeResponse?.data) {
            return
        }

        const employee = employeeResponse.data
        reset({
            nombre: employee.name || '',
            numeroTelefonico: employee.number_phone || '',
            correoElectronico: employee.email || '',
            fechaNacimiento: employee.birthDay ? new Date(employee.birthDay).toISOString().slice(0, 10) : '',
            documentoIdentificacion: employee.dui || '',
            afpAfiliado: employee.afp_affiliated || '',
            isss: employee.isss || '',
            direccion: employee.direction || '',
            fechaIngreso: employee.payroll_month || '',
            salarioActual: employee.salary?.$numberDecimal ? `$${employee.salary.$numberDecimal}` : '$0.00',
            cargo: employee.position || '',
        })

        if (employee.dui_img) {
            setDefaultDuiImage(employee.dui_img)
        }
    }, [isEditMode, employeeResponse, reset])

    const onSubmitForm = async (data: EmployeeFormValues) => {
        const salaryValue = parseFloat(data.salarioActual.replace(/[^0-9.-]+/g, '')) || 0
        const payload: Record<string, any> = {
            name: data.nombre,
            dui: data.documentoIdentificacion,
            birthDay: data.fechaNacimiento,
            number_phone: data.numeroTelefonico,
            afp_affiliated: data.afpAfiliado,
            isss: data.isss,
            direction: data.direccion,
            position: data.cargo,
            payroll_month: data.fechaIngreso,
            salary: salaryValue,
            email: data.correoElectronico,
            dui_img: duiImages.length > 0 ? duiImages[0].name : defaultDuiImage,
        }

        try {
            if (isEditMode && employeeId) {
                await updateEmployee({ id: employeeId, dataUpd: payload })
                alert('Empleado actualizado correctamente')
            } else {
                await createEmployee(payload)
                alert('Empleado registrado correctamente')
            }

            navigate('/atomicAdmin/empleados')
        } catch (error) {
            console.error('Error al guardar empleado:', error)
            alert('Ocurrió un error al procesar el empleado')
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const files = Array.from(e.dataTransfer.files)
        setDuiImages((prev) => [...prev, ...files])
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return
        }

        const files = Array.from(e.target.files)
        setDuiImages((prev) => [...prev, ...files])
    }

    const removeImage = (index: number) => {
        setDuiImages((prev) => prev.filter((_, i) => i !== index))
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const loading = isSubmitting
    return (
        <motion.main
            className="w-full min-h-screen bg-linear-to-br from-blue-50 to-slate-50 p-4 md:p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div variants={itemVariants}>
                    <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                        {isEditMode ? 'Editar empleado' : 'Registro de empleado'}
                    </h1>

                    <Card className="shadow-lg border-0 bg-white">
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                {/* COLUMNA IZQUIERDA: DATOS PERSONALES */}
                                <div className="space-y-6">
                                    <div className="pb-6 border-b border-gray-200">
                                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                            Datos Personales
                                        </h2>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Nombre</label>
                                        <Input
                                            {...register('nombre')}
                                            placeholder="Nombre completo"
                                            className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Número Telefónico</label>
                                            <Input
                                                {...register('numeroTelefonico')}
                                                placeholder="+503"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Correo Electrónico</label>
                                            <Input
                                                {...register('correoElectronico')}
                                                type="email"
                                                placeholder="correo@ejemplo.com"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Fecha de nacimiento</label>
                                            <Input
                                                {...register('fechaNacimiento')}
                                                type="date"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Documento de identificación</label>
                                            <Input
                                                {...register('documentoIdentificacion')}
                                                placeholder="DUI"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">AFP Afiliado</label>
                                            <Input
                                                {...register('afpAfiliado')}
                                                placeholder="AFP"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">ISSS</label>
                                            <Input
                                                {...register('isss')}
                                                placeholder="ISSS"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Dirección</label>
                                        <Input
                                            {...register('direccion')}
                                            placeholder="Dirección completa"
                                            className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Fecha de ingreso</label>
                                            <Input
                                                {...register('fechaIngreso')}
                                                type="date"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Salario actual</label>
                                            <Input
                                                {...register('salarioActual')}
                                                placeholder="$0.00"
                                                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Cargo</label>
                                        <Controller
                                            control={control}
                                            name="cargo"
                                            render={({ field }) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
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
                                            )}
                                        />
                                    </div>
                                </div> {/* Fin Columna Izquierda */}

                                {/* COLUMNA DERECHA: IMÁGENES DEL DUI */}
                                <div className="space-y-6">
                                    <div className="pb-6 border-b border-gray-200">
                                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Imágenes del DUI</h2>
                                    </div>

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

                                    {duiImages.length > 0 ? (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-700 uppercase">Imágenes Actuales</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {duiImages.map((file, index) => (
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
                                                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                        >
                                                            <X className="w-5 h-5 text-red-500" />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50 text-center">
                                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-400 text-2xl">📄</span>
                                            </div>
                                            <p className="text-sm text-gray-500">No hay imágenes cargadas</p>
                                        </div>
                                    )}
                                </div> {/* Aquí solo queda UN div (Cierre de la columna derecha) */}

                                {/* BOTÓN DE ENVÍO */}
                                <div className="mt-8 flex justify-start lg:col-span-2">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-base">
                                            {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Registrar'}
                                        </Button>
                                    </motion.div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div> {/* Cierra correctamente el motion.div */}
            </div> {/* Cierra el max-w-7xl */}
        </motion.main>
    )
}
