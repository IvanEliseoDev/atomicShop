import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addEmployeeAction } from '../actions/add.employee.action';
import { updateEmployeeAction } from '../actions/update.employee.action';
import { deleteEmployeeAction } from '../actions/delete.employee.action';
import { toast } from 'sonner';

// Hook para AGREGAR empleado
export const useAddEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEmployeeAction,
    onSuccess: () => {
      // Invalida la caché para recargar la lista de empleados en tiempo real
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      console.error("Error desde el hook useAddEmployee:", error);
    }
  });
};

// Hook para EDITAR empleado
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Como useMutation recibe un solo argumento en su mutate(), pasamos un objeto con id y dataUpd
    mutationFn: ({ id, dataUpd }: { id: string; dataUpd: any }) => 
      updateEmployeeAction(id, dataUpd),
    onSuccess: () => {
      // Limpia la caché general de empleados para que el GET refleje los cambios
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      console.error("Error desde el hook useUpdateEmployee:", error);
    }
  });
};

// Hook para ELIMINAR empleado
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEmployeeAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success('Empleado eliminado correctamente');
    },
    onError: () => {
      toast.error('Ocurrió un error al eliminar el empleado');
    },
  });
};