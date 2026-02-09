
// ==========================================
// COMPONENTE: Mis Citas
// ==========================================
import { useEffect, useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { Cita } from "@/services";
import type { PatientBasic } from "../interfaces";
import * as citasService from '@/services/citas.service'
import { formatDateLongVenezuela, formatTimeVenezuela } from "@/utils/dateUtils";
import { toast } from "sonner";

type FilterType = 'TODAS' | 'PASADAS' | 'FUTURAS'

interface Props {
  doctorId: number;
  onRegisterEncounter?: (patient: PatientBasic) => void;
  onEncounterRegistered?: () => void; // Callback para refresco después de registrar encuentro
  refreshKey?: number; // Trigger para recargar citas desde el padre
}

export default function MyAppointments({ doctorId, onRegisterEncounter, refreshKey = 0 }: Props) {
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<FilterType>('FUTURAS') // Por defecto mostrar futuras

  // Validar que doctorId sea un número válido
  const validDoctorId = typeof doctorId === 'number' && doctorId > 0 ? doctorId : null

  // TODO: Obtener ID del médico actual del contexto de autenticación
  // const medicoId = 1 // Temporal

  useEffect(() => {
    if (!validDoctorId) {
      setError('ID del médico no válido')
      setLoading(false)
      return
    }
    cargarCitas()
  }, [validDoctorId, refreshKey])

  const cargarCitas = async () => {
    try {
      // Cargar citas de los próximos 7 días para el médico actual
      const citasProximas = await citasService.obtenerCitasProximos(validDoctorId!, 7)
      setCitas(citasProximas)
    } catch (err) {
      console.error('Error al cargar citas:', err)
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMsg)
      toast.error('❌ Error al cargar las citas')
    } finally {
      setLoading(false)
    }
  }

  const getEstadoLabel = (estado: string) => {
    // ✅ Solo 2 estados: PROGRAMADA y COMPLETADA
    const labels: Record<string, string> = {
      PROGRAMADA: 'Programada',
      COMPLETADA: 'Completada',
    }
    return labels[estado] || estado
  }

  const formatearFecha = (fechaCita: any) => {
    try {
      if (!fechaCita) return 'Sin fecha'
      const fecha = new Date(fechaCita)
      if (isNaN(fecha.getTime())) {
        console.warn('Fecha inválida:', fechaCita)
        return 'Fecha inválida'
      }
      return formatDateLongVenezuela(fecha)
    } catch (e) {
      console.error('Error al formatear fecha:', e)
      return 'Error en fecha'
    }
  }

  const formatearHoraCita = (horaCita: string | null) => {
    try {
      if (!horaCita) return 'Sin hora'
      // horaCita viene como string HH:MM:SS o HH:MM
      // Lo convertimos a hora legible
      const horas = horaCita.split(':')
      if (horas.length < 2) return horaCita
      return horas[0] + ':' + horas[1]
    } catch (e) {
      console.error('Error al formatear hora:', e)
      return 'Error en hora'
    }
  }

  const mapearEstado = (estadoBackend: string): string => {
    // ✅ Solo 2 estados: PROGRAMADA y COMPLETADA
    const mapeo: Record<string, string> = {
      'PROGRAMADA': 'PROGRAMADA',
      'COMPLETADA': 'COMPLETADA',
    }
    return mapeo[estadoBackend] || estadoBackend
  }

  // Filtrar citas según el tipo seleccionado
  const citasFiltradas = citas.filter(cita => {
    const fechaCita = new Date(cita.fechaCita || cita.fechaHora || '')
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    // Comparar solo las fechas (sin horas)
    fechaCita.setHours(0, 0, 0, 0)

    if (filterType === 'PASADAS') {
      return fechaCita < hoy
    } else if (filterType === 'FUTURAS') {
      return fechaCita >= hoy
    }
    return true // TODAS
  })

  // Contar estadísticas según el filtro actual
  const estadisticas = {
    total: citasFiltradas.length,
    porAtender: citasFiltradas.filter(c => (c as any).estado === 'PROGRAMADA').length, // ✅ Solo PROGRAMADA
    completadas: citasFiltradas.filter(c => (c as any).estado === 'COMPLETADA').length, // ✅ Solo COMPLETADA
  }

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles.spinner}></div>
        <p>Cargando citas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <section className={styles['view-section']}>
        <div className={styles['section-header']}>
          <h2>Mis Citas</h2>
        </div>
        <div className={styles['form-card']}>
          <div style={{ padding: '2rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', textAlign: 'center' }}>
            <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
              ⚠️ {error}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>Mis Citas</h2>
      </div>

      <div className={styles['form-card']}>
        {/* Botones de filtro */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            className={styles['btn-small']}
            onClick={() => setFilterType('FUTURAS')}
            style={{
              backgroundColor: filterType === 'FUTURAS' ? '#3b82f6' : '#d1d5db',
              color: filterType === 'FUTURAS' ? 'white' : '#374151',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: filterType === 'FUTURAS' ? 'bold' : 'normal',
            }}
          >
            Citas Futuras ({citas.filter(c => {
              const f = new Date(c.fechaCita || c.fechaHora || '')
              const h = new Date()
              h.setHours(0, 0, 0, 0)
              f.setHours(0, 0, 0, 0)
              return f >= h
            }).length})
          </button>
          
          <button
            className={styles['btn-small']}
            onClick={() => setFilterType('PASADAS')}
            style={{
              backgroundColor: filterType === 'PASADAS' ? '#ef4444' : '#d1d5db',
              color: filterType === 'PASADAS' ? 'white' : '#374151',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: filterType === 'PASADAS' ? 'bold' : 'normal',
            }}
          >
            Citas Pasadas ({citas.filter(c => {
              const f = new Date(c.fechaCita || c.fechaHora || '')
              const h = new Date()
              h.setHours(0, 0, 0, 0)
              f.setHours(0, 0, 0, 0)
              return f < h
            }).length})
          </button>
          
          <button
            className={styles['btn-small']}
            onClick={() => setFilterType('TODAS')}
            style={{
              backgroundColor: filterType === 'TODAS' ? '#8b5cf6' : '#d1d5db',
              color: filterType === 'TODAS' ? 'white' : '#374151',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: filterType === 'TODAS' ? 'bold' : 'normal',
            }}
          >
            Todas ({citas.length})
          </button>
        </div>

        <div className={styles['stats-summary']}>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>{estadisticas.total}</span>
            <span className={styles['stat-label']}>Total Citas</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>{estadisticas.porAtender}</span>
            <span className={styles['stat-label']}>Por Atender</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>{estadisticas.completadas}</span>
            <span className={styles['stat-label']}>Completadas</span>
          </div>
        </div>

        {citasFiltradas.length === 0 ? (
          <div className={styles['empty-state']}>
            <span className={styles['empty-icon']}>📅</span>
            <h3>No hay citas programadas para los próximos 7 días</h3>
            <p>Las citas asignadas aparecerán aquí</p>
          </div>
        ) : (
          <div className={styles['appointments-list']}>
            {citasFiltradas.map((cita) => (
              <div key={cita.id} className={styles['appointment-card']}>
                <div className={styles['appointment-header']}>
                  <div>
                    <div className={styles['appointment-date']}>
                      {formatearFecha((cita as any).fechaCita)}
                    </div>
                    <span className={styles['appointment-time']}>
                      {formatearHoraCita((cita as any).horaCita)}
                    </span>
                  </div>
                  <span className={`${styles['status-badge']} ${styles[`status-${(cita as any).estado?.toLowerCase()}`]}`}>
                    {getEstadoLabel(mapearEstado((cita as any).estado))}
                  </span>
                </div>
                <div className={styles['appointment-body']}>
                  <p><strong>Paciente:</strong> {cita.paciente?.apellidosNombres || 'N/A'}</p>
                  <p><strong>CI:</strong> {cita.paciente?.ci || 'N/A'}</p>
                  <p><strong>Especialidad:</strong> {cita.especialidad || 'N/A'}</p>
                  <p><strong>Motivo:</strong> {cita.motivo || 'No especificado'}</p>
                  {cita.horaLlegada && (
                    <p><strong>Hora llegada:</strong> {formatTimeVenezuela(cita.horaLlegada)}</p>
                  )}
                </div>
                <div className={styles['appointment-actions']}>
                  {(cita as any).estado === 'PROGRAMADA' && onRegisterEncounter && cita.paciente && (
                    <button 
                      className={styles['btn-primary']} 
                      onClick={() => {
                        const patientData: PatientBasic = {
                          id: String(cita.paciente!.id),
                          nroHistoria: cita.paciente!.nroHistoria,
                          apellidosNombres: cita.paciente!.apellidosNombres,
                          ci: cita.paciente!.ci,
                          fechaNacimiento: cita.paciente!.fechaNacimiento,
                          sexo: cita.paciente!.sexo,
                          citaId: cita.id, // ✅ NUEVO: Pasar el ID de la cita
                        }
                        onRegisterEncounter(patientData)
                      }}
                    >
                      Registrar Encuentro
                    </button>
                  )}
                  {(cita as any).estado === 'COMPLETADA' && (
                    <span className={styles['completed-label']}>✅ Encuentro registrado</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles['section-footer']}>
        <button className={styles['refresh-btn']} onClick={cargarCitas}>
          Actualizar
        </button>
      </div>
    </section>
  )
}