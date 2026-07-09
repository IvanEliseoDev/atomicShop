import { useQuery } from '@tanstack/react-query'
import { getEmployeesAction } from '../actions/get.employees'

export const useGetEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployeesAction,
    staleTime: 1000 * 60 * 5
})}
