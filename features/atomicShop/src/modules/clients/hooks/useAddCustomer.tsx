import { useMutation } from '@tanstack/react-query';
import { addCustomer } from '../actions/addCustomer.action';
import { queryClient } from '@/AtomicShop-App';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export const useAddCustomer = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      // Invalida la query de "getCustomers" para que se vuelva a traer la lista actualizada
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("¡Cliente registrado con éxito!");
      navigate("/atomicAdmin/clientes")
    },
    onError: (error: any) => {
      toast.error("Hubo un error al registrar al cliente");
      console.error(error);
    }
  })
}
