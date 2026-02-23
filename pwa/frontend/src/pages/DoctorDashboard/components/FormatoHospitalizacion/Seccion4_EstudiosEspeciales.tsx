// ==========================================
// SECCIÓN 4: Estudios Especiales
// Registro de estudios de imágenes y otros
// ==========================================

import { useState, useEffect } from 'react';
import styles from './Secciones.module.css';
import type { FormatoHospitalizacion, EstudioEspecial } from '@/services/formatoHospitalizacion.service';
import type { Admision } from '@/services/admisiones.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';
import { formatDateVenezuela } from '@/utils/dateUtils';

interface Props {
  formato: FormatoHospitalizacion;
  admision: Admision;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

const TIPOS_ESTUDIO = [
  { value: 'RX_TORAX', label: '🫁 Rx de Tórax', icon: '🫁' },
  { value: 'RX_ABDOMEN', label: '🩻 Rx de Abdomen', icon: '🩻' },
  { value: 'RX_COLUMNA', label: '🦴 Rx de Columna', icon: '🦴' },
  { value: 'RX_EXTREMIDADES', label: '🦵 Rx de Extremidades', icon: '🦵' },
  { value: 'TAC_CABEZA', label: '🧠 TAC de Cabeza', icon: '🧠' },
  { value: 'TAC_TORAX', label: '🫁 TAC de Tórax', icon: '🫁' },
  { value: 'TAC_ABDOMEN', label: '🩻 TAC de Abdomen/Pelvis', icon: '🩻' },
  { value: 'RMN_CEREBRO', label: '🧠 RMN Cerebral', icon: '🧠' },
  { value: 'RMN_COLUMNA', label: '🦴 RMN de Columna', icon: '🦴' },
  { value: 'ECO_ABDOMINAL', label: '📡 Ecografía Abdominal', icon: '📡' },
  { value: 'ECO_PELVICA', label: '📡 Ecografía Pélvica', icon: '📡' },
  { value: 'ECO_RENAL', label: '📡 Ecografía Renal', icon: '📡' },
  { value: 'ECO_CARDIACA', label: '❤️ Ecocardiograma', icon: '❤️' },
  { value: 'ECO_DOPPLER', label: '🔊 Eco Doppler', icon: '🔊' },
  { value: 'ENDOSCOPIA_ALTA', label: '🔬 Endoscopía Alta', icon: '🔬' },
  { value: 'COLONOSCOPIA', label: '🔬 Colonoscopía', icon: '🔬' },
  { value: 'BRONCOSCOPIA', label: '🔬 Broncoscopía', icon: '🔬' },
  { value: 'GAMMAGRAFIA', label: '☢️ Gammagrafía', icon: '☢️' },
  { value: 'ANGIOGRAFIA', label: '🩸 Angiografía', icon: '🩸' },
  { value: 'OTRO', label: '📋 Otro', icon: '📋' },
];

export default function Seccion4_EstudiosEspeciales({ formato, onUpdate, setSaving }: Props) {
  const [estudios, setEstudios] = useState<EstudioEspecial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<EstudioEspecial>>({
    fecha: new Date().toISOString().split('T')[0],
    tipo: '',
    descripcion: '',
  });

  useEffect(() => {
    if (formato.estudiosEspeciales) {
      const sorted = [...formato.estudiosEspeciales].sort((a, b) => {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });
      setEstudios(sorted);
    }
  }, [formato.estudiosEspeciales]);

  const handleInputChange = (field: keyof EstudioEspecial, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fecha || !formData.tipo || !formData.descripcion) {
      alert('Fecha, tipo de estudio y descripción son obligatorios');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await formatoService.updateEstudioEspecial(editingId, formData);
      } else {
        await formatoService.addEstudioEspecial(formato.id, formData as any);
      }
      
      await onUpdate();
      
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        tipo: '',
        descripcion: '',
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (estudio: EstudioEspecial) => {
    setFormData({ ...estudio });
    setEditingId(estudio.id!);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      tipo: '',
      descripcion: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getTipoLabel = (tipo: string) => {
    const found = TIPOS_ESTUDIO.find(t => t.value === tipo);
    return found ? found.label : tipo;
  };

  const getTipoIcon = (tipo: string) => {
    const found = TIPOS_ESTUDIO.find(t => t.value === tipo);
    return found ? found.icon : '📋';
  };

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <div>
          <h3>🩻 Estudios Especiales</h3>
          <p className={styles.seccionDescription}>
            Registro de estudios de imágenes, endoscopías y otros procedimientos diagnósticos
          </p>
        </div>
        <button 
          className={styles.btnPrimary}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Estudio'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className={styles.formCard}>
          <h4>{editingId ? '✏️ Editar Estudio' : '📝 Nuevo Estudio Especial'}</h4>
          
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
                <label>Tipo de Estudio *</label>
                <select
                  value={formData.tipo || ''}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  required
                >
                  <option value="">Seleccionar tipo...</option>
                  {TIPOS_ESTUDIO.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroupFull}>
                <label>Descripción del Estudio *</label>
                <textarea
                  value={formData.descripcion || ''}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Ej: Rx de tórax PA y lateral para evaluar campos pulmonares..."
                  rows={3}
                  required
                />
              </div>

              <div className={styles.formGroupFull}>
                <label>Resultado / Hallazgos</label>
                <textarea
                  value={formData.resultado || ''}
                  onChange={(e) => handleInputChange('resultado', e.target.value)}
                  placeholder="Descripción de los hallazgos del estudio..."
                  rows={4}
                />
              </div>

              <div className={styles.formGroupFull}>
                <label>Interpretación / Conclusión</label>
                <textarea
                  value={formData.interpretacion || ''}
                  onChange={(e) => handleInputChange('interpretacion', e.target.value)}
                  placeholder="Interpretación clínica de los resultados..."
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

      {/* Lista de Estudios */}
      <div className={styles.recordsList}>
        <h4>📊 Estudios Registrados ({estudios.length})</h4>
        
        {estudios.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay estudios especiales registrados.</p>
            <p>Haga clic en "Nuevo Estudio" para agregar el primero.</p>
          </div>
        ) : (
          <div className={styles.estudiosContainer}>
            {estudios.map((estudio) => (
              <div key={estudio.id} className={styles.estudioCard}>
                <div className={styles.estudioHeader}>
                  <div className={styles.estudioTipo}>
                    <span className={styles.estudioIcon}>{getTipoIcon(estudio.tipo)}</span>
                    <span>{getTipoLabel(estudio.tipo)}</span>
                  </div>
                  <div className={styles.estudioMeta}>
                    <span className={styles.estudioFecha}>
                      {formatDateVenezuela(estudio.fecha)}
                    </span>
                    <button 
                      className={styles.btnEdit}
                      onClick={() => handleEdit(estudio)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                <div className={styles.estudioBody}>
                  <div className={styles.estudioSeccion}>
                    <strong>📋 Descripción:</strong>
                    <p>{estudio.descripcion}</p>
                  </div>

                  {estudio.resultado && (
                    <div className={styles.estudioSeccion}>
                      <strong>🔍 Resultado:</strong>
                      <p>{estudio.resultado}</p>
                    </div>
                  )}

                  {estudio.interpretacion && (
                    <div className={styles.estudioSeccion}>
                      <strong>💡 Interpretación:</strong>
                      <p>{estudio.interpretacion}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.infoNote}>
        <strong>ℹ️ Tipos de estudios disponibles:</strong>
        <p>Radiografías, TAC, RMN, Ecografías, Endoscopías, Gammagrafías, Angiografías y otros.</p>
      </div>
    </div>
  );
}
