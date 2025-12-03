import type { ViewMode } from "../interfaces";
import styles from "../DoctorDashboard.module.css";

interface Props {
  onClick: (view: ViewMode) => void;
}

export default function DashboardActions({ onClick }: Props) {
  return (
    <section className={styles["management-section"]}>
      <h2>Acciones Clínicas</h2>
      <div className={styles["action-grid"]}>
        <button
          className={styles["action-btn"]}
          onClick={() => onClick("register-encounter")}
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <div className={styles["btn-content"]}>
            <span className={styles["btn-title"]}>Registrar Encuentro</span>
            <span className={styles["btn-description"]}>
              Documente consultas, emergencias y evoluciones
            </span>
          </div>
        </button>

        <button
          className={styles["action-btn"]}
          onClick={() => onClick("hospitalized-patients")}
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
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <div className={styles["btn-content"]}>
            <span className={styles["btn-title"]}>
              Pacientes Hospitalizados
            </span>
            <span className={styles["btn-description"]}>
              Visualice pacientes actualmente internados
            </span>
          </div>
        </button>

        <button
          className={styles["action-btn"]}
          onClick={() => onClick("today-encounters")}
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M8 14h.01M12 14h.01M16 14h.01" />
          </svg>
          <div className={styles["btn-content"]}>
            <span className={styles["btn-title"]}>Atenciones del Día</span>
            <span className={styles["btn-description"]}>
              Revise los encuentros registrados hoy
            </span>
          </div>
        </button>

        <button
          className={styles["action-btn"]}
          onClick={() => onClick("search-patient")}
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <div className={styles["btn-content"]}>
            <span className={styles["btn-title"]}>Buscar Paciente</span>
            <span className={styles["btn-description"]}>
              Consulte historia clínica y antecedentes
            </span>
          </div>
        </button>

        <button
          className={styles["action-btn"]}
          onClick={() => onClick("my-appointments")}
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div className={styles["btn-content"]}>
            <span className={styles["btn-title"]}>Mis Citas</span>
            <span className={styles["btn-description"]}>
              Gestione sus citas programadas
            </span>
          </div>
        </button>

        <button
          className={styles["action-btn"]}
          onClick={() => onClick("interconsultas")}
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M20 8v6" />
            <path d="M23 11h-6" />
          </svg>
          <div className={styles["btn-content"]}>
            <span className={styles["btn-title"]}>Interconsultas</span>
            <span className={styles["btn-description"]}>
              Solicite o responda consultas entre especialidades
            </span>
          </div>
        </button>

        <button
          className={styles["action-btn"]}
          onClick={() => alert("Próximamente: Registrar Alta Médica")}
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
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <div className={styles["btn-content"]}>
            <span className={styles["btn-title"]}>Registrar Alta</span>
            <span className={styles["btn-description"]}>
              Procese altas médicas de pacientes
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
