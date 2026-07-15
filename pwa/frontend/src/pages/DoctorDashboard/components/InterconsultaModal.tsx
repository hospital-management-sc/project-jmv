// ==========================================
// COMPONENTE: Modal de Interconsulta
// ==========================================
import { useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { Interconsulta } from "@/services";
import * as interconsultasService from "@/services/interconsultas.service";
import { formatDateTimeVenezuela } from "@/utils/dateUtils";
import { IconClipboard, IconNotes, IconCheck, IconClock } from "@/components/icons";

interface Props {
  interconsulta: Interconsulta;
  onClose: () => void;
  onUpdate: () => void;
  medicoId: number;
}
export default function InterconsultaModal({
  interconsulta,
  onClose,
  onUpdate,
  medicoId,
}: Props) {
  const [respuesta, setRespuesta] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [enviando, setEnviando] = useState(false);

  const puedeResponder =
    interconsulta.estado === "EN_PROCESO" &&
    interconsulta.medicoDestinoId === medicoId;

  const completarInterconsulta = async () => {
    if (!respuesta.trim()) {
      alert("Debe ingresar una respuesta");
      return;
    }
    setEnviando(true);
    try {
      await interconsultasService.completarInterconsulta(interconsulta.id, {
        respuesta,
        observaciones,
      });
      alert("Interconsulta completada");
      onUpdate();
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al completar";
      alert("Error: " + errorMessage);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles["modal-header"]}>
          <h3><IconClipboard size={15} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Detalle de Interconsulta</h3>
          <button className={styles["close-btn"]} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles["modal-body"]}>
          <div className={styles["detail-section"]}>
            <h4>Paciente</h4>
            <p>
              <strong>Nombre:</strong> {interconsulta.paciente?.nombre}{" "}
              {interconsulta.paciente?.apellido}
            </p>
            <p>
              <strong>Cédula:</strong> {interconsulta.paciente?.cedula}
            </p>
          </div>

          <div className={styles["detail-section"]}>
            <h4>Solicitud</h4>
            <p>
              <strong>Especialidad:</strong> {interconsulta.especialidadDestino}
            </p>
            <p>
              <strong>Prioridad:</strong> {interconsulta.prioridad}
            </p>
            <p>
              <strong>Estado:</strong> {interconsulta.estado}
            </p>
            <p>
              <strong>Motivo:</strong> {interconsulta.motivo}
            </p>
            {interconsulta.diagnosticoPrevio && (
              <p>
                <strong>Diagnóstico Previo:</strong>{" "}
                {interconsulta.diagnosticoPrevio}
              </p>
            )}
            <p>
              <strong>Solicitado por:</strong> Dr.{" "}
              {interconsulta.medicoSolicitante?.nombre}{" "}
              {interconsulta.medicoSolicitante?.apellido}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {formatDateTimeVenezuela(interconsulta.fechaSolicitud)}
            </p>
          </div>

          {interconsulta.respuesta && (
            <div className={styles["detail-section"]}>
              <h4>Respuesta</h4>
              <p>{interconsulta.respuesta}</p>
              {interconsulta.fechaRespuesta && (
                <p>
                  <small>
                    Respondido:{" "}
                    {formatDateTimeVenezuela(interconsulta.fechaRespuesta)}
                  </small>
                </p>
              )}
            </div>
          )}

          {puedeResponder && (
            <div className={styles["detail-section"]}>
              <h4><IconNotes size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Su Respuesta</h4>
              <div className={styles["form-group"]}>
                <label>Evaluación / Recomendaciones *</label>
                <textarea
                  rows={4}
                  placeholder="Ingrese su evaluación y recomendaciones..."
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                />
              </div>
              <div className={styles["form-group"]}>
                <label>Observaciones adicionales</label>
                <textarea
                  rows={2}
                  placeholder="Notas adicionales..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles["modal-footer"]}>
          <button className={styles["btn-secondary"]} onClick={onClose}>
            Cerrar
          </button>
          {puedeResponder && (
            <button
              className={styles["btn-primary"]}
              onClick={completarInterconsulta}
              disabled={enviando}
            >
              {enviando
                ? <><IconClock size={13} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Enviando...</>
                : <><IconCheck size={13} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Completar Interconsulta</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
