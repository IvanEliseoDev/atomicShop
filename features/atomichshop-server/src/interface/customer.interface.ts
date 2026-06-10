import { Document } from "mongoose";

// 1. Primero definimos la estructura de la compra
export interface IPurchase {
    id: string;        // Número de factura (ej: FAC-123456)
    date: string;      // Fecha de la compra
    discount: string;  // Descuento aplicado (ej: "10%")
    total: number;     // El monto total pagado
    productos: Array<{
        idProduct: string;
        qty: number;
        unitPrice?: number;
    }>;
}

export interface ICustomer extends Document {
    name: string;
    mail: string;
    password: string | null;
    telephone: string;
    direction: string;
    deparmet: string,
    municipality: string,
    typeCustomer: string;
    dui: string;
    nit: string;
    typeActivity: string;
    state: string;
    loginAttemps: number;
    timeOut: Date | null;
    image?: string; //El "?" sirve para indicarnos que estos campos pueden ser opcionales, un cliente puede agregar una imagen y a la vez no, por eso es un campo opcional
    public_id?: string;
    wishlist?: string[]; 
    purchases?: IPurchase[];
}