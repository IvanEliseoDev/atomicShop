import type { EstadoProducto } from "../interfaces/product.interface";

export const estadoConfig: Record<EstadoProducto, { color: string; bg: string; text: string }> = {
    Frecuente:   { color: 'bg-green-500',  bg: 'bg-green-50',  text: 'text-green-700' },
    Común:       { color: 'bg-blue-400',   bg: 'bg-blue-50',   text: 'text-blue-700' },
    Restringido: { color: 'bg-red-500',    bg: 'bg-red-50',    text: 'text-red-700' },
};