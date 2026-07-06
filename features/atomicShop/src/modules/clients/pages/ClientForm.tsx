import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useGetCustomerByID } from "../hooks/useGetCustomerByID"
import { useUpdateCustomer } from "../hooks/useUpdateCustomer"
import { toast } from "sonner"
import { formatPhoneNumber } from "@/utils/format/numberPhone.format"

const clientSchema = z.object({
    name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, "El nombre solo debe contener letras"),
    telephone: z
        .string()
        .optional()
        .refine((val) => !val || /^[267]\d{3}-\d{4}$/.test(val), {
            message: "Formato de teléfono inválido (ej: 7777-7777)",
        }),
    direction: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 5, {
            message: "La dirección debe tener al menos 5 caracteres",
        }),
    state: z
        .string()
        .min(1, "El estado es obligatorio")
        .refine((val) => ["comun", "frecuente", "restringido"].includes(val), {
            message: "Selecciona un estado válido",
        }),
})

type ClientFormValues = z.infer<typeof clientSchema>

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
} as const

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

export const ClientForm = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const action = searchParams.get("action")
    const clientId = searchParams.get("_id") || ""
    const isEditMode = action === "update" && Boolean(clientId)

    const { mutateAsync: updateClientMutation, isPending: isUpdating } = useUpdateCustomer()
    const { data: clientResponse } = useGetCustomerByID(clientId)

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            telephone: "",
            direction: "",
            state: "comun",
        },
    })

    useEffect(() => {
        if (!isEditMode || !clientResponse?.data) return
        const customer = clientResponse.data
        reset({
            name: customer.name || "",
            telephone: customer.telephone || "",
            direction: customer.direction || "",
            state: customer.state || "comun",
        })
    }, [isEditMode, clientResponse, reset])

    const onSubmitForm = async (formData: ClientFormValues) => {
        if (!isEditMode || !clientId) {
            toast.error("No se encontró el cliente a editar")
            return
        }

        try {
            await updateClientMutation({
                id: clientId,
                payload: {
                    name: formData.name,
                    telephone: formData.telephone || "",
                    direction: formData.direction || "",
                    state: formData.state,
                },
            })
        } catch {
            // toast shown in hook
        }
    }

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
                        Editar cliente
                    </h1>

                    <Card className="shadow-lg border-0 bg-white">
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">

                                <div className="pb-4 border-b border-gray-200">
                                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                        Datos del cliente
                                    </h2>
                                </div>

                                {/* Correo (solo lectura) */}
                                {clientResponse?.data?.mail && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Correo Electrónico
                                        </label>
                                        <Input
                                            value={clientResponse.data.mail}
                                            readOnly
                                            disabled
                                            className="border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            El correo no puede modificarse.
                                        </p>
                                    </div>
                                )}

                                {/* Nombre */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Nombre completo <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        {...register("name")}
                                        placeholder="Nombre completo"
                                        className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                    />
                                    <FieldError message={errors.name?.message} />
                                </div>

                                {/* Teléfono y Estado */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Número Telefónico
                                        </label>
                                        <Input
                                            {...register("telephone")}
                                            placeholder="7777-7777"
                                            maxLength={9}
                                            onChange={(e) =>
                                                setValue("telephone", formatPhoneNumber(e.target.value))
                                            }
                                            className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                        />
                                        <FieldError message={errors.telephone?.message} />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Estado <span className="text-red-500">*</span>
                                        </label>
                                        <Controller
                                            control={control}
                                            name="state"
                                            render={({ field }) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="border-2 border-gray-300 rounded-lg focus:border-blue-500">
                                                        <SelectValue placeholder="Seleccionar estado" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="comun">Común</SelectItem>
                                                        <SelectItem value="frecuente">Frecuente</SelectItem>
                                                        <SelectItem value="restringido">Restringido</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FieldError message={errors.state?.message} />
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Dirección
                                    </label>
                                    <Input
                                        {...register("direction")}
                                        placeholder="Dirección completa"
                                        className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                    />
                                    <FieldError message={errors.direction?.message} />
                                </div>

                                {/* Botones */}
                                <div className="pt-4 flex items-center gap-3">
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-base"
                                        >
                                            {isUpdating ? "Guardando..." : "Actualizar cliente"}
                                        </Button>
                                    </motion.div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate("/atomicAdmin/clientes")}
                                        className="py-3 px-6 rounded-lg text-base"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.main>
    )
}
