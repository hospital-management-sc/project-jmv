/**
 * Hook useEspecialidad
 * Proporciona acceso a la configuración de especialidad del usuario actual
 */

import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import especialidadesService from '@/services/especialidades.service'
import type { EspecialidadConfig, VistaDashboard, FormularioEspecializado } from '@/config/especialidades.config'

interface UseEspecialidadReturn {
  especialidad: EspecialidadConfig | undefined
  nombre: string | null
  esValida: boolean
  tieneFormularioPersonalizado: boolean
  opcionesEspeciales: string[]
  camposEspecificos: string[]
  descripcion: string
  departamento: string | null
  vistaDashboard: VistaDashboard | null
  formularioEncuentro: FormularioEspecializado | null
}

export function useEspecialidad(): UseEspecialidadReturn {
  const { user } = useAuth()

  return useMemo(() => {
    if (!user?.especialidad) {
      return {
        especialidad: undefined,
        nombre: null,
        esValida: false,
        tieneFormularioPersonalizado: false,
        opcionesEspeciales: [],
        camposEspecificos: [],
        descripcion: '',
        departamento: null,
        vistaDashboard: null,
        formularioEncuentro: null,
      }
    }

    const config = especialidadesService.obtenerConfig(user.especialidad)

    return {
      especialidad: config,
      nombre: user.especialidad,
      esValida: especialidadesService.esValida(user.especialidad),
      tieneFormularioPersonalizado: especialidadesService.tieneFormularioPersonalizado(user.especialidad),
      opcionesEspeciales: especialidadesService.obtenerOpcionesEspeciales(user.especialidad),
      camposEspecificos: especialidadesService.obtenerCamposEspecificos(user.especialidad),
      descripcion: especialidadesService.obtenerDescripcion(user.especialidad),
      departamento: config?.departamento || null,
      vistaDashboard: config?.vistaDashboard || null,
      formularioEncuentro: config?.formularioEspecializado || null,
    }
  }, [user?.especialidad])
}
