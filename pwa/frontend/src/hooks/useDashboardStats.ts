import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../utils/constants'

interface DashboardStats {
  totalPacientes: number
  pacientesMilitares: number
  pacientesAfiliados: number
  pacientesPNA: number
  citasProgramadasHoy: number
  registrosAuditoria: number
  pacientesHospitalizados?: number
  pacientesEnEmergencia?: number
  emergenciasPendientesHospitalizacion?: number
}

interface UseDashboardStatsResult {
  stats: DashboardStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboardStats(refetchInterval: number = 30000): UseDashboardStatsResult {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchStats = async () => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Manejar errores específicos
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicie sesión nuevamente.')
        }
        if (response.status === 403) {
          throw new Error('No tiene permisos para acceder a esta información.')
        }
        if (response.status === 503) {
          throw new Error('El servidor está en mantenimiento. Intente más tarde.')
        }
        if (response.status >= 500) {
          throw new Error('Error del servidor. Por favor intente más tarde.')
        }
        
        const result = await response.json()
        throw new Error(result.message || `Error ${response.status}: No se pudieron cargar las estadísticas`)
      }

      const result = await response.json()

      if (!result.data) {
        throw new Error('Respuesta inválida del servidor')
      }

      setStats(result.data)
      setRetryCount(0) // Reset retry count on success
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err)
      const errorMessage = err.message || 'Error al conectar con el servidor. Verifica tu conexión.'
      setError(errorMessage)
      
      // Log para diagnóstico
      console.warn(`Dashboard stats - Retry ${retryCount}:`, {
        url: `${API_BASE_URL}/dashboard/stats`,
        error: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch inicial
  useEffect(() => {
    fetchStats()
  }, [])

  // Auto-refresh según el intervalo
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats()
    }, refetchInterval)

    return () => clearInterval(interval)
  }, [refetchInterval])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
