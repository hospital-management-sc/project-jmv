// ==========================================
// COMPONENTE: Pacientes Hospitalizados
// ==========================================

import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../DoctorDashboard.module.css";
import admisionesService, {
  type Admision,
} from "@/services/admisiones.service";
import { formatDateVenezuela } from "@/utils/dateUtils";
import { SERVICIOS } from "@/constants";

interface Props {}

export default function HospitalizedPatientsView({}: Props) {
  const navigate = useNavigate();
  const [admisiones, setAdmisiones] = useState<Admision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [servicioFiltro, setServicioFiltro] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Debounce para evitar solicitudes repetidas (429 Too Many Requests)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Usar debounce para evitar llamadas repetidas al cambiar filtro
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      cargarPacientes();
    }, 500); // Esperar 500ms antes de hacer la solicitud
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [servicioFiltro]);

  const cargarPacientes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters: { servicio?: string } = {};
      if (servicioFiltro) filters.servicio = servicioFiltro;
      const response = await admisionesService.listarAdmisionesActivas(filters);
      setAdmisiones(response.admisiones);
    } catch (err: unknown) {
      let errorMessage = "Error al cargar pacientes";
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Si es error de token, mostrar mensaje más específico
        if (err.message.includes("401") || err.message.includes("Token is invalid")) {
          errorMessage = "❌ Sesión expirada. Por favor, inicie sesión nuevamente.";
        }
        // Manejar error 429 específicamente
        else if (errorMessage.includes("429") || errorMessage.includes("Too Many Requests")) {
          errorMessage = "⏳ Demasiadas solicitudes. Por favor, intente nuevamente en unos momentos.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [servicioFiltro]);

  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return "N/A";
    const hoy = new Date();
    const nac = new Date(fechaNac);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return `${edad} años`;
  };

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles.spinner}></div>
        <p>Cargando pacientes hospitalizados...</p>
      </div>
    );
  }

  return (
    <section className={styles["view-section"]}>
      <div className={styles["section-header"]}>
        <h2>🏥 Pacientes Hospitalizados Actualmente</h2>
        <p className={styles["section-subtitle"]}>
          Gestione la atención de pacientes internados
        </p>
      </div>

      <div className={styles["filters-bar"]}>
        <div className={styles["filter-group"]}>
          <label>Servicio:</label>
          <select
            value={servicioFiltro}
            onChange={(e) => setServicioFiltro(e.target.value)}
          >
            {SERVICIOS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <button onClick={cargarPacientes} className={styles["refresh-btn"]}>
          🔄 Actualizar
        </button>
      </div>

      {error && <div className={styles["error-alert"]}>{error}</div>}

      {admisiones.length === 0 ? (
        <div className={styles["empty-state"]}>
          <span className={styles["empty-icon"]}>🛏️</span>
          <h3>No hay pacientes hospitalizados</h3>
          <p>
            No se encontraron admisiones activas con los filtros seleccionados
          </p>
        </div>
      ) : (
        <div className={styles["patients-grid"]}>
          {admisiones.map((admision) => (
            <div
              key={admision.id}
              className={`${styles["patient-card"]} ${
                expandedId === admision.id ? styles.expanded : ""
              }`}
            >
              <div className={styles["card-header"]}>
                <div className={styles["patient-info"]}>
                  <h3>{admision.paciente?.apellidosNombres || "N/A"}</h3>
                  <span className={styles["historia-badge"]}>
                    HC: {admision.paciente?.nroHistoria || "N/A"}
                  </span>
                </div>
                <span
                  className={`${styles["tipo-badge"]} ${
                    admision.tipo === "EMERGENCIA"
                      ? styles["tipo-emergencia"]
                      : admision.tipo === "UCI"
                      ? styles["tipo-uci"]
                      : styles["tipo-hospitalizacion"]
                  }`}
                >
                  {admision.tipo === "EMERGENCIA"
                    ? "🚨"
                    : admision.tipo === "UCI"
                    ? "🏥"
                    : "🛏️"}{" "}
                  {admision.tipo}
                </span>
              </div>

              <div className={styles["card-body"]}>
                <div className={styles["info-row"]}>
                  <span>
                    <strong>CI:</strong> {admision.paciente?.ci}
                  </span>
                  <span>
                    <strong>Edad:</strong>{" "}
                    {calcularEdad(admision.paciente?.fechaNacimiento)}
                  </span>
                </div>
                <div className={styles["info-row"]}>
                  <span>
                    <strong>Servicio:</strong>{" "}
                    {admision.servicio?.replace(/_/g, " ") || "N/A"}
                  </span>
                  <span>
                    <strong>Cama:</strong> {admision.habitacion || "-"} /{" "}
                    {admision.cama || "-"}
                  </span>
                </div>
                <div className={styles["info-row"]}>
                  <span>
                    <strong>Días hosp.:</strong>{" "}
                    <span className={styles["dias-badge"]}>
                      {admision.diasHospitalizacion || 0}
                    </span>
                  </span>
                </div>
              </div>

              <div className={styles["card-actions"]}>
                <button
                  className={styles["action-btn-primary"]}
                  onClick={() => navigate(`/doctor/paciente/${admision.id}/formato`)}
                  title="Ir al Formato de Hospitalización"
                >
                  📝 Evolución
                </button>
                <button
                  className={styles["action-btn-secondary"]}
                  onClick={() =>
                    setExpandedId(
                      expandedId === admision.id ? null : admision.id
                    )
                  }
                >
                  {expandedId === admision.id ? "▲ Menos" : "▼ Más"}
                </button>
              </div>

              {expandedId === admision.id && (
                <div className={styles["card-expanded"]}>
                  <div className={styles["expanded-info"]}>
                    <p>
                      <strong>Forma ingreso:</strong>{" "}
                      {admision.formaIngreso || "N/A"}
                    </p>
                    <p>
                      <strong>Fecha ingreso:</strong>{" "}
                      {formatDateVenezuela(admision.fechaAdmision)}
                    </p>
                    {admision.observaciones && (
                      <p>
                        <strong>Observaciones:</strong> {admision.observaciones}
                      </p>
                    )}
                  </div>
                  <div className={styles["expanded-actions"]}>
                    <button
                      className={styles["action-btn-secondary"]}
                      onClick={() =>
                        alert("Próximamente: Ver Historia Completa")
                      }
                    >
                      📋 Historia Clínica
                    </button>
                    <button
                      className={styles["action-btn-secondary"]}
                      onClick={() => alert("Próximamente: Registrar Alta")}
                    >
                      ✅ Alta Médica
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles["section-footer"]}>
        <span>📊 Total: {admisiones.length} pacientes hospitalizados</span>
      </div>
    </section>
  );
}
