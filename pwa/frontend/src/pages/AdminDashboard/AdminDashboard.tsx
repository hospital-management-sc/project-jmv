/**
 * Dashboard para Personal Administrativo
 * Vista especializada para gestión administrativa y control de usuarios
 */

import { useState, useEffect } from 'react'
import styles from './AdminDashboard.module.css'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import RegistrarAdmision from '@/components/RegistrarAdmision'
import PacientesHospitalizados from '@/components/PacientesHospitalizados'
import EncuentroDetailModal from '@/components/EncuentroDetailModal'
import { SearchableSelect } from '@/components/SearchableSelect/SearchableSelect'
import { PatientTypeSelector } from '@/components/PatientTypeSelector'
import { AfiliadoDataSection, type AfiliadoData } from '@/components/AfiliadoDataSection'
import { encuentrosService } from '@/services/encuentros.service'
import type { Encuentro } from '@/services/encuentros.service'
import { API_BASE_URL } from '@/utils/constants'
import { VENEZUELA_TIMEZONE, VENEZUELA_LOCALE } from '@/utils/dateUtils'
import { ESTADOS_VENEZUELA, NACIONALIDADES, RELIGIONES, GRADOS_MILITARES, COMPONENTES_MILITARES } from '@/constants/venezuela'

type ViewMode = 'main' | 'register-patient' | 'create-appointment' | 'search-patient' | 'register-admission' | 'patient-history' | 'hospitalized-patients'

export default function AdminDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('main')
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<any>(null)
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState<any>(null)
  const { stats, loading, error } = useDashboardStats(120000) // Actualizar cada 2 minutos

  const renderMainView = () => (
    <>
      {/* Sección de Estadísticas */}
      <section className={styles['dashboard-stats']}>
        {error && (
          <div style={{ gridColumn: '1 / -1', color: '#ef4444', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            ⚠️ Error al cargar estadísticas: {error}
          </div>
        )}
        <div className={styles.card}>
          <h2>Total de Pacientes</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats?.totalPacientes ?? 0}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            {!loading && stats && (
              <>
                🪖 {stats.pacientesMilitares} Militares · 
                👨‍👩‍👧‍👦 {stats.pacientesAfiliados} Afiliados · 
                👤 {stats.pacientesPNA} PNA
              </>
            )}
          </div>
        </div>
        <div className={styles.card}>
          <h2>Citas Programadas Hoy</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats?.citasProgramadasHoy ?? 0}
          </div>
        </div>
        <div className={styles.card}>
          <h2>Registros de Auditoría</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats?.registrosAuditoria ?? 0}
          </div>
        </div>
      </section>

      {/* Sección de Gestión Principal */}
      <section className={styles['management-section']}>
        <h2>Gestión Principal</h2>
        <div className={styles['admin-grid']}>
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('register-patient')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Registrar Nuevo Paciente</span>
              <span className={styles['btn-description']}>Ingrese datos personales y médicos iniciales</span>
            </div>
          </button>
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('search-patient')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Consultar Historia Clínica</span>
              <span className={styles['btn-description']}>Busque y visualice registros médicos completos</span>
            </div>
          </button>
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('create-appointment')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Generar Cita Médica</span>
              <span className={styles['btn-description']}>Programe consultas y asigne especialidades</span>
            </div>
          </button>
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('register-admission')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>Registrar Admisión</span>
              <span className={styles['btn-description']}>Registre ingresos hospitalarios y asignaciones</span>
            </div>
          </button>
          <button 
            className={styles['admin-btn']}
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
        </div>
      </section>
    </>
  )

  return (
    <div className={styles['dashboard-container']}>
      <header className={styles['dashboard-header']}>
        <div className={styles['header-content']}>
          <div>
            <h1>Dashboard Administrativo</h1>
            <p className={styles.subtitle}>Panel de control administrativo del sistema</p>
          </div>
          {viewMode !== 'main' && (
            <button 
              className={styles['back-btn']}
              onClick={() => setViewMode('main')}
            >
              ← Volver al Dashboard
            </button>
          )}
        </div>
      </header>

      <main className={styles['dashboard-main']}>
        {viewMode === 'main' && renderMainView()}
        {viewMode === 'register-patient' && <RegisterPatientForm />}
        {viewMode === 'create-appointment' && <CreateAppointmentForm preSelectedPatient={selectedPatientForAppointment} />}
        {viewMode === 'search-patient' && (
          <SearchPatientView 
            onViewHistory={(patient) => {
              setSelectedPatientForHistory(patient)
              setViewMode('patient-history')
            }}
            onScheduleAppointment={(patient) => {
              setSelectedPatientForAppointment(patient)
              setViewMode('create-appointment')
            }}
          />
        )}
        {viewMode === 'register-admission' && <RegistrarAdmision onBack={() => setViewMode('main')} />}
        {viewMode === 'hospitalized-patients' && <PacientesHospitalizados onBack={() => setViewMode('main')} />}
        {viewMode === 'patient-history' && selectedPatientForHistory && (
          <PatientHistoryView 
            patient={selectedPatientForHistory}
            onBack={() => {
              setViewMode('search-patient')
              setSelectedPatientForHistory(null)
            }}
          />
        )}
      </main>
    </div>
  )
}

// Componente para registrar nuevo paciente
function RegisterPatientForm() {
  // Estado para tipo de paciente seleccionado
  const [selectedPatientType, setSelectedPatientType] = useState<'MILITAR' | 'AFILIADO' | 'PNA' | null>(null)

  // Estado para datos de afiliado
  const [afiliadoData, setAfiliadoData] = useState<AfiliadoData>({
    nroCarnet: '',
    parentesco: '',
    titularNombre: '',
    titularCi: '',
    titularCiTipo: 'V',
    titularCiNumeros: '',
    titularGrado: '',
    titularComponente: '',
    fechaAfiliacion: '',
    vigente: true,
  })

  const [formData, setFormData] = useState({
    // ADMISION
    nroHistoria: '',
    formaIngreso: 'AMBULANTE',
    fechaAdmision: new Date().toISOString().split('T')[0],
    horaAdmision: new Date().toTimeString().slice(0, 5),
    firmaFacultativo: '',
    habitacion: '',
    
    // PACIENTE - DATOS PERSONALES
    apellidosNombres: '',
    ciTipo: 'V',
    ciNumeros: '',
    fechaNacimiento: '',
    sexo: '',
    lugarNacimiento: '',
    nacionalidad: '',
    estado: '',
    religion: '',
    direccion: '',
    telefonoOperador: '0412',
    telefonoNumeros: '',
    telefonoEmergenciaOperador: '0412',
    telefonoEmergenciaNumeros: '',
    
    // PERSONAL MILITAR
    grado: '',
    estadoMilitar: '', // '' | 'activo' | 'disponible' | 'resActiva'
    componente: '',
    unidad: '',
    
    // ESTANCIA HOSPITALARIA
    diagnosticoIngreso: '',
    diagnosticoEgreso: '',
    fechaAlta: '',
    diasHospitalizacion: '',
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Calcular edad desde fecha de nacimiento
  const calcularEdad = (fechaNac: string): number => {
    if (!fechaNac) return 0
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const diferenciaMeses = hoy.getMonth() - nac.getMonth()
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nac.getDate())) {
      edad--
    }
    return edad
  }

  // Validar que el formato completo sea correcto
  const isHistoriaFormatValid = (value: string): boolean => {
    const pattern = /^\d{2}-\d{2}-\d{2}$/
    return pattern.test(value)
  }

  // Validar números de cédula (7-9 dígitos)
  const validateCINumeros = (value: string): boolean => {
    const pattern = /^\d{0,9}$/
    return pattern.test(value)
  }

  // Validar que la cédula tenga mínimo 7 dígitos para CI y máximo 9 para pasaporte
  const validateCINumerosLength = (value: string): boolean => {
    return value.length >= 7 && value.length <= 9
  }

  // Validar números de teléfono (7 dígitos)
  const validateTelefonoNumeros = (value: string): boolean => {
    const pattern = /^\d{0,7}$/
    return pattern.test(value)
  }

  const handleCINumerosChange = (value: string) => {
    if (validateCINumeros(value)) {
      setFormData({...formData, ciNumeros: value})
      setErrors({...errors, ciNumeros: ''})
    }
  }

  const handleTelefonoNumerosChange = (value: string) => {
    if (validateTelefonoNumeros(value)) {
      setFormData({...formData, telefonoNumeros: value})
      setErrors({...errors, telefonoNumeros: ''})
    }
  }

  const handleTelefonoEmergenciaNumerosChange = (value: string) => {
    if (validateTelefonoNumeros(value)) {
      setFormData({...formData, telefonoEmergenciaNumeros: value})
      setErrors({...errors, telefonoEmergenciaNumeros: ''})
    }
  }

  // Cargar el siguiente número de historia clínica de la BD
  const cargarSiguienteNroHistoria = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/ultimos?limit=1`)
      const result = await response.json()
      
      let siguiente = '00-00-01' // Valor por defecto si no hay pacientes
      
      if (result.success && result.data && result.data.length > 0) {
        const ultimoPaciente = result.data[0]
        const ultimoHistoria = ultimoPaciente.nroHistoria
        
        // Parsear el formato XX-XX-XX y convertir a número
        const partes = ultimoHistoria.split('-')
        const numeroCompleto = parseInt(partes.join(''), 10)
        const siguienteNumero = numeroCompleto + 1
        
        // Convertir de vuelta al formato XX-XX-XX
        const numeroStr = String(siguienteNumero).padStart(6, '0')
        siguiente = `${numeroStr.slice(0, 2)}-${numeroStr.slice(2, 4)}-${numeroStr.slice(4, 6)}`
      }
      
      setFormData({...formData, nroHistoria: siguiente})
      setErrors({...errors, nroHistoria: ''})
    } catch (error) {
      console.error('Error al cargar siguiente número de historia:', error)
      setFormData({...formData, nroHistoria: '00-00-01'})
      setErrors({...errors, nroHistoria: ''})
    }
  }

  // Cargar siguiente número al montar el componente
  useEffect(() => {
    cargarSiguienteNroHistoria()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    const newErrors: {[key: string]: string} = {}
    if (!formData.nroHistoria) newErrors.nroHistoria = 'Requerido'
    if (formData.nroHistoria && !isHistoriaFormatValid(formData.nroHistoria)) newErrors.nroHistoria = 'Formato: 00-00-00'
    if (!formData.apellidosNombres) newErrors.apellidosNombres = 'Requerido'
    if (!formData.ciNumeros) newErrors.ciNumeros = 'Requerido'
    if (formData.ciNumeros && !validateCINumerosLength(formData.ciNumeros)) newErrors.ciNumeros = 'Debe tener entre 7 y 9 dígitos'
    if (!formData.fechaAdmision) newErrors.fechaAdmision = 'Requerido'
    if (!formData.horaAdmision) newErrors.horaAdmision = 'Requerido'
    if (!formData.sexo) newErrors.sexo = 'Requerido'
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Requerido'
    if (!formData.lugarNacimiento) newErrors.lugarNacimiento = 'Requerido'
    if (!formData.nacionalidad) newErrors.nacionalidad = 'Requerido'
    if (!formData.estado) newErrors.estado = 'Requerido'
    if (!formData.religion) newErrors.religion = 'Requerido'
    if (!formData.direccion) newErrors.direccion = 'Requerido'
    if (!formData.telefonoNumeros) newErrors.telefonoNumeros = 'Requerido'

    // Validaciones específicas por tipo de paciente
    if (selectedPatientType === 'MILITAR') {
      if (!formData.grado) newErrors.grado = 'Requerido para personal militar'
      if (!formData.componente) newErrors.componente = 'Requerido para personal militar'
      if (!formData.estadoMilitar) newErrors.estadoMilitar = 'Requerido para personal militar'
    }

    if (selectedPatientType === 'AFILIADO') {
      if (!afiliadoData.nroCarnet) newErrors.nroCarnet = 'Requerido'
      if (!afiliadoData.parentesco) newErrors.parentesco = 'Requerido'
      if (!afiliadoData.titularNombre) newErrors.titularNombre = 'Requerido'
      if (!afiliadoData.titularCiNumeros) newErrors.titularCi = 'Requerido'
      if (afiliadoData.titularCiNumeros && afiliadoData.titularCiNumeros.length < 7) newErrors.titularCi = 'Debe tener entre 7 y 9 dígitos'
      if (!afiliadoData.titularGrado) newErrors.titularGrado = 'Requerido'
      if (!afiliadoData.titularComponente) newErrors.titularComponente = 'Requerido'
      if (!afiliadoData.fechaAfiliacion) newErrors.fechaAfiliacion = 'Requerido'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const ciCompleta = `${formData.ciTipo}-${formData.ciNumeros}`
    const telefonoCompleto = formData.telefonoNumeros ? `${formData.telefonoOperador}-${formData.telefonoNumeros}` : ''
    const telefonoEmergenciaCompleto = formData.telefonoEmergenciaNumeros ? `${formData.telefonoEmergenciaOperador}-${formData.telefonoEmergenciaNumeros}` : ''
    
    // Preparar datos para enviar al backend
    const datosRegistro: any = {
      nroHistoria: formData.nroHistoria,
      formaIngreso: formData.formaIngreso,
      fechaAdmision: formData.fechaAdmision,
      horaAdmision: formData.horaAdmision,
      firmaFacultativo: formData.firmaFacultativo,
      habitacion: formData.habitacion,
      apellidosNombres: formData.apellidosNombres,
      ci: ciCompleta,
      ciTipo: formData.ciTipo,
      fechaNacimiento: formData.fechaNacimiento,
      sexo: formData.sexo,
      lugarNacimiento: formData.lugarNacimiento,
      nacionalidad: formData.nacionalidad,
      estado: formData.estado,
      religion: formData.religion,
      direccion: formData.direccion,
      telefono: telefonoCompleto,
      telefonoEmergencia: telefonoEmergenciaCompleto,
      diagnosticoIngreso: formData.diagnosticoIngreso,
      diagnosticoEgreso: formData.diagnosticoEgreso,
      fechaAlta: formData.fechaAlta,
      diasHospitalizacion: formData.diasHospitalizacion,
      tipoPaciente: selectedPatientType || 'PNA',
    }

    // Agregar datos específicos según tipo de paciente
    if (selectedPatientType === 'MILITAR') {
      datosRegistro.grado = formData.grado
      datosRegistro.estadoMilitar = formData.estadoMilitar
      datosRegistro.componente = formData.componente
      datosRegistro.unidad = formData.unidad
    }

    if (selectedPatientType === 'AFILIADO') {
      const titularCiCompleta = `${afiliadoData.titularCiTipo}-${afiliadoData.titularCiNumeros}`
      datosRegistro.afiliadoData = {
        nroCarnet: afiliadoData.nroCarnet,
        parentesco: afiliadoData.parentesco,
        titularNombre: afiliadoData.titularNombre,
        titularCi: titularCiCompleta,
        titularGrado: afiliadoData.titularGrado,
        titularComponente: afiliadoData.titularComponente,
        fechaAfiliacion: afiliadoData.fechaAfiliacion,
        vigente: afiliadoData.vigente,
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pacientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosRegistro),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al registrar el paciente')
      }

      // Éxito - mostrar mensaje y limpiar formulario
      alert(`✅ Paciente registrado exitosamente\nNro. Historia: ${result.data.nroHistoria}\nCI: ${result.data.ci}`)
      
      // Limpiar formulario SOLO si el registro fue exitoso
      setFormData({
        nroHistoria: '',
        formaIngreso: 'AMBULANTE',
        fechaAdmision: new Date().toISOString().split('T')[0],
        horaAdmision: new Date().toTimeString().slice(0, 5),
        firmaFacultativo: '',
        habitacion: '',
        apellidosNombres: '',
        ciTipo: 'V',
        ciNumeros: '',
        fechaNacimiento: '',
        sexo: '',
        lugarNacimiento: '',
        nacionalidad: '',
        estado: '',
        religion: '',
        direccion: '',
        telefonoOperador: '0412',
        telefonoNumeros: '',
        telefonoEmergenciaOperador: '0412',
        telefonoEmergenciaNumeros: '',
        grado: '',
        estadoMilitar: '',
        componente: '',
        unidad: '',
        diagnosticoIngreso: '',
        diagnosticoEgreso: '',
        fechaAlta: '',
        diasHospitalizacion: '',
      })
      setErrors({})
    } catch (error: any) {
      console.error('Error:', error)
      // Mostrar error SIN limpiar el formulario
      alert(`❌ Error: ${error.message}\n\nLos datos del formulario se han mantenido. Por favor, verifique los errores marcados en rojo.`)
      // NO limpiar formData - mantener los datos ingresados
    }
  }

  return (
    <section className={styles["form-section"]}>
      {!selectedPatientType ? (
        // Mostrar selector de tipo de paciente
        <PatientTypeSelector onSelectType={setSelectedPatientType} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2>Control de Admisión - Registro de Paciente</h2>
              <p className={styles["form-description"]}>
                Tipo: <strong>{selectedPatientType}</strong> | Complete todos los campos requeridos (*)
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setSelectedPatientType(null)}
              className={styles["back-button"]}
              style={{ 
                padding: '0.5rem 1rem',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              ← Cambiar tipo
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className={styles["patient-form"]}>
        {/* SECCIÓN 1: DATOS DE ADMISIÓN */}
        <div className={styles["form-section-header"]}>
          <h3>1. Datos de Admisión</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Nro. Historia Clínica * <span className={styles["hint"]}>(Autogenerado)</span></label>
            <input
              type="text"
              required
              disabled
              value={formData.nroHistoria}
              placeholder="00-00-00"
              title="Se genera automáticamente del último paciente registrado"
            />
            {errors.nroHistoria && <span className={styles["error-message"]}>{errors.nroHistoria}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Forma de Ingreso *</label>
            <div className={styles["radio-group"]}>
              <label className={styles["radio-label"]}>
                <input
                  type="radio"
                  name="formaIngreso"
                  value="AMBULANTE"
                  checked={formData.formaIngreso === 'AMBULANTE'}
                  onChange={(e) => setFormData({...formData, formaIngreso: e.target.value})}
                />
                Ambulante
              </label>
              <label className={styles["radio-label"]}>
                <input
                  type="radio"
                  name="formaIngreso"
                  value="AMBULANCIA"
                  checked={formData.formaIngreso === 'AMBULANCIA'}
                  onChange={(e) => setFormData({...formData, formaIngreso: e.target.value})}
                />
                Ambulancia
              </label>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label>Fecha de Admisión *</label>
            <input
              type="date"
              required
              value={formData.fechaAdmision}
              onChange={(e) => setFormData({...formData, fechaAdmision: e.target.value})}
            />
            {errors.fechaAdmision && <span className={styles["error-message"]}>{errors.fechaAdmision}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Hora de Admisión *</label>
            <input
              type="time"
              required
              value={formData.horaAdmision}
              onChange={(e) => setFormData({...formData, horaAdmision: e.target.value})}
            />
            {errors.horaAdmision && <span className={styles["error-message"]}>{errors.horaAdmision}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Habitación</label>
            <input
              type="text"
              value={formData.habitacion}
              onChange={(e) => setFormData({...formData, habitacion: e.target.value})}
              placeholder="Ej: 101, 205"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Firma de Facultativo</label>
            <input
              type="text"
              value={formData.firmaFacultativo}
              onChange={(e) => setFormData({...formData, firmaFacultativo: e.target.value})}
              placeholder="Nombre del médico"
            />
          </div>

          <div className={styles["form-group"]} style={{ gridColumn: '1 / -1' }}>
            <label>Diagnóstico de Ingreso</label>
            <input
              type="text"
              value={formData.diagnosticoIngreso}
              onChange={(e) => setFormData({...formData, diagnosticoIngreso: e.target.value})}
              placeholder="Ej: Hipertensión Arterial, Fractura de tibia, etc."
            />
          </div>
        </div>

        {/* SECCIÓN 2: DATOS PERSONALES DEL PACIENTE */}
        <div className={styles["form-section-header"]}>
          <h3>2. Datos Personales del Paciente</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Apellidos y Nombres *</label>
            <input
              type="text"
              required
              value={formData.apellidosNombres}
              onChange={(e) => setFormData({...formData, apellidosNombres: e.target.value})}
              placeholder="Apellidos y Nombres completos"
            />
            {errors.apellidosNombres && <span className={styles["error-message"]}>{errors.apellidosNombres}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Cédula de Identidad *</label>
            <div className={styles["dual-input-group"]}>
              <select
                value={formData.ciTipo}
                onChange={(e) => setFormData({...formData, ciTipo: e.target.value})}
              >
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="P">P</option>
              </select>
              <input
                type="text"
                required
                value={formData.ciNumeros}
                onChange={(e) => handleCINumerosChange(e.target.value)}
                placeholder="12345678"
                maxLength={9}
              />
            </div>
            {errors.ciNumeros && <span className={styles["error-message"]}>{errors.ciNumeros}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Fecha de Nacimiento *</label>
            <input
              type="date"
              required
              value={formData.fechaNacimiento}
              onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
            />
            {errors.fechaNacimiento && <span className={styles["error-message"]}>{errors.fechaNacimiento}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Edad</label>
            <input
              type="number"
              disabled
              value={calcularEdad(formData.fechaNacimiento)}
              placeholder="Se calcula automáticamente"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Lugar de Nacimiento *</label>
            <SearchableSelect
              options={ESTADOS_VENEZUELA}
              value={formData.lugarNacimiento}
              onChange={(value) => setFormData({...formData, lugarNacimiento: value})}
              placeholder="Buscar estado..."
            />
            {errors.lugarNacimiento && <span className={styles["error-message"]}>{errors.lugarNacimiento}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Sexo *</label>
            <select
              required
              value={formData.sexo}
              onChange={(e) => setFormData({...formData, sexo: e.target.value})}
            >
              <option value="">Seleccione...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            {errors.sexo && <span className={styles["error-message"]}>{errors.sexo}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Nacionalidad *</label>
            <SearchableSelect
              options={NACIONALIDADES}
              value={formData.nacionalidad}
              onChange={(value) => setFormData({...formData, nacionalidad: value})}
              placeholder="Buscar nacionalidad..."
            />
            {errors.nacionalidad && <span className={styles["error-message"]}>{errors.nacionalidad}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Estado de residencia *</label>
            <SearchableSelect
              options={ESTADOS_VENEZUELA}
              value={formData.estado}
              onChange={(value) => setFormData({...formData, estado: value})}
              placeholder="Buscar estado..."
            />
            {errors.estado && <span className={styles["error-message"]}>{errors.estado}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Religión *</label>
            <SearchableSelect
              options={RELIGIONES}
              value={formData.religion}
              onChange={(value) => setFormData({...formData, religion: value})}
              placeholder="Buscar religión..."
            />
            {errors.religion && <span className={styles["error-message"]}>{errors.religion}</span>}
          </div>

          <div className="form-group full-width">
            <label>Dirección *</label>
            <input
              type="text"
              required
              value={formData.direccion}
              onChange={(e) => setFormData({...formData, direccion: e.target.value})}
              placeholder="Dirección completa de residencia"
            />
            {errors.direccion && <span className={styles["error-message"]}>{errors.direccion}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Teléfono *</label>
            <div className={styles["dual-input-group"]}>
              <select
                value={formData.telefonoOperador}
                onChange={(e) => setFormData({...formData, telefonoOperador: e.target.value})}
              >
                <option value="0412">0412</option>
                <option value="0422">0422</option>
                <option value="0416">0416</option>
                <option value="0426">0426</option>
                <option value="0414">0414</option>
                <option value="0424">0424</option>
              </select>
              <input
                type="text"
                required
                value={formData.telefonoNumeros}
                onChange={(e) => handleTelefonoNumerosChange(e.target.value)}
                placeholder="1234567"
                maxLength={7}
              />
            </div>
            {errors.telefonoNumeros && <span className={styles["error-message"]}>{errors.telefonoNumeros}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Teléfono de Emergencia <span className={styles["hint"]}>(Familiar)</span></label>
            <div className={styles["dual-input-group"]}>
              <select
                value={formData.telefonoEmergenciaOperador}
                onChange={(e) => setFormData({...formData, telefonoEmergenciaOperador: e.target.value})}
              >
                <option value="0412">0412</option>
                <option value="0422">0422</option>
                <option value="0416">0416</option>
                <option value="0426">0426</option>
                <option value="0414">0414</option>
                <option value="0424">0424</option>
              </select>
              <input
                type="text"
                value={formData.telefonoEmergenciaNumeros}
                onChange={(e) => handleTelefonoEmergenciaNumerosChange(e.target.value)}
                placeholder="1234567"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: DATOS SEGÚN TIPO DE PACIENTE */}
        {selectedPatientType === 'MILITAR' && (
          <>
            <div className={styles["form-section-header"]}>
              <h3>3. Datos de Personal Militar</h3>
            </div>

            <div className={styles["form-grid"]}>
              <SearchableSelect
                label="Grado *"
                options={GRADOS_MILITARES}
                value={formData.grado}
                onChange={(value) => setFormData({...formData, grado: value})}
                placeholder="Seleccione el grado militar"
              />
              {errors.grado && <div style={{ gridColumn: '1 / -1' }}><span className={styles["error-message"]}>{errors.grado}</span></div>}

              <SearchableSelect
                label="Componente *"
                options={COMPONENTES_MILITARES}
                value={formData.componente}
                onChange={(value) => setFormData({...formData, componente: value})}
                placeholder="Seleccione el componente militar"
              />
              {errors.componente && <div style={{ gridColumn: '1 / -1' }}><span className={styles["error-message"]}>{errors.componente}</span></div>}

              <div className={styles["form-group"]}>
                <label>Unidad</label>
                <input
                  type="text"
                  value={formData.unidad}
                  onChange={(e) => setFormData({...formData, unidad: e.target.value})}
                  placeholder="Ej: Batallón, Brigada"
                />
              </div>

              <div className="form-group full-width">
                <label>Estado Militar *</label>
                <div className={styles["radio-group-inline"]}>
                  <label className={styles["radio-label"]}>
                    <input
                      type="radio"
                      name="estadoMilitar"
                      value="activo"
                      checked={formData.estadoMilitar === 'activo'}
                      onChange={(e) => setFormData({...formData, estadoMilitar: e.target.value})}
                    />
                    Activo
                  </label>
                  <label className={styles["radio-label"]}>
                    <input
                      type="radio"
                      name="estadoMilitar"
                      value="disponible"
                      checked={formData.estadoMilitar === 'disponible'}
                      onChange={(e) => setFormData({...formData, estadoMilitar: e.target.value})}
                    />
                    Disponible
                  </label>
                  <label className={styles["radio-label"]}>
                    <input
                      type="radio"
                      name="estadoMilitar"
                      value="resActiva"
                      checked={formData.estadoMilitar === 'resActiva'}
                      onChange={(e) => setFormData({...formData, estadoMilitar: e.target.value})}
                    />
                    Reserva Activa
                  </label>
                </div>
                {errors.estadoMilitar && <span className={styles["error-message"]}>{errors.estadoMilitar}</span>}
              </div>
            </div>
          </>
        )}

        {selectedPatientType === 'AFILIADO' && (
          <AfiliadoDataSection 
            data={afiliadoData}
            onChange={setAfiliadoData}
            errors={errors}
            styles={styles}
          />
        )}

        {/* PNA no tiene sección 3 */}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Registrar Admisión
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => {
              setFormData({
                nroHistoria: '',
                formaIngreso: 'AMBULANTE',
                fechaAdmision: new Date().toISOString().split('T')[0],
                horaAdmision: new Date().toTimeString().slice(0, 5),
                firmaFacultativo: '',
                habitacion: '',
                apellidosNombres: '',
                ciTipo: 'V',
                ciNumeros: '',
                fechaNacimiento: '',
                sexo: '',
                lugarNacimiento: '',
                nacionalidad: '',
                estado: '',
                religion: '',
                direccion: '',
                telefonoOperador: '0412',
                telefonoNumeros: '',
                telefonoEmergenciaOperador: '0412',
                telefonoEmergenciaNumeros: '',
                grado: '',
                estadoMilitar: '',
                componente: '',
                unidad: '',
                diagnosticoIngreso: '',
                diagnosticoEgreso: '',
                fechaAlta: '',
                diasHospitalizacion: '',
              })
              setAfiliadoData({
                nroCarnet: '',
                parentesco: '',
                titularNombre: '',
                titularCi: '',
                titularCiTipo: 'V',
                titularCiNumeros: '',
                titularGrado: '',
                titularComponente: '',
                fechaAfiliacion: '',
                vigente: true,
              })
              setErrors({})
              cargarSiguienteNroHistoria()
            }}
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
        </>
      )}
    </section>
  )
}

// Componente para crear cita médica
function CreateAppointmentForm({ preSelectedPatient }: { preSelectedPatient?: any } = {}) {
  const [searchCITipo, setSearchCITipo] = useState('V')
  const [searchCINumeros, setSearchCINumeros] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<any>(preSelectedPatient || null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [especialidades, setEspecialidades] = useState<string[]>([
    'Medicina General',
    'Cardiología',
    'Traumatología',
    'Pediatría',
    'Ginecología',
    'Cirugía',
    'Neurología',
    'Oftalmología',
  ])
  const [citasExistentes, setCitasExistentes] = useState<any[]>([])

  const [appointmentData, setAppointmentData] = useState({
    fecha: '',
    hora: '',
    especialidad: '',
    medico: '',
    motivo: '',
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSearchCINumerosChange = (value: string) => {
    // Solo permitir dígitos, extraer solo los números del paste
    const soloNumeros = value.replace(/\D/g, '').slice(0, 8)
    setSearchCINumeros(soloNumeros)
    setSearchError('')
  }

  // Cargar especialidades al montar el componente
  useEffect(() => {
    cargarEspecialidades()
  }, [])

  // Cargar citas si hay paciente pre-seleccionado
  useEffect(() => {
    if (preSelectedPatient) {
      const cargarCitasPaciente = async () => {
        try {
          const citasResponse = await fetch(`${API_BASE_URL}/citas/paciente/${preSelectedPatient.id}?estado=PROGRAMADA`)
          const citasResult = await citasResponse.json()
          
          if (citasResult.success) {
            setCitasExistentes(citasResult.data || [])
          }
        } catch (err) {
          console.error('Error al cargar citas:', err)
        }
      }
      cargarCitasPaciente()
    }
  }, [preSelectedPatient])

  // Cargar especialidades al montar
  const cargarEspecialidades = async () => {
    // Siempre usar las especialidades por defecto
    const especialidadesDefecto = [
      'Medicina General',
      'Cardiología',
      'Traumatología',
      'Pediatría',
      'Ginecología',
      'Cirugía',
      'Neurología',
      'Oftalmología',
    ]
    setEspecialidades(especialidadesDefecto)
  }

  const handleSearchPatient = async () => {
    if (!searchCINumeros.trim()) {
      setSearchError('Por favor ingrese un CI')
      return
    }

    setSearchLoading(true)
    setSearchError('')
    setSelectedPatient(null)
    setCitasExistentes([])

    try {
      const ciCompleta = `${searchCITipo}-${searchCINumeros}`
      const response = await fetch(`${API_BASE_URL}/pacientes/search?ci=${encodeURIComponent(ciCompleta)}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Paciente no encontrado')
      }

      setSelectedPatient(result.data)

      // Cargar citas existentes del paciente
      const citasResponse = await fetch(`${API_BASE_URL}/citas/paciente/${result.data.id}?estado=PROGRAMADA`)
      const citasResult = await citasResponse.json()

      if (citasResult.success) {
        setCitasExistentes(citasResult.data || [])
      }

      // Limpiar formulario de cita
      setAppointmentData({
        fecha: '',
        hora: '',
        especialidad: '',
        medico: '',
        motivo: '',
      })
      setErrors({})
      setSubmitMessage('')
    } catch (err: any) {
      setSearchError(err.message || 'Error al buscar paciente')
      setSelectedPatient(null)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: {[key: string]: string} = {}
    if (!appointmentData.fecha) newErrors.fecha = 'Requerido'
    if (!appointmentData.hora) newErrors.hora = 'Requerido'
    if (!appointmentData.especialidad) newErrors.especialidad = 'Requerido'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitLoading(true)
    setSubmitMessage('')

    try {
      const citaData = {
        pacienteId: selectedPatient.id,
        medicoId: null,
        fechaCita: appointmentData.fecha,
        horaCita: appointmentData.hora,
        especialidad: appointmentData.especialidad,
        motivo: appointmentData.motivo || null,
        notas: null,
      }

      const response = await fetch(`${API_BASE_URL}/citas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(citaData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear la cita')
      }

      setSubmitMessage(`✅ Cita programada exitosamente para ${appointmentData.fecha} a las ${appointmentData.hora}`)
      
      // Limpiar formulario
      setAppointmentData({
        fecha: '',
        hora: '',
        especialidad: '',
        medico: '',
        motivo: '',
      })
      setErrors({})

      // Recargar citas
      const citasResponse = await fetch(`${API_BASE_URL}/citas/paciente/${selectedPatient.id}?estado=PROGRAMADA`)
      const citasResult = await citasResponse.json()
      if (citasResult.success) {
        setCitasExistentes(citasResult.data || [])
      }

      setTimeout(() => setSubmitMessage(''), 5000)
    } catch (error: any) {
      console.error('Error:', error)
      alert(`❌ Error: ${error.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <section className={styles["form-section"]}>
      <h2>Generar Cita Médica</h2>
      <p className={styles["form-description"]}>Busque el paciente y programe una cita médica</p>

      {/* Búsqueda de Paciente */}
      <div className="search-patient-box" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>1. Buscar Paciente</h3>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          {/* Dual input para CI */}
          <select
            value={searchCITipo}
            onChange={(e) => setSearchCITipo(e.target.value)}
            disabled={selectedPatient ? true : false}
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              cursor: selectedPatient ? 'not-allowed' : 'pointer',
              opacity: selectedPatient ? 0.6 : 1,
            }}
          >
            <option value="V">V</option>
            <option value="E">E</option>
            <option value="P">P</option>
          </select>
          <input
            type="text"
            value={searchCINumeros}
            onChange={(e) => handleSearchCINumerosChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchPatient()
              }
            }}
            placeholder="Ej: 12345678"
            maxLength={8}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.375rem',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
            }}
            disabled={selectedPatient ? true : false}
          />
          <button
            onClick={handleSearchPatient}
            disabled={searchLoading || selectedPatient ? true : false}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: selectedPatient ? 'not-allowed' : 'pointer',
              opacity: selectedPatient ? 0.5 : 1,
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            {searchLoading ? 'Buscando...' : 'Buscar'}
          </button>
          {selectedPatient && (
            <button
              onClick={() => {
                setSelectedPatient(null)
                setSearchCITipo('V')
                setSearchCINumeros('')
                setCitasExistentes([])
                setAppointmentData({
                  fecha: '',
                  hora: '',
                  especialidad: '',
                  medico: '',
                  motivo: '',
                })
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              Buscar Otro
            </button>
          )}
        </div>

        {searchError && (
          <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem' }}>
            {searchError}
          </div>
        )}

        {selectedPatient && (
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Paciente Seleccionado</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>CI:</strong> {selectedPatient.ci}
              </div>
              <div>
                <strong>Nombre:</strong> {selectedPatient.apellidosNombres}
              </div>
              <div>
                <strong>Historia:</strong> {selectedPatient.nroHistoria}
              </div>
              <div>
                <strong>Teléfono:</strong> {selectedPatient.telefono || 'N/A'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Citas Existentes */}
      {citasExistentes.length > 0 && (
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(124, 58, 237, 0.1)', borderRadius: '0.5rem', borderLeft: '3px solid #7c3aed' }}>
          <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Citas Programadas</h4>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {citasExistentes.map((cita: any) => {
              // Parsear fecha: puede venir en formato ISO (2025-11-29T00:00:00.000Z) o Date
              let fechaFormato = 'N/A'
              if (cita.fechaCita) {
                try {
                  const fecha = typeof cita.fechaCita === 'string' 
                    ? new Date(cita.fechaCita)
                    : cita.fechaCita
                  
                  if (!isNaN(fecha.getTime())) {
                    fechaFormato = fecha.toLocaleDateString(VENEZUELA_LOCALE, { timeZone: VENEZUELA_TIMEZONE })
                  }
                } catch (e) {
                  fechaFormato = 'N/A'
                }
              }
              
              // Parsear hora: puede venir en formato ISO (1970-01-01T14:30:00.000Z) o string
              let horaFormato = 'N/A'
              if (cita.horaCita) {
                try {
                  // Si es ISO string (1970-01-01T14:30:00.000Z), extraer HH:MM
                  if (typeof cita.horaCita === 'string') {
                    if (cita.horaCita.includes('T')) {
                      // Formato ISO DateTime
                      const horaMatch = cita.horaCita.match(/T(\d{2}):(\d{2})/)
                      if (horaMatch) {
                        horaFormato = `${horaMatch[1]}:${horaMatch[2]}`
                      }
                    } else if (cita.horaCita.includes(':')) {
                      // Formato HH:MM:SS o HH:MM
                      const partes = cita.horaCita.split(':')
                      horaFormato = `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}`
                    }
                  } else if (cita.horaCita instanceof Date) {
                    // Si es un Date object
                    const horas = String(cita.horaCita.getHours()).padStart(2, '0')
                    const minutos = String(cita.horaCita.getMinutes()).padStart(2, '0')
                    horaFormato = `${horas}:${minutos}`
                  }
                } catch (e) {
                  horaFormato = 'N/A'
                }
              }
              
              return (
                <div key={cita.id} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.375rem', fontSize: '0.9rem' }}>
                  <strong>{fechaFormato} a las {horaFormato}</strong> - {cita.especialidad}
                  <span style={{ float: 'right', color: '#7c3aed', fontSize: '0.8rem' }}>Estado: {cita.estado}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Formulario de Cita */}
      {selectedPatient && (
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1.5rem' }}>2. Datos de la Cita</h3>
          <div className={styles["form-grid"]}>
            <div className={styles["form-group"]}>
              <label>Fecha *</label>
              <input
                type="date"
                required
                value={appointmentData.fecha}
                onChange={(e) => {
                  setAppointmentData({...appointmentData, fecha: e.target.value})
                  setErrors({...errors, fecha: ''})
                }}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.fecha && <span className={styles["error-message"]}>{errors.fecha}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Hora *</label>
              <input
                type="time"
                required
                value={appointmentData.hora}
                onChange={(e) => {
                  setAppointmentData({...appointmentData, hora: e.target.value})
                  setErrors({...errors, hora: ''})
                }}
              />
              {errors.hora && <span className={styles["error-message"]}>{errors.hora}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Especialidad * (Total: {especialidades.length})</label>
              <select
                required
                value={appointmentData.especialidad}
                onChange={(e) => {
                  setAppointmentData({...appointmentData, especialidad: e.target.value})
                  setErrors({...errors, especialidad: ''})
                }}
              >
                <option value="">Seleccione especialidad...</option>
                {especialidades.map(esp => (
                  <option key={esp} value={esp}>{esp}</option>
                ))}
              </select>
              {errors.especialidad && <span className={styles["error-message"]}>{errors.especialidad}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Médico (Opcional)</label>
              <input
                type="text"
                value={appointmentData.medico}
                onChange={(e) => setAppointmentData({...appointmentData, medico: e.target.value})}
                placeholder="Nombre del médico o especialista"
              />
            </div>

            <div className="form-group full-width">
              <label>Motivo de la Consulta</label>
              <textarea
                value={appointmentData.motivo}
                onChange={(e) => setAppointmentData({...appointmentData, motivo: e.target.value})}
                placeholder="Describa brevemente el motivo de la consulta"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.375rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {submitMessage && (
            <div style={{ color: '#059669', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#d1fae5', borderRadius: '0.375rem' }}>
              {submitMessage}
            </div>
          )}

          <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" disabled={submitLoading} style={{ opacity: submitLoading ? 0.6 : 1, cursor: submitLoading ? 'not-allowed' : 'pointer' }} className="btn-primary">
              {submitLoading ? 'Programando...' : 'Programar Cita'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAppointmentData({
                  fecha: '',
                  hora: '',
                  especialidad: '',
                  medico: '',
                  motivo: '',
                })
                setErrors({})
                setSubmitMessage('')
              }}
              className="btn-secondary"
            >
              Limpiar Formulario
            </button>
          </div>
        </form>
      )}

      {!selectedPatient && !selectedPatient && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Busque un paciente para comenzar a programar una cita médica</p>
        </div>
      )}
    </section>
  )
}

// Componente para buscar y consultar historias clínicas
function SearchPatientView({ onViewHistory, onScheduleAppointment }: { onViewHistory: (patient: any) => void; onScheduleAppointment: (patient: any) => void }) {
  const [searchType, setSearchType] = useState<'ci' | 'historia'>('ci')
  const [searchCITipo, setSearchCITipo] = useState('V')
  const [searchCINumeros, setSearchCINumeros] = useState('')
  const [searchHistoria, setSearchHistoria] = useState('')
  const [patientData, setPatientData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearchCINumerosChange = (value: string) => {
    // Solo permitir dígitos, extraer solo los números del paste
    const soloNumeros = value.replace(/\D/g, '').slice(0, 8)
    setSearchCINumeros(soloNumeros)
    setError('')
  }

  const handleSearch = async () => {
    let searchParam = ''
    
    if (searchType === 'ci') {
      if (!searchCINumeros.trim()) {
        setError('Por favor ingrese un CI')
        return
      }
      searchParam = `${searchCITipo}-${searchCINumeros}`
    } else {
      if (!searchHistoria.trim()) {
        setError('Por favor ingrese un número de historia')
        return
      }
      searchParam = searchHistoria
    }

    setLoading(true)
    setError('')
    setPatientData(null)

    try {
      // Construir URL de búsqueda
      const param = searchType === 'ci' ? `ci=${encodeURIComponent(searchParam)}` : `historia=${encodeURIComponent(searchParam)}`
      const url = `${API_BASE_URL}/pacientes/search?${param}`

      const response = await fetch(url)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Paciente no encontrado')
      }

      // Formatear datos para mostrar
      const paciente = result.data
      setPatientData({
        id: paciente.id,
        nroHistoria: paciente.nroHistoria,
        apellidosNombres: paciente.apellidosNombres,
        ci: paciente.ci,
        fechaNacimiento: paciente.fechaNacimiento,
        sexo: paciente.sexo,
        telefono: paciente.telefono,
        direccion: paciente.direccion,
        nacionalidad: paciente.nacionalidad,
        estado: paciente.estado,
        lugarNacimiento: paciente.lugarNacimiento,
        religion: paciente.religion,
        createdAt: paciente.createdAt,
        admisiones: paciente.admisiones || [],
        encuentros: paciente.encuentros || [],
        personalMilitar: paciente.personalMilitar,
      })
    } catch (err: any) {
      setError(err.message || 'Error al buscar paciente')
      setPatientData(null)
    } finally {
      setLoading(false)
    }
  }

  const calcularEdad = (fechaNac: any): number => {
    if (!fechaNac) return 0
    try {
      // Extraer solo la parte de fecha YYYY-MM-DD sin considerar zona horaria
      let fechaStr: string
      if (typeof fechaNac === 'string') {
        // Si viene como "1970-03-15" o "1970-03-15T00:00:00.000Z"
        fechaStr = fechaNac.split('T')[0]
      } else if (fechaNac instanceof Date) {
        // Convertir a ISO y extraer solo la fecha
        fechaStr = fechaNac.toISOString().split('T')[0]
      } else {
        return 0
      }
      
      // Parsear la fecha como YYYY-MM-DD local (sin zona horaria)
      const [year, month, day] = fechaStr.split('-').map(Number)
      const nac = new Date(year, month - 1, day) // Mes es 0-indexed
      
      if (isNaN(nac.getTime())) return 0
      
      const hoy = new Date()
      let edad = hoy.getFullYear() - nac.getFullYear()
      const diferenciaMeses = hoy.getMonth() - nac.getMonth()
      if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nac.getDate())) {
        edad--
      }
      return edad
    } catch {
      return 0
    }
  }

  return (
    <section className={styles["form-section"]}>
      <h2>Consultar Historia Clínica</h2>
      <p className={styles["form-description"]}>Busque pacientes por CI o número de historia clínica</p>

      <div className="search-options" style={{ marginBottom: '2rem' }}>
        <div className="search-type-selector" style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              checked={searchType === 'ci'}
              onChange={() => {
                setSearchType('ci')
                setSearchCITipo('V')
                setSearchCINumeros('')
                setSearchHistoria('')
                setError('')
                setPatientData(null)
              }}
            />
            Buscar por CI
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              checked={searchType === 'historia'}
              onChange={() => {
                setSearchType('historia')
                setSearchCITipo('V')
                setSearchCINumeros('')
                setSearchHistoria('')
                setError('')
                setPatientData(null)
              }}
            />
            Buscar por Nro. Historia
          </label>
        </div>

        <div className="search-input-group" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          {searchType === 'ci' ? (
            <>
              {/* Dual input para CI */}
              <select
                value={searchCITipo}
                onChange={(e) => setSearchCITipo(e.target.value)}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.375rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="P">P</option>
              </select>
              <input
                type="text"
                value={searchCINumeros}
                onChange={(e) => handleSearchCINumerosChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                placeholder="Ej: 12345678"
                maxLength={8}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.375rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
            </>
          ) : (
            <input
              type="text"
              value={searchHistoria}
              onChange={(e) => {
                setSearchHistoria(e.target.value)
                setError('')
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              placeholder="Ej: 00-00-00"
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
              }}
            />
          )}
          <button 
            onClick={handleSearch} 
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            {loading ? 'Buscando...' : 'Buscar Paciente'}
          </button>
        </div>

        {error && (
          <div style={{ color: '#ef4444', marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem' }}>
            {error}
          </div>
        )}
      </div>

      {patientData && (
        <div className="patient-details" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Paciente Encontrado</h3>
          <div style={{ 
            backgroundColor: 'var(--bg-tertiary)', 
            padding: '1.5rem', 
            borderRadius: '0.5rem', 
            marginBottom: '2rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nro. Historia:</strong>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{patientData.nroHistoria}</span>
              </div>
              <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nombre Completo:</strong>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{patientData.apellidosNombres}</span>
              </div>
              <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>CI:</strong>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{patientData.ci}</span>
              </div>
              <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Edad:</strong>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{calcularEdad(patientData.fechaNacimiento)} años</span>
              </div>
            </div>
          </div>

          <div className="action-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
              onClick={() => onViewHistory(patientData)}
            >
              📋 Ver Historia Completa
            </button>
            <button 
              className="btn-secondary" 
              style={{ padding: '0.75rem 1.5rem', cursor: 'not-allowed', opacity: 0.5 }}
              disabled
              title="Funcionalidad en desarrollo"
            >
              🖨️ Imprimir Resumen
            </button>
            <button 
              className="btn-secondary" 
              style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
              onClick={() => onScheduleAppointment(patientData)}
            >
              📅 Programar Cita
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

// Componente para ver historia clínica completa con timeline
function PatientHistoryView({ patient, onBack }: { patient: any; onBack: () => void }) {
  const [historiaCompleta, setHistoriaCompleta] = useState<any>(null)
  const [encuentros, setEncuentros] = useState<Encuentro[]>([])
  const [encuentroSeleccionado, setEncuentroSeleccionado] = useState<Encuentro | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarHistoriaCompleta()
    cargarEncuentros()
  }, [patient.id])

  const cargarHistoriaCompleta = async () => {
    setLoading(true)
    try {
      // Cargar datos completos del paciente con admisiones y encuentros
      const response = await fetch(`${API_BASE_URL}/pacientes/${patient.id}`)
      const result = await response.json()

      if (result.success) {
        console.log('📊 Datos completos del paciente:', result.data)
        console.log('📋 Admisiones encontradas:', result.data.admisiones?.length || 0)
        console.log('⚕️ Encuentros encontrados:', result.data.encuentros?.length || 0)
        console.log('📅 Citas encontradas:', result.data.citas?.length || 0)
        if (result.data.admisiones && result.data.admisiones.length > 0) {
          console.log('🔍 Detalle admisiones:', JSON.stringify(result.data.admisiones, null, 2))
        }
        setHistoriaCompleta(result.data)
      }
    } catch (err) {
      console.error('Error al cargar historia:', err)
    } finally {
      setLoading(false)
    }
  }

  const cargarEncuentros = async () => {
    try {
      const data = await encuentrosService.obtenerPorPaciente(patient.id)
      setEncuentros(data)
      console.log('✅ Encuentros cargados:', data.length)
    } catch (err) {
      console.error('Error al cargar encuentros:', err)
      setEncuentros([])
    }
  }

  const handleVerDetalleEncuentro = (encuentro: Encuentro) => {
    setEncuentroSeleccionado(encuentro)
  }

  const handleCerrarDetalle = () => {
    setEncuentroSeleccionado(null)
  }

  const calcularEdad = (fechaNac: any): number => {
    if (!fechaNac) return 0
    try {
      let fechaStr: string
      if (typeof fechaNac === 'string') {
        fechaStr = fechaNac.split('T')[0]
      } else if (fechaNac instanceof Date) {
        fechaStr = fechaNac.toISOString().split('T')[0]
      } else {
        return 0
      }
      
      const [year, month, day] = fechaStr.split('-').map(Number)
      const nac = new Date(year, month - 1, day)
      
      if (isNaN(nac.getTime())) return 0
      
      const hoy = new Date()
      let edad = hoy.getFullYear() - nac.getFullYear()
      const diferenciaMeses = hoy.getMonth() - nac.getMonth()
      if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nac.getDate())) {
        edad--
      }
      return edad
    } catch {
      return 0
    }
  }

  const formatearFecha = (fecha: any): string => {
    if (!fecha) return 'N/A'
    try {
      let fechaStr: string
      if (typeof fecha === 'string') {
        fechaStr = fecha.split('T')[0]
      } else if (fecha instanceof Date) {
        fechaStr = fecha.toISOString().split('T')[0]
      } else {
        return 'N/A'
      }
      
      const [year, month, day] = fechaStr.split('-').map(Number)
      const fechaObj = new Date(year, month - 1, day)
      
      return isNaN(fechaObj.getTime()) ? 'N/A' : fechaObj.toLocaleDateString(VENEZUELA_LOCALE, { 
        timeZone: VENEZUELA_TIMEZONE,
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return 'N/A'
    }
  }

  const formatearHora = (hora: any): string => {
    if (!hora) return 'N/A'
    try {
      let horaDate: Date
      
      if (typeof hora === 'string') {
        // Puede venir como "14:30:00" o "1970-01-01T14:30:00.000Z"
        if (hora.includes('T')) {
          horaDate = new Date(hora)
        } else {
          // Formato "HH:MM:SS"
          const [hh, mm] = hora.split(':')
          return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`
        }
      } else if (hora instanceof Date) {
        horaDate = hora
      } else {
        return 'N/A'
      }
      
      const horas = horaDate.getHours().toString().padStart(2, '0')
      const minutos = horaDate.getMinutes().toString().padStart(2, '0')
      return `${horas}:${minutos}`
    } catch {
      return 'N/A'
    }
  }

  // Construir timeline de eventos
  const construirTimeline = () => {
    if (!historiaCompleta) return []

    const eventos: any[] = []

    // Evento: Registro inicial
    if (historiaCompleta.createdAt) {
      eventos.push({
        tipo: 'REGISTRO',
        fecha: historiaCompleta.createdAt,
        hora: historiaCompleta.createdAt,
        icono: '📋',
        titulo: 'Registro en el Sistema',
        descripcion: `Paciente registrado en el sistema hospitalario. Nro. Historia: ${historiaCompleta.nroHistoria}`,
        color: '#10b981'
      })
    }

    // Eventos: Admisiones
    if (historiaCompleta.admisiones && historiaCompleta.admisiones.length > 0) {
      historiaCompleta.admisiones.forEach((admision: any) => {
        // Diferenciar entre admisión inicial (sin tipo/servicio) y admisiones específicas
        const esAdmisionInicial = !admision.tipo && !admision.servicio
        
        if (esAdmisionInicial) {
          // Admisión de registro inicial
          const formaIngreso = admision.formaIngreso || 'No especificado'
          const diagnostico = admision.diagnosticoIngreso || 'Sin diagnóstico'
          
          eventos.push({
            tipo: 'ADMISION_INICIAL',
            fecha: admision.fechaAdmision || admision.createdAt,
            hora: admision.horaAdmision || admision.createdAt,
            icono: '🏥',
            titulo: 'Admisión Inicial',
            descripcion: `Forma de ingreso: ${formaIngreso}. Diagnóstico: ${diagnostico}`,
            detalles: admision,
            color: '#10b981'
          })
        } else {
          // Admisión específica (emergencia/hospitalización)
          const tipoAdmision = admision.tipo || 'HOSPITALIZACIÓN'
          const servicioAdmision = admision.servicio || 'No especificado'
          const estadoAdmision = admision.estado || 'ACTIVA'
          
          eventos.push({
            tipo: 'ADMISION',
            fecha: admision.fechaAdmision || admision.createdAt,
            hora: admision.horaAdmision || admision.createdAt,
            icono: tipoAdmision === 'EMERGENCIA' ? '🚨' : '🏥',
            titulo: `Admisión: ${tipoAdmision}`,
            descripcion: `Servicio: ${servicioAdmision}. Estado: ${estadoAdmision}`,
            detalles: admision,
            color: tipoAdmision === 'EMERGENCIA' ? '#ef4444' : '#3b82f6'
          })
        }
      })
    }

    // Eventos: Encuentros médicos (atenciones reales)
    if (encuentros && encuentros.length > 0) {
      encuentros.forEach((encuentro: any) => {
        // Determinar icono y color según tipo de encuentro
        let icono = '⚕️'
        let color = '#8b5cf6'
        
        if (encuentro.tipo === 'EMERGENCIA') {
          icono = '🚨'
          color = '#ef4444'
        } else if (encuentro.tipo === 'HOSPITALIZACION') {
          icono = '🛏️'
          color = '#3b82f6'
        } else if (encuentro.tipo === 'CONSULTA') {
          icono = '🩺'
          color = '#10b981'
        }
        
        const medicoNombre = encuentro.createdBy?.nombre || 'Médico no registrado'
        const motivoTexto = encuentro.motivoConsulta ? ` - ${encuentro.motivoConsulta.substring(0, 50)}...` : ''
        const diagnostico = encuentro.impresiones && encuentro.impresiones.length > 0 
          ? encuentro.impresiones[0].descripcion 
          : 'Sin diagnóstico'
        
        eventos.push({
          tipo: 'ENCUENTRO',
          fecha: encuentro.fecha,
          hora: encuentro.hora || encuentro.createdAt,
          icono: icono,
          titulo: `Encuentro Médico: ${encuentro.tipo}`,
          descripcion: `Médico: ${medicoNombre}${motivoTexto}`,
          detalles: encuentro,
          color: color,
          diagnostico: diagnostico
        })
      })
    }

    // Eventos: Citas médicas
    if (historiaCompleta.citas && historiaCompleta.citas.length > 0) {
      historiaCompleta.citas.forEach((cita: any) => {
        console.log('🔍 Procesando cita:', {
          fechaCita: cita.fechaCita,
          horaCita: cita.horaCita,
          estado: cita.estado
        })
        
        const estadoCita = cita.estado || 'PROGRAMADA'
        const especialidad = cita.especialidad || 'No especificado'
        const motivo = cita.motivo ? ` - ${cita.motivo}` : ''
        
        // Determinar icono y color según estado
        let icono = '📅'
        let color = '#f59e0b' // Amarillo para programadas
        let estadoTexto = 'Programada'
        
        if (estadoCita === 'COMPLETADA') {
          icono = '✅'
          color = '#10b981' // Verde
          estadoTexto = 'Completada'
        } else if (estadoCita === 'CANCELADA') {
          icono = '❌'
          color = '#ef4444' // Rojo
          estadoTexto = 'Cancelada'
        }
        
        eventos.push({
          tipo: 'CITA',
          fecha: cita.fechaCita,
          hora: cita.horaCita,
          icono: icono,
          titulo: `Cita Médica (${estadoTexto})`,
          descripcion: `Especialidad: ${especialidad}${motivo}`,
          detalles: cita,
          color: color
        })
      })
    }

    // Ordenar por fecha y hora descendente (más reciente primero)
    eventos.sort((a, b) => {
      try {
        // Normalizar fecha (extraer solo YYYY-MM-DD)
        let fechaA = a.fecha
        let fechaB = b.fecha
        
        // Convertir Date objects a string ISO
        if (fechaA instanceof Date) {
          fechaA = fechaA.toISOString()
        }
        if (fechaB instanceof Date) {
          fechaB = fechaB.toISOString()
        }
        
        if (typeof fechaA === 'string' && fechaA.includes('T')) {
          fechaA = fechaA.split('T')[0]
        }
        if (typeof fechaB === 'string' && fechaB.includes('T')) {
          fechaB = fechaB.split('T')[0]
        }
        
        // Normalizar hora (extraer HH:MM o usar 00:00)
        let horaA = '00:00:00'
        let horaB = '00:00:00'
        
        if (a.hora) {
          // Convertir Date objects a string ISO
          let horaTemp = a.hora
          if (horaTemp instanceof Date) {
            horaTemp = horaTemp.toISOString()
          }
          
          if (typeof horaTemp === 'string') {
            if (horaTemp.includes('T')) {
              // Formato ISO: extraer hora
              const timeMatch = horaTemp.match(/T(\d{2}:\d{2}:\d{2})/)
              horaA = timeMatch ? timeMatch[1] : '00:00:00'
            } else {
              // Ya es formato HH:MM:SS o HH:MM
              horaA = horaTemp.length === 5 ? `${horaTemp}:00` : horaTemp
            }
          }
        }
        
        if (b.hora) {
          let horaTemp = b.hora
          if (horaTemp instanceof Date) {
            horaTemp = horaTemp.toISOString()
          }
          
          if (typeof horaTemp === 'string') {
            if (horaTemp.includes('T')) {
              const timeMatch = horaTemp.match(/T(\d{2}:\d{2}:\d{2})/)
              horaB = timeMatch ? timeMatch[1] : '00:00:00'
            } else {
              horaB = horaTemp.length === 5 ? `${horaTemp}:00` : horaTemp
            }
          }
        }
        
        // Combinar fecha y hora para comparación
        const fechaHoraA = new Date(`${fechaA}T${horaA}`).getTime()
        const fechaHoraB = new Date(`${fechaB}T${horaB}`).getTime()
        
        console.log('⚖️ Comparando:', {
          eventoA: { tipo: a.tipo, titulo: a.titulo, fecha: fechaA, hora: horaA, timestamp: fechaHoraA },
          eventoB: { tipo: b.tipo, titulo: b.titulo, fecha: fechaB, hora: horaB, timestamp: fechaHoraB },
          resultado: fechaHoraB - fechaHoraA
        })
        
        // Retornar en orden descendente (más reciente primero)
        return fechaHoraB - fechaHoraA
      } catch (err) {
        console.error('Error ordenando eventos:', err, { a, b })
        return 0
      }
    })

    return eventos
  }

  const timeline = construirTimeline()

  if (loading) {
    return (
      <section className={styles["form-section"]}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Cargando historia clínica...</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles["form-section"]}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={onBack}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ← Volver
        </button>
        <h2 style={{ margin: 0 }}>Historia Clínica Completa</h2>
      </div>

      {/* Información del paciente */}
      <div style={{ 
        backgroundColor: 'var(--bg-tertiary)', 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        marginBottom: '2rem',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Datos del Paciente</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nro. Historia:</strong>
            <span>{historiaCompleta?.nroHistoria || patient.nroHistoria || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nombre Completo:</strong>
            <span>{historiaCompleta?.apellidosNombres || patient.apellidosNombres || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>CI:</strong>
            <span>{historiaCompleta?.ci || patient.ci || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Edad:</strong>
            <span>{calcularEdad(historiaCompleta?.fechaNacimiento || patient.fechaNacimiento)} años</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Fecha de Nacimiento:</strong>
            <span>{formatearFecha(historiaCompleta?.fechaNacimiento || patient.fechaNacimiento)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sexo:</strong>
            <span>{(historiaCompleta?.sexo || patient.sexo) === 'M' ? 'Masculino' : 'Femenino'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nacionalidad:</strong>
            <span>{historiaCompleta?.nacionalidad || patient.nacionalidad || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Estado:</strong>
            <span>{historiaCompleta?.estado || patient.estado || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Lugar de Nacimiento:</strong>
            <span>{historiaCompleta?.lugarNacimiento || patient.lugarNacimiento || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Teléfono:</strong>
            <span>{historiaCompleta?.telefono || patient.telefono || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Dirección:</strong>
            <span>{historiaCompleta?.direccion || patient.direccion || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Datos Militares */}
      {(historiaCompleta?.personalMilitar || patient.personalMilitar) && (
        <div style={{ 
          backgroundColor: 'rgba(124, 58, 237, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          marginBottom: '2rem',
          border: '1px solid rgba(124, 58, 237, 0.3)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#7c3aed' }}>Datos Militares</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Grado:</strong>
              <span>{(historiaCompleta?.personalMilitar || patient.personalMilitar)?.grado || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Componente:</strong>
              <span>{(historiaCompleta?.personalMilitar || patient.personalMilitar)?.componente || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Unidad:</strong>
              <span>{(historiaCompleta?.personalMilitar || patient.personalMilitar)?.unidad || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Estado Militar:</strong>
              <span>{(() => {
                const estado = (historiaCompleta?.personalMilitar || patient.personalMilitar)?.estadoMilitar
                if (!estado) return 'N/A'
                if (estado === 'activo') return 'Activo'
                if (estado === 'disponible') return 'Disponible'
                if (estado === 'resActiva') return 'Reserva Activa'
                return 'N/A'
              })()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Timeline de eventos */}
      <div>
        <h3 style={{ marginBottom: '1.5rem' }}>📅 Línea de Tiempo (Más Reciente Primero)</h3>
        
        {timeline.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            backgroundColor: 'var(--bg-tertiary)', 
            borderRadius: '0.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{ color: 'var(--text-secondary)' }}>No hay eventos registrados en la historia clínica</p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Línea vertical del timeline */}
            <div style={{
              position: 'absolute',
              left: '2rem',
              top: '1rem',
              bottom: '1rem',
              width: '2px',
              backgroundColor: 'var(--border-color)'
            }} />

            {timeline.map((evento, index) => (
              <div 
                key={index}
                style={{
                  position: 'relative',
                  paddingLeft: '5rem',
                  paddingBottom: '2rem'
                }}
              >
                {/* Icono del evento */}
                <div style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '0',
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: evento.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  border: '3px solid var(--bg-primary)',
                  zIndex: 1
                }}>
                  {evento.icono}
                </div>

                {/* Contenido del evento */}
                <div style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '1.25rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-color)',
                  borderLeft: `4px solid ${evento.color}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                      {evento.titulo}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        whiteSpace: 'nowrap'
                      }}>
                        {formatearFecha(evento.fecha)}
                      </span>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        fontFamily: 'monospace'
                      }}>
                        🕐 {formatearHora(evento.hora)}
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {evento.descripcion}
                  </p>
                  
                  {/* Detalles adicionales según tipo de evento */}
                  {evento.detalles && evento.tipo === 'ENCUENTRO' && (
                    <div style={{ 
                      marginTop: '1rem', 
                      paddingTop: '1rem', 
                      borderTop: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      fontSize: '0.85rem'
                    }}>
                      {evento.diagnostico && (
                        <div>
                          <strong style={{ color: 'var(--text-secondary)' }}>Diagnóstico:</strong>
                          <span style={{ marginLeft: '0.5rem' }}>{evento.diagnostico}</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleVerDetalleEncuentro(evento.detalles)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          alignSelf: 'flex-start'
                        }}
                      >
                        Ver detalle completo del encuentro →
                      </button>
                    </div>
                  )}
                  {evento.detalles && evento.tipo === 'ADMISION' && (
                    <div style={{ 
                      marginTop: '1rem', 
                      paddingTop: '1rem', 
                      borderTop: '1px solid var(--border-color)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '0.75rem',
                      fontSize: '0.85rem'
                    }}>
                      <div>
                        <strong style={{ color: 'var(--text-secondary)' }}>Forma Ingreso:</strong>
                        <span style={{ marginLeft: '0.5rem' }}>{evento.detalles.formaIngreso || 'N/A'}</span>
                      </div>
                      {evento.detalles.habitacion && (
                        <div>
                          <strong style={{ color: 'var(--text-secondary)' }}>Habitación:</strong>
                          <span style={{ marginLeft: '0.5rem' }}>{evento.detalles.habitacion}</span>
                        </div>
                      )}
                      {evento.detalles.cama && (
                        <div>
                          <strong style={{ color: 'var(--text-secondary)' }}>Cama:</strong>
                          <span style={{ marginLeft: '0.5rem' }}>{evento.detalles.cama}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle de encuentro */}
      {encuentroSeleccionado && (
        <EncuentroDetailModal
          encuentro={encuentroSeleccionado}
          onClose={handleCerrarDetalle}
        />
      )}
    </section>
  )
}
