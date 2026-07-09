import { AtomicShop_API } from "@/api/AtomicShop-API";

export const toggleInvoiceAction = async (id: string) => {
  const { data } = await AtomicShop_API.put(`/admin/invoices/${id}/toggle`);
  return data;
};
