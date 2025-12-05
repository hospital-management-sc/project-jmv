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

export default SearchPatientView
