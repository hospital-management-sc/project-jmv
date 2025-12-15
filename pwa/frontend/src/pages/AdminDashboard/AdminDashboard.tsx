/**
 * Dashboard para Personal Administrativo
 * Vista especializada para gestión administrativa y control de usuarios
 * 
 * REFACTORIZADO: Los componentes principales han sido extraídos a archivos separados
 * para mejorar la mantenibilidad y testabilidad del código.
 * 
 * Componentes extraídos:
 * - RegisterPatientForm: Formulario de registro de pacientes
 * - CreateAppointmentForm: Formulario de creación de citas
 * - SearchPatientView: Vista de búsqueda de pacientes
 * - PatientHistoryView: Vista de historia clínica completa
 */

import { useState } from 'react'
import styles from './AdminDashboard.module.css'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import RegistrarAdmision from '@/components/RegistrarAdmision'
import PacientesHospitalizados from '@/components/PacientesHospitalizados'
import PacientesEnEmergencia from '@/components/PacientesEnEmergencia'

// Componentes modulares extraídos
import {
  RegisterPatientForm,
  CreateAppointmentForm,
  SearchPatientView,
  PatientHistoryView,
  EmergenciasPendientes,
} from './components'

type ViewMode = 'main' | 'register-patient' | 'create-appointment' | 'search-patient' | 'register-admission' | 'patient-history' | 'hospitalized-patients' | 'emergencias-pendientes' | 'pacientes-emergencia'

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
        <div className={styles.card}>
          <h2>🏥 Pacientes Hospitalizados</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats?.pacientesHospitalizados ?? 0}
          </div>
        </div>
        <div className={styles.card}>
          <h2>🚨 Pacientes en Emergencia</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats?.pacientesEnEmergencia ?? 0}
          </div>
        </div>
        <div className={styles.card} style={{ background: 'linear-gradient(135deg, var(--color-warning) 0%, rgba(217, 119, 6, 0.9) 100%)' }}>
          <h2>⚠️ Emergencias Pendientes</h2>
          <div className={styles['stat-value']}>
            {loading ? '...' : stats?.emergenciasPendientesHospitalizacion ?? 0}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'white', marginTop: '0.5rem', opacity: 0.9 }}>
            Pacientes requieren asignación de cama
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
              <span className={styles['btn-title']}>🏥 Nueva Admisión de Hospitalización</span>
              <span className={styles['btn-description']}>Asigne cama y servicio para pacientes que requieren hospitalización</span>
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
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('emergencias-pendientes')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>🚨 Emergencias Pendientes de Hospitalización</span>
              <span className={styles['btn-description']}>Asigne cama a pacientes de emergencia que requieren hospitalización</span>
            </div>
          </button>
          <button 
            className={styles['admin-btn']}
            onClick={() => setViewMode('pacientes-emergencia')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <div className={styles['btn-content']}>
              <span className={styles['btn-title']}>📊 Pacientes en Emergencia Actualmente</span>
              <span className={styles['btn-description']}>Monitoree pacientes en atención de emergencia</span>
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
        {viewMode === 'emergencias-pendientes' && <EmergenciasPendientes onBack={() => setViewMode('main')} />}
        {viewMode === 'pacientes-emergencia' && <PacientesEnEmergencia onBack={() => setViewMode('main')} />}
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
