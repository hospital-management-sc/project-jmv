/**
 * DashboardEspecializadoContext
 * Contexto para proporcionar configuración de especialidad a componentes del dashboard
 */

import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import especialidadesService from '@/services/especialidades.service'
import type { EspecialidadConfig } from '@/config/especialidades.config'

interface DashboardEspecializadoContextType {
  especialidad: EspecialidadConfig | undefined
  nombre: string | null
  opcionesEspeciales: string[]
  camposEspecificos: string[]
  descripcion: string
  tieneFormularioPersonalizado: boolean
}

const DashboardEspecializadoContext = createContext<DashboardEspecializadoContextType | undefined>(
  undefined
)

export function DashboardEspecializadoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const value = useMemo(() => {
    if (!user?.especialidad) {
      return {
        especialidad: undefined,
        nombre: null,
        opcionesEspeciales: [],
        camposEspecificos: [],
        descripcion: '',
        tieneFormularioPersonalizado: false,
      }
    }

    const config = especialidadesService.obtenerConfig(user.especialidad)

    return {
      especialidad: config,
      nombre: user.especialidad,
      opcionesEspeciales: especialidadesService.obtenerOpcionesEspeciales(user.especialidad),
      camposEspecificos: especialidadesService.obtenerCamposEspecificos(),
      descripcion: especialidadesService.obtenerDescripcion(user.especialidad),
      tieneFormularioPersonalizado: especialidadesService.tieneFormularioPersonalizado(
        user.especialidad
      ),
    }
  }, [user?.especialidad])

  return (
    <DashboardEspecializadoContext.Provider value={value}>
      {children}
    </DashboardEspecializadoContext.Provider>
  )
}

export function useDashboardEspecializado() {
  const context = useContext(DashboardEspecializadoContext)
  if (context === undefined) {
    throw new Error(
      'useDashboardEspecializado must be used within a DashboardEspecializadoProvider'
    )
  }
  return context
}
