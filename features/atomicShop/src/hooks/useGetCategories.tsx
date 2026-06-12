import { getCategoriesAction } from '@/actions/get.categories'
import { useQuery } from '@tanstack/react-query'

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
    staleTime: 1000 * 60 * 5
  })
}
