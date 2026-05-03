import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { updateCustomer } from '../actions/updateCustomer.action';
import { queryClient } from '@/AtomicShop-App';
import { toast } from 'sonner';

export const useUpdateCustomer = () => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: updateCustomer,
        onSuccess: (_data, variables) => {
            // Invalida la query de "getCustomers" para que se vuelva a traer la lista actualizada
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            queryClient.invalidateQueries({ queryKey: ["CustomerByID", variables.id] });
            toast.success("¡Cliente actualizado con éxito!");
            navigate("/atomicAdmin/clientes")
        },
        onError: (error: any) => {
            toast.error("Hubo un error al actualizar al cliente");
            console.error(error);
        }
    })
}
