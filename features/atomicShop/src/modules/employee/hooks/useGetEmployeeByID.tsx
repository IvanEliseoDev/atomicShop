import { useQuery } from '@tanstack/react-query'
import { getEmployeeByIDAction } from '../actions/get.employee.byId'

export const useGetEmployeeByID = (id: string) => {
  return useQuery({
    queryKey: ["employeesbyId", id],
    queryFn: () => getEmployeeByIDAction(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5
  })
}
