// ==========================================
// COMPONENTE: Interconsultas
// ==========================================
import { useEffect, useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type {
  Interconsulta,
  CrearInterconsultaDTO,
  PrioridadInterconsulta,
} from "@/services";
import * as interconsultasService from "@/services/interconsultas.service";
import type { PatientBasic } from "../interfaces";
import { API_BASE_URL } from "@/utils/constants";
import { formatDateTimeVenezuela } from "@/utils/dateUtils";
import InterconsultaModal from "./InterconsultaModal";
import { toast } from "sonner";

interface Props {
  doctorId: number;
}

export default function InterconsultasView({ doctorId }: Props) {
  const [tabActiva, setTabActiva] = useState<
    "enviadas" | "recibidas" | "nueva"
  >("enviadas");
  const [interconsultasEnviadas, setInterconsultasEnviadas] = useState<
    Interconsulta[]
  >([]);
  const [interconsultasRecibidas, setInterconsultasRecibidas] = useState<
    Interconsulta[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedInterconsulta, setSelectedInterconsulta] =
    useState<Interconsulta | null>(null);

  // Para crear nueva interconsulta
  const [searchCI, setSearchCI] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState<PatientBasic | null>(null);
  const [searching, setSearching] = useState(false);
  const [formData, setFormData] = useState<Partial<CrearInterconsultaDTO>>({
    especialidadDestino: "",
    prioridad: "MEDIA",
    motivo: "",
    diagnosticoPrevio: "",
    observaciones: "",
  });
  const [creando, setCreando] = useState(false);

  // TODO: Obtener ID del médico actual del contexto de autenticación
  // const medicoId = 1; // Temporal - deberá venir del contexto de auth

  useEffect(() => {
    cargarInterconsultas();
  }, [doctorId]);

  const cargarInterconsultas = async () => {
    setLoading(true);
    try {
      const [enviadas, recibidas] = await Promise.all([
        interconsultasService.obtenerInterconsultasPendientes(doctorId),
        interconsultasService.obtenerInterconsultasRecibidas(doctorId),
      ]);
      setInterconsultasEnviadas(enviadas);
      setInterconsultasRecibidas(recibidas);
    } catch (err) {
      console.error("Error al cargar interconsultas:", err);
      setError("Error al cargar interconsultas");
      toast.error("Error al cargar interconsultas");
    } finally {
      setLoading(false);
    }
  };

  const buscarPaciente = async () => {
    if (!searchCI.trim()) {
      setError("Ingrese un número de cédula");
      toast.error("Ingrese un número de cédula");
      return;
    }
    setSearching(true);
    setError("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/pacientes/search?ci=${searchCI}`
      );
      const result = await response.json();
      if (result.success && result.data) {
        setPacienteSeleccionado(result.data);
      } else {
        setError("Paciente no encontrado");
        toast.error("Paciente no encontrado");
      }
    } catch {
      setError("Error al buscar paciente");
      toast.error("Error al buscar paciente");
    } finally {
      setSearching(false);
    }
  };

  const crearInterconsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteSeleccionado) {
      setError("Debe seleccionar un paciente");
      toast.error("Debe seleccionar un paciente");
      return;
    }
    if (!formData.especialidadDestino || !formData.motivo) {
      setError("Complete los campos obligatorios");
      toast.error("Complete los campos obligatorios");
      return;
    }

    setCreando(true);
    setError("");
    try {
      const nuevaInterconsulta: CrearInterconsultaDTO = {
        pacienteId: parseInt(pacienteSeleccionado.id),
        medicoSolicitanteId: doctorId,
        especialidadDestino: formData.especialidadDestino!,
        prioridad: formData.prioridad as PrioridadInterconsulta,
        motivo: formData.motivo!,
        diagnosticoPrevio: formData.diagnosticoPrevio,
        observaciones: formData.observaciones,
      };

      await interconsultasService.crearInterconsulta(nuevaInterconsulta);

      // Limpiar y volver a cargar
      setPacienteSeleccionado(null);
      setSearchCI("");
      setFormData({
        especialidadDestino: "",
        prioridad: "MEDIA",
        motivo: "",
        diagnosticoPrevio: "",
        observaciones: "",
      });
      setTabActiva("enviadas");
      await cargarInterconsultas();
      // alert("✅ Interconsulta creada exitosamente");
      toast.success("✅ Interconsulta creada exitosamente");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear interconsulta";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCreando(false);
    }
  };

  const aceptarInterconsulta = async (interconsultaId: number) => {
    try {
      await interconsultasService.aceptarInterconsulta(
        interconsultaId,
        doctorId
      );
      await cargarInterconsultas();
      // alert("✅ Interconsulta aceptada");
      toast.success("✅ Interconsulta aceptada");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al aceptar";
      // alert("❌ " + errorMessage);
      toast.error(`❌ ${errorMessage}`);
    }
  };

  const getPrioridadBadge = (prioridad: string) => {
    const config: Record<string, { emoji: string; className: string }> = {
      URGENTE: { emoji: "🔴", className: styles["prioridad-urgente"] },
      ALTA: { emoji: "🟠", className: styles["prioridad-alta"] },
      MEDIA: { emoji: "🟡", className: styles["prioridad-media"] },
      BAJA: { emoji: "🟢", className: styles["prioridad-baja"] },
    };
    return config[prioridad] || config.MEDIA;
  };

  const getEstadoBadge = (estado: string) => {
    const config: Record<string, { label: string; className: string }> = {
      PENDIENTE: {
        label: "⏳ Pendiente",
        className: styles["estado-pendiente"],
      },
      EN_PROCESO: {
        label: "🔄 En Proceso",
        className: styles["estado-proceso"],
      },
      COMPLETADA: {
        label: "✅ Completada",
        className: styles["estado-completada"],
      },
      CANCELADA: {
        label: "❌ Cancelada",
        className: styles["estado-cancelada"],
      },
    };
    return config[estado] || config.PENDIENTE;
  };

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles.spinner}></div>
        <p>Cargando interconsultas...</p>
      </div>
    );
  }

  return (
    <section className={styles["view-section"]}>
      <div className={styles["section-header"]}>
        <h2>🔄 Interconsultas Médicas</h2>
        <p className={styles["section-subtitle"]}>
          Solicite evaluaciones de otras especialidades o responda consultas
          recibidas
        </p>
      </div>

      {/* Tabs de navegación */}
      <div className={styles["tabs-container"]}>
        <button
          className={`${styles.tab} ${
            tabActiva === "enviadas" ? styles.active : ""
          }`}
          onClick={() => setTabActiva("enviadas")}
        >
          📤 Enviadas ({interconsultasEnviadas.length})
        </button>
        <button
          className={`${styles.tab} ${
            tabActiva === "recibidas" ? styles.active : ""
          }`}
          onClick={() => setTabActiva("recibidas")}
        >
          📥 Recibidas ({interconsultasRecibidas.length})
        </button>
        <button
          className={`${styles.tab} ${
            tabActiva === "nueva" ? styles.active : ""
          }`}
          onClick={() => setTabActiva("nueva")}
        >
          ➕ Nueva Interconsulta
        </button>
      </div>

      {error && <div className={styles["error-alert"]}>{error}</div>}

      {/* Tab: Interconsultas Enviadas */}
      {tabActiva === "enviadas" && (
        <div className={styles["form-card"]}>
          <h3>📤 Interconsultas Enviadas</h3>
          {interconsultasEnviadas.length === 0 ? (
            <div className={styles["empty-state"]}>
              <span className={styles["empty-icon"]}>📭</span>
              <h3>No hay interconsultas enviadas</h3>
              <p>Las solicitudes que envíe aparecerán aquí</p>
            </div>
          ) : (
            <div className={styles["interconsultas-list"]}>
              {interconsultasEnviadas.map((ic) => (
                <div key={ic.id} className={styles["interconsulta-card"]}>
                  <div className={styles["ic-header"]}>
                    <div className={styles["ic-paciente"]}>
                      <strong>
                        {ic.paciente?.nombre} {ic.paciente?.apellido}
                      </strong>
                      <small>CI: {ic.paciente?.cedula}</small>
                    </div>
                    <div className={styles["ic-badges"]}>
                      <span
                        className={getPrioridadBadge(ic.prioridad).className}
                      >
                        {getPrioridadBadge(ic.prioridad).emoji} {ic.prioridad}
                      </span>
                      <span className={getEstadoBadge(ic.estado).className}>
                        {getEstadoBadge(ic.estado).label}
                      </span>
                    </div>
                  </div>
                  <div className={styles["ic-body"]}>
                    <p>
                      <strong>Especialidad solicitada:</strong>{" "}
                      {ic.especialidadDestino}
                    </p>
                    <p>
                      <strong>Motivo:</strong> {ic.motivo}
                    </p>
                    <p>
                      <strong>Fecha solicitud:</strong>{" "}
                      {formatDateTimeVenezuela(ic.fechaSolicitud)}
                    </p>
                    {ic.medicoDestino && (
                      <p>
                        <strong>Atendida por:</strong> Dr.{" "}
                        {ic.medicoDestino.nombre} {ic.medicoDestino.apellido}
                      </p>
                    )}
                    {ic.respuesta && (
                      <div className={styles["ic-respuesta"]}>
                        <strong>Respuesta:</strong>
                        <p>{ic.respuesta}</p>
                      </div>
                    )}
                  </div>
                  <div className={styles["ic-actions"]}>
                    <button
                      className={styles["btn-small"]}
                      onClick={() => {
                        setSelectedInterconsulta(ic);
                        setShowModal(true);
                      }}
                    >
                      👁️ Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Interconsultas Recibidas */}
      {tabActiva === "recibidas" && (
        <div className={styles["form-card"]}>
          <h3>📥 Interconsultas Recibidas</h3>
          {interconsultasRecibidas.length === 0 ? (
            <div className={styles["empty-state"]}>
              <span className={styles["empty-icon"]}>📬</span>
              <h3>No hay interconsultas recibidas</h3>
              <p>Las solicitudes dirigidas a su especialidad aparecerán aquí</p>
            </div>
          ) : (
            <div className={styles["interconsultas-list"]}>
              {interconsultasRecibidas.map((ic) => (
                <div
                  key={ic.id}
                  className={`${styles["interconsulta-card"]} ${styles["ic-recibida"]}`}
                >
                  <div className={styles["ic-header"]}>
                    <div className={styles["ic-paciente"]}>
                      <strong>
                        {ic.paciente?.nombre} {ic.paciente?.apellido}
                      </strong>
                      <small>CI: {ic.paciente?.cedula}</small>
                    </div>
                    <div className={styles["ic-badges"]}>
                      <span
                        className={getPrioridadBadge(ic.prioridad).className}
                      >
                        {getPrioridadBadge(ic.prioridad).emoji} {ic.prioridad}
                      </span>
                      <span className={getEstadoBadge(ic.estado).className}>
                        {getEstadoBadge(ic.estado).label}
                      </span>
                    </div>
                  </div>
                  <div className={styles["ic-body"]}>
                    <p>
                      <strong>Solicitado por:</strong> Dr.{" "}
                      {ic.medicoSolicitante?.nombre}{" "}
                      {ic.medicoSolicitante?.apellido} (
                      {ic.medicoSolicitante?.especialidad})
                    </p>
                    <p>
                      <strong>Motivo:</strong> {ic.motivo}
                    </p>
                    {ic.diagnosticoPrevio && (
                      <p>
                        <strong>Diagnóstico previo:</strong>{" "}
                        {ic.diagnosticoPrevio}
                      </p>
                    )}
                    <p>
                      <strong>Fecha solicitud:</strong>{" "}
                      {formatDateTimeVenezuela(ic.fechaSolicitud)}
                    </p>
                  </div>
                  <div className={styles["ic-actions"]}>
                    {ic.estado === "PENDIENTE" && (
                      <button
                        className={styles["btn-primary"]}
                        onClick={() => aceptarInterconsulta(ic.id)}
                      >
                        ✅ Aceptar
                      </button>
                    )}
                    {ic.estado === "EN_PROCESO" && (
                      <button
                        className={styles["btn-primary"]}
                        onClick={() => {
                          setSelectedInterconsulta(ic);
                          setShowModal(true);
                        }}
                      >
                        📝 Responder
                      </button>
                    )}
                    <button
                      className={styles["btn-small"]}
                      onClick={() => {
                        setSelectedInterconsulta(ic);
                        setShowModal(true);
                      }}
                    >
                      👁️ Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Nueva Interconsulta */}
      {tabActiva === "nueva" && (
        <div className={styles["form-card"]}>
          <h3>➕ Crear Nueva Interconsulta</h3>

          {/* Paso 1: Buscar paciente */}
          {!pacienteSeleccionado ? (
            <div className={styles["form-section"]}>
              <h4>1. Buscar Paciente</h4>
              <div className={styles["search-box"]}>
                <input
                  type="text"
                  placeholder="Ingrese cédula del paciente (Ej: V-12345678)"
                  value={searchCI}
                  onChange={(e) => setSearchCI(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && buscarPaciente()}
                />
                <button onClick={buscarPaciente} disabled={searching}>
                  {searching ? "🔄 Buscando..." : "🔍 Buscar"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Paciente seleccionado */}
              <div className={styles["patient-summary"]}>
                <div className={styles["patient-details"]}>
                  <p>
                    <strong>Paciente:</strong>{" "}
                    {pacienteSeleccionado.apellidosNombres}
                  </p>
                  <p>
                    <strong>CI:</strong> {pacienteSeleccionado.ci}
                  </p>
                  <p>
                    <strong>Historia:</strong>{" "}
                    {pacienteSeleccionado.nroHistoria}
                  </p>
                </div>
                <button
                  className={styles["change-patient-btn"]}
                  onClick={() => setPacienteSeleccionado(null)}
                >
                  Cambiar paciente
                </button>
              </div>

              {/* Formulario de interconsulta */}
              <form onSubmit={crearInterconsulta}>
                <div className={styles["form-section"]}>
                  <h4>2. Datos de la Interconsulta</h4>
                  <div className={styles["form-grid"]}>
                    <div className={styles["form-group"]}>
                      <label>Especialidad Destino *</label>
                      <select
                        value={formData.especialidadDestino}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            especialidadDestino: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Seleccione especialidad</option>
                        {interconsultasService.ESPECIALIDADES_MEDICAS.map(
                          (esp) => (
                            <option key={esp} value={esp}>
                              {esp}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className={styles["form-group"]}>
                      <label>Prioridad *</label>
                      <select
                        value={formData.prioridad}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prioridad: e.target.value as PrioridadInterconsulta,
                          })
                        }
                      >
                        {interconsultasService.PRIORIDADES_INTERCONSULTA.map(
                          (p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div
                      className={`${styles["form-group"]} ${styles["full-width"]}`}
                    >
                      <label>Motivo de la Interconsulta *</label>
                      <textarea
                        rows={3}
                        placeholder="Describa el motivo de la solicitud de interconsulta..."
                        value={formData.motivo}
                        onChange={(e) =>
                          setFormData({ ...formData, motivo: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div
                      className={`${styles["form-group"]} ${styles["full-width"]}`}
                    >
                      <label>Diagnóstico Previo</label>
                      <textarea
                        rows={2}
                        placeholder="Diagnóstico o impresión diagnóstica actual..."
                        value={formData.diagnosticoPrevio}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            diagnosticoPrevio: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div
                      className={`${styles["form-group"]} ${styles["full-width"]}`}
                    >
                      <label>Observaciones Adicionales</label>
                      <textarea
                        rows={2}
                        placeholder="Información adicional relevante..."
                        value={formData.observaciones}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            observaciones: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className={styles["form-actions"]}>
                  <button
                    type="button"
                    className={styles["btn-secondary"]}
                    onClick={() => {
                      setPacienteSeleccionado(null);
                      setFormData({
                        especialidadDestino: "",
                        prioridad: "MEDIA",
                        motivo: "",
                        diagnosticoPrevio: "",
                        observaciones: "",
                      });
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles["btn-primary"]}
                    disabled={creando}
                  >
                    {creando ? "⏳ Enviando..." : "📤 Enviar Interconsulta"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Modal de detalle/respuesta */}
      {showModal && selectedInterconsulta && (
        <InterconsultaModal
          interconsulta={selectedInterconsulta}
          onClose={() => {
            setShowModal(false);
            setSelectedInterconsulta(null);
          }}
          onUpdate={cargarInterconsultas}
          medicoId={doctorId}
        />
      )}
    </section>
  );
}
