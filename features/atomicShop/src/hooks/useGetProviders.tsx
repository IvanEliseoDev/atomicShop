import { getProviderAction } from "@/actions/get.providers"

import { useQuery } from "@tanstack/react-query"

export const useGetProviders = () => {
  return useQuery({
    queryKey: ["providers"],
    queryFn: getProviderAction,
    staleTime: 1000 * 60 * 5
  })
}
