import { Types } from "mongoose";

// Tipo para el tipo de venta
export type TypeSale = "gravada" | "exenta";

export type TypePayment = "en efectivo" | "transferencia" | "tarjeta"

// Interfaz para los productos (por si se crea una factura directa SIN carrito)
export interface IInvoiceProduct {
  id_product: Types.ObjectId | string;
  amount: number;
  discount: number;
  subtotal: number;
}

// 1. Campos compartidos que SIEMPRE se necesitan independientemente del carrito
interface BaseInvoice {
  DTE: string;
  emision_date: Date | string;
  type_payment: TypePayment;          // Ej: "efectivo", "tarjeta"
  customer_id: Types.ObjectId | string;
  payment_received: number;      // El dinero que entrega el cliente
  change: number;                // El vuelto / cambio calculado
  type_sale: TypeSale;           // "gravada" | "exenta"
}

// 2. CASO A: La factura se crea DESDE UN CARRITO (id_cart presente)
// Los campos de montos y productos se vuelven OPCIONALES porque se heredarán del modelo Carts
interface InvoiceWithCart extends BaseInvoice {
  id_cart: Types.ObjectId | string; // Obligatorio aquí
  
  // Opcionales o autogenerados en el backend a través del carrito
  products?: IInvoiceProduct[];
  subtotal_sale?: number;           // Equivalente al 'total' del carrito antes de descuento
  general_sale_discount?: number;   // Equivalente al 'disccount' del carrito
  total_with_discount?: number;     // Equivalente al 'totalWithDiscount' del carrito
  total_pay?: number;               // Total final a pagar
}

// 3. CASO B: La factura se crea DIRECTAMENTE (id_cart NO presente)
// Todos los campos de productos y cálculos matemáticos pasan a ser OBLIGATORIOS
interface InvoiceWithoutCart extends BaseInvoice {
  id_cart?: never;                  // No debe existir si es directa
  
  products: IInvoiceProduct[];       // Obligatorio
  subtotal_sale: number;             // Obligatorio
  general_sale_discount: number;     // Obligatorio
  total_with_discount: number;       // Obligatorio
  total_pay: number;                 // Obligatorio
}

// Tipo final exportable
export type ICommercialInvoice = InvoiceWithCart | InvoiceWithoutCart;