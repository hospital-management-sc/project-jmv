/**
 * SearchPatientView - Vista de búsqueda de pacientes
 * Componente extraído de AdminDashboard para modularización
 */

import { useState } from 'react'
import { API_BASE_URL } from '@/utils/constants'
import styles from '../AdminDashboard.module.css'

interface SearchPatientViewProps {
  onViewHistory: (patient: any) => void
  onScheduleAppointment: (patient: any) => void
}

export function SearchPatientView({ onViewHistory, onScheduleAppointment }: SearchPatientViewProps) {
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

      <div className={styles["search-patient-box"]}>
        {/* Selector de tipo de búsqueda */}
        <div className={styles["search-type-selector"]}>
          <label className={styles["radio-label"]}>
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
          <label className={styles["radio-label"]}>
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

        <div className={styles["search-input-group"]}>
          {/* Fila de inputs */}
          {searchType === 'ci' ? (
            <div className={styles["dual-input-group"]}>
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
                  boxSizing: 'border-box',
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
                  if (e.key === 'Enter') handleSearch()
                }}
                placeholder="Ej: 12345678"
                maxLength={8}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.375rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ) : (
            <input
              type="text"
              value={searchHistoria}
              onChange={(e) => {
                setSearchHistoria(e.target.value)
                setError('')
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
              placeholder="Ej: 00-00-00"
              style={{
                flex: 1,
                minWidth: 0,
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.375rem',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            />
          )}

          {/* Fila de botón */}
          <div className={styles["search-actions"]}>
            <button
              onClick={handleSearch}
              disabled={loading}
              className={styles["btn-search"]}
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Buscando...' : 'Buscar Paciente'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ color: '#ef4444', marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem' }}>
            {error}
          </div>
        )}
      </div>

      {patientData && (
        <div className={styles["patient-details"]}>
          <h3 style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>Paciente Encontrado</h3>
          <div className={styles["details-grid"]}>
            <div className={styles["detail-item"]}>
              <strong>Nro. Historia:</strong>
              <span>{patientData.nroHistoria}</span>
            </div>
            <div className={styles["detail-item"]}>
              <strong>Nombre Completo:</strong>
              <span>{patientData.apellidosNombres}</span>
            </div>
            <div className={styles["detail-item"]}>
              <strong>CI:</strong>
              <span>{patientData.ci}</span>
            </div>
            <div className={styles["detail-item"]}>
              <strong>Edad:</strong>
              <span>{calcularEdad(patientData.fechaNacimiento)} años</span>
            </div>
          </div>

          <div className={styles["action-buttons"]}>
            <button
              className={styles["btn-primary"]}
              onClick={() => onViewHistory(patientData)}
            >
              📋 Ver Historia Completa
            </button>
            <button
              className={styles["btn-secondary"]}
              style={{ cursor: 'not-allowed', opacity: 0.5 }}
              disabled
              title="Funcionalidad en desarrollo"
            >
              🖨️ Imprimir Resumen
            </button>
            <button
              className={styles["btn-secondary"]}
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

export default SearchPatientView
