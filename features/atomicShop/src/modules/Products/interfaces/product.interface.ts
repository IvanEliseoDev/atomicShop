export type EstadoProducto = 'Frecuente' | 'Común' | 'Restringido';

export interface Producto {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
    marca: string;
    cantidad: number;
    precio: number;
    estado: EstadoProducto;
    imagen?: string;
}