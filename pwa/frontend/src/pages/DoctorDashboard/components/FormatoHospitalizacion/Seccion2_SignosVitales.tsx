// ==========================================
// SECCIÓN 2: Signos Vitales
// Registro múltiple de signos vitales durante hospitalización
// ==========================================

import { useState, useEffect } from 'react';
import styles from './Secciones.module.css';
import type { FormatoHospitalizacion, SignosVitalesHosp } from '@/services/formatoHospitalizacion.service';
import type { Admision } from '@/services/admisiones.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';
import { formatDateVenezuela } from '@/utils/dateUtils';

interface Props {
  formato: FormatoHospitalizacion;
  admision: Admision;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

export default function Seccion2_SignosVitales({ formato, onUpdate, setSaving }: Props) {
  const [signosVitales, setSignosVitales] = useState<SignosVitalesHosp[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<SignosVitalesHosp>>({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
  });

  useEffect(() => {
    if (formato.signosVitales) {
      // Ordenar por fecha y hora descendente (más recientes primero)
      const sorted = [...formato.signosVitales].sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora}`).getTime();
        const dateB = new Date(`${b.fecha}T${b.hora}`).getTime();
        return dateB - dateA;
      });
      setSignosVitales(sorted);
    }
  }, [formato.signosVitales]);

  const handleInputChange = (field: keyof SignosVitalesHosp, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calcular TAM cuando cambian TA Sistólica o Diastólica
      if ((field === 'taSistolica' || field === 'taDiastolica') && newData.taSistolica && newData.taDiastolica) {
        const sistolica = Number(newData.taSistolica);
        const diastolica = Number(newData.taDiastolica);
        newData.tam = parseFloat(((sistolica + 2 * diastolica) / 3).toFixed(2));
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fecha || !formData.hora) {
      alert('Fecha y hora son obligatorios');
      return;
    }

    setSaving(true);
    try {
      // Preparar datos con TAM calculado si no existe
      const dataToSend = { ...formData };
      if (dataToSend.taSistolica && dataToSend.taDiastolica && !dataToSend.tam) {
        dataToSend.tam = parseFloat(((Number(dataToSend.taSistolica) + 2 * Number(dataToSend.taDiastolica)) / 3).toFixed(2));
      }
      
      if (editingId) {
        // Actualizar existente
        await formatoService.updateSignosVitales(editingId, dataToSend);
      } else {
        // Crear nuevo
        await formatoService.addSignosVitales(formato.id, dataToSend as any);
      }
      
      // Recargar datos
      await onUpdate();
      
      // Resetear formulario
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

  const handleEdit = (signo: SignosVitalesHosp) => {
    setFormData({
      fecha: signo.fecha,
      hora: signo.hora,
      taSistolica: signo.taSistolica,
      taDiastolica: signo.taDiastolica,
      tam: signo.tam,
      fc: signo.fc,
      fr: signo.fr,
      temperatura: signo.temperatura,
      spo2: signo.spo2,
      observacion: signo.observacion,
    });
    setEditingId(signo.id!);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este registro de signos vitales?')) return;
    
    setSaving(true);
    try {
      await formatoService.deleteSignosVitales(id);
      await onUpdate();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
    });
    setShowForm(false);
    setEditingId(null);
  };

  const calcularTAM = (sistolica?: number, diastolica?: number) => {
    if (!sistolica || !diastolica) return null;
    return ((sistolica + 2 * diastolica) / 3).toFixed(2);
  };

  const getSignoStatus = (tipo: string, valor?: number) => {
    if (!valor) return '';
    
    switch (tipo) {
      case 'taSistolica':
        if (valor < 90) return styles.bajo;
        if (valor > 140) return styles.alto;
        break;
      case 'taDiastolica':
        if (valor < 60) return styles.bajo;
        if (valor > 90) return styles.alto;
        break;
      case 'fc':
        if (valor < 60) return styles.bajo;
        if (valor > 100) return styles.alto;
        break;
      case 'fr':
        if (valor < 12) return styles.bajo;
        if (valor > 20) return styles.alto;
        break;
      case 'temperatura':
        if (valor < 36) return styles.bajo;
        if (valor > 37.5) return styles.alto;
        break;
      case 'spo2':
        if (valor < 90) return styles.bajo;
        break;
    }
    return styles.normal;
  };

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <div>
          <h3>💓 Signos Vitales</h3>
          <p className={styles.seccionDescription}>
            Registro de signos vitales durante la hospitalización
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
          <h4>{editingId ? '✏️ Editar Registro' : '📝 Nuevo Registro de Signos Vitales'}</h4>
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
                <label>Hora *</label>
                <input
                  type="time"
                  value={formData.hora || ''}
                  onChange={(e) => handleInputChange('hora', e.target.value)}
                  required
                />
              </div>

              {/* Tensión Arterial */}
              <div className={styles.formGroup}>
                <label>TA Sistólica (mmHg)</label>
                <input
                  type="number"
                  value={formData.taSistolica || ''}
                  onChange={(e) => handleInputChange('taSistolica', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="120"
                  min="0"
                  max="300"
                />
              </div>

              <div className={styles.formGroup}>
                <label>TA Diastólica (mmHg)</label>
                <input
                  type="number"
                  value={formData.taDiastolica || ''}
                  onChange={(e) => handleInputChange('taDiastolica', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="80"
                  min="0"
                  max="200"
                />
              </div>

              {/* TAM (calculado) */}
              <div className={styles.formGroup}>
                <label>TAM (mmHg) - Calculado</label>
                <input
                  type="text"
                  value={calcularTAM(formData.taSistolica, formData.taDiastolica) || ''}
                  disabled
                  className={styles.calculated}
                />
              </div>

              {/* Frecuencia Cardíaca */}
              <div className={styles.formGroup}>
                <label>FC (lpm)</label>
                <input
                  type="number"
                  value={formData.fc || ''}
                  onChange={(e) => handleInputChange('fc', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="75"
                  min="0"
                  max="250"
                />
              </div>

              {/* Frecuencia Respiratoria */}
              <div className={styles.formGroup}>
                <label>FR (rpm)</label>
                <input
                  type="number"
                  value={formData.fr || ''}
                  onChange={(e) => handleInputChange('fr', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="16"
                  min="0"
                  max="60"
                />
              </div>

              {/* Temperatura */}
              <div className={styles.formGroup}>
                <label>Temperatura (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperatura || ''}
                  onChange={(e) => handleInputChange('temperatura', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="36.5"
                  min="30"
                  max="45"
                />
              </div>

              {/* SpO2 */}
              <div className={styles.formGroup}>
                <label>SpO₂ (%)</label>
                <input
                  type="number"
                  value={formData.spo2 || ''}
                  onChange={(e) => handleInputChange('spo2', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="98"
                  min="0"
                  max="100"
                />
              </div>

              {/* Observación */}
              <div className={styles.formGroupFull}>
                <label>Observaciones</label>
                <textarea
                  value={formData.observacion || ''}
                  onChange={(e) => handleInputChange('observacion', e.target.value)}
                  placeholder="Observaciones adicionales..."
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

      {/* Lista de Registros */}
      <div className={styles.recordsList}>
        <h4>📊 Historial de Signos Vitales ({signosVitales.length} registros)</h4>
        
        {signosVitales.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay registros de signos vitales aún.</p>
            <p>Haga clic en "Nuevo Registro" para agregar el primero.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha/Hora</th>
                  <th>TA (mmHg)</th>
                  <th>TAM</th>
                  <th>FC (lpm)</th>
                  <th>FR (rpm)</th>
                  <th>Temp (°C)</th>
                  <th>SpO₂ (%)</th>
                  <th>Observación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {signosVitales.map((signo) => {
                  // Formatear hora desde DateTime
                  let horaStr = '-';
                  if (signo.hora) {
                    try {
                      const horaDate = new Date(signo.hora);
                      horaStr = horaDate.toLocaleTimeString('es-VE', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false,
                        timeZone: 'America/Caracas'
                      });
                    } catch {
                      horaStr = '-';
                    }
                  }
                  
                  return (
                  <tr key={signo.id}>
                    <td>
                      <div className={styles.dateCell}>
                        <span>{formatDateVenezuela(signo.fecha)}</span>
                        <span className={styles.time}>{horaStr}</span>
                      </div>
                    </td>
                    <td>
                      {signo.taSistolica && signo.taDiastolica ? (
                        <span className={styles.taValue}>
                          {signo.taSistolica}/{signo.taDiastolica}
                        </span>
                      ) : (
                        <span className={styles.noData}>-</span>
                      )}
                    </td>
                    <td>
                      {signo.tam ? (
                        <span className={getSignoStatus('tam', Number(signo.tam))}>
                          {Number(signo.tam).toFixed(2)}
                        </span>
                      ) : (
                        <span className={styles.noData}>-</span>
                      )}
                    </td>
                    <td>
                      {signo.fc ? (
                        <span className={getSignoStatus('fc', signo.fc)}>
                          {signo.fc}
                        </span>
                      ) : (
                        <span className={styles.noData}>-</span>
                      )}
                    </td>
                    <td>
                      {signo.fr ? (
                        <span className={getSignoStatus('fr', signo.fr)}>
                          {signo.fr}
                        </span>
                      ) : (
                        <span className={styles.noData}>-</span>
                      )}
                    </td>
                    <td>
                      {signo.temperatura ? (
                        <span className={getSignoStatus('temperatura', signo.temperatura)}>
                          {signo.temperatura}
                        </span>
                      ) : (
                        <span className={styles.noData}>-</span>
                      )}
                    </td>
                    <td>
                      {signo.spo2 ? (
                        <span className={getSignoStatus('spo2', signo.spo2)}>
                          {signo.spo2}
                        </span>
                      ) : (
                        <span className={styles.noData}>-</span>
                      )}
                    </td>
                    <td className={styles.observacionCell}>
                      {signo.observacion || '-'}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.btnEdit}
                          onClick={() => handleEdit(signo)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className={styles.btnDelete}
                          onClick={() => handleDelete(signo.id!)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.infoNote}>
        <strong>ℹ️ Valores de referencia:</strong>
        <ul>
          <li>TA: 90-140 / 60-90 mmHg</li>
          <li>FC: 60-100 lpm</li>
          <li>FR: 12-20 rpm</li>
          <li>Temperatura: 36.0-37.5 °C</li>
          <li>SpO₂: ≥90%</li>
        </ul>
      </div>
    </div>
  );
}
