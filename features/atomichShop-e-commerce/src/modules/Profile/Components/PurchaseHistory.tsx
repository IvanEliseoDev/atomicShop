import React from "react";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

export const PurchaseHistory = () => {
    const purchases = [
        { id: "0000000001", date: "00/00/0000", discount: "0%", total: "$00.00" },
        { id: "0000000002", date: "00/00/0000", discount: "0%", total: "$00.00" },
        { id: "0000000003", date: "00/00/0000", discount: "0%", total: "$00.00" },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-center text-xl font-bold text-gray-700 mb-8">Compras realizadas</h3>

            <table className="w-full text-sm text-gray-500">
                <thead className="text-gray-400 font-medium border-b border-gray-100">
                    <tr>
                        <th className="pb-4 font-medium">N° factura</th>
                        <th className="pb-4 font-medium">Fecha</th>
                        <th className="pb-4 font-medium">Descuento</th>
                        <th className="pb-4 font-medium">Monto total</th>
                        <th className="pb-4 font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {purchases.map((item) => (
                        <tr key={item.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-6">{item.id}</td>
                            <td className="py-6">{item.date}</td>
                            <td className="py-6">{item.discount}</td>
                            <td className="py-6 font-semibold text-gray-700">{item.total}</td>
                            <td className="py-6">
                                <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación estilo imagen */}
            <div className="flex items-center justify-between mt-8 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                    <span>Mostrar más</span>
                    <select className="border border-gray-200 rounded px-2 py-1 outline-none text-[#5BA4E1]">
                        <option>10</option>
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <span>1-2 de 2</span>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded bg-[#5BA4E1] text-white opacity-70"><ChevronLeft size={18} /></button>
                        <button className="p-1.5 rounded bg-[#5BA4E1] text-white"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};