import { useQuery } from '@tanstack/react-query'
import { getProductAction } from '../actions/get.product.action'

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProductAction,
    staleTime: 1000 * 60 * 5
  })
}
