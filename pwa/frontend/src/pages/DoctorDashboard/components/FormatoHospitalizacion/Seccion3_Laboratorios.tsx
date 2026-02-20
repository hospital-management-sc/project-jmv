// ==========================================
// SECCIÓN 3: Laboratorios
// Resultados de laboratorio (44 parámetros)
// ==========================================

import { useState, useEffect } from 'react';
import styles from './Secciones.module.css';
import type { FormatoHospitalizacion, Laboratorio } from '@/services/formatoHospitalizacion.service';
import type { Admision } from '@/services/admisiones.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';
import { formatDateVenezuela } from '@/utils/dateUtils';

interface Props {
  formato: FormatoHospitalizacion;
  admision: Admision;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

// Definición de campos por categoría
const CAMPOS_LABORATORIO = {
  hematologia: {
    titulo: '🩸 Hematología',
    campos: [
      { key: 'hgb', label: 'Hemoglobina', unidad: 'g/dL', min: 12, max: 17 },
      { key: 'hct', label: 'Hematocrito', unidad: '%', min: 36, max: 50 },
      { key: 'vcm', label: 'VCM', unidad: 'fL', min: 80, max: 100 },
      { key: 'chcm', label: 'CHCM', unidad: 'g/dL', min: 32, max: 36 },
      { key: 'leucocitos', label: 'Leucocitos', unidad: '/mm³', min: 4500, max: 11000 },
      { key: 'neutrofilos', label: 'Neutrófilos', unidad: '%', min: 50, max: 70 },
      { key: 'linfocitos', label: 'Linfocitos', unidad: '%', min: 20, max: 40 },
      { key: 'eosinofilos', label: 'Eosinófilos', unidad: '%', min: 1, max: 4 },
      { key: 'plaquetas', label: 'Plaquetas', unidad: '/mm³', min: 150000, max: 400000 },
    ]
  },
  coagulacion: {
    titulo: '🔬 Coagulación',
    campos: [
      { key: 'pt', label: 'PT', unidad: 'seg', min: 11, max: 14 },
      { key: 'ptt', label: 'PTT', unidad: 'seg', min: 25, max: 35 },
      { key: 'inr', label: 'INR', unidad: '', min: 0.8, max: 1.2 },
      { key: 'fibrinogeno', label: 'Fibrinógeno', unidad: 'mg/dL', min: 200, max: 400 },
    ]
  },
  reactantes: {
    titulo: '🧪 Reactantes de Fase Aguda',
    campos: [
      { key: 'vsg', label: 'VSG', unidad: 'mm/h', min: 0, max: 20 },
      { key: 'pcr', label: 'PCR', unidad: 'mg/L', min: 0, max: 10 },
    ]
  },
  quimica: {
    titulo: '⚗️ Química Sanguínea',
    campos: [
      { key: 'glicemia', label: 'Glicemia', unidad: 'mg/dL', min: 70, max: 110 },
      { key: 'urea', label: 'Urea', unidad: 'mg/dL', min: 15, max: 45 },
      { key: 'creatinina', label: 'Creatinina', unidad: 'mg/dL', min: 0.7, max: 1.3 },
      { key: 'amilasa', label: 'Amilasa', unidad: 'U/L', min: 30, max: 110 },
      { key: 'lipasa', label: 'Lipasa', unidad: 'U/L', min: 0, max: 160 },
      { key: 'tgo', label: 'TGO (AST)', unidad: 'U/L', min: 5, max: 40 },
      { key: 'tgp', label: 'TGP (ALT)', unidad: 'U/L', min: 5, max: 40 },
      { key: 'troponina', label: 'Troponina', unidad: 'ng/mL', min: 0, max: 0.04 },
      { key: 'fosfatasa_alcalina', label: 'Fosfatasa Alcalina', unidad: 'U/L', min: 44, max: 147 },
      { key: 'bilirrubina_total', label: 'Bilirrubina Total', unidad: 'mg/dL', min: 0.1, max: 1.2 },
      { key: 'bilirrubina_directa', label: 'Bilirrubina Directa', unidad: 'mg/dL', min: 0, max: 0.3 },
      { key: 'bilirrubina_indirecta', label: 'Bilirrubina Indirecta', unidad: 'mg/dL', min: 0.1, max: 0.9 },
      { key: 'acido_urico', label: 'Ácido Úrico', unidad: 'mg/dL', min: 3.5, max: 7.2 },
      { key: 'proteinas_totales', label: 'Proteínas Totales', unidad: 'g/dL', min: 6, max: 8 },
      { key: 'albumina', label: 'Albúmina', unidad: 'g/dL', min: 3.5, max: 5 },
      { key: 'globulina', label: 'Globulina', unidad: 'g/dL', min: 2.3, max: 3.5 },
      { key: 'ldh', label: 'LDH', unidad: 'U/L', min: 140, max: 280 },
      { key: 'colesterol', label: 'Colesterol', unidad: 'mg/dL', min: 0, max: 200 },
      { key: 'trigliceridos', label: 'Triglicéridos', unidad: 'mg/dL', min: 0, max: 150 },
    ]
  },
  electrolitos: {
    titulo: '⚡ Electrolitos',
    campos: [
      { key: 'sodio', label: 'Sodio', unidad: 'mEq/L', min: 136, max: 145 },
      { key: 'potasio', label: 'Potasio', unidad: 'mEq/L', min: 3.5, max: 5 },
      { key: 'cloro', label: 'Cloro', unidad: 'mEq/L', min: 98, max: 106 },
      { key: 'calcio', label: 'Calcio', unidad: 'mg/dL', min: 8.5, max: 10.5 },
      { key: 'magnesio', label: 'Magnesio', unidad: 'mg/dL', min: 1.7, max: 2.2 },
      { key: 'fosforo', label: 'Fósforo', unidad: 'mg/dL', min: 2.5, max: 4.5 },
    ]
  }
};

export default function Seccion3_Laboratorios({ formato, onUpdate, setSaving }: Props) {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('hematologia');
  const [formData, setFormData] = useState<Partial<Laboratorio>>({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
  });

  useEffect(() => {
    if (formato.laboratorios) {
      const sorted = [...formato.laboratorios].sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora || '00:00'}`).getTime();
        const dateB = new Date(`${b.fecha}T${b.hora || '00:00'}`).getTime();
        return dateB - dateA;
      });
      setLaboratorios(sorted);
    }
  }, [formato.laboratorios]);

  const handleInputChange = (field: string, value: any) => {
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
        await formatoService.updateLaboratorio(editingId, formData);
      } else {
        await formatoService.addLaboratorio(formato.id, formData as any);
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

  const handleEdit = (lab: Laboratorio) => {
    setFormData({ ...lab });
    setEditingId(lab.id!);
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
    if (valor === undefined || valor === null) return '';
    
    // Buscar el campo en todas las categorías
    for (const cat of Object.values(CAMPOS_LABORATORIO)) {
      const campo = cat.campos.find(c => c.key === key);
      if (campo) {
        if (valor < campo.min) return styles.bajo;
        if (valor > campo.max) return styles.alto;
        return styles.normal;
      }
    }
    return '';
  };

  const renderCampoInput = (campo: { key: string; label: string; unidad: string; min: number; max: number }) => (
    <div className={styles.labField} key={campo.key}>
      <label>
        {campo.label}
        <span className={styles.unidad}>({campo.unidad})</span>
      </label>
      <div className={styles.labInputGroup}>
        <input
          type="number"
          step="0.01"
          value={(formData as any)[campo.key] || ''}
          onChange={(e) => handleInputChange(campo.key, e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder={`${campo.min} - ${campo.max}`}
        />
        <span className={styles.refRange}>Ref: {campo.min} - {campo.max}</span>
      </div>
    </div>
  );

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <div>
          <h3>🔬 Laboratorios</h3>
          <p className={styles.seccionDescription}>
            Registro de resultados de laboratorio (44 parámetros)
          </p>
        </div>
        <button 
          className={styles.btnPrimary}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Registro'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className={styles.formCard}>
          <h4>{editingId ? '✏️ Editar Laboratorio' : '📝 Nuevo Registro de Laboratorio'}</h4>
          
          <form onSubmit={handleSubmit}>
            {/* Fecha y Hora */}
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
                <label>Hora</label>
                <input
                  type="time"
                  value={formData.hora || ''}
                  onChange={(e) => handleInputChange('hora', e.target.value)}
                />
              </div>
            </div>

            {/* Tabs de categorías */}
            <div className={styles.labCategoryTabs}>
              {Object.entries(CAMPOS_LABORATORIO).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.labCategoryTab} ${activeCategory === key ? styles.active : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  {cat.titulo}
                </button>
              ))}
            </div>

            {/* Campos de la categoría activa */}
            <div className={styles.labFieldsGrid}>
              {CAMPOS_LABORATORIO[activeCategory as keyof typeof CAMPOS_LABORATORIO].campos.map(renderCampoInput)}
            </div>

            {/* Observaciones */}
            <div className={styles.formGroupFull}>
              <label>Observaciones</label>
              <textarea
                value={(formData as any).observacion || ''}
                onChange={(e) => handleInputChange('observacion', e.target.value)}
                placeholder="Notas adicionales sobre los resultados..."
                rows={3}
              />
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

      {/* Lista de Registros */}
      <div className={styles.recordsList}>
        <h4>📊 Historial de Laboratorios ({laboratorios.length} registros)</h4>
        
        {laboratorios.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay registros de laboratorio aún.</p>
            <p>Haga clic en "Nuevo Registro" para agregar el primero.</p>
          </div>
        ) : (
          <div className={styles.labCardsContainer}>
            {laboratorios.map((lab) => (
              <div key={lab.id} className={styles.labCard}>
                <div className={styles.labCardHeader}>
                  <div>
                    <span className={styles.labCardFecha}>
                      {formatDateVenezuela(lab.fecha)} {lab.hora && `- ${lab.hora}`}
                    </span>
                  </div>
                  <button 
                    className={styles.btnEdit}
                    onClick={() => handleEdit(lab)}
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>
                </div>

                <div className={styles.labCardBody}>
                  {/* Mostrar solo valores que tienen datos */}
                  {Object.entries(CAMPOS_LABORATORIO).map(([catKey, cat]) => {
                    const valoresConDatos = cat.campos.filter(c => (lab as any)[c.key] !== null && (lab as any)[c.key] !== undefined);
                    if (valoresConDatos.length === 0) return null;
                    
                    return (
                      <div key={catKey} className={styles.labCardSection}>
                        <h5>{cat.titulo}</h5>
                        <div className={styles.labCardValues}>
                          {valoresConDatos.map(campo => (
                            <div key={campo.key} className={styles.labCardValue}>
                              <span className={styles.labCardLabel}>{campo.label}:</span>
                              <span className={`${styles.labCardNum} ${getValorStatus(campo.key, (lab as any)[campo.key])}`}>
                                {(lab as any)[campo.key]} {campo.unidad}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(lab as any).observacion && (
                  <div className={styles.labCardObs}>
                    <strong>Observaciones:</strong> {(lab as any).observacion}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.infoNote}>
        <strong>ℹ️ Valores de referencia:</strong>
        <p>Los valores fuera de rango se mostrarán en <span className={styles.alto}>rojo (alto)</span> o <span className={styles.bajo}>azul (bajo)</span>.</p>
      </div>
    </div>
  );
}
