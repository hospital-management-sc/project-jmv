/**
 * Dashboard para Super Administrador
 * Gestión de la Whitelist de Personal Autorizado
 * 
 * ACCESO: Solo SUPER_ADMIN
 * FUNCIONES:
 * - Ver lista de personal autorizado
 * - Agregar nuevo personal a la whitelist
 * - Editar información de personal
 * - Dar de baja personal
 * - Ver estadísticas de la whitelist
 */

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { API_BASE_URL } from '@/utils/constants'
import { VENEZUELA_TIMEZONE, VENEZUELA_LOCALE } from '@/utils/dateUtils'
import styles from './SuperAdminDashboard.module.css'

// Tipos
interface PersonalAutorizado {
  id: number
  ci: string
  nombreCompleto: string
  email: string | null
  rolAutorizado: string
  departamento: string | null
  cargo: string | null
  estado: string
  fechaIngreso: string
  fechaVencimiento: string | null
  registrado: boolean
  fechaRegistro: string | null
  usuarioId: number | null
  usuario?: {
    id: number
    nombre: string
    email: string
    role: string
    createdAt: string
  } | null
}

interface WhitelistStats {
  total: number
  activos: number
  registrados: number
  pendientesRegistro: number
  porRol: { rol: string; cantidad: number }[]
}

interface FormData {
  ci: string
  nombreCompleto: string
  email: string
  rolAutorizado: string
  departamento: string
  cargo: string
  fechaIngreso: string
  fechaVencimiento: string
}

type ViewMode = 'list' | 'add' | 'edit' | 'stats'

const ROLES_DISPONIBLES = [
  { value: 'SUPER_ADMIN', label: 'Super Administrador', color: '#dc2626' },
  { value: 'ADMIN', label: 'Personal Administrativo', color: '#7c3aed' },
  { value: 'COORDINADOR', label: 'Coordinador de Área', color: '#2563eb' },
  { value: 'MEDICO', label: 'Médico', color: '#059669' },
  { value: 'ENFERMERO', label: 'Enfermero/a', color: '#0891b2' },
]

const ESTADOS_PERSONAL = [
  { value: 'ACTIVO', label: 'Activo', color: '#059669' },
  { value: 'INACTIVO', label: 'Inactivo', color: '#6b7280' },
  { value: 'SUSPENDIDO', label: 'Suspendido', color: '#f59e0b' },
  { value: 'BAJA', label: 'Baja', color: '#dc2626' },
]

const DEPARTAMENTOS = [
  // Especialidades Médicas Clínicas (15)
  'Medicina Interna',
  'Medicina Paliativa',
  'Cirugía General',
  'Pediatría',
  'Neumo Pediatría',
  'Traumatología',
  'Cirugía de Manos',
  'Odontología',
  'Otorrinolaringología',
  'Dermatología',
  'Fisiatría',
  'Ginecología',
  'Gastroenterología',
  'Hematología',
  'Psicología',
  // Servicios de Apoyo
  'Emergencia',
  'UCI',
  'Laboratorio',
  'Radiología',
  'Farmacia',
  'Admisiones',
  // Administrativos
  'Administración',
  'Recursos Humanos',
  'Sistemas',
  'Otro',
]

export default function SuperAdminDashboard() {
  const { user } = useAuth()
  
  // Obtener token del localStorage
  const getToken = () => localStorage.getItem('token')
  
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [personalList, setPersonalList] = useState<PersonalAutorizado[]>([])
  const [stats, setStats] = useState<WhitelistStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Filtros
  const [filtroEstado, setFiltroEstado] = useState<string>('')
  const [filtroRol, setFiltroRol] = useState<string>('')
  const [filtroRegistrado, setFiltroRegistrado] = useState<string>('')
  const [busqueda, setBusqueda] = useState<string>('')
  
  // Formulario
  const [formData, setFormData] = useState<FormData>({
    ci: '',
    nombreCompleto: '',
    email: '',
    rolAutorizado: '',
    departamento: '',
    cargo: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
  })
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({})
  const [editingCI, setEditingCI] = useState<string | null>(null)
  
  // Modal de baja
  const [showBajaModal, setShowBajaModal] = useState(false)
  const [bajaCI, setBajaCI] = useState<string | null>(null)
  const [motivoBaja, setMotivoBaja] = useState('')

  // Headers con autenticación
  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  }), [])

  // Cargar datos
  const cargarPersonal = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filtroEstado) params.append('estado', filtroEstado)
      if (filtroRol) params.append('rol', filtroRol)
      if (filtroRegistrado) params.append('registrado', filtroRegistrado)
      
      const url = `${API_BASE_URL}/authorized-personnel${params.toString() ? `?${params}` : ''}`
      const response = await fetch(url, { headers: getHeaders() })
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Error al cargar personal')
      }
      
      setPersonalList(result.data || [])
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [filtroEstado, filtroRol, filtroRegistrado, getHeaders])

  const cargarStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/authorized-personnel/stats`, {
        headers: getHeaders(),
      })
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err)
    }
  }, [getHeaders])

  useEffect(() => {
    cargarPersonal()
    cargarStats()
  }, [cargarPersonal, cargarStats])

  // Filtrar lista por búsqueda local
  const personalFiltrado = personalList.filter(p => {
    if (!busqueda) return true
    const searchLower = busqueda.toLowerCase()
    return (
      p.ci.toLowerCase().includes(searchLower) ||
      p.nombreCompleto.toLowerCase().includes(searchLower) ||
      (p.email && p.email.toLowerCase().includes(searchLower)) ||
      (p.departamento && p.departamento.toLowerCase().includes(searchLower))
    )
  })

  // Validar formulario
  const validarFormulario = (): boolean => {
    const errors: Partial<FormData> = {}
    
    if (!formData.ci) {
      errors.ci = 'CI es requerido'
    } else if (!/^[VEP]\d{7,9}$/.test(formData.ci.toUpperCase())) {
      errors.ci = 'Formato inválido. Ej: V12345678'
    }
    
    if (!formData.nombreCompleto || formData.nombreCompleto.length < 5) {
      errors.nombreCompleto = 'Nombre completo es requerido (mín. 5 caracteres)'
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido'
    }
    
    if (!formData.rolAutorizado) {
      errors.rolAutorizado = 'Rol es requerido'
    }
    
    if (!formData.fechaIngreso) {
      errors.fechaIngreso = 'Fecha de ingreso es requerida'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Guardar personal
  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const url = editingCI 
        ? `${API_BASE_URL}/authorized-personnel/${editingCI}`
        : `${API_BASE_URL}/authorized-personnel`
      
      const method = editingCI ? 'PUT' : 'POST'
      
      const dataToSend = {
        ...formData,
        ci: formData.ci.toUpperCase(),
        fechaVencimiento: formData.fechaVencimiento || null,
      }
      
      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(dataToSend),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Error al guardar')
      }
      
      setSuccessMessage(editingCI ? 'Personal actualizado exitosamente' : 'Personal agregado exitosamente')
      setTimeout(() => setSuccessMessage(null), 3000)
      
      // Limpiar y volver a lista
      setFormData({
        ci: '',
        nombreCompleto: '',
        email: '',
        rolAutorizado: '',
        departamento: '',
        cargo: '',
        fechaIngreso: new Date().toISOString().split('T')[0],
        fechaVencimiento: '',
      })
      setEditingCI(null)
      setViewMode('list')
      cargarPersonal()
      cargarStats()
    } catch (err: any) {
      setError(err.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  // Editar personal
  const handleEditar = (personal: PersonalAutorizado) => {
    setFormData({
      ci: personal.ci,
      nombreCompleto: personal.nombreCompleto,
      email: personal.email || '',
      rolAutorizado: personal.rolAutorizado,
      departamento: personal.departamento || '',
      cargo: personal.cargo || '',
      fechaIngreso: personal.fechaIngreso.split('T')[0],
      fechaVencimiento: personal.fechaVencimiento ? personal.fechaVencimiento.split('T')[0] : '',
    })
    setEditingCI(personal.ci)
    setViewMode('edit')
    setFormErrors({})
  }

  // Dar de baja
  const handleDarDeBaja = async () => {
    if (!bajaCI || !motivoBaja || motivoBaja.length < 10) {
      setError('Debe proporcionar un motivo de baja detallado (mín. 10 caracteres)')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/authorized-personnel/${bajaCI}`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ motivoBaja }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Error al dar de baja')
      }
      
      setSuccessMessage('Personal dado de baja exitosamente')
      setTimeout(() => setSuccessMessage(null), 3000)
      
      setShowBajaModal(false)
      setBajaCI(null)
      setMotivoBaja('')
      cargarPersonal()
      cargarStats()
    } catch (err: any) {
      setError(err.message || 'Error al dar de baja')
    } finally {
      setLoading(false)
    }
  }

  // Obtener color del rol
  const getRolColor = (rol: string) => {
    const rolInfo = ROLES_DISPONIBLES.find(r => r.value === rol)
    return rolInfo?.color || '#6b7280'
  }

  // Obtener color del estado
  const getEstadoColor = (estado: string) => {
    const estadoInfo = ESTADOS_PERSONAL.find(e => e.value === estado)
    return estadoInfo?.color || '#6b7280'
  }

  // Formatear fecha
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString(VENEZUELA_LOCALE, { timeZone: VENEZUELA_TIMEZONE })
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>🔐 Panel de Super Administrador</h1>
            <p className={styles.subtitle}>Gestión de Personal Autorizado (Whitelist)</p>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.nombre}</span>
            <span className={styles.userRole}>SUPER_ADMIN</span>
          </div>
        </div>
      </header>

      {/* Mensajes */}
      {error && (
        <div className={styles.errorAlert}>
          <span>❌</span>
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {successMessage && (
        <div className={styles.successAlert}>
          <span>✅</span>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Navegación */}
      <nav className={styles.nav}>
        <button 
          className={`${styles.navBtn} ${viewMode === 'list' ? styles.active : ''}`}
          onClick={() => { setViewMode('list'); setEditingCI(null); }}
        >
          📋 Lista de Personal
        </button>
        <button 
          className={`${styles.navBtn} ${viewMode === 'add' ? styles.active : ''}`}
          onClick={() => { 
            setViewMode('add'); 
            setEditingCI(null);
            setFormData({
              ci: '',
              nombreCompleto: '',
              email: '',
              rolAutorizado: '',
              departamento: '',
              cargo: '',
              fechaIngreso: new Date().toISOString().split('T')[0],
              fechaVencimiento: '',
            });
            setFormErrors({});
          }}
        >
          ➕ Agregar Personal
        </button>
        <button 
          className={`${styles.navBtn} ${viewMode === 'stats' ? styles.active : ''}`}
          onClick={() => setViewMode('stats')}
        >
          📊 Estadísticas
        </button>
      </nav>

      <main className={styles.main}>
        {/* Vista: Estadísticas */}
        {viewMode === 'stats' && stats && (
          <section className={styles.statsSection}>
            <h2>Estadísticas de la Whitelist</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.total}</span>
                  <span className={styles.statLabel}>Total Personal</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.activos}</span>
                  <span className={styles.statLabel}>Activos</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🔑</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.registrados}</span>
                  <span className={styles.statLabel}>Con Cuenta</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏳</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.pendientesRegistro}</span>
                  <span className={styles.statLabel}>Pendientes Registro</span>
                </div>
              </div>
            </div>
            
            <h3>Personal por Rol</h3>
            <div className={styles.rolStats}>
              {stats.porRol.map(item => {
                const rolInfo = ROLES_DISPONIBLES.find(r => r.value === item.rol)
                return (
                  <div key={item.rol} className={styles.rolStatItem}>
                    <span 
                      className={styles.rolBadge}
                      style={{ backgroundColor: rolInfo?.color || '#6b7280' }}
                    >
                      {rolInfo?.label || item.rol}
                    </span>
                    <span className={styles.rolCount}>{item.cantidad}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Vista: Lista de Personal */}
        {viewMode === 'list' && (
          <section className={styles.listSection}>
            {/* Filtros */}
            <div className={styles.filters}>
              <input
                type="text"
                placeholder="Buscar por CI, nombre, email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className={styles.searchInput}
              />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Todos los estados</option>
                {ESTADOS_PERSONAL.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
              <select
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Todos los roles</option>
                {ROLES_DISPONIBLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <select
                value={filtroRegistrado}
                onChange={(e) => setFiltroRegistrado(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Todos</option>
                <option value="true">Con cuenta</option>
                <option value="false">Sin cuenta</option>
              </select>
              <button onClick={cargarPersonal} className={styles.refreshBtn}>
                🔄 Actualizar
              </button>
            </div>

            {/* Tabla */}
            {loading ? (
              <div className={styles.loading}>Cargando...</div>
            ) : personalFiltrado.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No se encontró personal con los filtros aplicados</p>
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>CI</th>
                      <th>Nombre Completo</th>
                      <th>Rol</th>
                      <th>Departamento</th>
                      <th>Estado</th>
                      <th>Cuenta</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personalFiltrado.map(personal => (
                      <tr key={personal.id} className={personal.estado !== 'ACTIVO' ? styles.inactiveRow : ''}>
                        <td className={styles.ciCell}>{personal.ci}</td>
                        <td>
                          <div className={styles.nombreCell}>
                            <span className={styles.nombre}>{personal.nombreCompleto}</span>
                            {personal.email && (
                              <span className={styles.email}>{personal.email}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span 
                            className={styles.badge}
                            style={{ backgroundColor: getRolColor(personal.rolAutorizado) }}
                          >
                            {ROLES_DISPONIBLES.find(r => r.value === personal.rolAutorizado)?.label || personal.rolAutorizado}
                          </span>
                        </td>
                        <td>{personal.departamento || '-'}</td>
                        <td>
                          <span 
                            className={styles.estadoBadge}
                            style={{ backgroundColor: getEstadoColor(personal.estado) }}
                          >
                            {personal.estado}
                          </span>
                        </td>
                        <td>
                          {personal.registrado ? (
                            <span className={styles.registrado}>
                              ✅ Registrado
                              <small>{formatDate(personal.fechaRegistro)}</small>
                            </span>
                          ) : (
                            <span className={styles.pendiente}>⏳ Pendiente</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button 
                              onClick={() => handleEditar(personal)}
                              className={styles.editBtn}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            {personal.estado === 'ACTIVO' && (
                              <button 
                                onClick={() => {
                                  setBajaCI(personal.ci)
                                  setShowBajaModal(true)
                                }}
                                className={styles.deleteBtn}
                                title="Dar de baja"
                              >
                                🚫
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className={styles.tableFooter}>
              <span>Mostrando {personalFiltrado.length} de {personalList.length} registros</span>
            </div>
          </section>
        )}

        {/* Vista: Agregar/Editar Personal */}
        {(viewMode === 'add' || viewMode === 'edit') && (
          <section className={styles.formSection}>
            <h2>{editingCI ? '✏️ Editar Personal Autorizado' : '➕ Agregar Personal Autorizado'}</h2>
            <p className={styles.formDescription}>
              {editingCI 
                ? 'Modifique los datos del personal autorizado'
                : 'Complete los datos para autorizar a una nueva persona a registrarse en el sistema'
              }
            </p>
            
            <form onSubmit={handleGuardar} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Cédula de Identidad *</label>
                  <input
                    type="text"
                    value={formData.ci}
                    onChange={(e) => setFormData({ ...formData, ci: e.target.value.toUpperCase() })}
                    placeholder="V12345678"
                    disabled={!!editingCI}
                    maxLength={10}
                  />
                  {formErrors.ci && <span className={styles.fieldError}>{formErrors.ci}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                    placeholder="Como aparece en la cédula"
                  />
                  {formErrors.nombreCompleto && <span className={styles.fieldError}>{formErrors.nombreCompleto}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label>Email Institucional</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@hospital.com"
                  />
                  {formErrors.email && <span className={styles.fieldError}>{formErrors.email}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label>Rol Autorizado *</label>
                  <select
                    value={formData.rolAutorizado}
                    onChange={(e) => setFormData({ ...formData, rolAutorizado: e.target.value })}
                  >
                    <option value="">Seleccione un rol...</option>
                    {ROLES_DISPONIBLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  {formErrors.rolAutorizado && <span className={styles.fieldError}>{formErrors.rolAutorizado}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label>Departamento</label>
                  <select
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  >
                    <option value="">Seleccione...</option>
                    {DEPARTAMENTOS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Cargo</label>
                  <input
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="Ej: Médico Internista"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Fecha de Ingreso al Hospital *</label>
                  <input
                    type="date"
                    value={formData.fechaIngreso}
                    onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                  />
                  {formErrors.fechaIngreso && <span className={styles.fieldError}>{formErrors.fechaIngreso}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label>Fecha de Vencimiento (Opcional)</label>
                  <input
                    type="date"
                    value={formData.fechaVencimiento}
                    onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                    min={formData.fechaIngreso}
                  />
                  <small className={styles.fieldHint}>Dejar vacío para autorización indefinida</small>
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Guardando...' : (editingCI ? 'Actualizar' : 'Agregar a Whitelist')}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => {
                    setViewMode('list')
                    setEditingCI(null)
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      {/* Modal de Baja */}
      {showBajaModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>🚫 Dar de Baja</h3>
            <p>¿Está seguro de dar de baja al personal con CI <strong>{bajaCI}</strong>?</p>
            <p className={styles.warningText}>
              Esta acción revocará su autorización para acceder al sistema.
            </p>
            
            <div className={styles.formGroup}>
              <label>Motivo de la Baja *</label>
              <textarea
                value={motivoBaja}
                onChange={(e) => setMotivoBaja(e.target.value)}
                placeholder="Describa el motivo de la baja (mín. 10 caracteres)"
                rows={3}
              />
            </div>
            
            <div className={styles.modalActions}>
              <button 
                onClick={handleDarDeBaja}
                className={styles.dangerBtn}
                disabled={loading || motivoBaja.length < 10}
              >
                {loading ? 'Procesando...' : 'Confirmar Baja'}
              </button>
              <button 
                onClick={() => {
                  setShowBajaModal(false)
                  setBajaCI(null)
                  setMotivoBaja('')
                }}
                className={styles.cancelBtn}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
