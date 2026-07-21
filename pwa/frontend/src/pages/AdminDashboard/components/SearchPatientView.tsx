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
  const [searchType, setSearchType] = useState<'ci' | 'nombre' | 'historia'>('ci')
  const [searchCITipo, setSearchCITipo] = useState('V')
  const [searchCINumeros, setSearchCINumeros] = useState('')
  const [searchNombre, setSearchNombre] = useState('')
  const [searchHistoria, setSearchHistoria] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [patientData, setPatientData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearchCINumerosChange = (value: string) => {
    const soloNumeros = value.replace(/\D/g, '').slice(0, 8)
    setSearchCINumeros(soloNumeros)
    setError('')
  }

  // Auto-formato historia: XX-XX-XX (solo dígitos, guiones automáticos)
  const formatHistoria = (raw: string): string => {
    const digits = raw.replace(/\D/g, '').slice(0, 6)
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`
  }

  const handleHistoriaChange = (value: string) => {
    setSearchHistoria(formatHistoria(value))
    setError('')
  }

  const seleccionarPaciente = (paciente: any) => {
    setSearchResults([])
    setError('')
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
  }

  const handleSearch = async () => {
    let param = ''
    
    if (searchType === 'ci') {
      if (!searchCINumeros.trim()) {
        setError('Por favor ingrese un CI')
        return
      }
      param = `ci=${encodeURIComponent(searchCITipo + '-' + searchCINumeros)}`
    } else if (searchType === 'nombre') {
      if (!searchNombre.trim()) {
        setError('Por favor ingrese un nombre o apellido')
        return
      }
      param = `nombre=${encodeURIComponent(searchNombre.trim())}&q=${encodeURIComponent(searchNombre.trim())}`
    } else {
      if (!searchHistoria.trim()) {
        setError('Por favor ingrese un número de historia')
        return
      }
      param = `historia=${encodeURIComponent(searchHistoria)}`
    }

    setLoading(true)
    setError('')
    setPatientData(null)
    setSearchResults([])

    try {
      const url = `${API_BASE_URL}/pacientes/search?${param}`
      const response = await fetch(url)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Paciente no encontrado')
      }

      if (Array.isArray(result.data)) {
        if (result.data.length === 0) {
          throw new Error('No se encontraron pacientes con esa búsqueda')
        }
        if (searchType === 'nombre') {
          setSearchResults(result.data)
        } else {
          if (result.data.length === 1) {
            seleccionarPaciente(result.data[0])
          } else {
            setSearchResults(result.data)
          }
        }
      } else if (result.data) {
        if (searchType === 'nombre') {
          setSearchResults([result.data])
        } else {
          seleccionarPaciente(result.data)
        }
      } else {
        throw new Error('Paciente no encontrado')
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar paciente')
      setPatientData(null)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
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

  return (
    <section className={styles["form-section"]}>
      <h2>Consultar Historia Clínica</h2>
      <p className={styles["form-description"]}>Busque pacientes por CI, nombre o número de historia clínica</p>

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
                setSearchNombre('')
                setSearchHistoria('')
                setError('')
                setPatientData(null)
                setSearchResults([])
              }}
            />
            Buscar por CI
          </label>
          <label className={styles["radio-label"]}>
            <input
              type="radio"
              checked={searchType === 'nombre'}
              onChange={() => {
                setSearchType('nombre')
                setSearchCITipo('V')
                setSearchCINumeros('')
                setSearchNombre('')
                setSearchHistoria('')
                setError('')
                setPatientData(null)
                setSearchResults([])
              }}
            />
            Buscar por Nombre / Apellido
          </label>
          <label className={styles["radio-label"]}>
            <input
              type="radio"
              checked={searchType === 'historia'}
              onChange={() => {
                setSearchType('historia')
                setSearchCITipo('V')
                setSearchCINumeros('')
                setSearchNombre('')
                setSearchHistoria('')
                setError('')
                setPatientData(null)
                setSearchResults([])
              }}
            />
            Buscar por Nro. Historia
          </label>
        </div>

        <div className={styles["search-input-group"]}>
          {searchType === 'ci' && (
            <div className={styles["dual-input-group"]}>
              <select
                value={searchCITipo}
                onChange={(e) => setSearchCITipo(e.target.value)}
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
                  if (e.key === 'Enter') handleSearch()
                }}
                placeholder="12345678"
                maxLength={8}
                inputMode="numeric"
              />
            </div>
          )}

          {searchType === 'nombre' && (
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className={styles["search-input"]}
                value={searchNombre}
                onChange={(e) => { setSearchNombre(e.target.value); setError(''); }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearch()
                }}
                placeholder="Ej: Pérez o María García"
              />
            </div>
          )}

          {searchType === 'historia' && (
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className={styles["search-input"]}
                value={searchHistoria}
                onChange={(e) => handleHistoriaChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearch()
                }}
                placeholder="00-00-00"
              />
            </div>
          )}

          <div className={styles["search-actions"]}>
            <button
              onClick={handleSearch}
              disabled={loading}
              className={styles["btn-search"]}
            >
              {loading ? 'Buscando...' : 'Buscar Paciente'}
            </button>
          </div>
        </div>

        {error && (
          <div className={styles["error-message"]} style={{ padding: '0.75rem', marginTop: '1rem' }}>
            {error}
          </div>
        )}

        {/* Lista de coincidencias encontradas por nombre o múltiples */}
        {searchResults.length > 0 && (
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
                    Ver Historia
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {patientData && (
        <div className={styles["patient-details"]}>
          <h3 className={styles["form-section-header"]}>Paciente Encontrado</h3>
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
              Ver Historia Completa
            </button>
            <button
              className={styles["btn-secondary"]}
              style={{ cursor: 'not-allowed', opacity: 0.5 }}
              disabled
              title="Funcionalidad en desarrollo"
            >
              Imprimir Resumen
            </button>
            <button
              className={styles["btn-secondary"]}
              onClick={() => onScheduleAppointment(patientData)}
            >
              Programar Cita
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default SearchPatientView
