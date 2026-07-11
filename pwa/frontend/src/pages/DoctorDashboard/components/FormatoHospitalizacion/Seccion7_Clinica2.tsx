// ==========================================
// SECCIÓN 7: Clínica II - Examen Físico Completo
// Exploración física por sistemas y regiones
// ==========================================

import { useState, useEffect } from 'react';
import styles from './Secciones.module.css';
import type { FormatoHospitalizacion, ExamenFisico } from '@/services/formatoHospitalizacion.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';
import { IconStethoscope, IconSave, IconBook, IconCheck, IconAlertTriangle, IconInfo } from '@/components/icons';

interface Props {
  formato: FormatoHospitalizacion;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

// Estructura del examen físico por sistemas
const sistemasExamen = [
  { key: 'general', label: 'Estado General', placeholder: 'Ej: Paciente alerta, orientado en 3 esferas, bien hidratado, cooperador, sin facies de dolor agudo...' },
  { key: 'cabeza', label: 'Cabeza', placeholder: 'Ej: Normocéfalo, sin lesiones visibles, cabello de implantación normal...' },
  { key: 'ojos', label: 'Ojos', placeholder: 'Ej: Pupilas isocóricas, normorreactivas a la luz, conjuntivas rosadas, escleras anictéricas...' },
  { key: 'oidos', label: 'Oídos', placeholder: 'Ej: Conductos auditivos permeables, tímpanos íntegros, sin secreciones...' },
  { key: 'nariz', label: 'Nariz', placeholder: 'Ej: Tabique centrado, mucosas húmedas, sin secreciones, cornetes normales...' },
  { key: 'boca', label: 'Boca / Faringe', placeholder: 'Ej: Mucosa oral húmeda, sin lesiones, dentadura completa, orofaringe no congestiva, amígdalas G I...' },
  { key: 'cuello', label: 'Cuello', placeholder: 'Ej: Cilíndrico, móvil, sin adenopatías, pulsos carotídeos simétricos, tiroides no palpable, sin ingurgitación yugular...' },
  { key: 'torax', label: 'Tórax', placeholder: 'Ej: Simétrico, expansible, sin deformidades, sin dolor a la palpación...' },
  { key: 'pulmones', label: 'Pulmones', placeholder: 'Ej: Murmullo vesicular presente bilateral, sin estertores, sin sibilancias, sin frote pleural...' },
  { key: 'cardiovascular', label: 'Cardiovascular', placeholder: 'Ej: Ruidos cardíacos rítmicos, sin soplos, sin S3 ni S4, llenado capilar < 2 segundos, pulsos periféricos presentes y simétricos...' },
  { key: 'abdomen', label: 'Abdomen', placeholder: 'Ej: Plano, blando, depresible, no doloroso a la palpación, peristalsis presente, sin visceromegalias, sin masas, Murphy (-), McBurney (-), puño-percusión (-)...' },
  { key: 'genitourinario', label: 'Genitourinario', placeholder: 'Ej: Genitales externos sin alteraciones, puño-percusión renal negativa bilateral, sin globo vesical...' },
  { key: 'extremidades', label: 'Extremidades', placeholder: 'Ej: Simétricas, sin edema, sin deformidades, pulsos distales presentes, llenado capilar < 2 seg, sin signos de TVP, movilidad conservada...' },
  { key: 'piel', label: 'Piel y Faneras', placeholder: 'Ej: Normotermica, hidratada, sin lesiones, sin petequias ni equimosis, uñas sin alteraciones...' },
  { key: 'neurologico', label: 'Neurológico', placeholder: 'Ej: Glasgow 15/15 (O4 V5 M6), pares craneales sin alteraciones, fuerza muscular 5/5 en 4 extremidades, sensibilidad conservada, ROT ++/++++, sin signos meníngeos...' },
  { key: 'muscEsqueletico', label: 'Músculo-Esquelético', placeholder: 'Ej: Marcha estable, arcos de movilidad conservados, sin deformidades articulares, columna sin dolor a la palpación...' },
];

export default function Seccion7_Clinica2({ formato, onUpdate, setSaving }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setLocalSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));

  useEffect(() => {
    if (formato.examenFisicoCompleto) {
      // Convertir el examen físico existente a formato de formulario
      const existing: Record<string, string> = {};
      sistemasExamen.forEach(sistema => {
        existing[sistema.key] = (formato.examenFisicoCompleto as any)?.[sistema.key] || '';
      });
      setFormData(existing);
    }
  }, [formato.examenFisicoCompleto]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(sistemasExamen.map(s => s.key)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const handleSave = async () => {
    setLocalSaving(true);
    setSaving(true);
    try {
      await formatoService.updateExamenFisico(formato.id, formData as ExamenFisico);
      await onUpdate();
      setHasChanges(false);
    } catch (error: any) {
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setLocalSaving(false);
      setSaving(false);
    }
  };

  // Calcular progreso
  const camposLlenos = sistemasExamen.filter(s => formData[s.key]?.trim()).length;
  const porcentaje = Math.round((camposLlenos / sistemasExamen.length) * 100);

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <div>
          <h3><IconStethoscope size={16} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Clínica II - Examen Físico</h3>
          <p className={styles.seccionDescription}>
            Exploración física completa por sistemas y regiones anatómicas
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.progressBadge}>
            {camposLlenos}/{sistemasExamen.length} ({porcentaje}%)
          </span>
          <button
            className={`${styles.btnPrimary} ${!hasChanges ? styles.btnDisabled : ''}`}
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            <IconSave size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />{saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className={styles.expandCollapseBar}>
        <button onClick={expandAll} className={styles.btnSecondary}>
          <IconBook size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Expandir Todo
        </button>
        <button onClick={collapseAll} className={styles.btnSecondary}>
          <IconBook size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Colapsar Todo
        </button>
      </div>

      <div className={styles.examenContainer}>
        {sistemasExamen.map((sistema) => (
          <div
            key={sistema.key}
            className={`${styles.examenSection} ${expandedSections.has(sistema.key) ? styles.expanded : ''} ${formData[sistema.key]?.trim() ? styles.filled : ''}`}
          >
            <div
              className={styles.examenHeader}
              onClick={() => toggleSection(sistema.key)}
            >
              <span className={styles.examenIcon}>
                {formData[sistema.key]?.trim() ? <IconCheck size={14} /> : <span style={{ display: 'inline-block', width: 14, height: 14 }} />}
              </span>
              <span className={styles.examenLabel}>{sistema.label}</span>
              <span className={styles.expandIcon}>
                {expandedSections.has(sistema.key) ? '▼' : '▶'}
              </span>
            </div>

            {expandedSections.has(sistema.key) && (
              <div className={styles.examenBody}>
                <textarea
                  value={formData[sistema.key] || ''}
                  onChange={(e) => handleInputChange(sistema.key, e.target.value)}
                  placeholder={sistema.placeholder}
                  rows={3}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className={styles.unsavedWarning}>
          <IconAlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Hay cambios sin guardar. Haga clic en "Guardar" para no perderlos.
        </div>
      )}

      <div className={styles.infoNote}>
        <strong><IconInfo size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Guía para el examen físico:</strong>
        <ul>
          <li>Sea sistemático: examine de cabeza a pies</li>
          <li>Documente hallazgos positivos Y negativos pertinentes</li>
          <li>Use terminología médica estándar</li>
          <li>Compare hallazgos bilaterales cuando aplique</li>
          <li>Incluya escala de Glasgow si hay alteración neurológica</li>
        </ul>
      </div>
    </div>
  );
}
