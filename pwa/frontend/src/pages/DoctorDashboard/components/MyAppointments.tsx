
// ==========================================
// COMPONENTE: Mis Citas
// ==========================================
import { useEffect, useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { Cita } from "@/services";
import * as citasService from '@/services/citas.service'
import { API_BASE_URL } from "@/utils/constants";
import { formatDateLongVenezuela, formatTimeVenezuela } from "@/utils/dateUtils";
import { toast } from "sonner";

interface Props {
  doctorId: number;
}

export default function MyAppointments({ doctorId }: Props) {
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState<number | null>(null)

  // TODO: Obtener ID del médico actual del contexto de autenticación
  // const medicoId = 1 // Temporal

  useEffect(() => {
    cargarCitas()
  }, [doctorId])

  const cargarCitas = async () => {
    try {
      // Intentar cargar citas del día para el médico actual
      const citasHoy = await citasService.obtenerCitasDelDia(doctorId)
      setCitas(citasHoy)
    } catch (err) {
      console.error('Error al cargar citas:', err)
      // Fallback al endpoint anterior si falla
      try {
        const response = await fetch(`${API_BASE_URL}/citas/lista/proximas`)
        const result = await response.json()
        if (result.success) {
          setCitas(result.data || [])
        }
      } catch {
        console.error('Fallback también falló')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAtenderCita = async (citaId: number) => {
    setProcesando(citaId)
    try {
      await citasService.atenderCita(citaId)
      await cargarCitas()
      // alert('✅ Cita marcada como en atención')
      toast.success('✅ Cita marcada como en atención')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al atender cita'
      // alert('❌ ' + errorMessage)
      toast.error(`❌ ${errorMessage}`)
    } finally {
      setProcesando(null)
    }
  }

  const handleCompletarCita = async (citaId: number) => {
    setProcesando(citaId)
    try {
      await citasService.completarCita(citaId)
      await cargarCitas()
      // alert('✅ Cita completada')
      toast.success('✅ Cita completada')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar cita'
      // alert('❌ ' + errorMessage)
      toast.error(`❌ ${errorMessage}`)
    } finally {
      setProcesando(null)
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

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles.spinner}></div>
        <p>Cargando citas...</p>
      </div>
    )
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>📅 Mis Citas del Día</h2>
        <p className={styles['section-subtitle']}>
          {formatDateLongVenezuela(new Date())}
        </p>
      </div>

      <div className={styles['form-card']}>
        <div className={styles['stats-summary']}>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>{citas.length}</span>
            <span className={styles['stat-label']}>Total Citas</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>
              {citas.filter(c => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA').length}
            </span>
            <span className={styles['stat-label']}>Por Atender</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-number']}>
              {citas.filter(c => c.estado === 'COMPLETADA').length}
            </span>
            <span className={styles['stat-label']}>Completadas</span>
          </div>
        </div>

        {citas.length === 0 ? (
          <div className={styles['empty-state']}>
            <span className={styles['empty-icon']}>📅</span>
            <h3>No hay citas programadas para hoy</h3>
            <p>Las citas asignadas aparecerán aquí</p>
          </div>
        ) : (
          <div className={styles['appointments-list']}>
            {citas.map((cita) => (
              <div key={cita.id} className={styles['appointment-card']}>
                <div className={styles['appointment-header']}>
                  <span className={styles['appointment-time']}>
                    {formatTimeVenezuela(cita.fechaHora)}
                  </span>
                  <span className={`${styles['status-badge']} ${styles[`status-${cita.estado?.toLowerCase()}`]}`}>
                    {getEstadoLabel(cita.estado)}
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
                  {(cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA') && (
                    <button 
                      className={styles['btn-primary']} 
                      onClick={() => handleAtenderCita(cita.id)}
                      disabled={procesando === cita.id}
                    >
                      {procesando === cita.id ? '⏳...' : '▶️ Atender'}
                    </button>
                  )}
                  {cita.estado === 'EN_CURSO' && (
                    <button 
                      className={styles['btn-primary']} 
                      onClick={() => handleCompletarCita(cita.id)}
                      disabled={procesando === cita.id}
                    >
                      {procesando === cita.id ? '⏳...' : '✅ Completar'}
                    </button>
                  )}
                  {cita.estado === 'COMPLETADA' && (
                    <span className={styles['completed-label']}>✅ Atención finalizada</span>
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