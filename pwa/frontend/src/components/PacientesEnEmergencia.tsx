/**
 * Componente para mostrar pacientes en emergencia actualmente
 * Puede ser usado tanto en AdminDashboard como en DoctorDashboard
 */

import { useEffect, useState } from 'react';
import styles from './PacientesEnEmergencia.module.css';

interface Paciente {
  id: number;
  nroHistoria: string;
  apellidosNombres: string;
  ci: string;
  fechaNacimiento?: string;
  sexo: string;
}

interface FormatoEmergencia {
  impresionDx?: string;
  observaciones?: string;
  requiereHospitalizacion: boolean;
}

interface EmergenciaActiva {
  id: number;
  pacienteId: number;
  fechaAdmision: string;
  horaAdmision?: string;
  horasEnEmergencia: number;
  paciente: Paciente;
  formatoEmergencia?: FormatoEmergencia;
}

interface Props {
  onBack?: () => void;
}

export default function PacientesEnEmergencia({ onBack }: Props) {
  const [emergencias, setEmergencias] = useState<EmergenciaActiva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    cargarEmergencias();
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(cargarEmergencias, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarEmergencias = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admisiones/emergencias-activas');
      
      if (!response.ok) {
        throw new Error('Error al cargar emergencias');
      }

      const data = await response.json();
      setEmergencias(data.admisiones || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return 'N/A';
    const hoy = new Date();
    const nac = new Date(fechaNac);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return `${edad} años`;
  };

  const getAlertaClase = (horas: number) => {
    if (horas >= 24) return styles.critico; // Más de 24 horas
    if (horas >= 12) return styles.alerta; // 12-24 horas
    return styles.normal; // Menos de 12 horas
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando pacientes en emergencia...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2>🚨 Pacientes en Emergencia Actualmente</h2>
          <div className={styles.headerActions}>
            <button onClick={cargarEmergencias} className={styles.refreshBtn}>
              🔄 Actualizar
            </button>
            {onBack && (
              <button onClick={onBack} className={styles.backBtn}>
                ← Volver
              </button>
            )}
          </div>
        </div>
        <p className={styles.subtitle}>
          Vista en tiempo real de pacientes en el servicio de emergencia
        </p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {emergencias.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>✅</span>
          <h3>No hay pacientes en emergencia</h3>
          <p>No hay admisiones de emergencia activas en este momento</p>
        </div>
      ) : (
        <>
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{emergencias.length}</span>
              <span className={styles.statLabel}>Total en emergencia</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {emergencias.filter(e => e.formatoEmergencia?.requiereHospitalizacion).length}
              </span>
              <span className={styles.statLabel}>Requieren hospitalización</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {emergencias.filter(e => e.horasEnEmergencia >= 24).length}
              </span>
              <span className={styles.statLabel}>Más de 24 horas</span>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {emergencias.map((emergencia) => (
              <div 
                key={emergencia.id} 
                className={`${styles.card} ${getAlertaClase(emergencia.horasEnEmergencia)}`}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <h3>{emergencia.paciente.apellidosNombres}</h3>
                    <span className={styles.badge}>HC: {emergencia.paciente.nroHistoria}</span>
                  </div>
                  <div className={styles.badges}>
                    <span className={styles.tiempoBadge}>
                      {emergencia.horasEnEmergencia}h
                    </span>
                    {emergencia.formatoEmergencia?.requiereHospitalizacion && (
                      <span className={styles.hospitalizacionBadge}>
                        🏥 Requiere hospitalización
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.infoRow}>
                    <strong>CI:</strong> {emergencia.paciente.ci}
                  </div>
                  <div className={styles.infoRow}>
                    <strong>Edad:</strong> {calcularEdad(emergencia.paciente.fechaNacimiento)}
                  </div>
                  <div className={styles.infoRow}>
                    <strong>Sexo:</strong> {emergencia.paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}
                  </div>
                  <div className={styles.infoRow}>
                    <strong>Ingreso:</strong> {new Date(emergencia.fechaAdmision).toLocaleDateString('es-VE')} {emergencia.horaAdmision}
                  </div>

                  {emergencia.formatoEmergencia?.impresionDx && (
                    <div className={styles.diagnostico}>
                      <strong>Impresión Diagnóstica:</strong>
                      <p>{emergencia.formatoEmergencia.impresionDx}</p>
                    </div>
                  )}

                  {expandedId === emergencia.id && emergencia.formatoEmergencia?.observaciones && (
                    <div className={styles.observaciones}>
                      <strong>Observaciones:</strong>
                      <p>{emergencia.formatoEmergencia.observaciones}</p>
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <button
                    onClick={() => setExpandedId(expandedId === emergencia.id ? null : emergencia.id)}
                    className={styles.expandBtn}
                  >
                    {expandedId === emergencia.id ? '▲ Ver menos' : '▼ Ver más'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
