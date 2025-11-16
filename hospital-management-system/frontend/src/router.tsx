import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import MainLayout from '@layouts/MainLayout'
import AuthLayout from '@layouts/AuthLayout'
import Login from '@pages/Login'
import Register from '@pages/Register'
import DoctorDashboard from '@pages/DoctorDashboard'
import AdminDashboard from '@pages/AdminDashboard'
import ProtectedRoute from '@components/ProtectedRoute'

export default function Router() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
        </Route>

        {/* Main Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          
          {/* Dashboard Médico - Para MEDICO, ENFERMERO, COORDINADOR */}
          <Route
            path="/dashboard/medico"
            element={
              <ProtectedRoute allowedRoles={['MEDICO', 'ENFERMERO', 'COORDINADOR']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Administrativo - Para ADMIN */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Ruta por defecto - redirigir según rol */}
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === 'ADMIN' ? (
                <Navigate to="/dashboard/admin" replace />
              ) : (
                <Navigate to="/dashboard/medico" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
