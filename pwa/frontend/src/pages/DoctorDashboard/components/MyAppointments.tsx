
// ==========================================
// COMPONENTE: Mis Citas
// ==========================================
import { useEffect, useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { Cita } from "@/services";
import type { PatientBasic } from "../interfaces";
import * as citasService from '@/services/citas.service'
import { formatDateLongLocal, formatTimeVenezuela, getTodayVenezuelaISO } from "@/utils/dateUtils";
import { toastCustom } from "@/utils/toastCustom";

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
  const [filterType, setFilterType] = useState<FilterType>('TODAS') // Por defecto mostrar todas (pasadas + futuras)
  const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null) // Para rate limiting

  // Validar que doctorId sea un número válido
  const validDoctorId = typeof doctorId === 'number' && doctorId > 0 ? doctorId : null

  // Rate limiting: máximo 1 refresh cada 5 minutos
  const REFRESH_COOLDOWN_MS = 5 * 60 * 1000 // 5 minutos en milisegundos

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
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMsg)
      toastCustom.error('Error al cargar las citas')
    } finally {
      setLoading(false)
    }
  }

  // Manejador para el botón de actualizar con rate limiting
  const handleRefreshClick = async () => {
    const now = Date.now()
    
    // Validar cooldown: ¿Puede hacer refresh?
    if (lastRefreshTime && now - lastRefreshTime < REFRESH_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((REFRESH_COOLDOWN_MS - (now - lastRefreshTime)) / 1000)
      const remainingMinutes = Math.ceil(remainingSeconds / 60)
      
      toastCustom.info(`Espera ${remainingMinutes} min para actualizar de nuevo`)
      return
    }
    
    // Proceder con la actualización
    setLoading(true)
    await cargarCitas()
    setLastRefreshTime(now)
    toastCustom.success('Citas actualizadas')
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
      return formatDateLongLocal(fechaCita)
    } catch (e) {
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

  // Obtener la fecha de hoy en zona horaria de Venezuela (YYYY-MM-DD)
  const hoyVE = getTodayVenezuelaISO()

  // Conteos pre-calculados para las etiquetas de los tabs de filtro
  const countFuturas = citas.filter(c => String(c.fechaCita || c.fechaHora || '').split('T')[0] >= hoyVE).length
  const countPasadas = citas.filter(c => String(c.fechaCita || c.fechaHora || '').split('T')[0] < hoyVE).length

  // Filtrar citas según el tipo seleccionado y ordenar en orden descendente (más recientes primero)
  const citasFiltradas = citas
    .filter(cita => {
      // Extraer la fecha en formato YYYY-MM-DD
      const fechaCitaStr = String(cita.fechaCita || cita.fechaHora || '').split('T')[0]
      
      if (filterType === 'PASADAS') {
        return fechaCitaStr < hoyVE
      } else if (filterType === 'FUTURAS') {
        return fechaCitaStr >= hoyVE
      }
      return true // TODAS
    })
    .sort((a, b) => {
      // Ordenar en orden descendente (más recientes primero)
      const fechaA = new Date(a.fechaCita || a.fechaHora || '')
      const fechaB = new Date(b.fechaCita || b.fechaHora || '')
      return fechaB.getTime() - fechaA.getTime()
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
          <div className={styles['error-alert']}>
            {error}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>
          Mis Citas
          <button className={styles['refresh-btn']} onClick={handleRefreshClick} title="Actualizar">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            <span className={styles['refresh-btn-label']}>Actualizar</span>
          </button>
        </h2>
      </div>

      <div className={styles['form-card']}>
        {/* Botones de filtro */}
        <div className={styles['tabs-container']}>
          <button
            type="button"
            className={`${styles.tab} ${filterType === 'FUTURAS' ? styles.active : ''}`}
            onClick={() => setFilterType('FUTURAS')}
          >
            Futuras ({countFuturas})
          </button>
          <button
            type="button"
            className={`${styles.tab} ${styles['tab-pasadas']} ${filterType === 'PASADAS' ? styles.active : ''}`}
            onClick={() => setFilterType('PASADAS')}
          >
            Pasadas ({countPasadas})
          </button>
          <button
            type="button"
            className={`${styles.tab} ${styles['tab-todas']} ${filterType === 'TODAS' ? styles.active : ''}`}
            onClick={() => setFilterType('TODAS')}
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
            <div className={styles['empty-icon']}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <line x1="9" y1="16" x2="15" y2="16"/>
              </svg>
            </div>
            <h3>No hay citas en el rango seleccionado</h3>
            <p>Tus citas asignadas aparecerán aquí</p>
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
                    <span className={styles['completed-label']}>Encuentro registrado</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </section>
  )
}