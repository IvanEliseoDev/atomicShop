import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '../actions/getCustomers.action'
import type { CustomerResponse } from '../responses/getCustomerResponse'

export const useGetAllCustomers = () => {
  return useQuery<CustomerResponse>({
    queryKey: ["customers"],
    queryFn: getCustomers,
    staleTime: 1000 * 60 * 5 //La cache se invalida cada 5 minutos
  })
}
