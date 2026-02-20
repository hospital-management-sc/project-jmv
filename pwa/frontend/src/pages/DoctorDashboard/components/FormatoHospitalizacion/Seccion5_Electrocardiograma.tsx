// ==========================================
// SECCIÓN 5: Electrocardiograma
// Registro e interpretación de EKG
// ==========================================

import { useState, useEffect } from 'react';
import styles from './Secciones.module.css';
import type { FormatoHospitalizacion, Electrocardiograma } from '@/services/formatoHospitalizacion.service';
import type { Admision } from '@/services/admisiones.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';
import { formatDateVenezuela } from '@/utils/dateUtils';

interface Props {
  formato: FormatoHospitalizacion;
  admision: Admision;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

const RITMOS = [
  'Sinusal',
  'Fibrilación auricular',
  'Flutter auricular',
  'Taquicardia supraventricular',
  'Taquicardia ventricular',
  'Bradicardia sinusal',
  'Bloqueo AV 1er grado',
  'Bloqueo AV 2do grado Mobitz I',
  'Bloqueo AV 2do grado Mobitz II',
  'Bloqueo AV 3er grado',
  'Marcapasos',
  'Otro',
];

const EJES = [
  'Normal (0 a +90°)',
  'Desviación izquierda',
  'Desviación derecha',
  'Desviación extrema',
  'Indeterminado',
];

export default function Seccion5_Electrocardiograma({ formato, onUpdate, setSaving }: Props) {
  const [ekgs, setEkgs] = useState<Electrocardiograma[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Electrocardiograma>>({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
  });

  useEffect(() => {
    if (formato.electrocardiogramas) {
      const sorted = [...formato.electrocardiogramas].sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora || '00:00'}`).getTime();
        const dateB = new Date(`${b.fecha}T${b.hora || '00:00'}`).getTime();
        return dateB - dateA;
      });
      setEkgs(sorted);
    }
  }, [formato.electrocardiogramas]);

  const handleInputChange = (field: keyof Electrocardiograma, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fecha) {
      alert('La fecha es obligatoria');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await formatoService.updateElectrocardiograma(editingId, formData);
      } else {
        await formatoService.addElectrocardiograma(formato.id, formData as any);
      }
      
      await onUpdate();
      
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ekg: Electrocardiograma) => {
    setFormData({ ...ekg });
    setEditingId(ekg.id!);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getValorStatus = (key: string, valor?: number) => {
    if (!valor) return '';
    
    switch (key) {
      case 'frecuencia':
        if (valor < 60) return styles.bajo;
        if (valor > 100) return styles.alto;
        break;
      case 'pr':
        if (valor < 120) return styles.bajo;
        if (valor > 200) return styles.alto;
        break;
      case 'qrs':
        if (valor > 120) return styles.alto;
        break;
      case 'qt':
        if (valor > 440) return styles.alto;
        break;
      case 'qtc':
        if (valor > 450) return styles.alto;
        break;
    }
    return styles.normal;
  };

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <div>
          <h3>📈 Electrocardiograma</h3>
          <p className={styles.seccionDescription}>
            Registro e interpretación de electrocardiogramas
          </p>
        </div>
        <button 
          className={styles.btnPrimary}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo EKG'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className={styles.formCard}>
          <h4>{editingId ? '✏️ Editar EKG' : '📝 Nuevo Electrocardiograma'}</h4>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Fecha y Hora */}
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
                <label>Hora</label>
                <input
                  type="time"
                  value={formData.hora || ''}
                  onChange={(e) => handleInputChange('hora', e.target.value)}
                />
              </div>

              {/* Ritmo y Eje */}
              <div className={styles.formGroup}>
                <label>Ritmo</label>
                <select
                  value={formData.ritmo || ''}
                  onChange={(e) => handleInputChange('ritmo', e.target.value)}
                >
                  <option value="">Seleccionar ritmo...</option>
                  {RITMOS.map(ritmo => (
                    <option key={ritmo} value={ritmo}>{ritmo}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Eje</label>
                <select
                  value={formData.eje || ''}
                  onChange={(e) => handleInputChange('eje', e.target.value)}
                >
                  <option value="">Seleccionar eje...</option>
                  {EJES.map(eje => (
                    <option key={eje} value={eje}>{eje}</option>
                  ))}
                </select>
              </div>

              {/* Parámetros numéricos */}
              <div className={styles.formGroup}>
                <label>Frecuencia (lpm)</label>
                <input
                  type="number"
                  value={formData.frecuencia || ''}
                  onChange={(e) => handleInputChange('frecuencia', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="60-100"
                  min="20"
                  max="300"
                />
              </div>

              <div className={styles.formGroup}>
                <label>PR (ms)</label>
                <input
                  type="number"
                  value={formData.pr || ''}
                  onChange={(e) => handleInputChange('pr', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="120-200"
                  min="0"
                  max="500"
                />
              </div>

              <div className={styles.formGroup}>
                <label>QRS (ms)</label>
                <input
                  type="number"
                  value={formData.qrs || ''}
                  onChange={(e) => handleInputChange('qrs', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="<120"
                  min="0"
                  max="300"
                />
              </div>

              <div className={styles.formGroup}>
                <label>QT (ms)</label>
                <input
                  type="number"
                  value={formData.qt || ''}
                  onChange={(e) => handleInputChange('qt', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="<440"
                  min="0"
                  max="600"
                />
              </div>

              <div className={styles.formGroup}>
                <label>QTc (ms)</label>
                <input
                  type="number"
                  value={formData.qtc || ''}
                  onChange={(e) => handleInputChange('qtc', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="<450"
                  min="0"
                  max="700"
                />
              </div>

              {/* Hallazgos e Interpretación */}
              <div className={styles.formGroupFull}>
                <label>Hallazgos</label>
                <textarea
                  value={formData.hallazgos || ''}
                  onChange={(e) => handleInputChange('hallazgos', e.target.value)}
                  placeholder="Ej: Ondas T invertidas en V1-V3, infradesnivel ST en DII, DIII, aVF..."
                  rows={3}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label>Interpretación</label>
                <textarea
                  value={formData.interpretacion || ''}
                  onChange={(e) => handleInputChange('interpretacion', e.target.value)}
                  placeholder="Ej: EKG con ritmo sinusal, eje normal, sin alteraciones del segmento ST..."
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.btnPrimary}>
                {editingId ? '💾 Actualizar' : '💾 Guardar'}
              </button>
              <button type="button" className={styles.btnSecondary} onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de EKGs */}
      <div className={styles.recordsList}>
        <h4>📊 Electrocardiogramas ({ekgs.length})</h4>
        
        {ekgs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay electrocardiogramas registrados.</p>
            <p>Haga clic en "Nuevo EKG" para agregar el primero.</p>
          </div>
        ) : (
          <div className={styles.ekgContainer}>
            {ekgs.map((ekg) => (
              <div key={ekg.id} className={styles.ekgCard}>
                <div className={styles.ekgHeader}>
                  <span className={styles.ekgFecha}>
                    📅 {formatDateVenezuela(ekg.fecha)} {ekg.hora && `- ${ekg.hora}`}
                  </span>
                  <button 
                    className={styles.btnEdit}
                    onClick={() => handleEdit(ekg)}
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>
                </div>

                <div className={styles.ekgBody}>
                  <div className={styles.ekgParams}>
                    {ekg.ritmo && (
                      <div className={styles.ekgParam}>
                        <span className={styles.ekgParamLabel}>Ritmo:</span>
                        <span className={styles.ekgParamValue}>{ekg.ritmo}</span>
                      </div>
                    )}
                    {ekg.eje && (
                      <div className={styles.ekgParam}>
                        <span className={styles.ekgParamLabel}>Eje:</span>
                        <span className={styles.ekgParamValue}>{ekg.eje}</span>
                      </div>
                    )}
                    {ekg.frecuencia && (
                      <div className={styles.ekgParam}>
                        <span className={styles.ekgParamLabel}>FC:</span>
                        <span className={`${styles.ekgParamValue} ${getValorStatus('frecuencia', ekg.frecuencia)}`}>
                          {ekg.frecuencia} lpm
                        </span>
                      </div>
                    )}
                    {ekg.pr && (
                      <div className={styles.ekgParam}>
                        <span className={styles.ekgParamLabel}>PR:</span>
                        <span className={`${styles.ekgParamValue} ${getValorStatus('pr', ekg.pr)}`}>
                          {ekg.pr} ms
                        </span>
                      </div>
                    )}
                    {ekg.qrs && (
                      <div className={styles.ekgParam}>
                        <span className={styles.ekgParamLabel}>QRS:</span>
                        <span className={`${styles.ekgParamValue} ${getValorStatus('qrs', ekg.qrs)}`}>
                          {ekg.qrs} ms
                        </span>
                      </div>
                    )}
                    {ekg.qt && (
                      <div className={styles.ekgParam}>
                        <span className={styles.ekgParamLabel}>QT:</span>
                        <span className={`${styles.ekgParamValue} ${getValorStatus('qt', ekg.qt)}`}>
                          {ekg.qt} ms
                        </span>
                      </div>
                    )}
                    {ekg.qtc && (
                      <div className={styles.ekgParam}>
                        <span className={styles.ekgParamLabel}>QTc:</span>
                        <span className={`${styles.ekgParamValue} ${getValorStatus('qtc', ekg.qtc)}`}>
                          {ekg.qtc} ms
                        </span>
                      </div>
                    )}
                  </div>

                  {ekg.hallazgos && (
                    <div className={styles.ekgSeccion}>
                      <strong>🔍 Hallazgos:</strong>
                      <p>{ekg.hallazgos}</p>
                    </div>
                  )}

                  {ekg.interpretacion && (
                    <div className={styles.ekgSeccion}>
                      <strong>💡 Interpretación:</strong>
                      <p>{ekg.interpretacion}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.infoNote}>
        <strong>ℹ️ Valores de referencia EKG:</strong>
        <ul>
          <li>FC: 60-100 lpm</li>
          <li>PR: 120-200 ms</li>
          <li>QRS: &lt;120 ms</li>
          <li>QT: &lt;440 ms</li>
          <li>QTc: &lt;450 ms</li>
        </ul>
      </div>
    </div>
  );
}
