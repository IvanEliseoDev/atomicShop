import { getBrandsActions } from '@/actions/get.brands'
import { useQuery } from '@tanstack/react-query'

export const useGetBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrandsActions,
    staleTime: 1000 * 60 * 5
  })
}
