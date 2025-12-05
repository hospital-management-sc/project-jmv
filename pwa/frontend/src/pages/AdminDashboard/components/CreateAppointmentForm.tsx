/**
 * CreateAppointmentForm - Formulario para crear citas médicas
 * Componente extraído de AdminDashboard para modularización
 */

import { useState, useEffect } from 'react'
import { SearchableSelect } from '@/components/SearchableSelect'
import { API_BASE_URL } from '@/utils/constants'
import { getTodayVenezuelaISO, formatTimeMilitaryVenezuela, formatDateLocal } from '@/utils/dateUtils'
import styles from '../AdminDashboard.module.css'

interface CreateAppointmentFormProps {
  preSelectedPatient?: any
}

export function CreateAppointmentForm({ preSelectedPatient }: CreateAppointmentFormProps = {}) {
  const [searchCITipo, setSearchCITipo] = useState('V')
  const [searchCINumeros, setSearchCINumeros] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<any>(preSelectedPatient || null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [especialidades, setEspecialidades] = useState<string[]>([
    'Medicina Interna',
    'Medicina Paleativa',
    'Cirugía General',
    'Pediatría',
    'Neumo Pediatría',
    'Traumatología',
    'Cirugía de Manos',
    'Odontología',
    'Otorrinolaringología',
    'Permatología',
    'Fisiatría',
    'Ginecología',
    'Gastroenterología',
    'Ematología',
    'Psicología'
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
      'Medicina Interna',
      'Medicina Paleativa',
      'Cirugía General',
      'Pediatría',
      'Neumo Pediatría',
      'Traumatología',
      'Cirugía de Manos',
      'Odontología',
      'Otorrinolaringología',
      'Permatología',
      'Fisiatría',
      'Ginecología',
      'Gastroenterología',
      'Ematología',
      'Psicología'
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
      // Con fecha y hora en columnas separadas, NO necesitamos conversión de zona horaria
      // Enviamos los valores directamente como el usuario los ingresó
      const citaData = {
        pacienteId: selectedPatient.id,
        medicoId: null,
        fechaCita: appointmentData.fecha, // YYYY-MM-DD
        horaCita: appointmentData.hora,   // HH:MM
        especialidad: appointmentData.especialidad,
        motivo: appointmentData.motivo || null,
        notas: null,
      }

      console.log('📅 Datos de cita a enviar:', citaData)

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
              // Usar funciones de dateUtils alineadas con test-timezone.ts
              const fechaFormato = formatDateLocal(cita.fechaCita)
              const horaFormato = formatTimeMilitaryVenezuela(cita.horaCita)
              
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
                min={getTodayVenezuelaISO()}
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

export default CreateAppointmentForm
