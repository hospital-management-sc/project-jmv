/**
 * Servicio de Especialidades Médicas
 * Gestiona la configuración y lógica de especialidades
 */

import { ESPECIALIDADES_MEDICAS, obtenerNombresEspecialidades, obtenerEspecialidad, esEspecialidadValida, obtenerDepartamentosUnicos, obtenerEspecialidadesPorDepartamento } from '@/config/especialidades.config'
import type { EspecialidadConfig } from '@/config/especialidades.config'

class EspecialidadesService {
  /**
   * Obtener todas las especialidades
   */
  obtenerTodas(): EspecialidadConfig[] {
    return ESPECIALIDADES_MEDICAS
  }

  /**
   * Obtener solo los nombres de especialidades (para selects)
   */
  obtenerNombres(): string[] {
    return obtenerNombresEspecialidades()
  }

  /**
   * Obtener configuración de una especialidad
   */
  obtenerConfig(nombre: string): EspecialidadConfig | undefined {
    return obtenerEspecialidad(nombre)
  }

  /**
   * Validar si una especialidad es válida
   */
  esValida(nombre: string): boolean {
    return esEspecialidadValida(nombre)
  }

  /**
   * Obtener todos los departamentos únicos
   */
  obtenerDepartamentos(): string[] {
    return obtenerDepartamentosUnicos()
  }

  /**
   * Obtener especialidades de un departamento
   */
  obtenerPorDepartamento(departamento: string): EspecialidadConfig[] {
    return obtenerEspecialidadesPorDepartamento(departamento)
  }

  /**
   * Obtener opciones especiales (acciones disponibles) de una especialidad
   * Devuelve las acciones del dashboard configuradas en vistaDashboard.acciones
   */
  obtenerOpcionesEspeciales(nombre: string): string[] {
    const config = this.obtenerConfig(nombre)
    return config?.vistaDashboard?.acciones || []
  }

  /**
   * Verificar si una especialidad tiene formulario personalizado
   */
  tieneFormularioPersonalizado(nombre: string): boolean {
    const config = this.obtenerConfig(nombre)
    return config?.formularioEspecializado !== undefined
  }

  /**
   * Obtener campos específicos de una especialidad
   * @deprecated No tiene datos en EspecialidadConfig actualmente
   * Mantenerlo por retrocompatibilidad en caso de uso futuro
   */
  obtenerCamposEspecificos(nombre: string): string[] {
    // Actualmente no hay propiedades de campos específicos en EspecialidadConfig
    // Si en el futuro se agregan, implementar aquí
    return []
  }

  /**
   * Obtener descripción de una especialidad
   */
  obtenerDescripcion(nombre: string): string {
    const config = this.obtenerConfig(nombre)
    return config?.descripcion || ''
  }

  /**
   * Obtener código de una especialidad
   */
  obtenerCodigo(nombre: string): string {
    const config = this.obtenerConfig(nombre)
    return config?.codigo || ''
  }

  /**
   * Obtener color de una especialidad
   */
  obtenerColor(nombre: string): string {
    const config = this.obtenerConfig(nombre)
    return config?.color || '#6B7280'
  }
}

export default new EspecialidadesService()
