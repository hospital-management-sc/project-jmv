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
import { obtenerNombresEspecialidades } from '@/config/especialidades.config'
import styles from './SuperAdminDashboard.module.css'
import {
  IconShield, IconList, IconUserPlus, IconChartBar, IconUsers, IconCheckCircle,
  IconKey, IconClock, IconRefresh, IconPencil, IconUserX, IconTrash,
  IconCalendarClock, IconAlertCircle, IconX, IconCheck, IconSave, IconPlus,
  IconWhatsApp,
} from './icons'

// Tipos
interface PersonalAutorizado {
  id: number
  ci: string
  nombreCompleto: string
  email: string | null
  rolAutorizado: string
  departamento: string | null
  especialidad: string | null
  cargo: string | null
  telefono: string | null
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
  especialidad: string
  cargo: string
  telefono: string
  fechaIngreso: string
  fechaVencimiento: string
}

type ViewMode = 'list' | 'add' | 'edit' | 'stats'

const ROLES_DISPONIBLES = [
  { value: 'SUPER_ADMIN', label: 'Super Administrador', color: '#b3372f' },
  { value: 'ADMIN', label: 'Personal Administrativo', color: '#5b46c9' },
  { value: 'MEDICO', label: 'Médico', color: '#3a8a63' },
]

const ESTADOS_PERSONAL = [
  { value: 'ACTIVO', label: 'Activo', color: '#3a8a63' },
  { value: 'INACTIVO', label: 'Inactivo', color: '#6b7280' },
  { value: 'SUSPENDIDO', label: 'Suspendido', color: '#b8842f' },
  { value: 'BAJA', label: 'Baja', color: '#b3372f' },
]

const DEPARTAMENTOS = [
  ...obtenerNombresEspecialidades(), // Especialidades médicas desde fuente única
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
    especialidad: '',
    cargo: '',
    telefono: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
  })
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({})
  const [editingCI, setEditingCI] = useState<string | null>(null)
  
  // Modal de baja
  const [showBajaModal, setShowBajaModal] = useState(false)
  const [bajaCI, setBajaCI] = useState<string | null>(null)
  const [motivoBaja, setMotivoBaja] = useState('')

  // Modal de gestión de horarios
  const [showSchedulesModal, setShowSchedulesModal] = useState(false)
  const [selectedMedico, setSelectedMedico] = useState<PersonalAutorizado | null>(null)
  const [schedules, setSchedules] = useState<any[]>([])
  const [loadingSchedules, setLoadingSchedules] = useState(false)
  const [schedulesError, setSchedulesError] = useState<string | null>(null)
  const [schedulesSuccess, setSchedulesSuccess] = useState<string | null>(null)
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null)

  const [newSchedule, setNewSchedule] = useState({
    diaSemana: 0,
    horaInicio: '08:00',
    horaFin: '12:00',
    capacidadPorDia: 10,
    activo: true
  })

  const [editFormData, setEditFormData] = useState({
    diaSemana: 0,
    horaInicio: '08:00',
    horaFin: '12:00',
    capacidadPorDia: 10,
    activo: true
  })

  const getDayNameInSpanish = (dayNumber: number) => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    return days[dayNumber] || 'Desconocido'
  }

  // Headers con autenticación
  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  }), [])

  // Cargar horarios de un médico
  const cargarHorarios = async (usuarioId: number) => {
    setLoadingSchedules(true)
    setSchedulesError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/medicos/${usuarioId}/horarios`, {
        headers: getHeaders()
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Error al obtener horarios')
      }
      setSchedules(result.data || [])
    } catch (err: any) {
      setSchedulesError(err.message || 'Error al cargar horarios')
    } finally {
      setLoadingSchedules(false)
    }
  }

  const handleManageSchedules = (personal: PersonalAutorizado) => {
    setSelectedMedico(personal)
    setShowSchedulesModal(true)
    setSchedulesError(null)
    setSchedulesSuccess(null)
    setEditingScheduleId(null)
    if (personal.usuarioId) {
      cargarHorarios(personal.usuarioId)
    }
    setNewSchedule({
      diaSemana: 0,
      horaInicio: '08:00',
      horaFin: '12:00',
      capacidadPorDia: 10,
      activo: true
    })
  }

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMedico || !selectedMedico.usuarioId) return

    setLoadingSchedules(true)
    setSchedulesError(null)
    setSchedulesSuccess(null)

    try {
      const response = await fetch(`${API_BASE_URL}/medicos/${selectedMedico.usuarioId}/horarios`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newSchedule)
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Error al agregar horario')
      }
      setSchedulesSuccess('Horario agregado exitosamente')
      cargarHorarios(selectedMedico.usuarioId)
      setNewSchedule({
        diaSemana: 0,
        horaInicio: '08:00',
        horaFin: '12:00',
        capacidadPorDia: 10,
        activo: true
      })
      setTimeout(() => setSchedulesSuccess(null), 3000)
    } catch (err: any) {
      setSchedulesError(err.message || 'Error al guardar horario')
    } finally {
      setLoadingSchedules(false)
    }
  }

  const handleDeleteSchedule = async (horarioId: number) => {
    if (!selectedMedico || !selectedMedico.usuarioId) return
    if (!window.confirm('¿Está seguro de eliminar este horario?')) return

    setLoadingSchedules(true)
    setSchedulesError(null)
    setSchedulesSuccess(null)

    try {
      const response = await fetch(`${API_BASE_URL}/medicos/${selectedMedico.usuarioId}/horarios/${horarioId}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Error al eliminar horario')
      }
      setSchedulesSuccess('Horario eliminado exitosamente')
      cargarHorarios(selectedMedico.usuarioId)
      setTimeout(() => setSchedulesSuccess(null), 3000)
    } catch (err: any) {
      setSchedulesError(err.message || 'Error al eliminar horario')
    } finally {
      setLoadingSchedules(false)
    }
  }

  const handleToggleScheduleActive = async (horarioId: number, currentActive: boolean) => {
    if (!selectedMedico || !selectedMedico.usuarioId) return

    setLoadingSchedules(true)
    setSchedulesError(null)
    setSchedulesSuccess(null)

    try {
      const response = await fetch(`${API_BASE_URL}/medicos/${selectedMedico.usuarioId}/horarios/${horarioId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ activo: !currentActive })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Error al actualizar horario')
      }
      setSchedulesSuccess(currentActive ? 'Horario desactivado' : 'Horario activado')
      cargarHorarios(selectedMedico.usuarioId)
      setTimeout(() => setSchedulesSuccess(null), 3000)
    } catch (err: any) {
      setSchedulesError(err.message || 'Error al actualizar horario')
    } finally {
      setLoadingSchedules(false)
    }
  }

  const startEditSchedule = (horario: any) => {
    setEditingScheduleId(horario.id)
    setEditFormData({
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      capacidadPorDia: horario.capacidadPorDia,
      activo: horario.activo
    })
  }

  const handleSaveEditSchedule = async (horarioId: number) => {
    if (!selectedMedico || !selectedMedico.usuarioId) return

    setLoadingSchedules(true)
    setSchedulesError(null)
    setSchedulesSuccess(null)

    try {
      const response = await fetch(`${API_BASE_URL}/medicos/${selectedMedico.usuarioId}/horarios/${horarioId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(editFormData)
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Error al guardar cambios')
      }
      setSchedulesSuccess('Horario actualizado exitosamente')
      setEditingScheduleId(null)
      cargarHorarios(selectedMedico.usuarioId)
      setTimeout(() => setSchedulesSuccess(null), 3000)
    } catch (err: any) {
      setSchedulesError(err.message || 'Error al guardar cambios')
    } finally {
      setLoadingSchedules(false)
    }
  }

  // Cargar datos
  const cargarPersonal = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filtroEstado) params.append('estado', filtroEstado)
      if (filtroRol) params.append('rol', filtroRol)
      if (filtroRegistrado) params.append('registrado', filtroRegistrado)
      
      params.append('_t', Date.now().toString())
      const url = `${API_BASE_URL}/authorized-personnel?${params}`
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
      // Error loading stats
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
      
      // Actualizar el state local inmediatamente con el dato devuelto por la API
      // para no depender de la latencia del re-fetch
      if (editingCI) {
        setPersonalList(prev => prev.map(p => p.ci === editingCI ? { ...p, ...result.data } : p))
      } else {
        setPersonalList(prev => [...prev, result.data])
      }

      // Limpiar y volver a lista
      setFormData({
        ci: '',
        nombreCompleto: '',
        email: '',
        rolAutorizado: '',
        departamento: '',
        especialidad: '',
        cargo: '',
        telefono: '',
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
      especialidad: personal.especialidad || '',
      cargo: personal.cargo || '',
      telefono: personal.telefono || '',
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

  // Eliminar permanentemente (solo registros en estado BAJA)
  const handleEliminarPermanente = async (ci: string, nombre: string) => {
    if (!window.confirm(`¿Eliminar permanentemente a "${nombre}" de la whitelist?\n\nEsta acción no se puede deshacer.`)) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/authorized-personnel/permanente/${ci}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Error al eliminar')

      setPersonalList(prev => prev.filter(p => p.ci !== ci))
      setSuccessMessage('Registro eliminado permanentemente de la whitelist')
      setTimeout(() => setSuccessMessage(null), 3000)
      cargarStats()
    } catch (err: any) {
      setError(err.message || 'Error al eliminar')
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
          <div className={styles.headerTitle}>
            <IconShield size={26} className={styles.headerIcon} />
            <div>
              <h1>Panel de Super Administrador</h1>
              <p className={styles.subtitle}>Gestión de Personal Autorizado (Whitelist)</p>
            </div>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.nombre}</span>
            <span className={styles.userRole}>SUPER_ADMIN</span>
          </div>
        </div>

        {/* Navegación */}
        <nav className={styles.nav}>
        <button
          className={`${styles.navBtn} ${viewMode === 'list' ? styles.active : ''}`}
          onClick={() => { setViewMode('list'); setEditingCI(null); }}
        >
          <IconList size={16} /> Lista de Personal
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
              especialidad: '',
              cargo: '',
              telefono: '',
              fechaIngreso: new Date().toISOString().split('T')[0],
              fechaVencimiento: '',
            });
            setFormErrors({});
          }}
        >
          <IconUserPlus size={16} /> Agregar Personal
        </button>
        <button
          className={`${styles.navBtn} ${viewMode === 'stats' ? styles.active : ''}`}
          onClick={() => setViewMode('stats')}
        >
          <IconChartBar size={16} /> Estadísticas
        </button>
        </nav>
      </header>

      {/* Mensajes */}
      {(error || successMessage) && (
        <div className={styles.alertWrapper}>
          {error && (
            <div className={styles.errorAlert}>
              <IconAlertCircle size={18} />
              <p>{error}</p>
              <button onClick={() => setError(null)}><IconX size={16} /></button>
            </div>
          )}

          {successMessage && (
            <div className={styles.successAlert}>
              <IconCheck size={18} />
              <p>{successMessage}</p>
            </div>
          )}
        </div>
      )}

      <main className={styles.main}>
        {/* Vista: Estadísticas */}
        {viewMode === 'stats' && stats && (
          <section className={styles.statsSection}>
            <h2>Estadísticas de la Whitelist</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><IconUsers size={22} /></div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.total}</span>
                  <span className={styles.statLabel}>Total Personal</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><IconCheckCircle size={22} /></div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.activos}</span>
                  <span className={styles.statLabel}>Activos</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><IconKey size={22} /></div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.registrados}</span>
                  <span className={styles.statLabel}>Con Cuenta</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><IconClock size={22} /></div>
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
                <IconRefresh size={15} /> Actualizar
              </button>
            </div>

            {/* Tabla */}
            {loading ? (
              <div className={styles.loading}>
                <div className="spinner" aria-hidden="true" />
                <p className="loading-text">Cargando...</p>
              </div>
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
                      <th>Teléfono</th>
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
                            {personal.especialidad && (
                              <span className={styles.email} style={{ color: '#3a8a63', fontStyle: 'italic' }}>{personal.especialidad}</span>
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
                        <td>{personal.telefono || '-'}</td>
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
                              <IconCheck size={13} /> Registrado
                              <small>{formatDate(personal.fechaRegistro)}</small>
                            </span>
                          ) : (
                            <span className={styles.pendiente}><IconClock size={13} /> Pendiente</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              onClick={() => handleEditar(personal)}
                              className={styles.editBtn}
                              title="Editar"
                            >
                              <IconPencil size={15} />
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
                                <IconUserX size={15} />
                              </button>
                            )}
                            {personal.estado === 'BAJA' && (
                              <button
                                onClick={() => handleEliminarPermanente(personal.ci, personal.nombreCompleto)}
                                className={styles.deleteBtnStrong}
                                title="Eliminar permanentemente de la whitelist"
                              >
                                <IconTrash size={15} />
                              </button>
                            )}
                            {personal.rolAutorizado === 'MEDICO' && personal.registrado && personal.usuarioId && (
                              <button
                                onClick={() => handleManageSchedules(personal)}
                                className={styles.scheduleBtn}
                                title="Gestionar Horarios"
                              >
                                <IconCalendarClock size={15} />
                              </button>
                            )}
                            {personal.telefono && (
                              <a
                                href={`https://wa.me/${personal.telefono.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.whatsappBtn}
                                title={`WhatsApp: ${personal.telefono}`}
                              >
                                <IconWhatsApp size={15} />
                              </a>
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
            <h2 className={styles.sectionTitle}>
              {editingCI ? <IconPencil size={20} /> : <IconUserPlus size={20} />}
              {editingCI ? 'Editar Personal Autorizado' : 'Agregar Personal Autorizado'}
            </h2>
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

                {formData.rolAutorizado === 'MEDICO' && (
                  <div className={styles.formGroup}>
                    <label>Especialidad Médica</label>
                    <select
                      value={formData.especialidad}
                      onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                    >
                      <option value="">Seleccione especialidad...</option>
                      {obtenerNombresEspecialidades().map(esp => (
                        <option key={esp} value={esp}>{esp}</option>
                      ))}
                    </select>
                    <small className={styles.fieldHint}>Requerida para que el médico aparezca en interconsultas</small>
                  </div>
                )}

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
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Ej: 0412-4751675"
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
            <h3 className={styles.sectionTitle}><IconUserX size={19} /> Dar de Baja</h3>
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

      {/* Modal de Gestión de Horarios */}
      {showSchedulesModal && selectedMedico && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.schedulesModal}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.sectionTitle}><IconCalendarClock size={19} /> Horarios de Atención</h3>
              <button
                onClick={() => {
                  setShowSchedulesModal(false)
                  setSelectedMedico(null)
                  setSchedules([])
                  setEditingScheduleId(null)
                }}
                className={styles.closeModalBtn}
                title="Cerrar"
              >
                <IconX size={20} />
              </button>
            </div>
            <p className={styles.medicoName}>
              Médico: <strong>{selectedMedico.nombreCompleto}</strong> | Especialidad: <strong>{selectedMedico.departamento || 'No asignada'}</strong>
            </p>

            {/* Mensajes del Modal */}
            {schedulesError && (
              <div className={styles.modalError}>
                <IconAlertCircle size={16} />
                <p>{schedulesError}</p>
              </div>
            )}
            {schedulesSuccess && (
              <div className={styles.modalSuccess}>
                <IconCheck size={16} />
                <p>{schedulesSuccess}</p>
              </div>
            )}

            {/* Listado de horarios */}
            <div className={styles.schedulesListSection}>
              <h4>Horarios Semanales Configurados</h4>
              {loadingSchedules && schedules.length === 0 ? (
                <div className={styles.modalLoading}>
                  <div className="spinner" aria-hidden="true" />
                  <p>Cargando horarios...</p>
                </div>
              ) : schedules.length === 0 ? (
                <p className={styles.noSchedules}>No hay horarios configurados para este médico.</p>
              ) : (
                <div className={styles.modalTableContainer}>
                  <table className={styles.modalTable}>
                    <thead>
                      <tr>
                        <th>Día</th>
                        <th>Horario</th>
                        <th>Capacidad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((horario) => {
                        const isEditing = editingScheduleId === horario.id;
                        return (
                          <tr key={horario.id} className={!horario.activo ? styles.inactiveRow : ''}>
                            <td>
                              {isEditing ? (
                                <select
                                  value={editFormData.diaSemana}
                                  onChange={(e) => setEditFormData({ ...editFormData, diaSemana: Number(e.target.value) })}
                                  className={styles.modalSelect}
                                >
                                  <option value={0}>Lunes</option>
                                  <option value={1}>Martes</option>
                                  <option value={2}>Miércoles</option>
                                  <option value={3}>Jueves</option>
                                  <option value={4}>Viernes</option>
                                  <option value={5}>Sábado</option>
                                  <option value={6}>Domingo</option>
                                </select>
                              ) : (
                                getDayNameInSpanish(horario.diaSemana)
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <div className={styles.timeInputsInline}>
                                  <input
                                    type="text"
                                    value={editFormData.horaInicio}
                                    onChange={(e) => setEditFormData({ ...editFormData, horaInicio: e.target.value })}
                                    placeholder="HH:MM"
                                    maxLength={5}
                                    className={styles.modalTimeInput}
                                  />
                                  <span>a</span>
                                  <input
                                    type="text"
                                    value={editFormData.horaFin}
                                    onChange={(e) => setEditFormData({ ...editFormData, horaFin: e.target.value })}
                                    placeholder="HH:MM"
                                    maxLength={5}
                                    className={styles.modalTimeInput}
                                  />
                                </div>
                              ) : (
                                `${horario.horaInicio} - ${horario.horaFin}`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editFormData.capacidadPorDia}
                                  onChange={(e) => setEditFormData({ ...editFormData, capacidadPorDia: Number(e.target.value) })}
                                  min={1}
                                  className={styles.modalNumberInput}
                                />
                              ) : (
                                horario.capacidadPorDia
                              )}
                            </td>
                            <td>
                              <span 
                                className={horario.activo ? styles.activeBadge : styles.inactiveBadge}
                                onClick={() => !isEditing && handleToggleScheduleActive(horario.id, horario.activo)}
                                style={{ cursor: isEditing ? 'default' : 'pointer' }}
                                title={isEditing ? '' : 'Haz clic para alternar'}
                              >
                                {horario.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <div className={styles.modalActions}>
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => handleSaveEditSchedule(horario.id)}
                                      className={styles.saveInlineBtn}
                                      title="Guardar"
                                      disabled={loadingSchedules}
                                    >
                                      <IconSave size={15} />
                                    </button>
                                    <button
                                      onClick={() => setEditingScheduleId(null)}
                                      className={styles.cancelInlineBtn}
                                      title="Cancelar"
                                      disabled={loadingSchedules}
                                    >
                                      <IconX size={15} />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => startEditSchedule(horario)}
                                      className={styles.editInlineBtn}
                                      title="Editar horario"
                                      disabled={loadingSchedules}
                                    >
                                      <IconPencil size={15} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSchedule(horario.id)}
                                      className={styles.deleteInlineBtn}
                                      title="Eliminar horario"
                                      disabled={loadingSchedules}
                                    >
                                      <IconTrash size={15} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Formulario para agregar horario */}
            <form onSubmit={handleAddSchedule} className={styles.addScheduleForm}>
              <h4>Agregar Nuevo Horario</h4>
              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <label>Día</label>
                  <select
                    value={newSchedule.diaSemana}
                    onChange={(e) => setNewSchedule({ ...newSchedule, diaSemana: Number(e.target.value) })}
                    className={styles.modalSelect}
                  >
                    <option value={0}>Lunes</option>
                    <option value={1}>Martes</option>
                    <option value={2}>Miércoles</option>
                    <option value={3}>Jueves</option>
                    <option value={4}>Viernes</option>
                    <option value={5}>Sábado</option>
                    <option value={6}>Domingo</option>
                  </select>
                </div>
                <div className={styles.formCol}>
                  <label>Desde</label>
                  <input
                    type="text"
                    value={newSchedule.horaInicio}
                    onChange={(e) => setNewSchedule({ ...newSchedule, horaInicio: e.target.value })}
                    placeholder="08:00"
                    maxLength={5}
                    className={styles.modalTimeInput}
                    required
                  />
                </div>
                <div className={styles.formCol}>
                  <label>Hasta</label>
                  <input
                    type="text"
                    value={newSchedule.horaFin}
                    onChange={(e) => setNewSchedule({ ...newSchedule, horaFin: e.target.value })}
                    placeholder="12:00"
                    maxLength={5}
                    className={styles.modalTimeInput}
                    required
                  />
                </div>
                <div className={styles.formCol}>
                  <label>Capacidad</label>
                  <input
                    type="number"
                    value={newSchedule.capacidadPorDia}
                    onChange={(e) => setNewSchedule({ ...newSchedule, capacidadPorDia: Number(e.target.value) })}
                    min={1}
                    className={styles.modalNumberInput}
                    required
                  />
                </div>
                <div className={styles.formColBtn}>
                  <button type="submit" className={styles.addBtn} disabled={loadingSchedules}>
                    <IconPlus size={14} /> Agregar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
