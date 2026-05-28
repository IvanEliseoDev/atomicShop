import { useAuthStore } from '@/auth/store/auth.store'
import { type PropsWithChildren } from 'react'
import { Navigate } from 'react-router'

export const AdminRoute = ({children}:PropsWithChildren) => {
  
    const { authStatus, isAdmin } = useAuthStore()

    if (authStatus === 'checking') return null

    if (authStatus === 'not-authenticated') return <Navigate to='/login' />

    if (isAdmin()) return <Navigate to='/atomicAdmin/dashboard' />

    return children
}
