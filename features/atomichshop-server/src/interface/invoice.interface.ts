import { Document, Types } from "mongoose";

// Detalle de cada producto dentro de la factura
export interface IInvoiceProduct {
    productId: Types.ObjectId;
    quantity: number;
    unitPrice: number;    // precio real consultado desde la BD en el momento de la compra
    discount: number;     // porcentaje de descuento aplicado (0-100)
    subtotalLine: number; // unitPrice * quantity con descuento ya aplicado
}

// Datos de envio capturados en el paso 2 del checkout
export interface IDeliveryData {
    direccion: string;
    departamento: string;
    municipio: string;
    fechaEntrega?: Date; // opcional segun el formulario DatosEntrega.tsx
}

// Documento principal de factura (coleccion sales)
export interface IInvoice extends Document {
    invoiceNumber: string;           // correlativo autogenerado: FCF-000001
    customerId: Types.ObjectId;      // ref Customers
    products: IInvoiceProduct[];
    deliveryData: IDeliveryData;
    subtotal: number;                // suma de precios sin descuento
    discountTotal: number;           // suma total de descuentos aplicados
    total: number;                   // subtotal - discountTotal
    paymentMethod: "credito" | "debito" | "efectivo";
    paymentStatus: "pendiente" | "pagado" | "rechazado";
    wompiTransactionId?: string;     // ID retornado por Wompi, solo para tarjetas
    state: boolean;                  // true = activo, false = anulado
    dateCreation: Date;
}