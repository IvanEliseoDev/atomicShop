import { useMutation } from '@tanstack/react-query';
import { restrictCustomer } from '../actions/restrictCustomer.action';
import { queryClient } from '@/AtomicShop-App';
import { toast } from 'sonner';

export const useRestrictCustomer = () => {
    return useMutation({
        mutationFn: restrictCustomer,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            const msg = variables.state === "restringido"
                ? "Cliente restringido correctamente"
                : "Cliente habilitado correctamente";
            toast.success(msg);
        },
        onError: () => {
            toast.error("Ocurrió un error al cambiar el estado del cliente");
        }
    });
};
