// ==========================================
// SECCIÓN 9: Resumen de Ingreso
// Diagnósticos, plan diagnóstico/terapéutico y pronóstico
// ==========================================

import { useState, useEffect } from 'react';
import styles from './Secciones.module.css';
import type { FormatoHospitalizacion, ResumenIngreso } from '@/services/formatoHospitalizacion.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';
import { IconNotes, IconSave, IconTag, IconBook, IconClipboard, IconMicroscope, IconPill, IconChartBar, IconAlertTriangle, IconInfo } from '@/components/icons';

interface Props {
  formato: FormatoHospitalizacion;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

export default function Seccion9_ResumenIngreso({ formato, onUpdate, setSaving }: Props) {
  const [formData, setFormData] = useState<Partial<ResumenIngreso>>({
    diagnosticoPrincipal: '',
    diagnosticosSecundarios: [],
    padecimientoActual: '',
    resumenClinico: '',
    planDiagnostico: '',
    planTerapeutico: '',
    pronostico: 'RESERVADO',
    observaciones: ''
  });
  const [newDiagnostico, setNewDiagnostico] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setLocalSaving] = useState(false);

  useEffect(() => {
    if (formato.resumenIngreso) {
      setFormData({
        ...formato.resumenIngreso,
        diagnosticosSecundarios: formato.resumenIngreso.diagnosticosSecundarios || []
      });
    }
  }, [formato.resumenIngreso]);

  const handleInputChange = (field: keyof ResumenIngreso, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addDiagnosticoSecundario = () => {
    if (newDiagnostico.trim()) {
      const updated = [...(formData.diagnosticosSecundarios || []), newDiagnostico.trim()];
      handleInputChange('diagnosticosSecundarios', updated);
      setNewDiagnostico('');
    }
  };

  const removeDiagnosticoSecundario = (index: number) => {
    const updated = formData.diagnosticosSecundarios?.filter((_, i) => i !== index) || [];
    handleInputChange('diagnosticosSecundarios', updated);
  };

  const handleSave = async () => {
    if (!formData.diagnosticoPrincipal?.trim()) {
      alert('El diagnóstico principal es obligatorio');
      return;
    }

    setLocalSaving(true);
    setSaving(true);
    try {
      await formatoService.updateResumenIngreso(formato.id, formData as ResumenIngreso);
      await onUpdate();
      setHasChanges(false);
    } catch (error: any) {
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setLocalSaving(false);
      setSaving(false);
    }
  };

  const pronosticoOptions = [
    { value: 'BUENO', label: 'Bueno', description: 'Expectativa de recuperación completa sin secuelas', color: '#22c55e' },
    { value: 'RESERVADO', label: 'Reservado', description: 'Evolución incierta, requiere vigilancia estrecha', color: '#eab308' },
    { value: 'GRAVE', label: 'Grave', description: 'Alta probabilidad de complicaciones o secuelas', color: '#f97316' },
    { value: 'MUY_GRAVE', label: 'Muy Grave', description: 'Riesgo vital inmediato, pronóstico sombrío', color: '#ef4444' },
  ];

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <div>
          <h3><IconNotes size={16} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Resumen de Ingreso</h3>
          <p className={styles.seccionDescription}>
            Diagnósticos, plan diagnóstico/terapéutico y pronóstico del paciente
          </p>
        </div>
        <button
          className={`${styles.btnPrimary} ${!hasChanges ? styles.btnDisabled : ''}`}
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          <IconSave size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />{saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className={styles.resumenContainer}>
        {/* Diagnósticos */}
        <div className={styles.resumenSection}>
          <h4><IconTag size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Diagnósticos</h4>

          <div className={styles.formGroup}>
            <label className={styles.required}>Diagnóstico Principal (Dx Ingreso)</label>
            <input
              type="text"
              value={formData.diagnosticoPrincipal || ''}
              onChange={(e) => handleInputChange('diagnosticoPrincipal', e.target.value)}
              placeholder="Ej: Neumonía adquirida en la comunidad (J18.9)"
              className={formData.diagnosticoPrincipal?.trim() ? '' : styles.inputRequired}
            />
            <small>Incluir código CIE-10 si es posible</small>
          </div>

          <div className={styles.formGroup}>
            <label>Diagnósticos Secundarios / Comorbilidades</label>
            <div className={styles.diagnosticosList}>
              {formData.diagnosticosSecundarios?.map((dx, index) => (
                <div key={index} className={styles.diagnosticoItem}>
                  <span>{index + 1}. {dx}</span>
                  <button
                    type="button"
                    onClick={() => removeDiagnosticoSecundario(index)}
                    className={styles.btnRemove}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.addDiagnostico}>
              <input
                type="text"
                value={newDiagnostico}
                onChange={(e) => setNewDiagnostico(e.target.value)}
                placeholder="Agregar diagnóstico secundario..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDiagnosticoSecundario())}
              />
              <button type="button" onClick={addDiagnosticoSecundario} className={styles.btnAdd}>
                + Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Padecimiento Actual */}
        <div className={styles.resumenSection}>
          <h4><IconBook size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Padecimiento Actual</h4>
          <div className={styles.formGroup}>
            <label>Resumen del Padecimiento Actual</label>
            <textarea
              value={formData.padecimientoActual || ''}
              onChange={(e) => handleInputChange('padecimientoActual', e.target.value)}
              placeholder="Describa el padecimiento actual de forma cronológica, incluyendo: inicio, evolución, síntomas, tratamientos previos, factores de riesgo..."
              rows={4}
            />
          </div>
        </div>

        {/* Resumen Clínico */}
        <div className={styles.resumenSection}>
          <h4><IconClipboard size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Resumen Clínico</h4>
          <div className={styles.formGroup}>
            <label>Integración Clínica</label>
            <textarea
              value={formData.resumenClinico || ''}
              onChange={(e) => handleInputChange('resumenClinico', e.target.value)}
              placeholder="Integre los hallazgos relevantes del interrogatorio, exploración física y estudios disponibles. Correlacione con el diagnóstico de ingreso..."
              rows={5}
            />
          </div>
        </div>

        {/* Plan Diagnóstico */}
        <div className={styles.resumenSection}>
          <h4><IconMicroscope size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Plan Diagnóstico</h4>
          <div className={styles.formGroup}>
            <label>Estudios y Procedimientos Diagnósticos</label>
            <textarea
              value={formData.planDiagnostico || ''}
              onChange={(e) => handleInputChange('planDiagnostico', e.target.value)}
              placeholder="Ej:
• BH, QS, EGO, PFH
• Rx de tórax PA y lateral
• TAC de tórax simple y contrastada
• Cultivo de expectoración + antibiograma
• Hemocultivos x2
• PCR COVID-19 / Influenza"
              rows={5}
            />
          </div>
        </div>

        {/* Plan Terapéutico */}
        <div className={styles.resumenSection}>
          <h4><IconPill size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Plan Terapéutico</h4>
          <div className={styles.formGroup}>
            <label>Tratamiento Inicial</label>
            <textarea
              value={formData.planTerapeutico || ''}
              onChange={(e) => handleInputChange('planTerapeutico', e.target.value)}
              placeholder="Ej:
• Ayuno / Dieta blanda
• Soluciones cristaloides IV
• Oxígeno suplementario PRN
• Ceftriaxona 2g IV c/24h
• Azitromicina 500mg VO c/24h
• Paracetamol 1g IV c/8h PRN
• Bromuro de Ipratropio + Salbutamol nebulizado c/8h
• Tromboprofilaxis: Enoxaparina 40mg SC c/24h"
              rows={6}
            />
          </div>
        </div>

        {/* Pronóstico */}
        <div className={styles.resumenSection}>
          <h4><IconChartBar size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Pronóstico</h4>
          <div className={styles.pronosticoGrid}>
            {pronosticoOptions.map((option) => (
              <div
                key={option.value}
                className={`${styles.pronosticoOption} ${formData.pronostico === option.value ? styles.selected : ''}`}
                style={{ borderColor: formData.pronostico === option.value ? option.color : undefined }}
                onClick={() => handleInputChange('pronostico', option.value)}
              >
                <div className={styles.pronosticoHeader} style={{ color: option.color }}>
                  {option.label}
                </div>
                <div className={styles.pronosticoDesc}>
                  {option.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <div className={styles.resumenSection}>
          <h4><IconNotes size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Observaciones Adicionales</h4>
          <div className={styles.formGroup}>
            <label>Notas / Observaciones</label>
            <textarea
              value={formData.observaciones || ''}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              placeholder="Cualquier observación relevante: interconsultas pendientes, consentimientos informados, situaciones especiales..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className={styles.unsavedWarning}>
          <IconAlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Hay cambios sin guardar. Haga clic en "Guardar Cambios" para no perderlos.
        </div>
      )}

      <div className={styles.infoNote}>
        <strong><IconInfo size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Guía para el resumen de ingreso:</strong>
        <ul>
          <li>El diagnóstico principal debe ser el motivo de hospitalización</li>
          <li>Incluya códigos CIE-10 para mejor documentación</li>
          <li>El plan diagnóstico debe ser ordenado por prioridad</li>
          <li>El plan terapéutico debe incluir dosis, vía, frecuencia</li>
          <li>Actualice el pronóstico según evolución del paciente</li>
        </ul>
      </div>
    </div>
  );
}
