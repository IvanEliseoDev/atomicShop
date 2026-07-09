import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInvoicesAction } from "../actions/getInvoices.action";
import { toggleInvoiceAction } from "../actions/toggleInvoice.action";

export const useGetInvoices = () => {
  return useQuery({
    queryKey: ["admin-invoices"],
    queryFn: getInvoicesAction,
  });
};

export const useToggleInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleInvoiceAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
    },
  });
};
