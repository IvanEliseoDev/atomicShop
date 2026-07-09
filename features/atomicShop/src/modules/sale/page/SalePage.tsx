import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CustomPaginationPage } from "@/components/custom/pagination/CustomPaginationPage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, Power, PowerOff } from "lucide-react";
import { CustomNotRegister } from "@/components/custom/span/CustomNotRegister";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useGetInvoices, useToggleInvoice } from "../hooks/useGetInvoices";
import { HeaderAdmin } from "@/components/custom/header/HeaderAdmin";
import type { AdminInvoice } from "../actions/getInvoices.action";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
    credito: "Crédito",
    debito: "Débito",
    efectivo: "Efectivo",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
    pendiente: "Pendiente",
    pagado: "Pagado",
    rechazado: "Rechazado",
};

const PAYMENT_STATUS_COLOR: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-700",
    pagado: "bg-green-100 text-green-700",
    rechazado: "bg-red-100 text-red-700",
};

const TableSkeleton = () => (
    <>
        {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-4">
                        <Skeleton className="h-4 w-full" />
                    </td>
                ))}
            </tr>
        ))}
    </>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export const SalePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [paymentFilter, setPaymentFilter] = useState("Todos");

    const { data: invoicesResponse, isLoading } = useGetInvoices();
    const { mutateAsync: toggleInvoice, isPending: isToggling } = useToggleInvoice();

    const invoices: AdminInvoice[] = invoicesResponse?.data ?? [];

    const filtered = invoices.filter((inv) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
            inv.invoiceNumber.toLowerCase().includes(q) ||
            (inv.customerId?.name ?? "").toLowerCase().includes(q);

        const matchesStatus =
            statusFilter === "Todos" ||
            (statusFilter === "Activa" && inv.state) ||
            (statusFilter === "Inactiva" && !inv.state);

        const matchesPayment =
            paymentFilter === "Todos" || inv.paymentStatus === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleToggle = async (inv: AdminInvoice) => {
        const action = inv.state ? "desactivar" : "activar";
        const result = await Swal.fire({
            title: `¿${inv.state ? "Desactivar" : "Activar"} factura?`,
            html: `Se ${action}á la factura <b>${inv.invoiceNumber}</b>.`,
            icon: inv.state ? "warning" : "question",
            showCancelButton: true,
            confirmButtonColor: inv.state ? "#ef4444" : "#22c55e",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Sí, ${action}`,
            cancelButtonText: "Cancelar",
        });
        if (!result.isConfirmed) return;
        try {
            await toggleInvoice(inv._id);
            toast.success(`Factura ${inv.state ? "desactivada" : "activada"} correctamente`);
        } catch {
            toast.error("No se pudo cambiar el estado de la factura");
        }
    };

    return (
        <motion.main
            className="w-full min-h-screen bg-linear-to-br from-blue-50 to-slate-50 p-4 md:p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="space-y-6">
                    <HeaderAdmin
                        title="Ventas"
                        amount={invoices.length}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onAddClick={undefined}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                    >
                        <Card>
                            <CardContent className="pt-5 space-y-4">
                                {/* Filtros */}
                                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-600">Filtros:</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:ml-4">
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="border-2 border-gray-300 w-full sm:w-44">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Todos">Estado: Todos</SelectItem>
                                                <SelectItem value="Activa">Estado: Activa</SelectItem>
                                                <SelectItem value="Inactiva">Estado: Inactiva</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                                            <SelectTrigger className="border-2 border-gray-300 w-full sm:w-48">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Todos">Pago: Todos</SelectItem>
                                                <SelectItem value="pendiente">Pago: Pendiente</SelectItem>
                                                <SelectItem value="pagado">Pago: Pagado</SelectItem>
                                                <SelectItem value="rechazado">Pago: Rechazado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Tabla */}
                                <div className="overflow-x-auto rounded-lg border border-gray-100">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-blue-500 text-white">
                                                <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Factura</th>
                                                <th className="text-left font-semibold px-4 py-3">Cliente</th>
                                                <th className="text-center font-semibold px-4 py-3">Total</th>
                                                <th className="text-center font-semibold px-4 py-3">Método Pago</th>
                                                <th className="text-center font-semibold px-4 py-3">Estado Pago</th>
                                                <th className="text-center font-semibold px-4 py-3">Fecha</th>
                                                <th className="text-center font-semibold px-4 py-3">Activa</th>
                                                <th className="text-center font-semibold px-4 py-3 rounded-tr-lg">Acciones</th>
                                            </tr>
                                        </thead>
                                        <motion.tbody
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            key={`${currentPage}-${statusFilter}-${paymentFilter}`}
                                        >
                                            {isLoading ? (
                                                <TableSkeleton />
                                            ) : paginated.length === 0 ? (
                                                <CustomNotRegister title="Facturas" />
                                            ) : (
                                                paginated.map((inv, index) => (
                                                    <motion.tr
                                                        key={inv._id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.04 }}
                                                        className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                                                    >
                                                        <td className="px-4 py-4 font-medium text-gray-800">{inv.invoiceNumber}</td>
                                                        <td className="px-4 py-4 text-gray-700">{inv.customerId?.name ?? "—"}</td>
                                                        <td className="px-4 py-4 text-center font-semibold text-gray-800">
                                                            ${inv.total?.toFixed(2) ?? "0.00"}
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-gray-600 capitalize">
                                                            {PAYMENT_METHOD_LABEL[inv.paymentMethod] ?? inv.paymentMethod}
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLOR[inv.paymentStatus] ?? ""}`}>
                                                                {PAYMENT_STATUS_LABEL[inv.paymentStatus] ?? inv.paymentStatus}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-gray-600">
                                                            {new Date(inv.dateCreation).toLocaleDateString("es-ES")}
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${inv.state ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                                {inv.state ? "Activa" : "Inactiva"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-44 bg-white border border-gray-100 shadow-md rounded-lg p-1">
                                                                    <DropdownMenuItem
                                                                        disabled={isToggling}
                                                                        onClick={() => handleToggle(inv)}
                                                                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                                                                            inv.state
                                                                                ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
                                                                                : "text-green-600 hover:bg-green-50 focus:bg-green-50"
                                                                        }`}
                                                                    >
                                                                        {inv.state ? (
                                                                            <><PowerOff size={14} /> Desactivar</>
                                                                        ) : (
                                                                            <><Power size={14} /> Activar</>
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            )}
                                        </motion.tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <CustomPaginationPage
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </motion.main>
    );
};
