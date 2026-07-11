// ==========================================
// SECCIÓN 10: Órdenes Médicas
// Órdenes médicas activas con CRUD completo
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import styles from './Secciones.module.css';
import type { FormatoHospitalizacion, OrdenMedica } from '@/services/formatoHospitalizacion.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';
import { IconClipboard, IconPlus, IconEdit, IconSave, IconTrash, IconCheck, IconPause, IconPill, IconFlask, IconCamera, IconUtensilsCrossed, IconStethoscope, IconDoctor, IconWrench, IconNotes, IconClock, IconInfo } from '@/components/icons';

interface Props {
  formato: FormatoHospitalizacion;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

// Tipos de órdenes médicas
const tiposOrden = [
  { value: 'MEDICAMENTO', label: 'Medicamento', icon: <IconPill size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />, color: '#3b82f6' },
  { value: 'LABORATORIO', label: 'Laboratorio', icon: <IconFlask size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />, color: '#8b5cf6' },
  { value: 'IMAGEN', label: 'Imagen/Estudio', icon: <IconCamera size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />, color: '#06b6d4' },
  { value: 'DIETA', label: 'Dieta', icon: <IconUtensilsCrossed size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />, color: '#22c55e' },
  { value: 'CUIDADOS', label: 'Cuidados Enfermería', icon: <IconStethoscope size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />, color: '#f59e0b' },
  { value: 'INTERCONSULTA', label: 'Interconsulta', icon: <IconDoctor size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />, color: '#ec4899' },
  { value: 'PROCEDIMIENTO', label: 'Procedimiento', icon: <IconWrench size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />, color: '#ef4444' },
  { value: 'OTRO', label: 'Otro', icon: <IconNotes size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />, color: '#6b7280' },
];

// Frecuencias de administración comunes
const frecuencias = [
  { value: 'STAT', label: 'STAT (Inmediato)' },
  { value: 'C/4H', label: 'Cada 4 horas' },
  { value: 'C/6H', label: 'Cada 6 horas' },
  { value: 'C/8H', label: 'Cada 8 horas' },
  { value: 'C/12H', label: 'Cada 12 horas' },
  { value: 'C/24H', label: 'Cada 24 horas' },
  { value: 'PRN', label: 'PRN (Si es necesario)' },
  { value: 'DOSIS_UNICA', label: 'Dosis única' },
  { value: 'CUSTOM', label: 'Personalizado' },
];

// Vías de administración
const vias = [
  'VO (Vía Oral)',
  'IV (Intravenoso)',
  'IM (Intramuscular)',
  'SC (Subcutáneo)',
  'SL (Sublingual)',
  'TD (Transdérmico)',
  'INH (Inhalado)',
  'NEB (Nebulizado)',
  'TOP (Tópico)',
  'VR (Vía Rectal)',
  'VV (Vía Vaginal)',
  'IO (Intraóseo)',
  'IT (Intratecal)',
];

const nuevaOrdenDefault: Partial<OrdenMedica> = {
  tipo: 'MEDICAMENTO',
  descripcion: '',
  dosis: '',
  via: '',
  frecuencia: '',
  duracion: '',
  indicaciones: '',
  estado: 'ACTIVA',
};

export default function Seccion10_OrdenesMedicas({ formato, onUpdate, setSaving }: Props) {
  const [ordenes, setOrdenes] = useState<OrdenMedica[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<OrdenMedica>>(nuevaOrdenDefault);
  const [saving, setLocalSaving] = useState(false);
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');
  const [filterEstado, setFilterEstado] = useState<string>('ACTIVA');

  // Cargar órdenes
  const loadOrdenes = useCallback(async () => {
    try {
      const data = await formatoService.getOrdenesMedicas(formato.id);
      setOrdenes(data);
    } catch (error: any) {
      // Error loading medical orders
    }
  }, [formato.id]);

  useEffect(() => {
    loadOrdenes();
  }, [loadOrdenes]);

  const handleInputChange = (field: keyof OrdenMedica, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(nuevaOrdenDefault);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.descripcion?.trim()) {
      alert('La descripción es obligatoria');
      return;
    }

    setLocalSaving(true);
    setSaving(true);
    try {
      if (editingId) {
        await formatoService.updateOrdenMedica(editingId, formData);
      } else {
        await formatoService.addOrdenMedica(formato.id, formData as Omit<OrdenMedica, 'id'>);
      }
      await loadOrdenes();
      await onUpdate();
      resetForm();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLocalSaving(false);
      setSaving(false);
    }
  };

  const handleEdit = (orden: OrdenMedica) => {
    setFormData(orden);
    setEditingId(orden.id);
    setShowForm(true);
  };

  const handleSuspend = async (id: string) => {
    if (!confirm('¿Suspender esta orden médica?')) return;

    setLocalSaving(true);
    setSaving(true);
    try {
      await formatoService.updateOrdenMedica(id, { estado: 'SUSPENDIDA' });
      await loadOrdenes();
      await onUpdate();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLocalSaving(false);
      setSaving(false);
    }
  };

  const handleComplete = async (id: string) => {
    setLocalSaving(true);
    setSaving(true);
    try {
      await formatoService.updateOrdenMedica(id, { estado: 'COMPLETADA' });
      await loadOrdenes();
      await onUpdate();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLocalSaving(false);
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta orden médica? Esta acción no se puede deshacer.')) return;

    setLocalSaving(true);
    setSaving(true);
    try {
      await formatoService.deleteOrdenMedica(id);
      await loadOrdenes();
      await onUpdate();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLocalSaving(false);
      setSaving(false);
    }
  };

  // Filtrar órdenes
  const ordenesFiltradas = ordenes.filter(orden => {
    if (filterTipo !== 'TODOS' && orden.tipo !== filterTipo) return false;
    if (filterEstado !== 'TODAS' && orden.estado !== filterEstado) return false;
    return true;
  });

  // Estadísticas
  const ordenesActivas = ordenes.filter(o => o.estado === 'ACTIVA').length;
  const totalOrdenes = ordenes.length;

  const getTipoInfo = (tipo: string) => tiposOrden.find(t => t.value === tipo) || tiposOrden[tiposOrden.length - 1];

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <div>
          <h3><IconClipboard size={16} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Órdenes Médicas</h3>
          <p className={styles.seccionDescription}>
            Gestión de órdenes médicas activas y su seguimiento
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.statBadge}>
            {ordenesActivas} activas / {totalOrdenes} total
          </span>
          <button
            className={styles.btnPrimary}
            onClick={() => { resetForm(); setShowForm(true); }}
          >
            <IconPlus size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Nueva Orden
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.ordenesFilters}>
        <div className={styles.filterGroup}>
          <label>Tipo:</label>
          <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
            <option value="TODOS">Todos</option>
            {tiposOrden.map(tipo => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Estado:</label>
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="TODAS">Todas</option>
            <option value="ACTIVA">Activas</option>
            <option value="SUSPENDIDA">Suspendidas</option>
            <option value="COMPLETADA">Completadas</option>
          </select>
        </div>
      </div>

      {/* Formulario de nueva/editar orden */}
      {showForm && (
        <div className={styles.ordenForm}>
          <h4>
            {editingId
              ? <><IconEdit size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Editar Orden</>
              : <><IconPlus size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Nueva Orden Médica</>}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className={styles.ordenFormGrid}>
              <div className={styles.formGroup}>
                <label className={styles.required}>Tipo de Orden</label>
                <select
                  value={formData.tipo || 'MEDICAMENTO'}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                >
                  {tiposOrden.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroupSpan2}>
                <label className={styles.required}>Descripción / Medicamento</label>
                <input
                  type="text"
                  value={formData.descripcion || ''}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Ej: Ceftriaxona 2g, BH completa, TAC de tórax..."
                  required
                />
              </div>

              {formData.tipo === 'MEDICAMENTO' && (
                <>
                  <div className={styles.formGroup}>
                    <label>Dosis</label>
                    <input
                      type="text"
                      value={formData.dosis || ''}
                      onChange={(e) => handleInputChange('dosis', e.target.value)}
                      placeholder="Ej: 2g, 500mg, 1 tableta..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Vía de Administración</label>
                    <select
                      value={formData.via || ''}
                      onChange={(e) => handleInputChange('via', e.target.value)}
                    >
                      <option value="">Seleccionar vía...</option>
                      {vias.map(via => (
                        <option key={via} value={via}>{via}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Frecuencia</label>
                    <select
                      value={formData.frecuencia || ''}
                      onChange={(e) => handleInputChange('frecuencia', e.target.value)}
                    >
                      <option value="">Seleccionar frecuencia...</option>
                      {frecuencias.map(freq => (
                        <option key={freq.value} value={freq.value}>{freq.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Duración</label>
                    <input
                      type="text"
                      value={formData.duracion || ''}
                      onChange={(e) => handleInputChange('duracion', e.target.value)}
                      placeholder="Ej: 7 días, hasta nuevo aviso..."
                    />
                  </div>
                </>
              )}

              <div className={styles.formGroupFull}>
                <label>Indicaciones Especiales</label>
                <textarea
                  value={formData.indicaciones || ''}
                  onChange={(e) => handleInputChange('indicaciones', e.target.value)}
                  placeholder="Instrucciones adicionales, precauciones, condiciones especiales..."
                  rows={2}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={resetForm} className={styles.btnSecondary}>
                Cancelar
              </button>
              <button type="submit" disabled={saving} className={styles.btnPrimary}>
                {saving
                  ? <><IconSave size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Guardando...</>
                  : editingId
                    ? <><IconEdit size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Actualizar</>
                    : <><IconPlus size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />Agregar</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de órdenes */}
      <div className={styles.ordenesList}>
        {ordenesFiltradas.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}><IconClipboard size={32} /></span>
            <p>No hay órdenes médicas {filterEstado !== 'TODAS' ? `${filterEstado.toLowerCase()}s` : ''}</p>
            <button
              className={styles.btnPrimary}
              onClick={() => { resetForm(); setShowForm(true); }}
            >
              <IconPlus size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Crear Primera Orden
            </button>
          </div>
        ) : (
          ordenesFiltradas.map((orden) => {
            const tipoInfo = getTipoInfo(orden.tipo);
            return (
              <div
                key={orden.id}
                className={`${styles.ordenCard} ${styles[`estado${orden.estado}`]}`}
                style={{ borderLeftColor: tipoInfo.color }}
              >
                <div className={styles.ordenHeader}>
                  <span className={styles.ordenTipo} style={{ backgroundColor: tipoInfo.color }}>
                    {tipoInfo.icon}{tipoInfo.label}
                  </span>
                  <span className={`${styles.ordenEstado} ${styles[orden.estado.toLowerCase()]}`}>
                    {orden.estado === 'ACTIVA' && <><IconCheck size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />Activa</>}
                    {orden.estado === 'SUSPENDIDA' && <><IconPause size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />Suspendida</>}
                    {orden.estado === 'COMPLETADA' && <><IconCheck size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} />Completada</>}
                  </span>
                </div>

                <div className={styles.ordenBody}>
                  <div className={styles.ordenDescripcion}>
                    <strong>{orden.descripcion}</strong>
                    {orden.tipo === 'MEDICAMENTO' && orden.dosis && (
                      <span className={styles.ordenDosis}>
                        {orden.dosis} {orden.via && `- ${orden.via}`} {orden.frecuencia && `- ${orden.frecuencia}`}
                      </span>
                    )}
                  </div>
                  {orden.duracion && (
                    <div className={styles.ordenDuracion}>
                      <span><IconClock size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} /> Duración: {orden.duracion}</span>
                    </div>
                  )}
                  {orden.indicaciones && (
                    <div className={styles.ordenIndicaciones}>
                      <span><IconNotes size={12} style={{ verticalAlign: 'middle', marginRight: '0.2em' }} /> {orden.indicaciones}</span>
                    </div>
                  )}
                  <div className={styles.ordenMeta}>
                    <small>
                      Creada: {new Date(orden.fechaCreacion || '').toLocaleString('es-MX')}
                    </small>
                  </div>
                </div>

                <div className={styles.ordenActions}>
                  {orden.estado === 'ACTIVA' && (
                    <>
                      <button
                        onClick={() => handleEdit(orden)}
                        className={styles.btnIcon}
                        title="Editar"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleComplete(orden.id)}
                        className={styles.btnIcon}
                        title="Marcar como completada"
                      >
                        <IconCheck size={14} />
                      </button>
                      <button
                        onClick={() => handleSuspend(orden.id)}
                        className={styles.btnIconWarning}
                        title="Suspender"
                      >
                        <IconPause size={14} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(orden.id)}
                    className={styles.btnIconDanger}
                    title="Eliminar"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className={styles.infoNote}>
        <strong><IconInfo size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Gestión de Órdenes Médicas:</strong>
        <ul>
          <li>Las órdenes activas aparecen al inicio de la lista</li>
          <li>Use "Completar" cuando una orden ya no aplique</li>
          <li>Use "Suspender" para pausar temporalmente una orden</li>
          <li>Las órdenes eliminadas no se pueden recuperar</li>
          <li>Incluya siempre dosis, vía y frecuencia para medicamentos</li>
        </ul>
      </div>
    </div>
  );
}
