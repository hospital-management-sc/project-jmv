// ==========================================
// COMPONENTE: Historia del Paciente
// ==========================================
import { useEffect, useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { PatientBasic } from "../interfaces";
import {
  encuentrosService,
  type Encuentro,
} from "@/services/encuentros.service";
import { EncuentroDetailModal, EncuentrosList } from "@/components";
import type { Admision } from "@/services";
import { formatDateVenezuela } from "@/utils/dateUtils";

interface Props {
  patient: PatientBasic;
  onBack: () => void;
}

export default function PatientHistoryView({ patient, onBack }: Props) {
  const [encuentros, setEncuentros] = useState<Encuentro[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEncuentro, setSelectedEncuentro] = useState<Encuentro | null>(
    null
  );

  useEffect(() => {
    cargarEncuentros();
  }, [patient?.id]);

  const cargarEncuentros = async () => {
    try {
      const data = await encuentrosService.obtenerPorPaciente(patient.id);
      setEncuentros(data);
    } catch (err) {
      console.error("Error al cargar encuentros:", err);
    } finally {
      setLoading(false);
    }
  };

  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return "N/A";
    const hoy = new Date();
    const nac = new Date(fechaNac);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return `${edad} años`;
  };

  return (
    <section className={styles["view-section"]}>
      <div className={styles["section-header"]}>
        <h2>📋 Historia Clínica</h2>
        <button className={styles["back-link"]} onClick={onBack}>
          ← Volver a búsqueda
        </button>
      </div>

      {/* Datos del Paciente */}
      <div className={styles["patient-header-card"]}>
        <div className={styles["patient-main-info"]}>
          <h3>{patient.apellidosNombres}</h3>
          <div className={styles.badges}>
            <span className={styles["historia-badge"]}>
              HC: {patient.nroHistoria}
            </span>
            <span className={styles["ci-badge"]}>CI: {patient.ci}</span>
          </div>
        </div>
        <div className={styles["patient-details-grid"]}>
          <span>
            <strong>Edad:</strong> {calcularEdad(patient.fechaNacimiento)}
          </span>
          <span>
            <strong>Sexo:</strong>{" "}
            {patient.sexo === "M" ? "♂ Masculino" : "♀ Femenino"}
          </span>
          <span>
            <strong>Teléfono:</strong> {patient.telefono || "N/A"}
          </span>
          <span>
            <strong>Dirección:</strong> {patient.direccion || "N/A"}
          </span>
        </div>

        {/* Datos Militares si existen */}
        {patient.personalMilitar && (
          <div className={styles["military-info"]}>
            <h4>🎖️ Datos Militares</h4>
            <div className={styles["military-grid"]}>
              <span>
                <strong>Grado:</strong> {patient.personalMilitar.grado || "N/A"}
              </span>
              <span>
                <strong>Componente:</strong>{" "}
                {patient.personalMilitar.componente || "N/A"}
              </span>
              <span>
                <strong>Unidad:</strong>{" "}
                {patient.personalMilitar.unidad || "N/A"}
              </span>
              <span>
                <strong>Estado:</strong>{" "}
                {patient.personalMilitar.estadoMilitar || "N/A"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Encuentros */}
      <div className={styles["form-card"]}>
        <h3>👨‍⚕️ Encuentros Médicos</h3>
        {loading ? (
          <div className={styles["loading-inline"]}>Cargando encuentros...</div>
        ) : (
          <EncuentrosList
            encuentros={encuentros}
            onVerDetalle={(encuentro) => setSelectedEncuentro(encuentro)}
          />
        )}
      </div>

      {/* Admisiones */}
      {patient.admisiones && patient.admisiones.length > 0 && (
        <div className={styles["form-card"]}>
          <h3>🏥 Historial de Admisiones</h3>
          <div className={styles["admisiones-list"]}>
            {patient.admisiones.map((adm: Admision) => (
              <div key={adm.id} className={styles["admision-item"]}>
                <div className={styles["admision-header"]}>
                  <span
                    className={`${styles["tipo-badge"]} ${
                      styles[`tipo-${adm.tipo?.toLowerCase()}`]
                    }`}
                  >
                    {adm.tipo || "N/A"}
                  </span>
                  <span className={styles.fecha}>
                    {formatDateVenezuela(adm.fechaAdmision)}
                  </span>
                </div>
                <div className={styles["admision-details"]}>
                  <span>
                    <strong>Servicio:</strong>{" "}
                    {adm.servicio?.replace(/_/g, " ") || "N/A"}
                  </span>
                  <span>
                    <strong>Estado:</strong> {adm.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalle de Encuentro */}
      {selectedEncuentro && (
        <EncuentroDetailModal
          encuentro={selectedEncuentro}
          onClose={() => setSelectedEncuentro(null)}
        />
      )}
    </section>
  );
}
