import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from './auth.store'
import type { UserRole } from './auth.types'

export interface RoleBasedRouteProps {
  allowedRoles: UserRole[]
}

export function RoleBasedRoute({ allowedRoles }: RoleBasedRouteProps) {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
