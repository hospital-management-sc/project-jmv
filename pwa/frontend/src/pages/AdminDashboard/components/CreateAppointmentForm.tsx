/**
 * CreateAppointmentForm - Formulario para crear citas médicas
 * Componente extraído de AdminDashboard para modularización
 */

import { useState, useEffect } from 'react'
import { SearchableSelect } from '@/components/SearchableSelect'
import { API_BASE_URL } from '@/utils/constants'
import { getTodayVenezuelaISO, getCurrentTimeVenezuela, formatTimeMilitaryVenezuela, formatDateLocal } from '@/utils/dateUtils'
import { obtenerNombresEspecialidades } from '@/config/especialidades.config'
import { useAuth } from '@/contexts/AuthContext'
import { toastCustom } from '@/utils/toastCustom'
import styles from '../AdminDashboard.module.css'

interface CreateAppointmentFormProps {
  preSelectedPatient?: any
}

export function CreateAppointmentForm({ preSelectedPatient }: CreateAppointmentFormProps = {}) {
  const { user } = useAuth() // Obtener usuario actual para saber quién agendó la cita
  const [searchMode, setSearchMode] = useState<'ci' | 'nombre' | 'historia'>('ci')
  const [searchCITipo, setSearchCITipo] = useState('V')
  const [searchCINumeros, setSearchCINumeros] = useState('')
  const [searchNombre, setSearchNombre] = useState('')
  const [searchHistoria, setSearchHistoria] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(preSelectedPatient || null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  // 🎯 Especialidades obtenidas desde fuente única (especialidades.config.ts)
  const especialidades = obtenerNombresEspecialidades()
  const [citasExistentes, setCitasExistentes] = useState<any[]>([])

  const [appointmentData, setAppointmentData] = useState({
    fecha: '',
    hora: '',
    especialidad: '',
    medico: '',
    motivo: '',
  })

  // 🆕 Estados para médicos disponibles y disponibilidad
  const [medicosDisponibles, setMedicosDisponibles] = useState<any[]>([])
  const [loadingMedicos, setLoadingMedicos] = useState(false)
  const [disponibilidadMedico, setDisponibilidadMedico] = useState<any>(null)
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false)

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleSearchCINumerosChange = (value: string) => {
    // Solo permitir dígitos, extraer solo los números del paste
    const soloNumeros = value.replace(/\D/g, '').slice(0, 8)
    setSearchCINumeros(soloNumeros)
    setSearchError('')
  }

  // ✅ Especialidades se cargan desde la configuración centralizada (especialidades.config.ts)

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
          // Error loading patient appointments
        }
      }
      cargarCitasPaciente()
    }
  }, [preSelectedPatient])

  // 🆕 useEffect: Cargar médicos cuando cambia la especialidad
  useEffect(() => {
    if (appointmentData.especialidad) {
      setSearchError('') // Limpiar errores previos
      cargarMedicosEspecialidad(appointmentData.especialidad)
    } else {
      setMedicosDisponibles([])
      setDisponibilidadMedico(null)
    }
  }, [appointmentData.especialidad])

  // 🆕 useEffect: Validar disponibilidad cuando cambian médico y fecha
  useEffect(() => {
    if (appointmentData.medico && appointmentData.fecha && appointmentData.especialidad) {
      validarDisponibilidadMedico()
    } else {
      setDisponibilidadMedico(null)
    }
  }, [appointmentData.fecha, appointmentData.medico])

  // 🆕 Función: Cargar médicos de una especialidad
  const cargarMedicosEspecialidad = async (especialidad: string) => {
    setLoadingMedicos(true)
    setMedicosDisponibles([])
    setAppointmentData(prev => ({ ...prev, medico: '' }))
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/medicos/especialidad/${encodeURIComponent(especialidad)}`
      )
      const result = await response.json()

      if (result.success) {
        setMedicosDisponibles(result.data || [])
      }
    } catch (err: any) {
      // Error loading doctors - handled by UI showing empty list
    } finally {
      setLoadingMedicos(false)
    }
  }

  // 🆕 Función: Validar disponibilidad del médico en la fecha
  const validarDisponibilidadMedico = async () => {
    setLoadingDisponibilidad(true)
    
    try {
      // 🆕 Detectar FIN DE SEMANA localmente (sin llamada API)
      const fechaSeleccionada = new Date(appointmentData.fecha + 'T00:00:00')
      const diaDelSemana = fechaSeleccionada.getDay() // 0=Domingo, 6=Sábado
      
      if (diaDelSemana === 0 || diaDelSemana === 6) {
        // Es fin de semana - mostrar advertencia clara en feedback visual
        setDisponibilidadMedico({
          atiendeSeDia: false,
          esFinDeSemana: true,
          diasDisponibles: []
        })
        setLoadingDisponibilidad(false)
        return
      }

      // No es fin de semana - llamar API para validar disponibilidad del médico
      const response = await fetch(
        `${API_BASE_URL}/medicos/${appointmentData.medico}/disponibilidad?fecha=${appointmentData.fecha}&especialidad=${encodeURIComponent(appointmentData.especialidad)}`
      )
      const result = await response.json()

      if (result.success) {
        setDisponibilidadMedico(result.data)
        if (result.data.atiendeSeDia && result.data.horaInicio) {
          setAppointmentData(prev => ({ ...prev, hora: result.data.horaInicio }))
        }
      }
    } catch (err: any) {
      // Error checking doctor availability
    } finally {
      setLoadingDisponibilidad(false)
    }
  }

  // ✅ Función eliminada - especialidades se obtienen directamente desde la configuración centralizada

  const handleSearchHistoriaChange = (value: string) => {
    let clean = value.replace(/[^\d-]/g, '')
    if (clean.length > 8) clean = clean.slice(0, 8)
    
    // Auto-formatear si el usuario teclea 6 dígitos continuos sin guiones (ej. 000007 -> 00-00-07)
    const digitsOnly = clean.replace(/\D/g, '')
    if (!clean.includes('-') && digitsOnly.length === 6) {
      clean = `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 4)}-${digitsOnly.slice(4, 6)}`
    }
    
    setSearchHistoria(clean)
    setSearchError('')
  }

  const seleccionarPaciente = async (paciente: any) => {
    setSelectedPatient(paciente)
    setSearchResults([])
    setSearchError('')

    try {
      const citasResponse = await fetch(`${API_BASE_URL}/citas/paciente/${paciente.id}?estado=PROGRAMADA`)
      const citasResult = await citasResponse.json()

      if (citasResult.success) {
        setCitasExistentes(citasResult.data || [])
      }
    } catch (err) {
      // Ignorar error al cargar citas
    }

    setAppointmentData({
      fecha: '',
      hora: '',
      especialidad: '',
      medico: '',
      motivo: '',
    })
    setErrors({})
  }

  const handleSearchPatient = async () => {
    let url = ''

    if (searchMode === 'ci') {
      if (!searchCINumeros.trim()) {
        setSearchError('Por favor ingrese un número de cédula')
        return
      }
      const ciCompleta = `${searchCITipo}-${searchCINumeros}`
      url = `${API_BASE_URL}/pacientes/search?ci=${encodeURIComponent(ciCompleta)}`
    } else if (searchMode === 'nombre') {
      if (!searchNombre.trim()) {
        setSearchError('Por favor ingrese un nombre o apellido')
        return
      }
      url = `${API_BASE_URL}/pacientes/search?nombre=${encodeURIComponent(searchNombre.trim())}&q=${encodeURIComponent(searchNombre.trim())}`
    } else if (searchMode === 'historia') {
      if (!searchHistoria.trim()) {
        setSearchError('Por favor ingrese un número de historia clínica')
        return
      }
      url = `${API_BASE_URL}/pacientes/search?historia=${encodeURIComponent(searchHistoria.trim())}`
    }

    setSearchLoading(true)
    setSearchError('')
    setSelectedPatient(null)
    setSearchResults([])
    setCitasExistentes([])

    try {
      const response = await fetch(url)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Paciente no encontrado')
      }

      if (Array.isArray(result.data)) {
        if (result.data.length === 0) {
          throw new Error('No se encontraron pacientes con esa búsqueda')
        }
        if (searchMode === 'nombre') {
          // Al buscar por nombre, SIEMPRE mostrar la lista de coincidencias para que el usuario elija
          setSearchResults(result.data)
        } else {
          // Búsqueda por cédula o historia: si hay 1 coincidencia directa, seleccionar automáticamente
          if (result.data.length === 1) {
            seleccionarPaciente(result.data[0])
          } else {
            setSearchResults(result.data)
          }
        }
      } else if (result.data) {
        if (searchMode === 'nombre') {
          setSearchResults([result.data])
        } else {
          seleccionarPaciente(result.data)
        }
      } else {
        throw new Error('Paciente no encontrado')
      }
    } catch (err: any) {
      setSearchError(err.message || 'Error al buscar paciente')
      setSelectedPatient(null)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: {[key: string]: string} = {}
    if (!appointmentData.fecha) newErrors.fecha = 'Requerido'
    // Hora NO es requerida (es solo referencia/sugerencia)
    if (!appointmentData.especialidad) newErrors.especialidad = 'Requerido'
    if (!appointmentData.medico) newErrors.medico = '🔴 Debe seleccionar un médico' // REQUERIDO
    if (!appointmentData.motivo || !appointmentData.motivo.trim()) newErrors.motivo = '🔴 Este campo es obligatorio para una correcta documentación'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 🆕 Validación: No permitir dos citas en la misma especialidad
    const citaEnMismaEspecialidad = citasExistentes.some(
      (cita: any) => cita.especialidad === appointmentData.especialidad && cita.estado === 'PROGRAMADA'
    )

    if (citaEnMismaEspecialidad) {
      setErrors({
        especialidad: `⚠️ El paciente ya tiene una cita programada en ${appointmentData.especialidad}. No se pueden agendar dos citas en la misma especialidad.`
      })
      return
    }

    // Validar que haya espacios disponibles (validación final)
    if (disponibilidadMedico && !disponibilidadMedico.atiendeSeDia) {
      setErrors({ fecha: 'El médico no está disponible ese día' })
      return
    }

    if (disponibilidadMedico && disponibilidadMedico.espaciosDisponibles <= 0) {
      setErrors({ fecha: 'No hay espacios disponibles para esa fecha' })
      return
    }

    // 🆕 Validación: No permitir agendar citas con fecha/hora menor a la actual (Venezuela)
    const hoyVenezuela = getTodayVenezuelaISO()
    const horaActualVenezuela = getCurrentTimeVenezuela()
    
    if (appointmentData.fecha < hoyVenezuela) {
      newErrors.fecha = 'No puede agendar una cita en el pasado'
    } else if (appointmentData.fecha === hoyVenezuela && appointmentData.hora) {
      // Si es hoy, validar que la hora no sea menor a la actual
      if (appointmentData.hora < horaActualVenezuela) {
        newErrors.hora = 'La hora debe ser mayor a la hora actual'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitLoading(true)

    try {
      // OPCIÓN A: Hora es solo referencia/sugerencia
      // Si no ingresa hora, usar una por defecto (ej: 10:00)
      const horaFinal = appointmentData.hora || '10:00'

      const citaData = {
        pacienteId: selectedPatient.id,
        medicoId: Number(appointmentData.medico), // REQUERIDO
        createdById: user?.id ? Number(user.id) : null, // Quién agendó la cita - asegurar que sea número
        fechaCita: appointmentData.fecha, // YYYY-MM-DD
        horaCita: horaFinal, // HH:MM - Solo referencia
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
        // 🆕 Manejo específico del error de cita duplicada en la misma especialidad
        if (result.code === 'DUPLICATE_SPECIALTY_APPOINTMENT') {
          setErrors({
            especialidad: `⚠️ ${result.message}`
          })
          setSubmitLoading(false)
          return
        }
        throw new Error(result.message || 'Error al crear la cita')
      }

      // Obtener nombre del médico seleccionado
      const medicoNombre = medicosDisponibles.find(m => String(m.id) === appointmentData.medico)?.nombre || 'Médico';
      
      // Mostrar notificación con toast
      toastCustom.success(
        'Cita programada exitosamente',
        `Dr(a). ${medicoNombre} - ${formatDateLocal(appointmentData.fecha)}`
      )
      
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
    } catch (error: any) {
      toastCustom.error('Error', error.message)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <section className={styles["form-section"]}>
      <h2>Generar Cita Médica</h2>
      <p className={styles["form-description"]}>Busque el paciente y programe una cita médica</p>

      {/* Búsqueda de Paciente */}
      <div className={styles["search-patient-box"]}>
        <h3 className={styles["form-section-header"]}>1. Buscar Paciente</h3>

        {/* Selector de modo de búsqueda */}
        {!selectedPatient && (
          <div className={styles["search-type-selector"]}>
            <label className={searchMode === 'ci' ? styles["active"] : ''}>
              <input
                type="radio"
                name="searchMode"
                value="ci"
                checked={searchMode === 'ci'}
                onChange={() => { setSearchMode('ci'); setSearchError(''); setSearchResults([]); }}
              />
              Por Cédula
            </label>

            <label className={searchMode === 'nombre' ? styles["active"] : ''}>
              <input
                type="radio"
                name="searchMode"
                value="nombre"
                checked={searchMode === 'nombre'}
                onChange={() => { setSearchMode('nombre'); setSearchError(''); setSearchResults([]); }}
              />
              Por Nombre / Apellido
            </label>

            <label className={searchMode === 'historia' ? styles["active"] : ''}>
              <input
                type="radio"
                name="searchMode"
                value="historia"
                checked={searchMode === 'historia'}
                onChange={() => { setSearchMode('historia'); setSearchError(''); setSearchResults([]); }}
              />
              Por Nro. Historia
            </label>
          </div>
        )}

        <div className={styles["search-input-group"]}>
          {searchMode === 'ci' && (
            <div className={styles["dual-input-group"]}>
              <select
                value={searchCITipo}
                onChange={(e) => setSearchCITipo(e.target.value)}
                disabled={!!selectedPatient}
              >
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="P">P</option>
                <option value="J">J</option>
                <option value="G">G</option>
              </select>
              <input
                type="text"
                value={searchCINumeros}
                onChange={(e) => handleSearchCINumerosChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearchPatient()
                }}
                placeholder="12345678"
                maxLength={8}
                disabled={!!selectedPatient}
                inputMode="numeric"
              />
            </div>
          )}

          {searchMode === 'nombre' && (
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className={styles["search-input"]}
                value={searchNombre}
                onChange={(e) => { setSearchNombre(e.target.value); setSearchError(''); }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearchPatient()
                }}
                placeholder="Ej: Pérez o María García"
                disabled={!!selectedPatient}
              />
            </div>
          )}

          {searchMode === 'historia' && (
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className={styles["search-input"]}
                value={searchHistoria}
                onChange={(e) => handleSearchHistoriaChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearchPatient()
                }}
                placeholder="Ej: 00-00-01"
                disabled={!!selectedPatient}
              />
            </div>
          )}

          {/* Fila 2: Botones de acción */}
          <div className={styles["search-actions"]}>
            <button
              onClick={handleSearchPatient}
              disabled={searchLoading || !!selectedPatient}
              className={styles["btn-search"]}
            >
              {searchLoading ? 'Buscando...' : 'Buscar'}
            </button>
            {selectedPatient && (
              <button
                onClick={() => {
                  setSelectedPatient(null)
                  setSearchResults([])
                  setSearchCITipo('V')
                  setSearchCINumeros('')
                  setSearchNombre('')
                  setSearchHistoria('')
                  setCitasExistentes([])
                  setAppointmentData({
                    fecha: '',
                    hora: '',
                    especialidad: '',
                    medico: '',
                    motivo: '',
                  })
                  setMedicosDisponibles([])
                  setDisponibilidadMedico(null)
                }}
                className={styles["btn-secondary"]}
              >
                Buscar Otro
              </button>
            )}
          </div>{/* end search-actions */}
        </div>{/* end search-input-group */}

        {searchError && (
          <div className={styles["error-message"]} style={{ padding: '0.75rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
            {searchError}
          </div>
        )}

        {/* Lista de coincidencias cuando se busca por nombre u otros criterios múltiples */}
        {searchResults.length > 0 && !selectedPatient && (
          <div style={{ marginTop: '1rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--dashboard-border)' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Coincidencias encontradas ({searchResults.length}):
            </h4>
            <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
              {searchResults.map((paciente: any) => (
                <div
                  key={paciente.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '0.375rem',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{paciente.apellidosNombres}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      CI: <strong>{paciente.ci}</strong> | Historia: <strong>{paciente.nroHistoria}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => seleccionarPaciente(paciente)}
                    className={styles["btn-primary"]}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    Seleccionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedPatient && (
          <div className={styles["patient-details"]}>
            <h4 className={styles["form-section-header"]}>Paciente Seleccionado</h4>
            <div className={styles["details-grid"]}>
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
              // Usar funciones de dateUtils alineadas con test-timezone.ts
              const fechaFormato = formatDateLocal(cita.fechaCita)
              const horaFormato = formatTimeMilitaryVenezuela(cita.horaCita)
              
              return (
                <div key={cita.id} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.375rem', fontSize: '0.9rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>{fechaFormato} a las {horaFormato}</strong> - <strong>{cita.especialidad}</strong>
                  </div>
                  {cita.medico && (
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>Dr(a):</strong> {cita.medico.nombre}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {cita.motivo && `Motivo: ${cita.motivo}`}
                    </span>
                    <span style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: '500' }}>Estado: {cita.estado}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Formulario de Cita */}
      {selectedPatient && (
        <form onSubmit={handleSubmit}>
          <h3 className={styles["form-section-header"]}>2. Datos de la Cita</h3>
          <div className={styles["form-grid"]}>
            {/* 1️⃣ ESPECIALIDAD - Primer campo */}
            <div className={styles["form-group"]}>
              <label>Especialidad * (Total: {especialidades.length})</label>
              <SearchableSelect
                options={especialidades}
                value={appointmentData.especialidad}
                onChange={(value) => {
                  setAppointmentData({...appointmentData, especialidad: value})
                  setErrors({...errors, especialidad: ''})
                }}
                placeholder="Seleccione especialidad..."
              />
              {errors.especialidad && <span className={styles["error-message"]}>{errors.especialidad}</span>}
            </div>

            {/* 2️⃣ MÉDICO - Depende de especialidad */}
            <div className={styles["form-group"]}>
              <label>Médico * <span className={styles["required"]}>Requerido</span></label>
              {appointmentData.especialidad ? (
                <>
                  {loadingMedicos ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0' }}>
                      <div className="spinner" aria-hidden="true" style={{ transform: 'scale(0.55)', marginBottom: '0' }} />
                      <p className="loading-text" style={{ fontSize: '0.82rem' }}>Cargando médicos disponibles...</p>
                    </div>
                  ) : medicosDisponibles.length > 0 ? (
                    <>
                      <select
                        required
                        value={appointmentData.medico}
                        onChange={(e) => {
                          setAppointmentData({...appointmentData, medico: e.target.value})
                          setErrors({...errors, medico: ''})
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '0.375rem',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">-- Seleccione un médico --</option>
                        {medicosDisponibles.map((medico: any) => (
                          <option key={medico.id} value={medico.id}>
                            {medico.nombre}
                          </option>
                        ))}
                      </select>
                      <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                        {medicosDisponibles.length} médico(s) disponible(s) para esta especialidad
                      </small>
                    </>
                  ) : (
                    <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>
                      No hay médicos disponibles para esta especialidad
                    </p>
                  )}
                  {errors.medico && <span className={styles["error-message"]}>{errors.medico}</span>}
                </>
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Selecciona una especialidad primero
                </p>
              )}
            </div>

            {/* 3️⃣ FECHA - Depende de médico */}
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
                min={getTodayVenezuelaISO()}
              />
            </div>

            {/* 🆕 FEEDBACK VISUAL DE DISPONIBILIDAD - Después de fecha */}
            {disponibilidadMedico && appointmentData.medico && (
              <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
                <div style={{
                  padding: '1rem',
                  backgroundColor: disponibilidadMedico.atiendeSeDia ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderLeft: `4px solid ${disponibilidadMedico.atiendeSeDia ? '#10b981' : '#ef4444'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                }}>
                  {loadingDisponibilidad ? (
                    <p style={{ margin: 0 }}>⏳ Validando disponibilidad...</p>
                  ) : disponibilidadMedico.atiendeSeDia ? (
                    <>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#10b981' }}>
                        Médico disponible
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0' }}>
                        <strong>Horario:</strong> {disponibilidadMedico.horaInicio} - {disponibilidadMedico.horaFin}
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Espacios:</strong> {disponibilidadMedico.espaciosDisponibles} / {disponibilidadMedico.capacidadTotal} disponibles
                      </p>
                      {disponibilidadMedico.espaciosDisponibles > 0 && disponibilidadMedico.espaciosDisponibles <= 3 && (
                        <p style={{ margin: '0.5rem 0 0 0', color: '#d97706', fontSize: '0.85rem' }}>
                          Pocos espacios disponibles
                        </p>
                      )}
                    </>
                  ) : disponibilidadMedico.esFinDeSemana ? (
                    <>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#ef4444' }}>
                        No disponible
                      </p>
                      <p style={{ margin: 0 }}>
                        Hospital labora solo de lunes a viernes.
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#ef4444' }}>
                        No disponible
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0' }}>
                        El médico no atiende ese día
                      </p>
                      {disponibilidadMedico.diasDisponibles && disponibilidadMedico.diasDisponibles.length > 0 && (
                        <>
                          <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold' }}>Próximas fechas disponibles:</p>
                          <ul style={{ margin: '0.25rem 0 0 1.5rem', paddingLeft: 0 }}>
                            {disponibilidadMedico.diasDisponibles.slice(0, 3).map((d: any) => (
                              <li key={d.fecha} style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                                {d.dia} {formatDateLocal(d.fecha)} ({d.espacios} espacios)
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 4️⃣ HORA - Después del feedback visual */}
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
            <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
              <label>Motivo de la Consulta * <span className={styles["required"]}>Requerido</span></label>
              <textarea
                required
                value={appointmentData.motivo}
                onChange={(e) => setAppointmentData({...appointmentData, motivo: e.target.value})}
                placeholder="Describa brevemente el motivo de la consulta"
                rows={3}
              />
              {errors.motivo && <span className={styles["error-message"]}>{errors.motivo}</span>}
            </div>
          </div>

          <div className={styles["form-actions"]}>
            <button type="submit" disabled={submitLoading} className={styles["btn-primary"]}>
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
                setMedicosDisponibles([])
                setDisponibilidadMedico(null)
              }}
              className={styles["btn-secondary"]}
            >
              Limpiar Formulario
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export default CreateAppointmentForm
