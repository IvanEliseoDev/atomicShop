import { getProviderAction } from '@/actions/get.providers'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export const useGetProviders = () => {
  return useQuery({
    queryKey: ["providers"],
    queryFn: getProviderAction,
    staleTime: 1000 * 60 * 5
  })
}
