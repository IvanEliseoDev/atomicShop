import { useQuery } from '@tanstack/react-query'
import { getCustomerByID } from '../actions/getCustomerByID.action'

export const useGetCustomerByID = (id:string) => {
  return useQuery({
    queryKey: ["CustomerByID", id],
    queryFn: () => getCustomerByID(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
