/**
 * Dashboard para Médicos y Personal Clínico
 * Vista especializada para atención médica y gestión de pacientes
 */

import { useState, useEffect } from 'react'
import styles from './DoctorDashboard.module.css'
import { API_BASE_URL } from '../utils/constants'
import { formatDateVenezuela, formatDateTimeVenezuela, formatTimeVenezuela, formatDateLongVenezuela } from '../utils/dateUtils'
import admisionesService from '../services/admisiones.service'
import type { Admision } from '../services/admisiones.service'
import { encuentrosService } from '../services/encuentros.service'
import type { Encuentro } from '../services/encuentros.service'
import * as interconsultasService from '../services/interconsultas.service'
import type { Interconsulta, CrearInterconsultaDTO, PrioridadInterconsulta } from '../services/interconsultas.service'
import * as citasService from '../services/citas.service'
import type { Cita } from '../services/citas.service'
import EncuentroDetailModal from '../components/EncuentroDetailModal'
import EncuentrosList from '../components/EncuentrosList'

type ViewMode = 
  | 'main' 
  | 'hospitalized-patients' 
  | 'register-encounter' 
  | 'search-patient' 
  | 'patient-history'
  | 'today-encounters'
  | 'my-appointments'
  | 'interconsultas'

interface DoctorStats {
  pacientesHospitalizados: number
  encuentrosHoy: number
  citasHoy: number
  altasPendientes: number
}

interface PatientBasic {
  id: string
  nroHistoria: string
  apellidosNombres: string
  ci: string
  fechaNacimiento?: string
  sexo?: string
  telefono?: string
  direccion?: string
  personalMilitar?: {
    grado?: string
    componente?: string
    unidad?: string
    estadoMilitar?: string
  }
  admisiones?: any[]
  encuentros?: any[]
}

export default function DoctorDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('main')
  const [stats, setStats] = useState<DoctorStats>({
    pacientesHospitalizados: 0,
    encuentrosHoy: 0,
    citasHoy: 0,
    altasPendientes: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<PatientBasic | null>(null)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000) // Actualizar cada minuto
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      // Obtener pacientes hospitalizados activos
      const admisionesResponse = await admisionesService.listarAdmisionesActivas({})
      
      // Obtener encuentros de hoy
      let encuentrosHoyCount = 0
      try {
        const encuentrosHoy = await encuentrosService.obtenerHoy()
        encuentrosHoyCount = encuentrosHoy.length || 0
      } catch {
        // Si falla, dejamos en 0
      }
      
      // Obtener citas de hoy
      let citasHoyCount = 0
      try {
        const citasResponse = await fetch(`${API_BASE_URL}/dashboard/stats`)
        const citasData = await citasResponse.json()
        citasHoyCount = citasData.data?.citasProgramadasHoy || 0
      } catch {
        // Si falla, dejamos en 0
      }

      setStats({
        pacientesHospitalizados: admisionesResponse.total || 0,
        encuentrosHoy: encuentrosHoyCount,
        citasHoy: citasHoyCount,
        altasPendientes: 0 // Por implementar
      })
    } catch (error) {
      console.error('Error fetching doctor stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderMainView = () => (
    <>
      {/* Sección de Estadísticas del Médico */}
      <section className={styles['dashboard-stats']}>
        <div className={styles.card}>
          <h2>Pacientes Hospitalizados</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats.pacientesHospitalizados}
          </div>
          <span className={styles['stat-label']}>Actualmente internados</span>
        </div>
        <div className={styles.card}>
          <h2>Atenciones Hoy</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats.encuentrosHoy}
          </div>
          <span className={styles['stat-label']}>Encuentros registrados</span>
        </div>
        <div className={styles.card}>
          <h2>Citas Programadas</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats.citasHoy}
          </div>
          <span className={styles['stat-label']}>Para hoy</span>
        </div>
        <div className={styles.card}>
          <h2>Altas Pendientes</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats.altasPendientes}
          </div>
          <span className={styles['stat-label']}>Por procesar</span>
        </div>
      </section>

      {/* Sección de Acciones Clínicas */}
      <section className={styles['management-section']}>
        <h2>Acciones Clínicas</h2>
        <div className={styles['action-grid']}>
          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('register-encounter')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Registrar Encuentro</span>
              <span className={styles['btn-description']}>Documente consultas, emergencias y evoluciones</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('hospitalized-patients')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Pacientes Hospitalizados</span>
              <span className={styles['btn-description']}>Visualice pacientes actualmente internados</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('today-encounters')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Atenciones del Día</span>
              <span className={styles['btn-description']}>Revise los encuentros registrados hoy</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('search-patient')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Buscar Paciente</span>
              <span className={styles['btn-description']}>Consulte historia clínica y antecedentes</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('my-appointments')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Mis Citas</span>
              <span className={styles['btn-description']}>Gestione sus citas programadas</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => setViewMode('interconsultas')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6" />
              <path d="M23 11h-6" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Interconsultas</span>
              <span className={styles['btn-description']}>Solicite o responda consultas entre especialidades</span>
            </div>
          </button>

          <button 
            className={styles['action-btn']}
            onClick={() => alert('Próximamente: Registrar Alta Médica')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Registrar Alta</span>
              <span className={styles['btn-description']}>Procese altas médicas de pacientes</span>
            </div>
          </button>
        </div>
      </section>
    </>
  )

  return (
    <div className={styles['dashboard-container']}>
      <header className={styles['dashboard-header']}>
        <div className={styles['header-content']}>
          <div>
            <h1>Dashboard Médico</h1>
            <p className={styles.subtitle}>Panel de control para atención clínica</p>
          </div>
          {viewMode !== 'main' && (
            <button 
              className={styles['back-btn']}
              onClick={() => {
                setViewMode('main')
                setSelectedPatient(null)
              }}
            >
              ← Volver al Dashboard
            </button>
          )}
        </div>
      </header>

      <main className={styles['dashboard-main']}>
        {viewMode === 'main' && renderMainView()}
        {viewMode === 'hospitalized-patients' && <HospitalizedPatientsView />}
        {viewMode === 'register-encounter' && <RegisterEncounterView patient={selectedPatient} />}
        {viewMode === 'search-patient' && <SearchPatientView onViewHistory={(patient) => {
          setSelectedPatient(patient)
          setViewMode('patient-history')
        }}  onRegisterEncounter={(patient) => {
          setSelectedPatient(patient)
          setViewMode('register-encounter')
        }}/>}
        {viewMode === 'patient-history' && selectedPatient && (
          <PatientHistoryView 
            patient={selectedPatient}
            onBack={() => {
              setViewMode('search-patient')
              setSelectedPatient(null)
            }}
          />
        )}
        {viewMode === 'today-encounters' && <TodayEncountersView />}
        {viewMode === 'my-appointments' && <MyAppointmentsView />}
        {viewMode === 'interconsultas' && <InterconsultasView />}
      </main>
    </div>
  )
}

// ==========================================
// COMPONENTE: Pacientes Hospitalizados
// ==========================================
function HospitalizedPatientsView() {
  const [admisiones, setAdmisiones] = useState<Admision[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [servicioFiltro, setServicioFiltro] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const SERVICIOS = [
    { value: '', label: 'Todos los servicios' },
    { value: 'EMERGENCIA', label: 'Emergencia' },
    { value: 'MEDICINA_INTERNA', label: 'Medicina Interna' },
    { value: 'CIRUGIA_GENERAL', label: 'Cirugía General' },
    { value: 'TRAUMATOLOGIA', label: 'Traumatología' },
    { value: 'UCI', label: 'UCI' },
    { value: 'PEDIATRIA', label: 'Pediatría' },
    { value: 'CARDIOLOGIA', label: 'Cardiología' },
  ]

  useEffect(() => {
    cargarPacientes()
  }, [servicioFiltro])

  const cargarPacientes = async () => {
    setLoading(true)
    try {
      const filters: { servicio?: string } = {}
      if (servicioFiltro) filters.servicio = servicioFiltro
      const response = await admisionesService.listarAdmisionesActivas(filters)
      setAdmisiones(response.admisiones)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar pacientes'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return 'N/A'
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const mes = hoy.getMonth() - nac.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--
    return `${edad} años`
  }

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles.spinner}></div>
        <p>Cargando pacientes hospitalizados...</p>
      </div>
    )
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>🏥 Pacientes Hospitalizados Actualmente</h2>
        <p className={styles['section-subtitle']}>Gestione la atención de pacientes internados</p>
      </div>

      <div className={styles['filters-bar']}>
        <div className={styles['filter-group']}>
          <label>Servicio:</label>
          <select value={servicioFiltro} onChange={(e) => setServicioFiltro(e.target.value)}>
            {SERVICIOS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <button onClick={cargarPacientes} className={styles['refresh-btn']}>
          🔄 Actualizar
        </button>
      </div>

      {error && <div className={styles['error-alert']}>{error}</div>}

      {admisiones.length === 0 ? (
        <div className={styles['empty-state']}>
          <span className={styles['empty-icon']}>🛏️</span>
          <h3>No hay pacientes hospitalizados</h3>
          <p>No se encontraron admisiones activas con los filtros seleccionados</p>
        </div>
      ) : (
        <div className={styles['patients-grid']}>
          {admisiones.map((admision) => (
            <div 
              key={admision.id} 
              className={`${styles['patient-card']} ${expandedId === admision.id ? styles.expanded : ''}`}
            >
              <div className={styles['card-header']}>
                <div className={styles['patient-info']}>
                  <h3>{admision.paciente?.apellidosNombres || 'N/A'}</h3>
                  <span className={styles['historia-badge']}>
                    HC: {admision.paciente?.nroHistoria || 'N/A'}
                  </span>
                </div>
                <span className={`${styles['tipo-badge']} ${
                  admision.tipo === 'EMERGENCIA' ? styles['tipo-emergencia'] : 
                  admision.tipo === 'UCI' ? styles['tipo-uci'] : 
                  styles['tipo-hospitalizacion']
                }`}>
                  {admision.tipo === 'EMERGENCIA' ? '🚨' : admision.tipo === 'UCI' ? '🏥' : '🛏️'} {admision.tipo}
                </span>
              </div>

              <div className={styles['card-body']}>
                <div className={styles['info-row']}>
                  <span><strong>CI:</strong> {admision.paciente?.ci}</span>
                  <span><strong>Edad:</strong> {calcularEdad(admision.paciente?.fechaNacimiento)}</span>
                </div>
                <div className={styles['info-row']}>
                  <span><strong>Servicio:</strong> {admision.servicio?.replace(/_/g, ' ') || 'N/A'}</span>
                  <span><strong>Cama:</strong> {admision.habitacion || '-'} / {admision.cama || '-'}</span>
                </div>
                <div className={styles['info-row']}>
                  <span><strong>Días hosp.:</strong> <span className={styles['dias-badge']}>{admision.diasHospitalizacion || 0}</span></span>
                </div>
              </div>

              <div className={styles['card-actions']}>
                <button 
                  className={styles['action-btn-primary']}
                  onClick={() => alert('Próximamente: Registrar Evolución')}
                >
                  📝 Evolución
                </button>
                <button 
                  className={styles['action-btn-secondary']}
                  onClick={() => setExpandedId(expandedId === admision.id ? null : admision.id)}
                >
                  {expandedId === admision.id ? '▲ Menos' : '▼ Más'}
                </button>
              </div>

              {expandedId === admision.id && (
                <div className={styles['card-expanded']}>
                  <div className={styles['expanded-info']}>
                    <p><strong>Forma ingreso:</strong> {admision.formaIngreso || 'N/A'}</p>
                    <p><strong>Fecha ingreso:</strong> {formatDateVenezuela(admision.fechaAdmision)}</p>
                    {admision.observaciones && (
                      <p><strong>Observaciones:</strong> {admision.observaciones}</p>
                    )}
                  </div>
                  <div className={styles['expanded-actions']}>
                    <button onClick={() => alert('Próximamente: Ver Historia Completa')}>
                      📋 Historia Clínica
                    </button>
                    <button onClick={() => alert('Próximamente: Registrar Alta')}>
                      ✅ Alta Médica
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles['section-footer']}>
        <span>📊 Total: {admisiones.length} pacientes hospitalizados</span>
      </div>
    </section>
  )
}

// ==========================================
// COMPONENTE: Registrar Encuentro
// ==========================================
function RegisterEncounterView({ patient = null }: { patient: PatientBasic | null}) {
  const [step, setStep] = useState(patient ? 2 : 1)
  const [searchCI, setSearchCI] = useState(patient? patient?.ci  : '')
  const [paciente, setPaciente] = useState<PatientBasic | null>(patient)
  const [searching, setSearching] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    tipo: 'CONSULTA' as 'EMERGENCIA' | 'HOSPITALIZACION' | 'CONSULTA' | 'OTRO',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    motivoConsulta: '',
    enfermedadActual: '',
    procedencia: '',
    nroCama: '',
    // Signos vitales
    taSistolica: '',
    taDiastolica: '',
    pulso: '',
    temperatura: '',
    fr: '',
    // Diagnóstico
    diagnostico: '',
    codigoCie: '',
    tratamiento: '',
    observaciones: ''
  })

  // TODO: Obtener ID del médico del contexto de autenticación
  const medicoId = 1

  const buscarPaciente = async () => {
    if (!searchCI.trim()) {
      setError('Ingrese un número de cédula')
      return
    }
    setSearching(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/search?ci=${searchCI}`)
      const result = await response.json()
      if (result.success && result.data) {
        setPaciente(result.data)
        setStep(2)
      } else {
        setError('Paciente no encontrado')
      }
    } catch {
      setError('Error al buscar paciente')
    } finally {
      setSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!paciente) {
      setError('Debe seleccionar un paciente')
      return
    }

    if (!formData.motivoConsulta.trim()) {
      setError('El motivo de consulta es obligatorio')
      return
    }

    setGuardando(true)
    setError('')
    setSuccessMessage('')

    try {
      // Construir objeto de signos vitales solo si hay datos
      const signosVitales = (formData.taSistolica || formData.taDiastolica || formData.pulso || formData.temperatura || formData.fr) ? {
        taSistolica: formData.taSistolica ? parseInt(formData.taSistolica) : undefined,
        taDiastolica: formData.taDiastolica ? parseInt(formData.taDiastolica) : undefined,
        pulso: formData.pulso ? parseInt(formData.pulso) : undefined,
        temperatura: formData.temperatura ? parseFloat(formData.temperatura) : undefined,
        fr: formData.fr ? parseInt(formData.fr) : undefined,
      } : undefined

      // Construir objeto de impresión diagnóstica solo si hay datos
      const impresionDiagnostica = formData.diagnostico ? {
        descripcion: formData.diagnostico,
        codigoCie: formData.codigoCie || undefined,
      } : undefined

      const encuentroData = {
        pacienteId: parseInt(paciente.id),
        tipo: formData.tipo,
        fecha: formData.fecha,
        hora: formData.hora,
        motivoConsulta: formData.motivoConsulta,
        enfermedadActual: formData.enfermedadActual || undefined,
        procedencia: formData.procedencia || undefined,
        nroCama: formData.nroCama || undefined,
        createdById: medicoId,
        signosVitales,
        impresionDiagnostica,
      }

      await encuentrosService.crearEncuentro(encuentroData)
      
      setSuccessMessage('✅ Encuentro registrado exitosamente')
      
      // Limpiar formulario después de éxito
      setTimeout(() => {
        setStep(1)
        setPaciente(null)
        setSearchCI('')
        setFormData({
          tipo: 'CONSULTA',
          fecha: new Date().toISOString().split('T')[0],
          hora: new Date().toTimeString().slice(0, 5),
          motivoConsulta: '',
          enfermedadActual: '',
          procedencia: '',
          nroCama: '',
          taSistolica: '',
          taDiastolica: '',
          pulso: '',
          temperatura: '',
          fr: '',
          diagnostico: '',
          codigoCie: '',
          tratamiento: '',
          observaciones: ''
        })
        setSuccessMessage('')
      }, 2000)
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el encuentro'
      setError(errorMessage)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>📝 Registrar Nuevo Encuentro</h2>
        <p className={styles['section-subtitle']}>
          Documente atenciones médicas: consultas, emergencias o evoluciones hospitalarias
        </p>
      </div>

      {/* Step Indicator */}
      <div className={styles['step-indicator']}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
          <span className={styles['step-number']}>1</span>
          <span className={styles['step-label']}>Buscar Paciente</span>
        </div>
        <div className={styles['step-line']}></div>
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
          <span className={styles['step-number']}>2</span>
          <span className={styles['step-label']}>Datos del Encuentro</span>
        </div>
        <div className={styles['step-line']}></div>
        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
          <span className={styles['step-number']}>3</span>
          <span className={styles['step-label']}>Signos y Diagnóstico</span>
        </div>
      </div>

      {/* Step 1: Buscar Paciente */}
      {step === 1 && (
        <div className={styles['form-card']}>
          <h3>Buscar Paciente por Cédula</h3>
          <div className={styles['search-box']}>
            <input
              type="text"
              placeholder="Ej: V-12345678"
              value={searchCI}
              onChange={(e) => setSearchCI(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarPaciente()}
            />
            <button onClick={buscarPaciente} disabled={searching}>
              {searching ? '🔄 Buscando...' : '🔍 Buscar'}
            </button>
          </div>
          {error && <p className={styles['error-text']}>{error}</p>}
        </div>
      )}

      {/* Step 2: Datos del Encuentro */}
      {step === 2 && paciente && (
        <div className={styles['form-card']}>
          {/* Info del paciente */}
          <div className={styles['patient-summary']}>
            <h3>Paciente Seleccionado</h3>
            <div className={styles['patient-details']}>
              <p><strong>Nombre:</strong> {paciente.apellidosNombres}</p>
              <p><strong>CI:</strong> {paciente.ci}</p>
              <p><strong>Historia:</strong> {paciente.nroHistoria}</p>
            </div>
            <button className={styles['change-patient-btn']} onClick={() => { setStep(1); setPaciente(null) }}>
              Cambiar paciente
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
            <div className={styles['form-grid']}>
              <div className={styles['form-group']}>
                <label>Tipo de Encuentro *</label>
                <select 
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value as 'EMERGENCIA' | 'HOSPITALIZACION' | 'CONSULTA' | 'OTRO'})}
                >
                  <option value="CONSULTA">🩺 Consulta</option>
                  <option value="EMERGENCIA">🚨 Emergencia</option>
                  <option value="HOSPITALIZACION">🛏️ Evolución Hospitalización</option>
                  <option value="OTRO">📋 Otro</option>
                </select>
              </div>

              <div className={styles['form-group']}>
                <label>Fecha *</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                />
              </div>

              <div className={styles['form-group']}>
                <label>Hora *</label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({...formData, hora: e.target.value})}
                />
              </div>

              <div className={styles['form-group']}>
                <label>Procedencia</label>
                <input
                  type="text"
                  placeholder="Ej: Consulta externa, Referido de..."
                  value={formData.procedencia}
                  onChange={(e) => setFormData({...formData, procedencia: e.target.value})}
                />
              </div>

              <div className={`${styles['form-group']} ${styles['full-width']}`}>
                <label>Motivo de Consulta *</label>
                <textarea
                  rows={3}
                  placeholder="Describa el motivo de la consulta..."
                  value={formData.motivoConsulta}
                  onChange={(e) => setFormData({...formData, motivoConsulta: e.target.value})}
                />
              </div>

              <div className={`${styles['form-group']} ${styles['full-width']}`}>
                <label>Enfermedad Actual</label>
                <textarea
                  rows={4}
                  placeholder="Historia de la enfermedad actual..."
                  value={formData.enfermedadActual}
                  onChange={(e) => setFormData({...formData, enfermedadActual: e.target.value})}
                />
              </div>
            </div>

            <div className={styles['form-actions']}>
              <button type="button" className={styles['btn-secondary']} onClick={() => setStep(1)}>
                ← Atrás
              </button>
              <button type="submit" className={styles['btn-primary']}>
                Continuar →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Signos Vitales y Diagnóstico */}
      {step === 3 && (
        <div className={styles['form-card']}>
          <h3>Signos Vitales y Diagnóstico</h3>
          
          <form onSubmit={handleSubmit}>
            {/* Signos Vitales */}
            <div className={styles['form-section']}>
              <h4>📊 Signos Vitales</h4>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label>T.A. Sistólica (mmHg)</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={formData.taSistolica}
                    onChange={(e) => setFormData({...formData, taSistolica: e.target.value})}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>T.A. Diastólica (mmHg)</label>
                  <input
                    type="number"
                    placeholder="80"
                    value={formData.taDiastolica}
                    onChange={(e) => setFormData({...formData, taDiastolica: e.target.value})}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Pulso (lpm)</label>
                  <input
                    type="number"
                    placeholder="72"
                    value={formData.pulso}
                    onChange={(e) => setFormData({...formData, pulso: e.target.value})}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={formData.temperatura}
                    onChange={(e) => setFormData({...formData, temperatura: e.target.value})}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Frec. Respiratoria (rpm)</label>
                  <input
                    type="number"
                    placeholder="18"
                    value={formData.fr}
                    onChange={(e) => setFormData({...formData, fr: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Diagnóstico */}
            <div className={styles['form-section']}>
              <h4>🩺 Impresión Diagnóstica</h4>
              <div className={styles['form-grid']}>
                <div className={`${styles['form-group']} ${styles['full-width']}`}>
                  <label>Diagnóstico *</label>
                  <textarea
                    rows={3}
                    placeholder="Describa el diagnóstico..."
                    value={formData.diagnostico}
                    onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Código CIE-10 (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: J06.9"
                    value={formData.codigoCie}
                    onChange={(e) => setFormData({...formData, codigoCie: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Tratamiento */}
            <div className={styles['form-section']}>
              <h4>💊 Plan de Tratamiento</h4>
              <div className={styles['form-grid']}>
                <div className={`${styles['form-group']} ${styles['full-width']}`}>
                  <label>Indicaciones y Tratamiento</label>
                  <textarea
                    rows={4}
                    placeholder="Indique el tratamiento y recomendaciones..."
                    value={formData.tratamiento}
                    onChange={(e) => setFormData({...formData, tratamiento: e.target.value})}
                  />
                </div>
                <div className={`${styles['form-group']} ${styles['full-width']}`}>
                  <label>Observaciones Adicionales</label>
                  <textarea
                    rows={2}
                    placeholder="Notas adicionales..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {error && <div className={styles['error-alert']}>{error}</div>}
            {successMessage && <div className={styles['success-alert']}>{successMessage}</div>}

            <div className={styles['form-actions']}>
              <button type="button" className={styles['btn-secondary']} onClick={() => setStep(2)} disabled={guardando}>
                ← Atrás
              </button>
              <button type="submit" className={styles['btn-primary']} disabled={guardando}>
                {guardando ? '⏳ Guardando...' : '💾 Guardar Encuentro'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}

// ==========================================
// COMPONENTE: Buscar Paciente
// ==========================================
function SearchPatientView({ onViewHistory, onRegisterEncounter }: { onViewHistory: (patient: PatientBasic) => void, onRegisterEncounter: (patient: PatientBasic) => void }) {
  const [searchType, setSearchType] = useState<'ci' | 'historia'>('ci')
  const [searchValue, setSearchValue] = useState('')
  const [searching, setSearching] = useState(false)
  const [paciente, setPaciente] = useState<PatientBasic | null>(null)
  const [error, setError] = useState('')

  const buscarPaciente = async () => {
    if (!searchValue.trim()) {
      setError('Ingrese un valor de búsqueda')
      return
    }
    setSearching(true)
    setError('')
    setPaciente(null)

    try {
      const queryParam = searchType === 'ci' ? `ci=${searchValue}` : `historia=${searchValue}`
      const response = await fetch(`${API_BASE_URL}/pacientes/search?${queryParam}`)
      const result = await response.json()

      if (result.success && result.data) {
        console.log('El paciente:', result?.data);
        setPaciente(result.data)
      } else {
        setError('Paciente no encontrado')
      }
    } catch {
      setError('Error al buscar paciente')
    } finally {
      setSearching(false)
    }
  }

  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return 'N/A'
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const mes = hoy.getMonth() - nac.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--
    return `${edad} años`
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>🔍 Buscar Paciente</h2>
        <p className={styles['section-subtitle']}>Consulte la historia clínica y antecedentes del paciente</p>
      </div>

      <div className={styles['form-card']}>
        <div className={styles['search-type-selector']}>
          <label className={searchType === 'ci' ? styles.active : ''}>
            <input
              type="radio"
              name="searchType"
              value="ci"
              checked={searchType === 'ci'}
              onChange={() => setSearchType('ci')}
            />
            Buscar por Cédula
          </label>
          <label className={searchType === 'historia' ? styles.active : ''}>
            <input
              type="radio"
              name="searchType"
              value="historia"
              checked={searchType === 'historia'}
              onChange={() => setSearchType('historia')}
            />
            Buscar por Nro. Historia
          </label>
        </div>

        <div className={styles['search-box']}>
          <input
            type="text"
            placeholder={searchType === 'ci' ? 'Ej: V-12345678' : 'Ej: 25-11-01'}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && buscarPaciente()}
          />
          <button onClick={buscarPaciente} disabled={searching}>
            {searching ? '🔄 Buscando...' : '🔍 Buscar'}
          </button>
        </div>

        {error && <p className={styles['error-text']}>{error}</p>}

        {paciente && (
          <div className={styles['patient-result']}>
            <div className={styles['patient-header']}>
              <h3>{paciente.apellidosNombres}</h3>
              <span className={styles['historia-badge']}>HC: {paciente.nroHistoria}</span>
            </div>

            <div className={styles['patient-info-grid']}>
              <div className={styles['info-item']}>
                <strong>Cédula:</strong>
                <span>{paciente.ci}</span>
              </div>
              <div className={styles['info-item']}>
                <strong>Edad:</strong>
                <span>{calcularEdad(paciente.fechaNacimiento)}</span>
              </div>
              <div className={styles['info-item']}>
                <strong>Sexo:</strong>
                <span>{paciente.sexo === 'M' ? '♂ Masculino' : '♀ Femenino'}</span>
              </div>
              <div className={styles['info-item']}>
                <strong>Teléfono:</strong>
                <span>{paciente.telefono || 'N/A'}</span>
              </div>
            </div>

            <div className={styles['patient-stats']}>
              <div className={styles['stat-item']}>
                <span className={styles['stat-number']}>{paciente.admisiones?.length || 0}</span>
                <span className={styles['stat-label']}>Admisiones</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-number']}>{paciente.encuentros?.length || 0}</span>
                <span className={styles['stat-label']}>Encuentros</span>
              </div>
            </div>

            <div className={styles['patient-actions']}>
              <button className={styles['btn-primary']} onClick={() => onViewHistory(paciente)}>
                📋 Ver Historia Completa
              </button>
              <button className={styles['btn-secondary']} onClick={() => onRegisterEncounter(paciente)}>
                📝 Nuevo Encuentro
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ==========================================
// COMPONENTE: Historia del Paciente
// ==========================================
function PatientHistoryView({ patient, onBack }: { patient: PatientBasic; onBack: () => void }) {
  const [encuentros, setEncuentros] = useState<Encuentro[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEncuentro, setSelectedEncuentro] = useState<Encuentro | null>(null)

  useEffect(() => {
    cargarEncuentros()
  }, [patient.id])

  const cargarEncuentros = async () => {
    try {
      const data = await encuentrosService.obtenerPorPaciente(patient.id)
      setEncuentros(data)
    } catch (err) {
      console.error('Error al cargar encuentros:', err)
    } finally {
      setLoading(false)
    }
  }

  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return 'N/A'
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const mes = hoy.getMonth() - nac.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--
    return `${edad} años`
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>📋 Historia Clínica</h2>
        <button className={styles['back-link']} onClick={onBack}>← Volver a búsqueda</button>
      </div>

      {/* Datos del Paciente */}
      <div className={styles['patient-header-card']}>
        <div className={styles['patient-main-info']}>
          <h3>{patient.apellidosNombres}</h3>
          <div className={styles.badges}>
            <span className={styles['historia-badge']}>HC: {patient.nroHistoria}</span>
            <span className={styles['ci-badge']}>CI: {patient.ci}</span>
          </div>
        </div>
        <div className={styles['patient-details-grid']}>
          <span><strong>Edad:</strong> {calcularEdad(patient.fechaNacimiento)}</span>
          <span><strong>Sexo:</strong> {patient.sexo === 'M' ? '♂ Masculino' : '♀ Femenino'}</span>
          <span><strong>Teléfono:</strong> {patient.telefono || 'N/A'}</span>
          <span><strong>Dirección:</strong> {patient.direccion || 'N/A'}</span>
        </div>
        
        {/* Datos Militares si existen */}
        {patient.personalMilitar && (
          <div className={styles['military-info']}>
            <h4>🎖️ Datos Militares</h4>
            <div className={styles['military-grid']}>
              <span><strong>Grado:</strong> {patient.personalMilitar.grado || 'N/A'}</span>
              <span><strong>Componente:</strong> {patient.personalMilitar.componente || 'N/A'}</span>
              <span><strong>Unidad:</strong> {patient.personalMilitar.unidad || 'N/A'}</span>
              <span><strong>Estado:</strong> {patient.personalMilitar.estadoMilitar || 'N/A'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Encuentros */}
      <div className={styles['form-card']}>
        <h3>👨‍⚕️ Encuentros Médicos</h3>
        {loading ? (
          <div className={styles['loading-inline']}>Cargando encuentros...</div>
        ) : (
          <EncuentrosList 
            encuentros={encuentros}
            onVerDetalle={(encuentro) => setSelectedEncuentro(encuentro)}
          />
        )}
      </div>

      {/* Admisiones */}
      {patient.admisiones && patient.admisiones.length > 0 && (
        <div className={styles['form-card']}>
          <h3>🏥 Historial de Admisiones</h3>
          <div className={styles['admisiones-list']}>
            {patient.admisiones.map((adm: Admision) => (
              <div key={adm.id} className={styles['admision-item']}>
                <div className={styles['admision-header']}>
                  <span className={`${styles['tipo-badge']} ${styles[`tipo-${adm.tipo?.toLowerCase()}`]}`}>
                    {adm.tipo || 'N/A'}
                  </span>
                  <span className={styles.fecha}>
                    {formatDateVenezuela(adm.fechaAdmision)}
                  </span>
                </div>
                <div className={styles['admision-details']}>
                  <span><strong>Servicio:</strong> {adm.servicio?.replace(/_/g, ' ') || 'N/A'}</span>
                  <span><strong>Estado:</strong> {adm.estado}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalle de Encuentro */}
      {selectedEncuentro && (
        <EncuentroDetailModal
          encuentro={selectedEncuentro}
          onClose={() => setSelectedEncuentro(null)}
        />
      )}
    </section>
  )
}

// ==========================================
// COMPONENTE: Atenciones del Día
// ==========================================
function TodayEncountersView() {
  const [encuentros, setEncuentros] = useState<Encuentro[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEncuentro, setSelectedEncuentro] = useState<Encuentro | null>(null)

  useEffect(() => {
    cargarEncuentrosHoy()
  }, [])

  const cargarEncuentrosHoy = async () => {
    try {
      const data = await encuentrosService.obtenerHoy()
      setEncuentros(data)
    } catch (err) {
      console.error('Error al cargar encuentros:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      EMERGENCIA: '🚨 Emergencia',
      HOSPITALIZACION: '🛏️ Hospitalización',
      CONSULTA: '🩺 Consulta',
      OTRO: '📋 Otro',
    }
    return labels[tipo] || tipo
  }

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles.spinner}></div>
        <p>Cargando atenciones de hoy...</p>
      </div>
    )
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>📅 Atenciones de Hoy</h2>
        <p className={styles['section-subtitle']}>
          {formatDateLongVenezuela(new Date())}
        </p>
      </div>

      <div className={styles['form-card']}>
        {encuentros.length === 0 ? (
          <div className={styles['empty-state']}>
            <span className={styles['empty-icon']}>📋</span>
            <h3>No hay atenciones registradas hoy</h3>
            <p>Los encuentros médicos aparecerán aquí cuando se registren</p>
          </div>
        ) : (
          <>
            <div className={styles['stats-summary']}>
              <div className={styles['stat-box']}>
                <span className={styles['stat-number']}>{encuentros.length}</span>
                <span className={styles['stat-label']}>Total atenciones</span>
              </div>
              <div className={styles['stat-box']}>
                <span className={styles['stat-number']}>
                  {encuentros.filter(e => e.tipo === 'EMERGENCIA').length}
                </span>
                <span className={styles['stat-label']}>Emergencias</span>
              </div>
              <div className={styles['stat-box']}>
                <span className={styles['stat-number']}>
                  {encuentros.filter(e => e.tipo === 'CONSULTA').length}
                </span>
                <span className={styles['stat-label']}>Consultas</span>
              </div>
            </div>

            <div className={styles['encounters-table']}>
              <table>
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>Tipo</th>
                    <th>Médico</th>
                    <th>Motivo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {encuentros.map((enc) => (
                    <tr key={enc.id}>
                      <td>{enc.hora?.substring(0, 5) || '--:--'}</td>
                      <td>
                        <strong>{enc.paciente?.apellidosNombres || 'N/A'}</strong>
                        <br />
                        <small>{enc.paciente?.ci}</small>
                      </td>
                      <td>
                        <span className={`${styles['tipo-tag']} ${styles[`tipo-${enc.tipo.toLowerCase()}`]}`}>
                          {getTipoLabel(enc.tipo)}
                        </span>
                      </td>
                      <td>{enc.createdBy?.nombre || 'N/A'}</td>
                      <td>{enc.motivoConsulta?.substring(0, 50) || 'N/A'}...</td>
                      <td>
                        <button 
                          className={styles['btn-small']}
                          onClick={() => setSelectedEncuentro(enc)}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedEncuentro && (
        <EncuentroDetailModal
          encuentro={selectedEncuentro}
          onClose={() => setSelectedEncuentro(null)}
        />
      )}
    </section>
  )
}

// ==========================================
// COMPONENTE: Mis Citas
// ==========================================
function MyAppointmentsView() {
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState<number | null>(null)

  // TODO: Obtener ID del médico actual del contexto de autenticación
  const medicoId = 1 // Temporal

  useEffect(() => {
    cargarCitas()
  }, [])

  const cargarCitas = async () => {
    try {
      // Intentar cargar citas del día para el médico actual
      const citasHoy = await citasService.obtenerCitasDelDia(medicoId)
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
      alert('✅ Cita marcada como en atención')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al atender cita'
      alert('❌ ' + errorMessage)
    } finally {
      setProcesando(null)
    }
  }

  const handleCompletarCita = async (citaId: number) => {
    setProcesando(citaId)
    try {
      await citasService.completarCita(citaId)
      await cargarCitas()
      alert('✅ Cita completada')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar cita'
      alert('❌ ' + errorMessage)
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

// ==========================================
// COMPONENTE: Interconsultas
// ==========================================
function InterconsultasView() {
  const [tabActiva, setTabActiva] = useState<'enviadas' | 'recibidas' | 'nueva'>('enviadas')
  const [interconsultasEnviadas, setInterconsultasEnviadas] = useState<Interconsulta[]>([])
  const [interconsultasRecibidas, setInterconsultasRecibidas] = useState<Interconsulta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedInterconsulta, setSelectedInterconsulta] = useState<Interconsulta | null>(null)
  
  // Para crear nueva interconsulta
  const [searchCI, setSearchCI] = useState('')
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PatientBasic | null>(null)
  const [searching, setSearching] = useState(false)
  const [formData, setFormData] = useState<Partial<CrearInterconsultaDTO>>({
    especialidadDestino: '',
    prioridad: 'MEDIA',
    motivo: '',
    diagnosticoPrevio: '',
    observaciones: ''
  })
  const [creando, setCreando] = useState(false)

  // TODO: Obtener ID del médico actual del contexto de autenticación
  const medicoId = 1 // Temporal - deberá venir del contexto de auth

  useEffect(() => {
    cargarInterconsultas()
  }, [])

  const cargarInterconsultas = async () => {
    setLoading(true)
    try {
      const [enviadas, recibidas] = await Promise.all([
        interconsultasService.obtenerInterconsultasPendientes(medicoId),
        interconsultasService.obtenerInterconsultasRecibidas(medicoId)
      ])
      setInterconsultasEnviadas(enviadas)
      setInterconsultasRecibidas(recibidas)
    } catch (err) {
      console.error('Error al cargar interconsultas:', err)
      setError('Error al cargar interconsultas')
    } finally {
      setLoading(false)
    }
  }

  const buscarPaciente = async () => {
    if (!searchCI.trim()) {
      setError('Ingrese un número de cédula')
      return
    }
    setSearching(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/search?ci=${searchCI}`)
      const result = await response.json()
      if (result.success && result.data) {
        setPacienteSeleccionado(result.data)
      } else {
        setError('Paciente no encontrado')
      }
    } catch {
      setError('Error al buscar paciente')
    } finally {
      setSearching(false)
    }
  }

  const crearInterconsulta = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pacienteSeleccionado) {
      setError('Debe seleccionar un paciente')
      return
    }
    if (!formData.especialidadDestino || !formData.motivo) {
      setError('Complete los campos obligatorios')
      return
    }

    setCreando(true)
    setError('')
    try {
      const nuevaInterconsulta: CrearInterconsultaDTO = {
        pacienteId: parseInt(pacienteSeleccionado.id),
        medicoSolicitanteId: medicoId,
        especialidadDestino: formData.especialidadDestino!,
        prioridad: formData.prioridad as PrioridadInterconsulta,
        motivo: formData.motivo!,
        diagnosticoPrevio: formData.diagnosticoPrevio,
        observaciones: formData.observaciones
      }
      
      await interconsultasService.crearInterconsulta(nuevaInterconsulta)
      
      // Limpiar y volver a cargar
      setPacienteSeleccionado(null)
      setSearchCI('')
      setFormData({
        especialidadDestino: '',
        prioridad: 'MEDIA',
        motivo: '',
        diagnosticoPrevio: '',
        observaciones: ''
      })
      setTabActiva('enviadas')
      await cargarInterconsultas()
      alert('✅ Interconsulta creada exitosamente')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear interconsulta'
      setError(errorMessage)
    } finally {
      setCreando(false)
    }
  }

  const aceptarInterconsulta = async (interconsultaId: number) => {
    try {
      await interconsultasService.aceptarInterconsulta(interconsultaId, medicoId)
      await cargarInterconsultas()
      alert('✅ Interconsulta aceptada')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aceptar'
      alert('❌ ' + errorMessage)
    }
  }

  const getPrioridadBadge = (prioridad: string) => {
    const config: Record<string, { emoji: string; className: string }> = {
      URGENTE: { emoji: '🔴', className: styles['prioridad-urgente'] },
      ALTA: { emoji: '🟠', className: styles['prioridad-alta'] },
      MEDIA: { emoji: '🟡', className: styles['prioridad-media'] },
      BAJA: { emoji: '🟢', className: styles['prioridad-baja'] }
    }
    return config[prioridad] || config.MEDIA
  }

  const getEstadoBadge = (estado: string) => {
    const config: Record<string, { label: string; className: string }> = {
      PENDIENTE: { label: '⏳ Pendiente', className: styles['estado-pendiente'] },
      EN_PROCESO: { label: '🔄 En Proceso', className: styles['estado-proceso'] },
      COMPLETADA: { label: '✅ Completada', className: styles['estado-completada'] },
      CANCELADA: { label: '❌ Cancelada', className: styles['estado-cancelada'] }
    }
    return config[estado] || config.PENDIENTE
  }

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles.spinner}></div>
        <p>Cargando interconsultas...</p>
      </div>
    )
  }

  return (
    <section className={styles['view-section']}>
      <div className={styles['section-header']}>
        <h2>🔄 Interconsultas Médicas</h2>
        <p className={styles['section-subtitle']}>
          Solicite evaluaciones de otras especialidades o responda consultas recibidas
        </p>
      </div>

      {/* Tabs de navegación */}
      <div className={styles['tabs-container']}>
        <button 
          className={`${styles.tab} ${tabActiva === 'enviadas' ? styles.active : ''}`}
          onClick={() => setTabActiva('enviadas')}
        >
          📤 Enviadas ({interconsultasEnviadas.length})
        </button>
        <button 
          className={`${styles.tab} ${tabActiva === 'recibidas' ? styles.active : ''}`}
          onClick={() => setTabActiva('recibidas')}
        >
          📥 Recibidas ({interconsultasRecibidas.length})
        </button>
        <button 
          className={`${styles.tab} ${tabActiva === 'nueva' ? styles.active : ''}`}
          onClick={() => setTabActiva('nueva')}
        >
          ➕ Nueva Interconsulta
        </button>
      </div>

      {error && <div className={styles['error-alert']}>{error}</div>}

      {/* Tab: Interconsultas Enviadas */}
      {tabActiva === 'enviadas' && (
        <div className={styles['form-card']}>
          <h3>📤 Interconsultas Enviadas</h3>
          {interconsultasEnviadas.length === 0 ? (
            <div className={styles['empty-state']}>
              <span className={styles['empty-icon']}>📭</span>
              <h3>No hay interconsultas enviadas</h3>
              <p>Las solicitudes que envíe aparecerán aquí</p>
            </div>
          ) : (
            <div className={styles['interconsultas-list']}>
              {interconsultasEnviadas.map((ic) => (
                <div key={ic.id} className={styles['interconsulta-card']}>
                  <div className={styles['ic-header']}>
                    <div className={styles['ic-paciente']}>
                      <strong>{ic.paciente?.nombre} {ic.paciente?.apellido}</strong>
                      <small>CI: {ic.paciente?.cedula}</small>
                    </div>
                    <div className={styles['ic-badges']}>
                      <span className={getPrioridadBadge(ic.prioridad).className}>
                        {getPrioridadBadge(ic.prioridad).emoji} {ic.prioridad}
                      </span>
                      <span className={getEstadoBadge(ic.estado).className}>
                        {getEstadoBadge(ic.estado).label}
                      </span>
                    </div>
                  </div>
                  <div className={styles['ic-body']}>
                    <p><strong>Especialidad solicitada:</strong> {ic.especialidadDestino}</p>
                    <p><strong>Motivo:</strong> {ic.motivo}</p>
                    <p><strong>Fecha solicitud:</strong> {formatDateTimeVenezuela(ic.fechaSolicitud)}</p>
                    {ic.medicoDestino && (
                      <p><strong>Atendida por:</strong> Dr. {ic.medicoDestino.nombre} {ic.medicoDestino.apellido}</p>
                    )}
                    {ic.respuesta && (
                      <div className={styles['ic-respuesta']}>
                        <strong>Respuesta:</strong>
                        <p>{ic.respuesta}</p>
                      </div>
                    )}
                  </div>
                  <div className={styles['ic-actions']}>
                    <button 
                      className={styles['btn-small']}
                      onClick={() => {
                        setSelectedInterconsulta(ic)
                        setShowModal(true)
                      }}
                    >
                      👁️ Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Interconsultas Recibidas */}
      {tabActiva === 'recibidas' && (
        <div className={styles['form-card']}>
          <h3>📥 Interconsultas Recibidas</h3>
          {interconsultasRecibidas.length === 0 ? (
            <div className={styles['empty-state']}>
              <span className={styles['empty-icon']}>📬</span>
              <h3>No hay interconsultas recibidas</h3>
              <p>Las solicitudes dirigidas a su especialidad aparecerán aquí</p>
            </div>
          ) : (
            <div className={styles['interconsultas-list']}>
              {interconsultasRecibidas.map((ic) => (
                <div key={ic.id} className={`${styles['interconsulta-card']} ${styles['ic-recibida']}`}>
                  <div className={styles['ic-header']}>
                    <div className={styles['ic-paciente']}>
                      <strong>{ic.paciente?.nombre} {ic.paciente?.apellido}</strong>
                      <small>CI: {ic.paciente?.cedula}</small>
                    </div>
                    <div className={styles['ic-badges']}>
                      <span className={getPrioridadBadge(ic.prioridad).className}>
                        {getPrioridadBadge(ic.prioridad).emoji} {ic.prioridad}
                      </span>
                      <span className={getEstadoBadge(ic.estado).className}>
                        {getEstadoBadge(ic.estado).label}
                      </span>
                    </div>
                  </div>
                  <div className={styles['ic-body']}>
                    <p><strong>Solicitado por:</strong> Dr. {ic.medicoSolicitante?.nombre} {ic.medicoSolicitante?.apellido} ({ic.medicoSolicitante?.especialidad})</p>
                    <p><strong>Motivo:</strong> {ic.motivo}</p>
                    {ic.diagnosticoPrevio && (
                      <p><strong>Diagnóstico previo:</strong> {ic.diagnosticoPrevio}</p>
                    )}
                    <p><strong>Fecha solicitud:</strong> {formatDateTimeVenezuela(ic.fechaSolicitud)}</p>
                  </div>
                  <div className={styles['ic-actions']}>
                    {ic.estado === 'PENDIENTE' && (
                      <button 
                        className={styles['btn-primary']}
                        onClick={() => aceptarInterconsulta(ic.id)}
                      >
                        ✅ Aceptar
                      </button>
                    )}
                    {ic.estado === 'EN_PROCESO' && (
                      <button 
                        className={styles['btn-primary']}
                        onClick={() => {
                          setSelectedInterconsulta(ic)
                          setShowModal(true)
                        }}
                      >
                        📝 Responder
                      </button>
                    )}
                    <button 
                      className={styles['btn-small']}
                      onClick={() => {
                        setSelectedInterconsulta(ic)
                        setShowModal(true)
                      }}
                    >
                      👁️ Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Nueva Interconsulta */}
      {tabActiva === 'nueva' && (
        <div className={styles['form-card']}>
          <h3>➕ Crear Nueva Interconsulta</h3>
          
          {/* Paso 1: Buscar paciente */}
          {!pacienteSeleccionado ? (
            <div className={styles['form-section']}>
              <h4>1. Buscar Paciente</h4>
              <div className={styles['search-box']}>
                <input
                  type="text"
                  placeholder="Ingrese cédula del paciente (Ej: V-12345678)"
                  value={searchCI}
                  onChange={(e) => setSearchCI(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && buscarPaciente()}
                />
                <button onClick={buscarPaciente} disabled={searching}>
                  {searching ? '🔄 Buscando...' : '🔍 Buscar'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Paciente seleccionado */}
              <div className={styles['patient-summary']}>
                <div className={styles['patient-details']}>
                  <p><strong>Paciente:</strong> {pacienteSeleccionado.apellidosNombres}</p>
                  <p><strong>CI:</strong> {pacienteSeleccionado.ci}</p>
                  <p><strong>Historia:</strong> {pacienteSeleccionado.nroHistoria}</p>
                </div>
                <button 
                  className={styles['change-patient-btn']} 
                  onClick={() => setPacienteSeleccionado(null)}
                >
                  Cambiar paciente
                </button>
              </div>

              {/* Formulario de interconsulta */}
              <form onSubmit={crearInterconsulta}>
                <div className={styles['form-section']}>
                  <h4>2. Datos de la Interconsulta</h4>
                  <div className={styles['form-grid']}>
                    <div className={styles['form-group']}>
                      <label>Especialidad Destino *</label>
                      <select
                        value={formData.especialidadDestino}
                        onChange={(e) => setFormData({...formData, especialidadDestino: e.target.value})}
                        required
                      >
                        <option value="">Seleccione especialidad</option>
                        {interconsultasService.ESPECIALIDADES_MEDICAS.map(esp => (
                          <option key={esp} value={esp}>{esp}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles['form-group']}>
                      <label>Prioridad *</label>
                      <select
                        value={formData.prioridad}
                        onChange={(e) => setFormData({...formData, prioridad: e.target.value as PrioridadInterconsulta})}
                      >
                        {interconsultasService.PRIORIDADES_INTERCONSULTA.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className={`${styles['form-group']} ${styles['full-width']}`}>
                      <label>Motivo de la Interconsulta *</label>
                      <textarea
                        rows={3}
                        placeholder="Describa el motivo de la solicitud de interconsulta..."
                        value={formData.motivo}
                        onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                        required
                      />
                    </div>

                    <div className={`${styles['form-group']} ${styles['full-width']}`}>
                      <label>Diagnóstico Previo</label>
                      <textarea
                        rows={2}
                        placeholder="Diagnóstico o impresión diagnóstica actual..."
                        value={formData.diagnosticoPrevio}
                        onChange={(e) => setFormData({...formData, diagnosticoPrevio: e.target.value})}
                      />
                    </div>

                    <div className={`${styles['form-group']} ${styles['full-width']}`}>
                      <label>Observaciones Adicionales</label>
                      <textarea
                        rows={2}
                        placeholder="Información adicional relevante..."
                        value={formData.observaciones}
                        onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles['form-actions']}>
                  <button 
                    type="button" 
                    className={styles['btn-secondary']}
                    onClick={() => {
                      setPacienteSeleccionado(null)
                      setFormData({
                        especialidadDestino: '',
                        prioridad: 'MEDIA',
                        motivo: '',
                        diagnosticoPrevio: '',
                        observaciones: ''
                      })
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className={styles['btn-primary']}
                    disabled={creando}
                  >
                    {creando ? '⏳ Enviando...' : '📤 Enviar Interconsulta'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Modal de detalle/respuesta */}
      {showModal && selectedInterconsulta && (
        <InterconsultaModal
          interconsulta={selectedInterconsulta}
          onClose={() => {
            setShowModal(false)
            setSelectedInterconsulta(null)
          }}
          onUpdate={cargarInterconsultas}
          medicoId={medicoId}
        />
      )}
    </section>
  )
}

// ==========================================
// COMPONENTE: Modal de Interconsulta
// ==========================================
function InterconsultaModal({ 
  interconsulta, 
  onClose, 
  onUpdate,
  medicoId 
}: { 
  interconsulta: Interconsulta
  onClose: () => void
  onUpdate: () => void
  medicoId: number
}) {
  const [respuesta, setRespuesta] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [enviando, setEnviando] = useState(false)

  const puedeResponder = interconsulta.estado === 'EN_PROCESO' && interconsulta.medicoDestinoId === medicoId

  const completarInterconsulta = async () => {
    if (!respuesta.trim()) {
      alert('Debe ingresar una respuesta')
      return
    }
    setEnviando(true)
    try {
      await interconsultasService.completarInterconsulta(interconsulta.id, {
        respuesta,
        observaciones
      })
      alert('✅ Interconsulta completada')
      onUpdate()
      onClose()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar'
      alert('❌ ' + errorMessage)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <h3>📋 Detalle de Interconsulta</h3>
          <button className={styles['close-btn']} onClick={onClose}>×</button>
        </div>
        
        <div className={styles['modal-body']}>
          <div className={styles['detail-section']}>
            <h4>Paciente</h4>
            <p><strong>Nombre:</strong> {interconsulta.paciente?.nombre} {interconsulta.paciente?.apellido}</p>
            <p><strong>Cédula:</strong> {interconsulta.paciente?.cedula}</p>
          </div>

          <div className={styles['detail-section']}>
            <h4>Solicitud</h4>
            <p><strong>Especialidad:</strong> {interconsulta.especialidadDestino}</p>
            <p><strong>Prioridad:</strong> {interconsulta.prioridad}</p>
            <p><strong>Estado:</strong> {interconsulta.estado}</p>
            <p><strong>Motivo:</strong> {interconsulta.motivo}</p>
            {interconsulta.diagnosticoPrevio && (
              <p><strong>Diagnóstico Previo:</strong> {interconsulta.diagnosticoPrevio}</p>
            )}
            <p><strong>Solicitado por:</strong> Dr. {interconsulta.medicoSolicitante?.nombre} {interconsulta.medicoSolicitante?.apellido}</p>
            <p><strong>Fecha:</strong> {formatDateTimeVenezuela(interconsulta.fechaSolicitud)}</p>
          </div>

          {interconsulta.respuesta && (
            <div className={styles['detail-section']}>
              <h4>Respuesta</h4>
              <p>{interconsulta.respuesta}</p>
              {interconsulta.fechaRespuesta && (
                <p><small>Respondido: {formatDateTimeVenezuela(interconsulta.fechaRespuesta)}</small></p>
              )}
            </div>
          )}

          {puedeResponder && (
            <div className={styles['detail-section']}>
              <h4>📝 Su Respuesta</h4>
              <div className={styles['form-group']}>
                <label>Evaluación / Recomendaciones *</label>
                <textarea
                  rows={4}
                  placeholder="Ingrese su evaluación y recomendaciones..."
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                />
              </div>
              <div className={styles['form-group']}>
                <label>Observaciones adicionales</label>
                <textarea
                  rows={2}
                  placeholder="Notas adicionales..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles['modal-footer']}>
          <button className={styles['btn-secondary']} onClick={onClose}>
            Cerrar
          </button>
          {puedeResponder && (
            <button 
              className={styles['btn-primary']} 
              onClick={completarInterconsulta}
              disabled={enviando}
            >
              {enviando ? '⏳ Enviando...' : '✅ Completar Interconsulta'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
