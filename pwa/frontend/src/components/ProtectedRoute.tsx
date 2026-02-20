import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

/**
 * ProtectedRoute - Componente para rutas protegidas por rol
 * Valida que el usuario esté autenticado y tenga el rol requerido
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirigir al dashboard correcto según su rol
    if (user.role === 'SUPER_ADMIN') {
      return <Navigate to="/dashboard/superadmin" replace />
    }
    if (user.role === 'ADMIN') {
      return <Navigate to="/dashboard/admin" replace />
    }
    return <Navigate to="/dashboard/medico" replace />
  }

  return <>{children}</>
}
