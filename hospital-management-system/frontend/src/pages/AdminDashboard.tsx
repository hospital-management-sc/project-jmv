/**
 * Dashboard para Personal Administrativo
 * Vista especializada para gestión administrativa y control de usuarios
 */

import { useState, useEffect } from 'react'
import styles from './AdminDashboard.module.css'

type ViewMode = 'main' | 'register-patient' | 'create-appointment' | 'search-patient'

export default function AdminDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('main')

  const renderMainView = () => (
    <>
      {/* Sección de Estadísticas */}
      <section className={styles['dashboard-stats']}>
        <div className={styles.card}>
          <h2>Total de Pacientes</h2>
          <div className={styles['stat-value']}>0</div>
        </div>
        <div className={styles.card}>
          <h2>Usuarios Activos</h2>
          <div className={styles['stat-value']}>0</div>
        </div>
        <div className={styles.card}>
          <h2>Citas Programadas Hoy</h2>
          <div className={styles['stat-value']}>0</div>
        </div>
        <div className={styles.card}>
          <h2>Registros de Auditoría</h2>
          <div className={styles['stat-value']}>0</div>
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
            <span className={styles.icon}>➕</span>
            <span>Registrar Nuevo Paciente</span>
          </button>
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('create-appointment')}
          >
            <span className={styles.icon}>📅</span>
            <span>Generar Cita Médica</span>
          </button>
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('search-patient')}
          >
            <span className={styles.icon}>🔍</span>
            <span>Consultar Historia Clínica</span>
          </button>
        </div>
      </section>

      {/* Sección de Actividad Reciente */}
      <section className={styles['recent-activity']}>
        <h2>Actividad Reciente</h2>
        <div className={styles['activity-placeholder']}>
          <p>Registros de actividad reciente se mostrarán aquí</p>
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
        {viewMode === 'create-appointment' && <CreateAppointmentForm />}
        {viewMode === 'search-patient' && <SearchPatientView />}
      </main>
    </div>
  )
}

// Componente para registrar nuevo paciente
function RegisterPatientForm() {
  const [formData, setFormData] = useState({
    // ADMISION
    nroHistoria: '',
    formaIngreso: 'AMBULANTE',
    fechaAdmision: '',
    horaAdmision: '',
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

  // Validar formato de historia clínica (00-00-00)
  const validateHistoria = (value: string): boolean => {
    // Permitir entrada parcial (números y guiones)
    const pattern = /^[\d-]*$/
    return pattern.test(value)
  }

  // Validar que el formato completo sea correcto
  const isHistoriaFormatValid = (value: string): boolean => {
    const pattern = /^\d{2}-\d{2}-\d{2}$/
    return pattern.test(value)
  }

  // Validar números de cédula (8 dígitos)
  const validateCINumeros = (value: string): boolean => {
    const pattern = /^\d{0,8}$/
    return pattern.test(value)
  }

  // Validar números de teléfono (7 dígitos)
  const validateTelefonoNumeros = (value: string): boolean => {
    const pattern = /^\d{0,7}$/
    return pattern.test(value)
  }

  const handleHistoriaChange = (value: string) => {
    // Permitir entrada parcial
    if (validateHistoria(value)) {
      setFormData({...formData, nroHistoria: value})
      // Solo mostrar error si está completo pero mal formateado
      if (value.length >= 8 && !isHistoriaFormatValid(value)) {
        setErrors({...errors, nroHistoria: 'Formato: 00-00-00'})
      } else {
        setErrors({...errors, nroHistoria: ''})
      }
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    const newErrors: {[key: string]: string} = {}
    if (!formData.nroHistoria) newErrors.nroHistoria = 'Requerido'
    if (formData.nroHistoria && !isHistoriaFormatValid(formData.nroHistoria)) newErrors.nroHistoria = 'Formato: 00-00-00'
    if (!formData.apellidosNombres) newErrors.apellidosNombres = 'Requerido'
    if (!formData.ciNumeros) newErrors.ciNumeros = 'Requerido'
    if (!formData.fechaAdmision) newErrors.fechaAdmision = 'Requerido'
    if (!formData.horaAdmision) newErrors.horaAdmision = 'Requerido'
    if (!formData.sexo) newErrors.sexo = 'Requerido'
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Requerido'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const ciCompleta = `${formData.ciTipo}-${formData.ciNumeros}`
    const telefonoCompleto = formData.telefonoNumeros ? `${formData.telefonoOperador}-${formData.telefonoNumeros}` : ''
    
    // Preparar datos para enviar al backend
    const datosRegistro = {
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
      grado: formData.grado,
      estadoMilitar: formData.estadoMilitar,
      componente: formData.componente,
      unidad: formData.unidad,
      diagnosticoIngreso: formData.diagnosticoIngreso,
      diagnosticoEgreso: formData.diagnosticoEgreso,
      fechaAlta: formData.fechaAlta,
      diasHospitalizacion: formData.diasHospitalizacion,
    }

    try {
      // Detectar URL del API según el entorno
      const apiUrl = window.location.hostname.includes('app.github.dev')
        ? window.location.origin.replace('-5173.', '-3001.') + '/api/pacientes'
        : 'http://localhost:3001/api/pacientes'

      const response = await fetch(apiUrl, {
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
      
      // Limpiar formulario
      setFormData({
        nroHistoria: '',
        formaIngreso: 'AMBULANTE',
        fechaAdmision: '',
        horaAdmision: '',
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
      alert(`❌ Error: ${error.message}`)
      setErrors({ submit: error.message })
    }
  }

  return (
    <section className={styles["form-section"]}>
      <h2>Control de Admisión - Registro de Paciente</h2>
      <p className={styles["form-description"]}>Complete todos los campos requeridos (*) según el formulario de control de admisión</p>
      
      <form onSubmit={handleSubmit} className={styles["patient-form"]}>
        {/* SECCIÓN 1: DATOS DE ADMISIÓN */}
        <div className={styles["form-section-header"]}>
          <h3>1. Datos de Admisión</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Nro. Historia Clínica * <span className={styles["hint"]}>(00-00-00)</span></label>
            <input
              type="text"
              required
              value={formData.nroHistoria}
              onChange={(e) => handleHistoriaChange(e.target.value)}
              placeholder="00-00-00"
              maxLength={8}
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
              placeholder="Nombre y firma del médico"
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
                maxLength={8}
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
            <label>Edad (Calculada)</label>
            <input
              type="number"
              disabled
              value={calcularEdad(formData.fechaNacimiento)}
              placeholder="Se calcula automáticamente"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Lugar de Nacimiento</label>
            <input
              type="text"
              value={formData.lugarNacimiento}
              onChange={(e) => setFormData({...formData, lugarNacimiento: e.target.value})}
              placeholder="Ciudad, Estado"
            />
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
            <label>Nacionalidad</label>
            <input
              type="text"
              value={formData.nacionalidad}
              onChange={(e) => setFormData({...formData, nacionalidad: e.target.value})}
              placeholder="Venezolana"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Estado</label>
            <input
              type="text"
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              placeholder="Estado de residencia"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Religión</label>
            <input
              type="text"
              value={formData.religion}
              onChange={(e) => setFormData({...formData, religion: e.target.value})}
              placeholder="Religión"
            />
          </div>

          <div className="form-group full-width">
            <label>Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({...formData, direccion: e.target.value})}
              placeholder="Dirección completa de residencia"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Teléfono</label>
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
                value={formData.telefonoNumeros}
                onChange={(e) => handleTelefonoNumerosChange(e.target.value)}
                placeholder="1234567"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: DATOS DE PERSONAL MILITAR */}
        <div className={styles["form-section-header"]}>
          <h3>3. Datos de Personal Militar (Opcional)</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Grado</label>
            <input
              type="text"
              value={formData.grado}
              onChange={(e) => setFormData({...formData, grado: e.target.value})}
              placeholder="Ej: Capitán, Teniente"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Componente</label>
            <input
              type="text"
              value={formData.componente}
              onChange={(e) => setFormData({...formData, componente: e.target.value})}
              placeholder="Ej: Ejército, Aviación"
            />
          </div>

          <div className="form-group full-width">
            <label>Estado Militar</label>
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
          </div>
        </div>

        {/* SECCIÓN 4: DATOS DE ESTANCIA HOSPITALARIA */}
        <div className={styles["form-section-header"]}>
          <h3>4. Datos de Estancia Hospitalaria</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Diagnóstico de Ingreso</label>
            <input
              type="text"
              value={formData.diagnosticoIngreso}
              onChange={(e) => setFormData({...formData, diagnosticoIngreso: e.target.value})}
              placeholder="Ej: Hipertensión Arterial"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Diagnóstico de Egreso</label>
            <input
              type="text"
              value={formData.diagnosticoEgreso}
              onChange={(e) => setFormData({...formData, diagnosticoEgreso: e.target.value})}
              placeholder="Ej: Hipertensión controlada"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Fecha de Alta</label>
            <input
              type="date"
              value={formData.fechaAlta}
              onChange={(e) => setFormData({...formData, fechaAlta: e.target.value})}
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Días de Hospitalización</label>
            <input
              type="number"
              value={formData.diasHospitalizacion}
              onChange={(e) => setFormData({...formData, diasHospitalizacion: e.target.value})}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

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
                fechaAdmision: '',
                horaAdmision: '',
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
            }}
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
    </section>
  )
}

// Componente para crear cita médica
function CreateAppointmentForm() {
  const [searchCI, setSearchCI] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
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

  // Cargar especialidades al montar el componente
  useEffect(() => {
    console.log('CreateAppointmentForm montado, cargando especialidades')
    cargarEspecialidades()
  }, [])

  // Cargar especialidades al montar
  const cargarEspecialidades = async () => {
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

    try {
      const apiBaseUrl = window.location.hostname.includes('app.github.dev')
        ? window.location.origin.replace('-5173.', '-3001.')
        : 'http://localhost:3001'

      const response = await fetch(`${apiBaseUrl}/api/citas/info/especialidades`)
      const result = await response.json()

      console.log('Respuesta de especialidades:', result)

      if (result.success && result.data && result.data.length > 0) {
        console.log('Usando especialidades de API:', result.data)
        setEspecialidades(result.data)
      } else {
        console.log('Usando especialidades por defecto')
        setEspecialidades(especialidadesDefecto)
      }
    } catch (error) {
      console.error('Error cargando especialidades:', error)
      setEspecialidades(especialidadesDefecto)
    }
  }

  const handleSearchPatient = async () => {
    if (!searchCI.trim()) {
      setSearchError('Por favor ingrese un CI')
      return
    }

    setSearchLoading(true)
    setSearchError('')
    setSelectedPatient(null)
    setCitasExistentes([])

    try {
      const apiBaseUrl = window.location.hostname.includes('app.github.dev')
        ? window.location.origin.replace('-5173.', '-3001.')
        : 'http://localhost:3001'

      const response = await fetch(`${apiBaseUrl}/api/pacientes/search?ci=${encodeURIComponent(searchCI)}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Paciente no encontrado')
      }

      setSelectedPatient(result.data)

      // Cargar citas existentes del paciente
      const citasResponse = await fetch(`${apiBaseUrl}/api/citas/paciente/${result.data.id}?estado=PROGRAMADA`)
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
      const apiBaseUrl = window.location.hostname.includes('app.github.dev')
        ? window.location.origin.replace('-5173.', '-3001.')
        : 'http://localhost:3001'

      const citaData = {
        pacienteId: selectedPatient.id,
        medicoId: null,
        fechaCita: appointmentData.fecha,
        horaCita: appointmentData.hora,
        especialidad: appointmentData.especialidad,
        motivo: appointmentData.motivo || null,
        notas: null,
      }

      const response = await fetch(`${apiBaseUrl}/api/citas`, {
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
      const citasResponse = await fetch(`${apiBaseUrl}/api/citas/paciente/${selectedPatient.id}?estado=PROGRAMADA`)
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
          <input
            type="text"
            value={searchCI}
            onChange={(e) => {
              setSearchCI(e.target.value)
              setSearchError('')
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchPatient()
              }
            }}
            placeholder="Ingrese CI del paciente (Ej: V-12345678)"
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
                setSearchCI('')
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
            {citasExistentes.map((cita: any) => (
              <div key={cita.id} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.375rem', fontSize: '0.9rem' }}>
                <strong>{new Date(cita.fechaCita).toLocaleDateString('es-VE')} a las {cita.horaCita ? new Date(`1970-01-01T${cita.horaCita}`).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</strong> - {cita.especialidad}
                <span style={{ float: 'right', color: '#7c3aed', fontSize: '0.8rem' }}>Estado: {cita.estado}</span>
              </div>
            ))}
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
                  console.log('Especialidad seleccionada:', e.target.value)
                  setAppointmentData({...appointmentData, especialidad: e.target.value})
                  setErrors({...errors, especialidad: ''})
                }}
              >
                <option value="">Seleccione especialidad...</option>
                {especialidades && especialidades.length > 0 ? (
                  especialidades.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))
                ) : (
                  <option disabled>No hay especialidades disponibles</option>
                )}
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
function SearchPatientView() {
  const [searchType, setSearchType] = useState<'ci' | 'historia'>('ci')
  const [searchValue, setSearchValue] = useState('')
  const [patientData, setPatientData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Por favor ingrese un criterio de búsqueda')
      return
    }

    setLoading(true)
    setError('')
    setPatientData(null)

    try {
      // Detectar URL del API según el entorno
      const apiBaseUrl = window.location.hostname.includes('app.github.dev')
        ? window.location.origin.replace('-5173.', '-3001.')
        : 'http://localhost:3001'

      // Construir URL de búsqueda
      const param = searchType === 'ci' ? `ci=${encodeURIComponent(searchValue)}` : `historia=${encodeURIComponent(searchValue)}`
      const url = `${apiBaseUrl}/api/pacientes/search?${param}`

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

  return (
    <section className={styles["form-section"]}>
      <h2>Consultar Historia Clínica</h2>
      <p className={styles["form-description"]}>Busque pacientes por CI o número de historia clínica</p>

      <div className="search-options">
        <div className="search-type-selector">
          <label>
            <input
              type="radio"
              checked={searchType === 'ci'}
              onChange={() => {
                setSearchType('ci')
                setSearchValue('')
                setError('')
                setPatientData(null)
              }}
            />
            Buscar por CI
          </label>
          <label>
            <input
              type="radio"
              checked={searchType === 'historia'}
              onChange={() => {
                setSearchType('historia')
                setSearchValue('')
                setError('')
                setPatientData(null)
              }}
            />
            Buscar por Nro. Historia
          </label>
        </div>

        <div className="search-input-group">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              setError('')
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            placeholder={searchType === 'ci' ? 'Ej: V-12345678' : 'Ej: 00-00-00'}
            className="search-input"
          />
          <button onClick={handleSearch} disabled={loading} className="btn-search">
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
          <h3>Información del Paciente</h3>
          <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>Nro. Historia:</strong>
              <span>{patientData.nroHistoria}</span>
            </div>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>Nombre Completo:</strong>
              <span>{patientData.apellidosNombres}</span>
            </div>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>CI:</strong>
              <span>{patientData.ci}</span>
            </div>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>Edad:</strong>
              <span>{calcularEdad(patientData.fechaNacimiento)} años</span>
            </div>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>Fecha de Nacimiento:</strong>
              <span>{new Date(patientData.fechaNacimiento).toLocaleDateString('es-VE')}</span>
            </div>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>Sexo:</strong>
              <span>{patientData.sexo === 'M' ? 'Masculino' : 'Femenino'}</span>
            </div>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>Nacionalidad:</strong>
              <span>{patientData.nacionalidad || 'N/A'}</span>
            </div>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>Teléfono:</strong>
              <span>{patientData.telefono || 'N/A'}</span>
            </div>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>Estado:</strong>
              <span>{patientData.estado || 'N/A'}</span>
            </div>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong>Lugar de Nacimiento:</strong>
              <span>{patientData.lugarNacimiento || 'N/A'}</span>
            </div>
            <div className="detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
              <strong>Dirección:</strong>
              <span>{patientData.direccion || 'N/A'}</span>
            </div>
          </div>

          {patientData.personalMilitar && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(124, 58, 237, 0.1)', borderRadius: '0.5rem', borderLeft: '3px solid #7c3aed' }}>
              <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Datos Militares</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div><strong>Grado:</strong> {patientData.personalMilitar.grado || 'N/A'}</div>
                <div><strong>Componente:</strong> {patientData.personalMilitar.componente || 'N/A'}</div>
                <div><strong>Unidad:</strong> {patientData.personalMilitar.unidad || 'N/A'}</div>
              </div>
            </div>
          )}

          <div className="patient-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="stat-card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Admisiones</h4>
              <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{patientData.admisiones.length}</p>
            </div>
            <div className="stat-card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Encuentros</h4>
              <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{patientData.encuentros.length}</p>
            </div>
          </div>

          <div className="action-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
              Ver Historia Completa
            </button>
            <button className="btn-secondary" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
              Imprimir Resumen
            </button>
            <button className="btn-secondary" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
              Programar Cita
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
