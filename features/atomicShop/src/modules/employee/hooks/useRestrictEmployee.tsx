import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restrictEmployeeAction } from '../actions/restrict.employee.action';
import { toast } from 'sonner';

export const useRestrictEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => restrictEmployeeAction(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            const msg = data?.data?.isVerified
                ? 'Empleado habilitado correctamente'
                : 'Empleado restringido correctamente';
            toast.success(msg);
        },
        onError: () => {
            toast.error('Ocurrió un error al cambiar el estado del empleado');
        },
    });
};
