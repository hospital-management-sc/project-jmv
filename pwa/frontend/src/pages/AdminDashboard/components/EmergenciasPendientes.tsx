/**
 * Componente para mostrar emergencias pendientes de hospitalización
 * El admin puede ver pacientes en emergencia que requieren hospitalización
 * y asignarles cama/servicio para crear admisión de hospitalización
 */

import { useEffect, useState } from 'react';
import styles from './EmergenciasPendientes.module.css';
import { SERVICIOS } from '@/constants';

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

interface EmergenciaPendiente {
  id: number;
  pacienteId: number;
  fechaAdmision: string;
  horaAdmision?: string;
  horasEnEmergencia: number;
  paciente: Paciente;
  formatoEmergencia?: FormatoEmergencia;
}

interface EmergenciasPendientesProps {
  onBack?: () => void;
}

export default function EmergenciasPendientes({ onBack: _ }: EmergenciasPendientesProps = {}) {
  const [emergencias, setEmergencias] = useState<EmergenciaPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmergencia, setSelectedEmergencia] = useState<EmergenciaPendiente | null>(null);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  
  // Form state
  const [servicio, setServicio] = useState('');
  const [habitacion, setHabitacion] = useState('');
  const [cama, setCama] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cargarEmergenciasPendientes();
  }, []);

  const cargarEmergenciasPendientes = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/admisiones/emergencias-pendientes-hospitalizacion');
      
      if (!response.ok) {
        throw new Error('Error al cargar emergencias pendientes');
      }

      const data = await response.json();
      setEmergencias(data.admisiones || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarCama = (emergencia: EmergenciaPendiente) => {
    setSelectedEmergencia(emergencia);
    setShowAsignarModal(true);
    setServicio('');
    setHabitacion('');
    setCama('');
    setObservaciones('');
  };

  const handleSubmitAsignacion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmergencia || !servicio || !cama) {
      alert('Por favor complete servicio y cama');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/api/admisiones/hospitalizar-desde-emergencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admisionEmergenciaId: selectedEmergencia.id,
          servicio,
          habitacion: habitacion || null,
          cama,
          observaciones: observaciones || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al hospitalizar paciente');
      }

      alert('✓ Paciente hospitalizado exitosamente');
      setShowAsignarModal(false);
      cargarEmergenciasPendientes(); // Recargar lista
    } catch (err: any) {
      alert('Error: ' + err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando emergencias pendientes...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🚨 Emergencias Pendientes de Hospitalización</h2>
        <p className={styles.subtitle}>
          Pacientes que requieren asignación de cama y servicio hospitalario
        </p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {emergencias.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>✅</span>
          <h3>No hay emergencias pendientes</h3>
          <p>Todos los pacientes que requieren hospitalización ya tienen cama asignada</p>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {emergencias.map((emergencia) => (
            <div key={emergencia.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{emergencia.paciente.apellidosNombres}</h3>
                  <span className={styles.badge}>HC: {emergencia.paciente.nroHistoria}</span>
                </div>
                <span className={styles.urgenteBadge}>
                  {emergencia.horasEnEmergencia}h en emergencia
                </span>
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

                {emergencia.formatoEmergencia?.observaciones && (
                  <div className={styles.observaciones}>
                    <strong>Observaciones:</strong>
                    <p>{emergencia.formatoEmergencia.observaciones}</p>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <button
                  onClick={() => handleAsignarCama(emergencia)}
                  className={styles.asignarBtn}
                >
                  🏥 Asignar Cama y Hospitalizar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Asignación */}
      {showAsignarModal && selectedEmergencia && (
        <div className={styles.modalOverlay} onClick={() => setShowAsignarModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Asignar Cama y Hospitalizar</h3>
              <button onClick={() => setShowAsignarModal(false)} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.patientInfo}>
                <p><strong>Paciente:</strong> {selectedEmergencia.paciente.apellidosNombres}</p>
                <p><strong>CI:</strong> {selectedEmergencia.paciente.ci}</p>
                <p><strong>HC:</strong> {selectedEmergencia.paciente.nroHistoria}</p>
              </div>

              <form onSubmit={handleSubmitAsignacion}>
                <div className={styles.formGroup}>
                  <label>Servicio Hospitalario *</label>
                  <select
                    value={servicio}
                    onChange={(e) => setServicio(e.target.value)}
                    required
                  >
                    <option value="">Seleccione servicio...</option>
                    {SERVICIOS.filter(s => s.value !== 'EMERGENCIA' && s.value !== 'CONSULTA_EXTERNA').map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Habitación</label>
                  <input
                    type="text"
                    value={habitacion}
                    onChange={(e) => setHabitacion(e.target.value)}
                    placeholder="Ej: 201, Piso 2"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Cama *</label>
                  <input
                    type="text"
                    value={cama}
                    onChange={(e) => setCama(e.target.value)}
                    placeholder="Ej: Cama A, Cama 1"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Observaciones</label>
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Indicaciones especiales, alergias, etc..."
                    rows={3}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setShowAsignarModal(false)}
                    className={styles.cancelBtn}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={submitting}
                  >
                    {submitting ? 'Hospitalizando...' : '✓ Confirmar Hospitalización'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
