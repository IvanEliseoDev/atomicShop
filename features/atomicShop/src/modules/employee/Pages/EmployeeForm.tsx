import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAddEmployee, useUpdateEmployee } from "../hooks/useEmployeeMutate"
import { useGetEmployeeByID } from "../hooks/useGetEmployeeByID"
import { toast } from "sonner"
import { formatPhoneNumber } from "@/utils/format/numberPhone.format"

const employeeSchema = z.object({
    nombre: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, "El nombre solo debe contener letras"),
    numeroTelefonico: z
        .string()
        .optional()
        .refine((val) => !val || /^[267]\d{3}-\d{4}$/.test(val), {
            message: "Formato de teléfono inválido (ej: 7777-7777)",
        }),
    correoElectronico: z
        .string()
        .min(1, "El correo es obligatorio")
        .email("Debe ser un correo electrónico válido"),
    direccion: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 5, {
            message: "La dirección debe tener al menos 5 caracteres",
        }),
    cargo: z
        .string()
        .min(1, "El cargo es obligatorio")
        .refine((val) => ["Admin", "Empleado"].includes(val), {
            message: "Selecciona un cargo válido",
        }),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
} as const

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
}

export const EmployeeForm = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const mode = searchParams.get("mode")
    const employeeId = searchParams.get("id") || ""
    const isEditMode = mode === "edit" && Boolean(employeeId)

    const { mutateAsync: createEmployee, isPending: isCreating } = useAddEmployee()
    const { mutateAsync: updateEmployee, isPending: isUpdating } = useUpdateEmployee()
    const { data: employeeResponse } = useGetEmployeeByID(employeeId)

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            nombre: "",
            numeroTelefonico: "",
            correoElectronico: "",
            direccion: "",
            cargo: "",
        },
    })

    useEffect(() => {
        if (!isEditMode || !employeeResponse?.data) return
        const employee = employeeResponse.data
        reset({
            nombre: employee.name || "",
            numeroTelefonico: employee.number_phone || "",
            correoElectronico: employee.email || "",
            direccion: employee.direction || "",
            cargo: employee.position || "",
        })
    }, [isEditMode, employeeResponse, reset])

    const onSubmitForm = async (data: EmployeeFormValues) => {
        const payload = {
            name: data.nombre,
            number_phone: data.numeroTelefonico || undefined,
            direction: data.direccion || undefined,
            position: data.cargo,
            email: data.correoElectronico,
        }

        try {
            if (isEditMode && employeeId) {
                await updateEmployee({ id: employeeId, dataUpd: payload })
                toast.success("Empleado actualizado correctamente")
            } else {
                await createEmployee(payload)
                toast.success("Empleado registrado. Se enviará un correo con sus credenciales de acceso.")
            }
            navigate("/atomicAdmin/empleados")
        } catch {
            toast.error("Ocurrió un error al procesar el empleado. Inténtalo de nuevo.")
        }
    }

    const loading = isCreating || isUpdating

    const FieldError = ({ message }: { message?: string }) =>
        message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null

    return (
        <motion.main
            className="w-full min-h-screen bg-linear-to-br from-blue-50 to-slate-50 p-4 md:p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-3xl mx-auto space-y-8">
                <motion.div variants={itemVariants}>
                    <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                        {isEditMode ? "Editar empleado" : "Registro de empleado"}
                    </h1>

                    <Card className="shadow-lg border-0 bg-white">
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">

                                <div className="pb-4 border-b border-gray-200">
                                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                        Datos del empleado
                                    </h2>
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Nombre completo <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        {...register("nombre")}
                                        placeholder="Nombre completo"
                                        className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                    />
                                    <FieldError message={errors.nombre?.message} />
                                </div>

                                {/* Teléfono y Correo */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Número Telefónico
                                        </label>
                                        <Input
                                            {...register("numeroTelefonico")}
                                            placeholder="7777-7777"
                                            maxLength={9}
                                            onChange={(e) =>
                                                setValue("numeroTelefonico", formatPhoneNumber(e.target.value))
                                            }
                                            className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                        />
                                        <FieldError message={errors.numeroTelefonico?.message} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Correo Electrónico <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            {...register("correoElectronico")}
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            disabled={isEditMode}
                                            className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                        <FieldError message={errors.correoElectronico?.message} />
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Dirección
                                    </label>
                                    <Input
                                        {...register("direccion")}
                                        placeholder="Dirección completa"
                                        className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                    />
                                    <FieldError message={errors.direccion?.message} />
                                </div>

                                {/* Cargo */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Cargo <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        control={control}
                                        name="cargo"
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="border-2 border-gray-300 rounded-lg focus:border-blue-500">
                                                    <SelectValue placeholder="Seleccionar cargo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Admin">Administrador</SelectItem>
                                                    <SelectItem value="Empleado">Empleado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <FieldError message={errors.cargo?.message} />
                                </div>

                                {/* Fecha de ingreso (solo lectura en modo edición) */}
                                {isEditMode && employeeResponse?.data?.payroll_month && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Fecha de ingreso
                                        </label>
                                        <Input
                                            value={employeeResponse.data.payroll_month}
                                            readOnly
                                            disabled
                                            className="border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            La fecha de ingreso se asigna automáticamente y no puede modificarse.
                                        </p>
                                    </div>
                                )}

                                {/* Botón */}
                                <div className="pt-4 flex justify-start">
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-base"
                                        >
                                            {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Registrar"}
                                        </Button>
                                    </motion.div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.main>
    )
}
