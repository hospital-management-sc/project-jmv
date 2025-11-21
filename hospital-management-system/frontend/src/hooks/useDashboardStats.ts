import { useState, useEffect } from 'react'

interface DashboardStats {
  totalPacientes: number
  citasProgramadasHoy: number
  registrosAuditoria: number
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

  const fetchStats = async () => {
    try {
      setError(null)
      const apiBaseUrl = window.location.hostname.includes('app.github.dev')
        ? window.location.origin.replace('-5173.', '-3001.')
        : 'http://localhost:3001'

      const response = await fetch(`${apiBaseUrl}/api/dashboard/stats`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al obtener estadísticas')
      }

      setStats(result.data)
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err)
      setError(err.message)
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
