import type { ViewMode } from "../interfaces";
import styles from "../DoctorDashboard.module.css";
import { useEspecialidad } from "@/hooks/useEspecialidad";

interface Props {
  onClick: (view: ViewMode) => void;
}

interface AccionConfig {
  id: string;
  titulo: string;
  descripcion: string;
  view: ViewMode;
  icono: React.ReactNode;
  estilo?: React.CSSProperties;
}

const ACCIONES_DISPONIBLES: Record<string, AccionConfig> = {
  'registrar-emergency': {
    id: 'registrar-emergency',
    titulo: '🚨 Nuevo Paciente en Emergencia',
    descripcion: 'Atención inmediata 24/7 - Buscar o registrar paciente',
    view: 'register-emergency',
    icono: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    estilo: { background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' },
  },
  'registrar-encuentro': {
    id: 'registrar-encuentro',
    titulo: 'Registrar Encuentro',
    descripcion: 'Documente consultas y evoluciones',
    view: 'register-encounter',
    icono: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </>
    ),
  },
  'hospitalized-patients': {
    id: 'hospitalized-patients',
    titulo: 'Pacientes Hospitalizados',
    descripcion: 'Visualice pacientes actualmente internados',
    view: 'hospitalized-patients',
    icono: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  'pacientes-emergencia': {
    id: 'pacientes-emergencia',
    titulo: '📊 Pacientes en Emergencia',
    descripcion: 'Monitoree pacientes en atención de emergencia',
    view: 'pacientes-emergencia',
    icono: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    estilo: { background: 'linear-gradient(135deg, var(--color-warning) 0%, rgba(245, 158, 11, 0.8) 100%)' },
  },
  'search-patient': {
    id: 'search-patient',
    titulo: 'Buscar Paciente',
    descripcion: 'Consulte historia clínica y antecedentes',
    view: 'search-patient',
    icono: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
  },
  'my-appointments': {
    id: 'my-appointments',
    titulo: 'Mis Citas',
    descripcion: 'Gestione sus citas programadas',
    view: 'my-appointments',
    icono: (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),
  },
  'interconsultas': {
    id: 'interconsultas',
    titulo: 'Interconsultas',
    descripcion: 'Solicite o responda consultas entre especialidades',
    view: 'interconsultas',
    icono: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="M20 8v6" />
        <path d="M23 11h-6" />
      </>
    ),
  },
  'registrar-alta': {
    id: 'registrar-alta',
    titulo: 'Registrar Alta',
    descripcion: 'Procese altas médicas de pacientes',
    view: 'registrar-alta',
    icono: (
      <>
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  'today-encounters': {
    id: 'today-encounters',
    titulo: 'Atenciones del Día',
    descripcion: 'Revise los encuentros registrados hoy',
    view: 'today-encounters',
    icono: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01" />
      </>
    ),
  }
};

function AccionButton({
  config,
  onClick,
}: {
  config: AccionConfig;
  onClick: () => void;
}) {
  return (
    <button
      className={styles["action-btn"]}
      onClick={onClick}
      style={config.estilo}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {config.icono}
      </svg>
      <div className={styles["btn-content"]}>
        <span className={styles["btn-title"]}>{config.titulo}</span>
        <span className={styles["btn-description"]}>
          {config.descripcion}
        </span>
      </div>
    </button>
  );
}

export default function DashboardActions({ onClick }: Props) {
  const { nombre, vistaDashboard } = useEspecialidad();

  // Si no hay configuración de vista, mostrar todas las acciones
  let accionesAMostrar = vistaDashboard?.acciones || 
    ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 
      'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta', 'today-encounters'];

  // Garantizar que 'today-encounters' sea la última acción
  accionesAMostrar = accionesAMostrar.filter(id => id !== 'today-encounters');
  accionesAMostrar.push('today-encounters');

  return (
    <section className={styles["management-section"]}>
      <h2>Acciones Clínicas {nombre && `- ${nombre}`}</h2>
      <div className={styles["action-grid"]}>
        {accionesAMostrar.map((accionId) => {
          const accion = ACCIONES_DISPONIBLES[accionId];
          if (!accion) return null;

          return (
            <AccionButton
              key={accionId}
              config={accion}
              onClick={() => onClick(accion.view)}
            />
          );
        })}
      </div>
    </section>
  );
}
