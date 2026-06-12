import { useQuery } from '@tanstack/react-query'
import { getProductByIdAction } from '../actions/get.product.byid.action';

export const useGetProductByID = (id:String) => {
  return useQuery({
      queryKey: ["productsbyid", id],
      queryFn: () => getProductByIdAction(id),
      staleTime: 1000 * 60 * 5
    })
}
