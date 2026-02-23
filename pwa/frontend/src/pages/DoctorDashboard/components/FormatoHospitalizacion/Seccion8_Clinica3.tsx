// ==========================================
// SECCIÓN 8: Clínica III - Examen Funcional por Sistemas
// Interrogatorio por aparatos y sistemas
// ==========================================

import { useState, useEffect } from 'react';
import styles from './Secciones.module.css';
import type { FormatoHospitalizacion, ExamenFuncional } from '@/services/formatoHospitalizacion.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';

interface Props {
  formato: FormatoHospitalizacion;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

// Sistemas para interrogatorio funcional con sus síntomas comunes
const sistemasFuncionales = [
  { 
    key: 'general', 
    label: 'Síntomas Generales', 
    icon: '🌡️',
    sintomas: ['Fiebre', 'Escalofríos', 'Diaforesis', 'Pérdida de peso', 'Aumento de peso', 'Astenia', 'Adinamia', 'Anorexia'],
    placeholder: 'Otros síntomas generales...'
  },
  { 
    key: 'respiratorio', 
    label: 'Aparato Respiratorio', 
    icon: '🫁',
    sintomas: ['Tos', 'Expectoración', 'Hemoptisis', 'Disnea', 'Ortopnea', 'DPN', 'Dolor torácico', 'Sibilancias'],
    placeholder: 'Describir características de los síntomas...'
  },
  { 
    key: 'cardiovascular', 
    label: 'Aparato Cardiovascular', 
    icon: '❤️',
    sintomas: ['Palpitaciones', 'Dolor precordial', 'Lipotimia', 'Síncope', 'Edema', 'Claudicación', 'Cianosis', 'Disnea de esfuerzo'],
    placeholder: 'Describir características, duración, factores desencadenantes...'
  },
  { 
    key: 'digestivo', 
    label: 'Aparato Digestivo', 
    icon: '🫃',
    sintomas: ['Náuseas', 'Vómito', 'Disfagia', 'Pirosis', 'Dolor abdominal', 'Diarrea', 'Estreñimiento', 'Melena', 'Hematoquecia', 'Ictericia'],
    placeholder: 'Características del dolor, evacuaciones, vómito...'
  },
  { 
    key: 'urinario', 
    label: 'Aparato Urinario', 
    icon: '🚽',
    sintomas: ['Disuria', 'Polaquiuria', 'Nicturia', 'Urgencia', 'Tenesmo', 'Hematuria', 'Incontinencia', 'Retención'],
    placeholder: 'Características de la orina, frecuencia miccional...'
  },
  { 
    key: 'genital', 
    label: 'Aparato Genital', 
    icon: '🔵',
    sintomas: ['Secreción', 'Prurito', 'Lesiones', 'Disfunción sexual', 'Sangrado', 'Dolor', 'Amenorrea', 'Dismenorrea'],
    placeholder: 'Características de síntomas genitales...'
  },
  { 
    key: 'nervioso', 
    label: 'Sistema Nervioso', 
    icon: '🧠',
    sintomas: ['Cefalea', 'Mareos', 'Vértigo', 'Convulsiones', 'Parestesias', 'Debilidad', 'Temblor', 'Alteración de la memoria', 'Alteración visual'],
    placeholder: 'Localización, tipo, duración de síntomas neurológicos...'
  },
  { 
    key: 'endocrino', 
    label: 'Sistema Endocrino', 
    icon: '⚗️',
    sintomas: ['Poliuria', 'Polidipsia', 'Polifagia', 'Intolerancia al calor/frío', 'Cambios de peso', 'Cambios en piel/cabello', 'Fatiga'],
    placeholder: 'Síntomas endocrinos y metabólicos...'
  },
  { 
    key: 'musculoesqueletico', 
    label: 'Sistema Músculo-Esquelético', 
    icon: '🦴',
    sintomas: ['Dolor articular', 'Rigidez', 'Inflamación articular', 'Debilidad muscular', 'Dolor muscular', 'Limitación de movimiento', 'Deformidad'],
    placeholder: 'Localización, tipo de dolor, limitaciones funcionales...'
  },
  { 
    key: 'hematologico', 
    label: 'Sistema Hematológico', 
    icon: '🩸',
    sintomas: ['Sangrado fácil', 'Petequias', 'Equimosis', 'Adenopatías', 'Fatiga', 'Palidez', 'Infecciones recurrentes'],
    placeholder: 'Historia de sangrados, transfusiones previas...'
  },
  { 
    key: 'piel', 
    label: 'Piel y Anexos', 
    icon: '🖐️',
    sintomas: ['Prurito', 'Erupciones', 'Lesiones', 'Cambios de coloración', 'Caída de cabello', 'Cambios en uñas', 'Sequedad'],
    placeholder: 'Describir lesiones cutáneas, localización, evolución...'
  },
  { 
    key: 'psiquiatrico', 
    label: 'Psiquiátrico', 
    icon: '🧘',
    sintomas: ['Ansiedad', 'Depresión', 'Insomnio', 'Cambios de ánimo', 'Irritabilidad', 'Ideación suicida', 'Alucinaciones', 'Ideas delirantes'],
    placeholder: 'Estado de ánimo, sueño, ideación...'
  },
];

export default function Seccion8_Clinica3({ formato, onUpdate, setSaving }: Props) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, string[]>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setLocalSaving] = useState(false);

  useEffect(() => {
    if (formato.examenFuncional) {
      // Cargar datos existentes
      const existing = formato.examenFuncional as any;
      const syms: Record<string, string[]> = {};
      const descs: Record<string, string> = {};
      
      sistemasFuncionales.forEach(sistema => {
        syms[sistema.key] = existing[`${sistema.key}_sintomas`] || [];
        descs[sistema.key] = existing[`${sistema.key}_descripcion`] || '';
      });
      
      setSelectedSymptoms(syms);
      setDescriptions(descs);
    }
  }, [formato.examenFuncional]);

  const toggleSymptom = (sistema: string, sintoma: string) => {
    setSelectedSymptoms(prev => {
      const current = prev[sistema] || [];
      const updated = current.includes(sintoma)
        ? current.filter(s => s !== sintoma)
        : [...current, sintoma];
      return { ...prev, [sistema]: updated };
    });
    setHasChanges(true);
  };

  const handleDescriptionChange = (sistema: string, value: string) => {
    setDescriptions(prev => ({ ...prev, [sistema]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLocalSaving(true);
    setSaving(true);
    try {
      // Construir objeto para guardar
      const dataToSave: Record<string, any> = {};
      sistemasFuncionales.forEach(sistema => {
        dataToSave[`${sistema.key}_sintomas`] = selectedSymptoms[sistema.key] || [];
        dataToSave[`${sistema.key}_descripcion`] = descriptions[sistema.key] || '';
      });
      
      await formatoService.updateExamenFuncional(formato.id, dataToSave as ExamenFuncional);
      await onUpdate();
      setHasChanges(false);
    } catch (error: any) {
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setLocalSaving(false);
      setSaving(false);
    }
  };

  // Calcular estadísticas
  const sistemasConSintomas = sistemasFuncionales.filter(
    s => (selectedSymptoms[s.key]?.length || 0) > 0 || descriptions[s.key]?.trim()
  ).length;

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <div>
          <h3>📋 Clínica III - Interrogatorio por Aparatos y Sistemas</h3>
          <p className={styles.seccionDescription}>
            Revisión sistemática de síntomas por cada sistema corporal
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.progressBadge}>
            {sistemasConSintomas}/{sistemasFuncionales.length} sistemas revisados
          </span>
          <button 
            className={`${styles.btnPrimary} ${!hasChanges ? styles.btnDisabled : ''}`}
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            {saving ? '💾 Guardando...' : '💾 Guardar'}
          </button>
        </div>
      </div>

      <div className={styles.funcionalContainer}>
        {sistemasFuncionales.map((sistema) => {
          const sintomasSeleccionados = selectedSymptoms[sistema.key] || [];
          const tieneContenido = sintomasSeleccionados.length > 0 || descriptions[sistema.key]?.trim();
          
          return (
            <div 
              key={sistema.key} 
              className={`${styles.funcionalSection} ${tieneContenido ? styles.filled : ''}`}
            >
              <div className={styles.funcionalHeader}>
                <span className={styles.funcionalIcon}>{sistema.icon}</span>
                <span className={styles.funcionalLabel}>{sistema.label}</span>
                {sintomasSeleccionados.length > 0 && (
                  <span className={styles.sintomasBadge}>
                    {sintomasSeleccionados.length} síntoma(s)
                  </span>
                )}
              </div>
              
              <div className={styles.sintomasGrid}>
                {sistema.sintomas.map(sintoma => (
                  <button
                    key={sintoma}
                    type="button"
                    className={`${styles.sintomaChip} ${sintomasSeleccionados.includes(sintoma) ? styles.selected : ''}`}
                    onClick={() => toggleSymptom(sistema.key, sintoma)}
                  >
                    {sintomasSeleccionados.includes(sintoma) ? '✓ ' : ''}{sintoma}
                  </button>
                ))}
              </div>
              
              {sintomasSeleccionados.length > 0 && (
                <div className={styles.descripcionArea}>
                  <textarea
                    value={descriptions[sistema.key] || ''}
                    onChange={(e) => handleDescriptionChange(sistema.key, e.target.value)}
                    placeholder={sistema.placeholder}
                    rows={2}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasChanges && (
        <div className={styles.unsavedWarning}>
          ⚠️ Hay cambios sin guardar. Haga clic en "Guardar" para no perderlos.
        </div>
      )}

      <div className={styles.infoNote}>
        <strong>ℹ️ Guía para el interrogatorio:</strong>
        <ul>
          <li>Seleccione los síntomas presentes en cada sistema</li>
          <li>Agregue descripción detallada para síntomas positivos</li>
          <li>Incluya: inicio, duración, intensidad, factores que modifican</li>
          <li>Documente síntomas negativos pertinentes según el padecimiento</li>
          <li>Este interrogatorio complementa el motivo de consulta y EF</li>
        </ul>
      </div>
    </div>
  );
}
