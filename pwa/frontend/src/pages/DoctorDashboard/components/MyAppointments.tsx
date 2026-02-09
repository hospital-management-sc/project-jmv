
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

interface Props {
  doctorId: number;
  onRegisterEncounter?: (patient: PatientBasic) => void;
}

export default function MyAppointments({ doctorId, onRegisterEncounter }: Props) {
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
  }, [validDoctorId])

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
    const labels: Record<string, string> = {
      PENDIENTE: '⏳ Pendiente',
      CONFIRMADA: '✓ Confirmada',
      EN_CURSO: '🔄 En Curso',
      COMPLETADA: '✅ Completada',
      CANCELADA: '❌ Cancelada',
      NO_ASISTIO: '⚠️ No Asistió',
    }
    return labels[estado] || estado
  }

  const formatearFecha = (fechaCita: any) => {
    try {
      if (!fechaCita) return '📅 Sin fecha'
      const fecha = new Date(fechaCita)
      if (isNaN(fecha.getTime())) {
        console.warn('Fecha inválida:', fechaCita)
        return '📅 Fecha inválida'
      }
      return '📅 ' + formatDateLongVenezuela(fecha)
    } catch (e) {
      console.error('Error al formatear fecha:', e)
      return '📅 Error en fecha'
    }
  }

  const formatearHoraCita = (horaCita: string | null) => {
    try {
      if (!horaCita) return '🕐 Sin hora'
      // horaCita viene como string HH:MM:SS o HH:MM
      // Lo convertimos a hora legible
      const horas = horaCita.split(':')
      if (horas.length < 2) return '🕐 ' + horaCita
      return '🕐 ' + horas[0] + ':' + horas[1]
    } catch (e) {
      console.error('Error al formatear hora:', e)
      return '🕐 Error en hora'
    }
  }

  // Mapear estado del backend al estado esperado
  const mapearEstado = (estadoBackend: string): string => {
    const mapeo: Record<string, string> = {
      'PROGRAMADA': 'CONFIRMADA',
      'EN_PROCESO': 'EN_CURSO',
      'REALIZADA': 'COMPLETADA',
    }
    return mapeo[estadoBackend] || estadoBackend
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
          <h2>📅 Mis Citas - Próximos 7 Días</h2>
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
        <h2>📅 Mis Citas - Próximos 7 Días</h2>
      </div>

      <div className={styles['form-card']}>
        <div className={styles['stats-summary']}>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>{citas.length}</span>
            <span className={styles['stat-label']}>Total Citas</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>
              {citas.filter(c => (c as any).estado === 'PROGRAMADA' || (c as any).estado === 'EN_PROCESO').length}
            </span>
            <span className={styles['stat-label']}>Por Atender</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>
              {citas.filter(c => (c as any).estado === 'REALIZADA').length}
            </span>
            <span className={styles['stat-label']}>Completadas</span>
          </div>
        </div>

        {citas.length === 0 ? (
          <div className={styles['empty-state']}>
            <span className={styles['empty-icon']}>📅</span>
            <h3>No hay citas programadas para los próximos 7 días</h3>
            <p>Las citas asignadas aparecerán aquí</p>
          </div>
        ) : (
          <div className={styles['appointments-list']}>
            {citas.map((cita) => (
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
                  {((cita as any).estado === 'PROGRAMADA' || (cita as any).estado === 'EN_PROCESO') && onRegisterEncounter && cita.paciente && (
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
                        }
                        onRegisterEncounter(patientData)
                      }}
                    >
                      📝 Registrar Encuentro
                    </button>
                  )}
                  {((cita as any).estado === 'REALIZADA') && (
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
          🔄 Actualizar
        </button>
      </div>
    </section>
  )
}