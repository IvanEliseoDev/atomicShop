import { AtomicShop_API } from "@/api/AtomicShop-API";

export const getInvoicesAction = async () => {
  const { data } = await AtomicShop_API.get("/admin/invoices");
  return data as {
    status: number;
    message: string;
    data: AdminInvoice[];
  };
};

export interface AdminInvoice {
  _id: string;
  invoiceNumber: string;
  customerId: { _id: string; name: string; mail: string; telephone?: string } | null;
  total: number;
  subtotal: number;
  discountTotal: number;
  paymentMethod: "credito" | "debito" | "efectivo";
  paymentStatus: "pendiente" | "pagado" | "rechazado";
  state: boolean;
  dateCreation: string;
  createdAt: string;
}
