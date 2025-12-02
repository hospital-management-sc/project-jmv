/**
 * Modal para mostrar el detalle completo de un encuentro médico
 * Solo lectura - Vista administrativa
 */

import type { Encuentro } from '@/services/encuentros.service';
import styles from './EncuentroDetailModal.module.css';
import { VENEZUELA_TIMEZONE, VENEZUELA_LOCALE } from '@/utils/dateUtils';

interface EncuentroDetailModalProps {
  encuentro: Encuentro | null;
  onClose: () => void;
}

const EncuentroDetailModal = ({ encuentro, onClose }: EncuentroDetailModalProps) => {
  if (!encuentro) return null;

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      EMERGENCIA: '🚨 Emergencia',
      HOSPITALIZACION: '🛏️ Hospitalización',
      CONSULTA: '🩺 Consulta',
      OTRO: '📋 Otro',
    };
    return labels[tipo] || tipo;
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString(VENEZUELA_LOCALE, {
      timeZone: VENEZUELA_TIMEZONE,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatHora = (hora?: string) => {
    if (!hora) return '--:--';
    return hora.substring(0, 5);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Detalle del Encuentro Médico</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Información General */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>📋 Información General</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tipo de encuentro:</span>
                <span className={styles.value}>{getTipoLabel(encuentro.tipo)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Fecha:</span>
                <span className={styles.value}>{formatFecha(encuentro.fecha)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Hora:</span>
                <span className={styles.value}>{formatHora(encuentro.hora)}</span>
              </div>
              {encuentro.nroCama && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Nro. Cama:</span>
                  <span className={styles.value}>{encuentro.nroCama}</span>
                </div>
              )}
              {encuentro.procedencia && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Procedencia:</span>
                  <span className={styles.value}>{encuentro.procedencia}</span>
                </div>
              )}
            </div>
          </section>

          {/* Médico Tratante */}
          {encuentro.createdBy && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>👨‍⚕️ Médico Tratante</h3>
              <div className={styles.medicoCard}>
                <div className={styles.medicoInfo}>
                  <strong>{encuentro.createdBy.nombre}</strong>
                  {encuentro.createdBy.cargo && (
                    <span className={styles.cargo}>{encuentro.createdBy.cargo}</span>
                  )}
                  {encuentro.createdBy.role && (
                    <span className={styles.role}>Rol: {encuentro.createdBy.role}</span>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Motivo y Enfermedad Actual */}
          {(encuentro.motivoConsulta || encuentro.enfermedadActual) && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>📝 Motivo de Consulta</h3>
              {encuentro.motivoConsulta && (
                <div className={styles.textBlock}>
                  <strong>Motivo:</strong>
                  <p>{encuentro.motivoConsulta}</p>
                </div>
              )}
              {encuentro.enfermedadActual && (
                <div className={styles.textBlock}>
                  <strong>Enfermedad Actual:</strong>
                  <p>{encuentro.enfermedadActual}</p>
                </div>
              )}
            </section>
          )}

          {/* Signos Vitales */}
          {encuentro.signosVitales && encuentro.signosVitales.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>💓 Signos Vitales</h3>
              {encuentro.signosVitales.map((signos, index) => (
                <div key={signos.id} className={styles.signosCard}>
                  {encuentro.signosVitales.length > 1 && (
                    <div className={styles.registroLabel}>Registro #{index + 1}</div>
                  )}
                  <div className={styles.signosGrid}>
                    {signos.taSistolica && signos.taDiastolica && (
                      <div className={styles.signoItem}>
                        <span className={styles.signoLabel}>Presión Arterial</span>
                        <span className={styles.signoValue}>
                          {signos.taSistolica}/{signos.taDiastolica} mmHg
                        </span>
                      </div>
                    )}
                    {signos.pulso && (
                      <div className={styles.signoItem}>
                        <span className={styles.signoLabel}>Frecuencia Cardíaca</span>
                        <span className={styles.signoValue}>{signos.pulso} lpm</span>
                      </div>
                    )}
                    {signos.temperatura && (
                      <div className={styles.signoItem}>
                        <span className={styles.signoLabel}>Temperatura</span>
                        {/* <span className={styles.signoValue}>{signos.temperatura}°C</span> */}
                      </div>
                    )}
                    {signos.fr && (
                      <div className={styles.signoItem}>
                        <span className={styles.signoLabel}>Frecuencia Respiratoria</span>
                        <span className={styles.signoValue}>{signos.fr} rpm</span>
                      </div>
                    )}
                  </div>
                  {signos.observaciones && (
                    <div className={styles.observaciones}>
                      <strong>Observaciones:</strong>
                      <p>{signos.observaciones}</p>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Impresión Diagnóstica */}
          {encuentro.impresiones && encuentro.impresiones.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>🔬 Impresión Diagnóstica</h3>
              <div className={styles.diagnosticosList}>
                {encuentro.impresiones.map((impresion, index) => (
                  <div key={impresion.id} className={styles.diagnosticoCard}>
                    <div className={styles.diagnosticoHeader}>
                      <span className={styles.diagnosticoNum}>#{index + 1}</span>
                      {impresion.clase && (
                        <span className={styles.diagnosticoTipo}>{impresion.clase}</span>
                      )}
                    </div>
                    <div className={styles.diagnosticoBody}>
                      {impresion.codigoCie && (
                        <div className={styles.codigoCie}>
                          CIE: <strong>{impresion.codigoCie}</strong>
                        </div>
                      )}
                      <p className={styles.descripcion}>{impresion.descripcion || 'Sin descripción'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Admisión Relacionada */}
          {encuentro.admision && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>🏥 Admisión Relacionada</h3>
              <div className={styles.admisionCard}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Tipo:</span>
                    <span className={styles.value}>{encuentro.admision.tipo || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Servicio:</span>
                    <span className={styles.value}>{encuentro.admision.servicio || 'N/A'}</span>
                  </div>
                  {encuentro.admision.fechaAdmision && (
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Fecha Ingreso:</span>
                      <span className={styles.value}>
                        {formatFecha(encuentro.admision.fechaAdmision)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCerrar} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EncuentroDetailModal;
