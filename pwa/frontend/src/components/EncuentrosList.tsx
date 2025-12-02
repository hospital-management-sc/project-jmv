/**
 * Componente para mostrar la lista de encuentros de un paciente
 * Solo lectura - Vista administrativa
 */

import { useState } from "react";
import type { Encuentro } from "@/services/encuentros.service";
import styles from "./EncuentrosList.module.css";
import { VENEZUELA_TIMEZONE, VENEZUELA_LOCALE } from "@/utils/dateUtils";

interface EncuentrosListProps {
  encuentros: Encuentro[];
  onVerDetalle: (encuentro: Encuentro) => void;
}

const EncuentrosList = ({ encuentros, onVerDetalle }: EncuentrosListProps) => {
  const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      EMERGENCIA: "🚨 Emergencia",
      HOSPITALIZACION: "🛏️ Hospitalización",
      CONSULTA: "🩺 Consulta",
      OTRO: "📋 Otro",
    };
    return labels[tipo] || tipo;
  };

  const getTipoBadgeClass = (tipo: string) => {
    const classes: Record<string, string> = {
      EMERGENCIA: styles.badgeEmergencia,
      HOSPITALIZACION: styles.badgeHospitalizacion,
      CONSULTA: styles.badgeConsulta,
      OTRO: styles.badgeOtro,
    };
    return classes[tipo] || styles.badgeDefault;
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString(VENEZUELA_LOCALE, {
      timeZone: VENEZUELA_TIMEZONE,
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatHora = (hora?: string) => {
    if (!hora) return "--:--";
    // La hora viene en formato HH:mm:ss, tomamos solo HH:mm
    return hora.substring(0, 5);
  };

  const encuentrosFiltrados =
    filtroTipo === "TODOS"
      ? encuentros
      : encuentros.filter((e) => e.tipo === filtroTipo);

  if (encuentros.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>📋 No se encontraron encuentros médicos para este paciente</p>
        <span className={styles.emptySubtext}>
          Los encuentros son registrados por el personal médico durante las
          consultas, emergencias u hospitalizaciones.
        </span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Encuentros Médicos
          <span className={styles.count}>({encuentros.length})</span>
        </h3>
        <div className={styles.filters}>
          <label>Filtrar por tipo:</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="TODOS">Todos</option>
            <option value="EMERGENCIA">Emergencia</option>
            <option value="HOSPITALIZACION">Hospitalización</option>
            <option value="CONSULTA">Consulta</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
      </div>

      <div className={styles.timeline}>
        {encuentrosFiltrados?.map((encuentro) => (
          <div key={encuentro.id} className={styles.timelineItem}>
            <div className={styles.timelineMarker}>
              <div
                className={`${styles.markerDot} ${getTipoBadgeClass(
                  encuentro.tipo
                )}`}
              />
            </div>
            <div className={styles.encounterCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <span
                    className={`${styles.tipoBadge} ${getTipoBadgeClass(
                      encuentro.tipo
                    )}`}
                  >
                    {getTipoLabel(encuentro.tipo)}
                  </span>
                  <span className={styles.fecha}>
                    {formatFecha(encuentro.fecha)} -{" "}
                    {formatHora(encuentro.hora)}
                  </span>
                </div>
                <button
                  onClick={() => onVerDetalle(encuentro)}
                  className={styles.btnDetalle}
                  title="Ver detalle completo"
                >
                  Ver detalle →
                </button>
              </div>

              <div className={styles.cardBody}>
                {encuentro.createdBy && (
                  <div className={styles.medico}>
                    <strong>👨‍⚕️ Médico:</strong>
                    <span>{encuentro.createdBy.nombre}</span>
                    {encuentro.createdBy.cargo && (
                      <span className={styles.cargo}>
                        ({encuentro.createdBy.cargo})
                      </span>
                    )}
                  </div>
                )}

                {encuentro.motivoConsulta && (
                  <div className={styles.motivo}>
                    <strong>Motivo:</strong>
                    <span>{encuentro.motivoConsulta}</span>
                  </div>
                )}

                {encuentro.impresiones && encuentro.impresiones.length > 0 && (
                  <div className={styles.diagnostico}>
                    <strong>Diagnóstico:</strong>
                    <span>
                      {encuentro.impresiones[0].descripcion ||
                        "Sin descripción"}
                    </span>
                  </div>
                )}

                {encuentro.signosVitales &&
                  encuentro.signosVitales.length > 0 && (
                    <div className={styles.signos}>
                      <strong>Signos vitales:</strong>
                      <div className={styles.signosGrid}>
                        {encuentro.signosVitales[0].taSistolica &&
                          encuentro.signosVitales[0].taDiastolica && (
                            <span>
                              PA: {encuentro.signosVitales[0].taSistolica}/
                              {encuentro.signosVitales[0].taDiastolica}
                            </span>
                          )}
                        {encuentro.signosVitales[0].pulso && (
                          <span>FC: {encuentro.signosVitales[0].pulso}</span>
                        )}
                        {/* TODO: corregir respuesta del back referente a la propiedad temperatura */}
                        {/* {encuentro.signosVitales[0].temperatura && (
                        <span>Temp: {encuentro.signosVitales[0].temperatura}°C</span>
                      )} */}
                      </div>
                    </div>
                  )}

                {encuentro.nroCama && (
                  <div className={styles.cama}>
                    <strong>🛏️ Cama:</strong>
                    <span>{encuentro.nroCama}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {encuentrosFiltrados.length === 0 && filtroTipo !== "TODOS" && (
        <div className={styles.noResults}>
          <p>No hay encuentros de tipo {getTipoLabel(filtroTipo)}</p>
        </div>
      )}
    </div>
  );
};

export default EncuentrosList;
