import React, { useEffect, useState, useRef } from "react";
import { MoreVertical, ChevronLeft, ChevronRight, Loader2, Eye, Trash2, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../lib/AuthContext"; 

interface ProductItem {
    idProduct: string;
    qty: number;
    unitPrice: number;
}

interface PurchaseItem {
    id: string;
    date: string;
    discount: string;
    total: number;
    productos?: ProductItem[]; 
}

export const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);
    const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    
    const { user } = useAuth(); 

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchPurchaseHistory = async () => {
        try {
            // Ajustamos por si en tu contexto 'user' expone 'id' o '_id'
            const customerId = user?.id || (user as any)?._id;
            if (!customerId) {
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:4000/api/v1/e-commerce/profile/${customerId}`);
            const resData = await response.json();

            if (response.ok && resData.data) {
                setPurchases(resData.data.purchases || []);
            } else {
                toast.error("No se pudo cargar el historial de compras");
            }
        } catch (error) {
            console.error("Error fetching purchases:", error);
            toast.error("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPurchaseHistory();
        }
    }, [user]);

    const handleOpenView = (purchase: PurchaseItem) => {
        setActiveMenuId(null);
        setSelectedPurchase(purchase);
        setIsViewOpen(true);
    };

    const handleOpenDelete = (purchase: PurchaseItem) => {
        setActiveMenuId(null);
        setSelectedPurchase(purchase);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        const customerId = user?.id || (user as any)?._id;
        if (!selectedPurchase || !customerId) return;

        try {
            const response = await fetch(`http://localhost:4000/api/v1/e-commerce/profile/${customerId}/purchases/${selectedPurchase.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                setPurchases(purchases.filter(p => p.id !== selectedPurchase.id));
                toast.success(`Factura ${selectedPurchase.id} eliminada permanentemente`);
            } else {
                const errData = await response.json();
                toast.error(errData.message || "El servidor denegó la eliminación");
            }
        } catch (error) {
            console.error("Error borrando factura:", error);
            toast.error("Error de red: No se pudo eliminar la factura del servidor");
        } finally {
            setIsDeleteOpen(false);
            setSelectedPurchase(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="animate-spin text-sky-500 mb-2" size={32} />
                <p className="text-sm text-gray-400">Cargando historial de compras...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-center text-xl font-bold text-gray-700 mb-8">Compras realizadas</h3>

            {purchases.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                    Aún no has realizado ninguna compra. ¡Tus facturas aparecerán aquí!
                </div>
            ) : (
                <table className="w-full text-sm text-gray-500">
                    <thead className="text-gray-400 font-medium border-b border-gray-100">
                        <tr>
                            <th className="pb-4 font-medium">N° factura</th>
                            <th className="pb-4 font-medium">Fecha</th>
                            <th className="pb-4 font-medium">Descuento</th>
                            <th className="pb-4 font-medium">Monto total</th>
                            <th className="pb-4 font-medium relative">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {purchases.map((item) => (
                            <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                <td className="py-6 font-mono text-xs text-gray-600">{item.id}</td>
                                <td className="py-6">{item.date}</td>
                                <td className="py-6">
                                    <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-medium">
                                        {item.discount}
                                    </span>
                                </td>
                                <td className="py-6 font-semibold text-gray-700">
                                    ${Number(item.total).toFixed(2)}
                                </td>
                                <td className="py-6 relative flex justify-center items-center">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuId(activeMenuId === item.id ? null : item.id);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {activeMenuId === item.id && (
                                        <div 
                                            ref={menuRef}
                                            className="absolute right-12 top-1/2 -translate-y-1/2 z-40 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 text-left"
                                        >
                                            <button
                                                onClick={() => handleOpenView(item)}
                                                className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                            >
                                                <Eye size={14} className="text-sky-500" />
                                                Ver productos
                                            </button>
                                            <button
                                                onClick={() => handleOpenDelete(item)}
                                                className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50 cursor-pointer"
                                            >
                                                <Trash2 size={14} />
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Paginación */}
            <div className="flex items-center justify-between mt-8 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                    <span>Mostrar más</span>
                    <select className="border border-gray-200 rounded px-2 py-1 outline-none text-[#5BA4E1]">
                        <option>10</option>
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <span>1-{purchases.length} de {purchases.length}</span>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded bg-[#5BA4E1] text-white opacity-50 cursor-not-allowed" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="p-1.5 rounded bg-[#5-[#5BA4E1]] text-white opacity-50 cursor-not-allowed" disabled>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ==================== MODAL DE DETALLES ==================== */}
            {isViewOpen && selectedPurchase && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h4 className="text-base font-bold text-gray-800">Detaille de Factura</h4>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedPurchase.id}</p>
                            </div>
                            <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between text-xs text-gray-400 mb-4 border-b border-gray-100 pb-2">
                                <span>Fecha: <b>{selectedPurchase.date}</b></span>
                                <span>Descuento aplicado: <b className="text-green-600">{selectedPurchase.discount}</b></span>
                            </div>

                            <div className="max-h-48 overflow-y-auto pr-1">
                                <table className="w-full text-xs text-left text-gray-500">
                                    <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-semibold sticky top-0">
                                        <tr>
                                            <th className="p-2 rounded-l">Cod. Producto</th>
                                            <th className="p-2 text-center">Cant.</th>
                                            <th className="p-2 text-right rounded-r">Precio Un.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPurchase.productos && selectedPurchase.productos.length > 0 ? (
                                            selectedPurchase.productos.map((prod, index) => (
                                                <tr key={index} className="border-b border-gray-50 last:border-0">
                                                    <td className="p-2 font-mono text-gray-600 text-[11px]">{prod.idProduct}</td>
                                                    <td className="p-2 text-center font-medium text-gray-700">{prod.qty}</td>
                                                    <td className="p-2 text-right font-semibold text-gray-700">${Number(prod.unitPrice).toFixed(2)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center py-4 text-gray-400 italic">
                                                    Detalles de artículos no disponibles para esta factura.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">Monto total liquidado:</span>
                                <span className="text-lg font-bold text-gray-800">${Number(selectedPurchase.total).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setIsViewOpen(false)} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== MODAL DE ELIMINACIÓN ==================== */}
            {isDeleteOpen && selectedPurchase && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-6 flex gap-4 items-start">
                            <div className="bg-red-50 p-2 rounded-full text-red-500 shrink-0">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-gray-800">¿Eliminar este registro?</h4>
                                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                    Estás a punto de remover la factura <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-bold">{selectedPurchase.id}</span>. Esta acción impactará directamente la base de datos de manera permanente.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => { setIsDeleteOpen(false); setSelectedPurchase(null); }} className="px-3 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                                Cancelar
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer">
                                Sí, eliminar factura
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};