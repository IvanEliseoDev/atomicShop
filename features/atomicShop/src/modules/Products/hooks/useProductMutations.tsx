import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../actions/put.product.action";
import { addProductAction } from "../actions/post.product.action";
import { deleteProduct } from "../actions/delete.product.action";
import { toggleProductState } from "../actions/toggle.product.action";

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  // Mutación para Crear Producto
  const createProductMutation = useMutation({
    mutationFn: addProductAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Error al crear producto desde el hook:", error);
    }
  });

  // Mutación para Editar Producto
  const updateProductMutation = useMutation({
    mutationFn: ({ id, dataProduct }: { id: string; dataProduct: any }) => 
      updateProduct(id, dataProduct),
    // Usamos las variables pasadas a la mutación para invalidar la query exacta
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productsbyid", variables.id] });
    },
    onError: (error) => {
      console.error("Error al editar producto desde el hook:", error);
    }
  });

  // Mutación para Eliminar Producto
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  // Mutación para Cambiar Estado (activar/desactivar)
  const toggleProductMutation = useMutation({
    mutationFn: toggleProductState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  return {
    createProduct: createProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    updateProduct: updateProductMutation.mutateAsync,
    mutateUpdate: updateProductMutation.mutateAsync,
    isUpdating: updateProductMutation.isPending,
    deleteProduct: deleteProductMutation.mutateAsync,
    isDeleting: deleteProductMutation.isPending,
    toggleProduct: toggleProductMutation.mutateAsync,
    isToggling: toggleProductMutation.isPending,
  };
};