// ==========================================
// SECCIÓN 6: Clínica I - Antecedentes Detallados
// Antecedentes personales, familiares y gineco-obstétricos
// ==========================================

import { useState, useEffect } from 'react';
import styles from './Secciones.module.css';
import type { FormatoHospitalizacion, AntecedentesDetallados } from '@/services/formatoHospitalizacion.service';
import type { Admision } from '@/services/admisiones.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';

interface Props {
  formato: FormatoHospitalizacion;
  admision: Admision;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

export default function Seccion6_Clinica1({ formato, admision, onUpdate, setSaving }: Props) {
  const [formData, setFormData] = useState<Partial<AntecedentesDetallados>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setLocalSaving] = useState(false);

  // Determinar si mostrar sección gineco-obstétrica
  const mostrarGineco = admision.paciente?.sexo === 'F';

  useEffect(() => {
    if (formato.antecedentesDetallados) {
      setFormData(formato.antecedentesDetallados);
    }
  }, [formato.antecedentesDetallados]);

  const handleInputChange = (field: keyof AntecedentesDetallados, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLocalSaving(true);
    setSaving(true);
    try {
      await formatoService.updateAntecedentesDetallados(formato.id, formData);
      await onUpdate();
      setHasChanges(false);
    } catch (error: any) {
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setLocalSaving(false);
      setSaving(false);
    }
  };

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <div>
          <h3>🏥 Clínica I - Antecedentes</h3>
          <p className={styles.seccionDescription}>
            Antecedentes personales, familiares y gineco-obstétricos del paciente
          </p>
        </div>
        <button 
          className={`${styles.btnPrimary} ${!hasChanges ? styles.btnDisabled : ''}`}
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? '💾 Guardando...' : '💾 Guardar Cambios'}
        </button>
      </div>

      <div className={styles.clinicaContainer}>
        {/* Antecedentes Personales */}
        <div className={styles.clinicaSection}>
          <h4>📋 Antecedentes Personales Patológicos</h4>
          
          <div className={styles.clinicaField}>
            <label>Antecedentes Médicos</label>
            <textarea
              value={formData.medicos || ''}
              onChange={(e) => handleInputChange('medicos', e.target.value)}
              placeholder="Ej: HTA desde 2015 en tratamiento con Losartán 50mg/día. DM2 desde 2018, controlada con Metformina 850mg c/12h. Asma bronquial desde la infancia, actualmente asintomático..."
              rows={4}
            />
          </div>

          <div className={styles.clinicaField}>
            <label>Antecedentes Quirúrgicos</label>
            <textarea
              value={formData.quirurgicos || ''}
              onChange={(e) => handleInputChange('quirurgicos', e.target.value)}
              placeholder="Ej: Apendicectomía en 2010 (Hospital Central), Colecistectomía laparoscópica en 2018, sin complicaciones..."
              rows={3}
            />
          </div>

          <div className={styles.clinicaField}>
            <label>Antecedentes Traumáticos</label>
            <textarea
              value={formData.traumaticos || ''}
              onChange={(e) => handleInputChange('traumaticos', e.target.value)}
              placeholder="Ej: Fractura de clavícula izquierda en 2005 (accidente de tránsito), tratamiento conservador..."
              rows={3}
            />
          </div>

          <div className={styles.clinicaField}>
            <label>Alergias</label>
            <textarea
              value={formData.alergias || ''}
              onChange={(e) => handleInputChange('alergias', e.target.value)}
              placeholder="Ej: Alergia a Penicilina (reacción cutánea), intolerancia a AINEs, niega alergias alimentarias..."
              rows={2}
            />
          </div>

          <div className={styles.clinicaField}>
            <label>Antecedentes Transfusionales</label>
            <textarea
              value={formData.transfusionales || ''}
              onChange={(e) => handleInputChange('transfusionales', e.target.value)}
              placeholder="Ej: Transfusión de 2 unidades de GRE en 2019 durante cirugía, sin reacciones adversas..."
              rows={2}
            />
          </div>

          <div className={styles.clinicaField}>
            <label>Toxicomanías / Hábitos</label>
            <textarea
              value={formData.toxicomanias || ''}
              onChange={(e) => handleInputChange('toxicomanias', e.target.value)}
              placeholder="Ej: Tabaquismo: 10 cigarrillos/día x 20 años (IT: 10 paquetes/año). Alcohol: ocasional, social. Niega uso de drogas ilícitas..."
              rows={3}
            />
          </div>
        </div>

        {/* Antecedentes Familiares */}
        <div className={styles.clinicaSection}>
          <h4>👨‍👩‍👧‍👦 Antecedentes Familiares</h4>
          
          <div className={styles.clinicaField}>
            <label>Antecedentes Familiares Patológicos</label>
            <textarea
              value={formData.familiares || ''}
              onChange={(e) => handleInputChange('familiares', e.target.value)}
              placeholder="Ej: Padre: HTA, DM2, fallecido a los 70 años por IAM. Madre: viva, 68 años, hipotiroidismo. Hermano: vivo, 45 años, dislipidemia. Abuelo paterno: cáncer de colon..."
              rows={4}
            />
          </div>
        </div>

        {/* Antecedentes Gineco-obstétricos (solo para mujeres) */}
        {mostrarGineco && (
          <div className={styles.clinicaSection}>
            <h4>👩 Antecedentes Gineco-Obstétricos</h4>
            
            <div className={styles.ginecoGrid}>
              <div className={styles.formGroup}>
                <label>Menarquia (años)</label>
                <input
                  type="number"
                  value={formData.menarquia || ''}
                  onChange={(e) => handleInputChange('menarquia', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Ej: 12"
                  min="8"
                  max="20"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ciclos menstruales</label>
                <input
                  type="text"
                  value={formData.ciclos || ''}
                  onChange={(e) => handleInputChange('ciclos', e.target.value)}
                  placeholder="Ej: 28 x 4 días"
                />
              </div>

              <div className={styles.formGroup}>
                <label>FUM (Fecha Última Menstruación)</label>
                <input
                  type="date"
                  value={formData.fum || ''}
                  onChange={(e) => handleInputChange('fum', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>FUR (Fecha Última Regla)</label>
                <input
                  type="date"
                  value={formData.fur || ''}
                  onChange={(e) => handleInputChange('fur', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>G (Gestas)</label>
                <input
                  type="number"
                  value={formData.gesta || ''}
                  onChange={(e) => handleInputChange('gesta', e.target.value ? parseInt(e.target.value) : undefined)}
                  min="0"
                  max="20"
                />
              </div>

              <div className={styles.formGroup}>
                <label>P (Partos)</label>
                <input
                  type="number"
                  value={formData.para || ''}
                  onChange={(e) => handleInputChange('para', e.target.value ? parseInt(e.target.value) : undefined)}
                  min="0"
                  max="20"
                />
              </div>

              <div className={styles.formGroup}>
                <label>A (Abortos)</label>
                <input
                  type="number"
                  value={formData.aborto || ''}
                  onChange={(e) => handleInputChange('aborto', e.target.value ? parseInt(e.target.value) : undefined)}
                  min="0"
                  max="20"
                />
              </div>

              <div className={styles.formGroup}>
                <label>C (Cesáreas)</label>
                <input
                  type="number"
                  value={formData.cesareas || ''}
                  onChange={(e) => handleInputChange('cesareas', e.target.value ? parseInt(e.target.value) : undefined)}
                  min="0"
                  max="10"
                />
              </div>

              <div className={styles.formGroupFull}>
                <label>Método de Planificación Familiar</label>
                <input
                  type="text"
                  value={formData.planificacion || ''}
                  onChange={(e) => handleInputChange('planificacion', e.target.value)}
                  placeholder="Ej: DIU, ACO, preservativo, ninguno..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {hasChanges && (
        <div className={styles.unsavedWarning}>
          ⚠️ Hay cambios sin guardar. Haga clic en "Guardar Cambios" para no perderlos.
        </div>
      )}

      <div className={styles.infoNote}>
        <strong>ℹ️ Recuerde:</strong>
        <ul>
          <li>Documentar alergias conocidas es crítico para la seguridad del paciente</li>
          <li>Incluir dosis y tiempo de uso en medicamentos crónicos</li>
          <li>Especificar fechas y lugares de cirugías previas</li>
          <li>En antecedentes familiares, incluir causa de muerte si aplica</li>
        </ul>
      </div>
    </div>
  );
}
