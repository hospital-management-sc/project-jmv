/**
 * EJEMPLO PRÁCTICO: Implementar componente DashboardActions actualizado
 * 
 * Este archivo muestra cómo actualizar el componente DashboardActions
 * para usar las especialidades personalizadas.
 */

import { useState } from 'react'
import type { ViewMode } from '@/pages/DoctorDashboard/interfaces'
import { useDashboardEspecializado } from '@/contexts/DashboardEspecializadoContext'

interface DashboardActionsProps {
  onClick: (mode: ViewMode) => void
}

/**
 * Componente actualizado con opciones dinámicas por especialidad
 */
export function DashboardActionsExample({ onClick }: DashboardActionsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Hook para obtener config de especialidad
  const { nombre, especialidad, opcionesEspeciales } = useDashboardEspecializado()

  // Definir acciones disponibles por opción especial
  const accionesEspeciales: Record<string, { label: string; icon: string; action: ViewMode }> = {
    'cirugia-reparadora': { label: 'Reporte Quirúrgico', icon: '🏥', action: 'search-patient' },
    'control-prenatal': { label: 'Control Prenatal', icon: '🤰', action: 'search-patient' },
    'rehabilitacion': { label: 'Sesión de Rehabilitación', icon: '💪', action: 'search-patient' },
    'evaluacion-psicologica': { label: 'Evaluación Psicológica', icon: '🧠', action: 'search-patient' },
    'espirometria': { label: 'Espirometría', icon: '💨', action: 'search-patient' },
    'biopsia': { label: 'Solicitar Biopsia', icon: '🔬', action: 'search-patient' },
    'consulta': { label: 'Consulta General', icon: '👥', action: 'search-patient' },
    'seguimiento': { label: 'Seguimiento de Paciente', icon: '📋', action: 'search-patient' },
  }

  // Acciones básicas (siempre disponibles)
  const accionesBasicas = [
    { label: 'Buscar Paciente', icon: '🔍', mode: 'search-patient' as ViewMode },
    { label: 'Pacientes Hospitalizados', icon: '🏥', mode: 'hospitalized-patients' as ViewMode },
    { label: 'Encuentros de Hoy', icon: '📅', mode: 'today-encounters' as ViewMode },
    { label: 'Mis Citas', icon: '📆', mode: 'my-appointments' as ViewMode },
  ]

  // Filtrar acciones especiales que apliquen a esta especialidad
  const accionesDisponibles = Object.entries(accionesEspeciales)
    .filter(([clave]) => opcionesEspeciales.includes(clave))
    .map(([_, config]) => config)

  return (
    <section style={{ padding: '2rem', marginBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>🎯 Panel de Acciones</h2>
        <p>
          Especialidad: <strong>{nombre}</strong>
          {especialidad?.color && (
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: especialidad.color,
                marginLeft: '0.5rem',
                verticalAlign: 'middle',
              }}
            />
          )}
        </p>
      </div>

      {/* Acciones Básicas */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Acciones Generales</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {accionesBasicas.map((accion) => (
            <button
              key={accion.mode}
              onClick={() => onClick(accion.mode)}
              title={accion.label}
              style={{
                padding: '1rem',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>{accion.icon}</div>
              <div>{accion.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Acciones Especializadas */}
      {accionesDisponibles.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() =>
              setExpandedSection(expandedSection === 'specialized' ? null : 'specialized')
            }
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            <span>{expandedSection === 'specialized' ? '▼' : '▶'}</span> Opciones de {nombre}
          </button>

          {expandedSection === 'specialized' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {accionesDisponibles.map((accion) => (
                <button
                  key={accion.label}
                  onClick={() => onClick(accion.action)}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f9f9f9',
                    border: `2px solid ${especialidad?.color}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  title={accion.label}
                >
                  <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>{accion.icon}</div>
                  <div>{accion.label}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Información de Especialidad */}
      {especialidad?.descripcion && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: `${especialidad.color}15`,
            borderLeft: `4px solid ${especialidad.color}`,
            borderRadius: '4px',
          }}
        >
          <h4>Acerca de {nombre}</h4>
          <p>{especialidad.descripcion}</p>
        </div>
      )}
    </section>
  )
}

/**
 * NOTA SOBRE INTEGRACIÓN:
 * 
 * Este componente necesita estar dentro del DashboardEspecializadoProvider
 * para que funcione correctamente. En tu router:
 * 
 * <DashboardEspecializadoProvider>
 *   <DoctorDashboard />
 * </DashboardEspecializadoProvider>
 * 
 * Luego puedes importar y usar este componente en DoctorDashboard:
 * 
 * import { DashboardActionsExample } from '@/components/examples/DashboardActionsExample'
 * 
 * Y en tu JSX:
 * 
 * <DashboardActionsExample onClick={setViewMode} />
 */

export default DashboardActionsExample
