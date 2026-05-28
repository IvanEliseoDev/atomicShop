import { useMutation } from '@tanstack/react-query';
import { deleteCustomer } from '../actions/deleteCustomer.action';
import { queryClient } from '@/AtomicShop-App';
import { toast } from 'sonner';

export const useDeleteCustomer = () => {
  return useMutation({
    mutationFn: (id:string) => deleteCustomer(id),
    onSuccess: () => {
      // Invalida la query de "getCustomers" para que se vuelva a traer la lista actualizada
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("¡Cliente eliminado con éxito!");
     
    },
    onError: (error: any) => {
      toast.error("Hubo un error al eliminar al cliente");
      console.error(error);
    }
  })
}
