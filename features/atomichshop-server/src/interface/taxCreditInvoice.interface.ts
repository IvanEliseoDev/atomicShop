import { Types } from "mongoose";

// Tipos base compartidos
export type TypeSale = "gravada" | "exenta";
export type ConditionSale = "contado" | "crédito"; // Común en Crédito Fiscal

export interface IProductTaxCredit {
  id_product: Types.ObjectId | string;
  amount: number;
  discount: number;
  subtotal: number; // En Crédito Fiscal, este subtotal suele ser SIN IVA
}

//Campos que SIEMPRE son obligatorios
interface BaseTaxCredit {
  DTE: string;
  emision_date: Date | string;
  type_payment: string;         // Ej: "transferencia", "cheque"
  customer_id: Types.ObjectId | string;
  condition_sale: ConditionSale; // Contado / Crédito
  type_sale: TypeSale;
  details?: string;             // Observaciones adicionales
  
  // Totales de impuestos 
  vat_tax: number;              // IVA (13% en El Salvador)
  total_not_taxed: number;      // Ventas no sujetas
  total_operations: number;     // Suma de gravadas + exentas + no sujetas
  
  // Retenciones y Percepciones (Clave en Crédito Fiscal)
  vat_received?: number;        // IVA Percibido
  vat_detained?: number;        // IVA Retenido
  rent?: number;                // renta
  
  payment_received: number;
  change: number;
  total_pay: number;
}

// 2. Escenario A: Con Carrito (Datos de productos y montos heredados)
interface TaxCreditWithCart extends BaseTaxCredit {
  id_cart: Types.ObjectId | string; // Obligatorio
  
  // Campos opcionales porque el Backend los sincronizará del Carrito
  products?: IProductTaxCredit[];
  subtotal_sale?: number;
  general_sale_discount?: number;
  total_with_discount?: number;
}

// 3. Escenario B: Sin Carrito (Factura Directa - Todo es obligatorio)
interface TaxCreditWithoutCart extends BaseTaxCredit {
  id_cart?: never; // No debe existir
  
  products: IProductTaxCredit[]; // Obligatorio
  subtotal_sale: number;
  general_sale_discount: number;
  total_with_discount: number;
}

// Tipo final exportable
export type ITaxCreditInvoice = TaxCreditWithCart | TaxCreditWithoutCart;