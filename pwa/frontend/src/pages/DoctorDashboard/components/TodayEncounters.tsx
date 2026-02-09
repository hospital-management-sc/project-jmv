// ==========================================
// COMPONENTE: Atenciones del Día
// ==========================================
import { useEffect, useState } from "react";
import styles from "../DoctorDashboard.module.css";
import {
  encuentrosService,
  type Encuentro,
} from "@/services/encuentros.service";
import { formatDateLongVenezuela } from "@/utils/dateUtils";
import { EncuentroDetailModal } from "@/components";
import { useAuth } from "@/contexts/AuthContext";

interface Props {}
export default function TodayEncounters({}: Props) {
  const { user } = useAuth();
  const [encuentros, setEncuentros] = useState<Encuentro[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEncuentro, setSelectedEncuentro] = useState<Encuentro | null>(
    null
  );

  useEffect(() => {
    if (user?.id) {
      cargarEncuentrosHoy();
    } else {
      // Si no hay usuario, marcar como no cargado
      setLoading(false);
    }
  }, [user?.id]);

  const cargarEncuentrosHoy = async () => {
    try {
      // Obtener encuentros solo del médico actual
      const data = await encuentrosService.obtenerHoyDelMedico(user!.id);
      setEncuentros(data);
    } catch (err) {
      console.error("Error al cargar encuentros:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      EMERGENCIA: "🚨 Emergencia",
      HOSPITALIZACION: "🛏️ Hospitalización",
      CONSULTA: "🩺 Consulta",
      OTRO: "📋 Otro",
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles.spinner}></div>
        <p>Cargando atenciones de hoy...</p>
      </div>
    );
  }

  return (
    <section className={styles["view-section"]}>
      <div className={styles["section-header"]}>
        <h2>📅 Atenciones de Hoy</h2>
        <p className={styles["section-subtitle"]}>
          {formatDateLongVenezuela(new Date())}
        </p>
      </div>

      <div className={styles["form-card"]}>
        {encuentros.length === 0 ? (
          <div className={styles["empty-state"]}>
            <span className={styles["empty-icon"]}>📋</span>
            <h3>No hay atenciones registradas hoy</h3>
            <p>Los encuentros médicos aparecerán aquí cuando se registren</p>
          </div>
        ) : (
          <>
            <div className={styles["stats-summary"]}>
              <div className={styles["stat-box"]}>
                <span className={styles["stat-number"]}>
                  {encuentros.length}
                </span>
                <span className={styles["stat-label"]}>Total atenciones</span>
              </div>
              <div className={styles["stat-box"]}>
                <span className={styles["stat-number"]}>
                  {encuentros.filter((e) => e.tipo === "EMERGENCIA").length}
                </span>
                <span className={styles["stat-label"]}>Emergencias</span>
              </div>
              <div className={styles["stat-box"]}>
                <span className={styles["stat-number"]}>
                  {encuentros.filter((e) => e.tipo === "CONSULTA").length}
                </span>
                <span className={styles["stat-label"]}>Consultas</span>
              </div>
            </div>

            <div className={styles["encounters-table"]}>
              <table>
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>Tipo</th>
                    <th>Médico</th>
                    <th>Motivo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {encuentros.map((enc) => (
                    <tr key={enc.id}>
                      <td>{enc.hora?.substring(0, 5) || "--:--"}</td>
                      <td>
                        <strong>
                          {enc.paciente?.apellidosNombres || "N/A"}
                        </strong>
                        <br />
                        <small>{enc.paciente?.ci}</small>
                      </td>
                      <td>
                        <span
                          className={`${styles["tipo-tag"]} ${
                            styles[`tipo-${enc.tipo.toLowerCase()}`]
                          }`}
                        >
                          {getTipoLabel(enc.tipo)}
                        </span>
                      </td>
                      <td>{enc.createdBy?.nombre || "N/A"}</td>
                      <td>
                        {enc.motivoConsulta?.substring(0, 50) || "N/A"}...
                      </td>
                      <td>
                        <button
                          className={styles["btn-small"]}
                          onClick={() => setSelectedEncuentro(enc)}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedEncuentro && (
        <EncuentroDetailModal
          encuentro={selectedEncuentro}
          onClose={() => setSelectedEncuentro(null)}
        />
      )}
    </section>
  );
}
