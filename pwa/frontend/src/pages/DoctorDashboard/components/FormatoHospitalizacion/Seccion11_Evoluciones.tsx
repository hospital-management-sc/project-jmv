// ==========================================
// SECCIÓN 11: Evoluciones Médicas
// Evoluciones diarias con formato SOAP
// ==========================================

import { useState, useEffect } from 'react';
import styles from './Secciones.module.css';
import type { FormatoHospitalizacion, EvolucionMedica } from '@/services/formatoHospitalizacion.service';
import type { Admision } from '@/services/admisiones.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';
import { formatDateVenezuela } from '@/utils/dateUtils';
import { IconCalendar, IconPlus, IconX, IconEdit, IconNotes, IconSave, IconBook, IconMessageSquare, IconSearch, IconBrain, IconClipboard, IconInfo } from '@/components/icons';

interface Props {
  formato: FormatoHospitalizacion;
  admision: Admision;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

export default function Seccion11_Evoluciones({ formato, admision, onUpdate, setSaving }: Props) {
  const [evoluciones, setEvoluciones] = useState<EvolucionMedica[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<EvolucionMedica>>({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
    subjetivo: '',
    objetivo: '',
    analisis: '',
    plan: '',
  });

  useEffect(() => {
    if (formato.evolucionesMedicas) {
      const sorted = [...formato.evolucionesMedicas].sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora}`).getTime();
        const dateB = new Date(`${b.fecha}T${b.hora}`).getTime();
        return dateB - dateA;
      });
      setEvoluciones(sorted);
    }
  }, [formato.evolucionesMedicas]);

  const handleInputChange = (field: keyof EvolucionMedica, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fecha || !formData.hora) {
      alert('Fecha y hora son obligatorios');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await formatoService.updateEvolucionMedica(editingId, formData);
      } else {
        await formatoService.addEvolucionMedica(formato.id, formData as EvolucionMedica);
      }

      await onUpdate();

      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
        subjetivo: '',
        objetivo: '',
        analisis: '',
        plan: '',
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error: unknown) {
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (evolucion: EvolucionMedica) => {
    setFormData({
      fecha: evolucion.fecha,
      hora: evolucion.hora,
      subjetivo: evolucion.subjetivo,
      objetivo: evolucion.objetivo,
      analisis: evolucion.analisis,
      plan: evolucion.plan,
    });
    setEditingId(evolucion.id!);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
      subjetivo: '',
      objetivo: '',
      analisis: '',
      plan: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const calcularDiaEvolucion = (fechaEvolucion: string, fechaIngreso?: string) => {
    if (!fechaIngreso) return '';
    const ingreso = new Date(fechaIngreso);
    const evolucion = new Date(fechaEvolucion);
    const diff = evolucion.getTime() - ingreso.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return dias > 0 ? `Día ${dias}` : '';
  };

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <div>
          <h3><IconCalendar size={16} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Evoluciones Médicas</h3>
          <p className={styles.seccionDescription}>
            Evoluciones diarias con metodología SOAP (Subjetivo, Objetivo, Análisis, Plan)
          </p>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm
            ? <><IconX size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Cancelar</>
            : <><IconPlus size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Nueva Evolución</>}
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h4>
            {editingId
              ? <><IconEdit size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Editar Evolución</>
              : <><IconNotes size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Nueva Evolución Médica</>}
          </h4>

          <div className={styles.soapInfo}>
            <p><strong>Metodología SOAP:</strong></p>
            <ul>
              <li><strong>S - Subjetivo:</strong> Síntomas que refiere el paciente</li>
              <li><strong>O - Objetivo:</strong> Hallazgos al examen físico, signos vitales, resultados</li>
              <li><strong>A - Análisis:</strong> Impresión diagnóstica, evaluación del estado clínico</li>
              <li><strong>P - Plan:</strong> Conducta a seguir, tratamiento, estudios pendientes</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Fecha *</label>
                <input
                  type="date"
                  value={formData.fecha || ''}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Hora *</label>
                <input
                  type="time"
                  value={formData.hora || ''}
                  onChange={(e) => handleInputChange('hora', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.soapLabel}>
                  <span className={styles.soapIcon}><IconMessageSquare size={14} style={{ verticalAlign: 'middle' }} /></span>
                  <strong>S - SUBJETIVO</strong>
                  <span className={styles.helpText}>(¿Qué refiere el paciente?)</span>
                </label>
                <textarea
                  value={formData.subjetivo || ''}
                  onChange={(e) => handleInputChange('subjetivo', e.target.value)}
                  placeholder="Ej: Paciente refiere dolor abdominal de moderada intensidad en epigastrio, sin irradiación. Refiere mejoría del cuadro febril..."
                  rows={4}
                  className={styles.soapTextarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.soapLabel}>
                  <span className={styles.soapIcon}><IconSearch size={14} style={{ verticalAlign: 'middle' }} /></span>
                  <strong>O - OBJETIVO</strong>
                  <span className={styles.helpText}>(Hallazgos al examen, signos vitales, paraclínicos)</span>
                </label>
                <textarea
                  value={formData.objetivo || ''}
                  onChange={(e) => handleInputChange('objetivo', e.target.value)}
                  placeholder="Ej: TA 120/80, FC 75, FR 16, Temp 36.8°C. Abdomen blando, RHA presentes, dolor a la palpación en epigastrio sin signos de irritación peritoneal. Laboratorios: Leucocitos 8500..."
                  rows={5}
                  className={styles.soapTextarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.soapLabel}>
                  <span className={styles.soapIcon}><IconBrain size={14} style={{ verticalAlign: 'middle' }} /></span>
                  <strong>A - ANÁLISIS</strong>
                  <span className={styles.helpText}>(Impresión diagnóstica, evaluación)</span>
                </label>
                <textarea
                  value={formData.analisis || ''}
                  onChange={(e) => handleInputChange('analisis', e.target.value)}
                  placeholder="Ej: Paciente masculino de 45 años con cuadro de gastritis aguda en resolución. Mejoría clínica evidente. Sin datos de complicaciones..."
                  rows={4}
                  className={styles.soapTextarea}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.soapLabel}>
                  <span className={styles.soapIcon}><IconClipboard size={14} style={{ verticalAlign: 'middle' }} /></span>
                  <strong>P - PLAN</strong>
                  <span className={styles.helpText}>(Conducta, tratamiento, estudios)</span>
                </label>
                <textarea
                  value={formData.plan || ''}
                  onChange={(e) => handleInputChange('plan', e.target.value)}
                  placeholder="Ej: 1. Continuar tratamiento actual 2. Dieta blanda 3. Control de signos vitales c/8h 4. Evaluar alta médica en 24-48h 5. Pendiente eco abdominal..."
                  rows={5}
                  className={styles.soapTextarea}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.btnPrimary}>
                {editingId
                  ? <><IconSave size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Actualizar Evolución</>
                  : <><IconSave size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Guardar Evolución</>}
              </button>
              <button type="button" className={styles.btnSecondary} onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.recordsList}>
        <h4><IconBook size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Historial de Evoluciones ({evoluciones.length} registros)</h4>

        {evoluciones.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay evoluciones médicas registradas aún.</p>
            <p>Haga clic en "Nueva Evolución" para agregar la primera.</p>
          </div>
        ) : (
          <div className={styles.evolucionesContainer}>
            {evoluciones.map((evolucion, index) => (
              <div key={evolucion.id} className={styles.evolucionCard}>
                <div className={styles.evolucionHeader}>
                  <div className={styles.evolucionMeta}>
                    <span className={styles.evolucionNumero}>
                      Evolución #{evoluciones.length - index}
                    </span>
                    <span className={styles.evolucionDia}>
                      {calcularDiaEvolucion(evolucion.fecha, admision.fechaAdmision)}
                    </span>
                    <span className={styles.evolucionFecha}>
                      {formatDateVenezuela(evolucion.fecha)} - {evolucion.hora}
                    </span>
                  </div>
                  <div className={styles.evolucionActions}>
                    <button
                      className={styles.btnEdit}
                      onClick={() => handleEdit(evolucion)}
                      title="Editar"
                    >
                      <IconEdit size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Editar
                    </button>
                  </div>
                </div>

                <div className={styles.soapContent}>
                  {evolucion.subjetivo && (
                    <div className={styles.soapSection}>
                      <div className={styles.soapSectionHeader}>
                        <span className={styles.soapIcon}><IconMessageSquare size={14} style={{ verticalAlign: 'middle' }} /></span>
                        <strong>SUBJETIVO</strong>
                      </div>
                      <p>{evolucion.subjetivo}</p>
                    </div>
                  )}

                  {evolucion.objetivo && (
                    <div className={styles.soapSection}>
                      <div className={styles.soapSectionHeader}>
                        <span className={styles.soapIcon}><IconSearch size={14} style={{ verticalAlign: 'middle' }} /></span>
                        <strong>OBJETIVO</strong>
                      </div>
                      <p>{evolucion.objetivo}</p>
                    </div>
                  )}

                  {evolucion.analisis && (
                    <div className={styles.soapSection}>
                      <div className={styles.soapSectionHeader}>
                        <span className={styles.soapIcon}><IconBrain size={14} style={{ verticalAlign: 'middle' }} /></span>
                        <strong>ANÁLISIS</strong>
                      </div>
                      <p>{evolucion.analisis}</p>
                    </div>
                  )}

                  {evolucion.plan && (
                    <div className={styles.soapSection}>
                      <div className={styles.soapSectionHeader}>
                        <span className={styles.soapIcon}><IconClipboard size={14} style={{ verticalAlign: 'middle' }} /></span>
                        <strong>PLAN</strong>
                      </div>
                      <p className={styles.planContent}>{evolucion.plan}</p>
                    </div>
                  )}
                </div>

                {evolucion.createdAt && (
                  <div className={styles.evolucionFooter}>
                    <span>Registrado: {formatDateVenezuela(evolucion.createdAt)} - {new Date(evolucion.createdAt).toLocaleTimeString('es-VE')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.infoNote}>
        <strong><IconInfo size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Recomendaciones:</strong>
        <ul>
          <li>Registre al menos una evolución médica diaria</li>
          <li>Sea específico y objetivo en sus observaciones</li>
          <li>Documente cambios en el estado clínico del paciente</li>
          <li>Incluya resultados de laboratorios y estudios relevantes</li>
          <li>Especifique claramente el plan de manejo</li>
        </ul>
      </div>
    </div>
  );
}
