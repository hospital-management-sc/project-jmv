/**
 * Modal para mostrar el detalle completo de un encuentro médico
 * Solo lectura - Vista administrativa
 * Renderiza dinámicamente todos los datos según el formularioEspecializado
 */

import type { Encuentro } from '@/services/encuentros.service';
import { ESPECIALIDADES_MEDICAS } from '@/config/especialidades.config';
import { formatDateLocal, formatTimeMilitaryVenezuela } from '@/utils/dateUtils';
import styles from './EncuentroDetailModal.module.css';

interface EncuentroDetailModalProps {
  encuentro: Encuentro | null;
  onClose: () => void;
}

const EncuentroDetailModal = ({ encuentro, onClose }: EncuentroDetailModalProps) => {
  if (!encuentro) return null;

  // Función para buscar la especialidad del médico - OPTIMIZADA PARA NUEVA ESTRUCTURA
  const obtenerEspecialidad = () => {
    if (!encuentro.createdBy) return null;
    
    // Estrategia 1: Buscar usando metadata guardada en examenFisico (para encuentros antiguos)
    if (encuentro.examenFisico?.['__especialidadId']) {
      const porMetadata = ESPECIALIDADES_MEDICAS.find(
        e => e.id === encuentro.examenFisico?.['__especialidadId']
      );
      if (porMetadata) {
        console.log('[EncuentroDetailModal] ✅ Especialidad encontrada por metadata:', porMetadata.nombre);
        return porMetadata;
      }
    }
    
    // Estrategia 2: Buscar por ID exacto en createdBy.especialidad (NUEVO - desde backend)
    if (encuentro.createdBy.especialidad) {
      const porId = ESPECIALIDADES_MEDICAS.find(e => e.id === encuentro.createdBy?.especialidad);
      if (porId) {
        console.log('[EncuentroDetailModal] ✅ Especialidad encontrada por ID directo:', porId.nombre);
        return porId;
      }
      
      // Estrategia 3: Buscar por nombre exacto (si el backend envió el nombre completo)
      const porNombre = ESPECIALIDADES_MEDICAS.find(e => e.nombre === encuentro.createdBy?.especialidad);
      if (porNombre) {
        console.log('[EncuentroDetailModal] ✅ Especialidad encontrada por nombre:', porNombre.nombre);
        return porNombre;
      }
      
      // Estrategia 4: Búsqueda parcial (si el backend envió algo similar)
      const especialidadBuscada = encuentro.createdBy?.especialidad;
      if (especialidadBuscada) {
        const porBusquedaParcial = ESPECIALIDADES_MEDICAS.find(e => 
          especialidadBuscada.toLowerCase().includes(e.id.toLowerCase()) ||
          e.id.toLowerCase().includes(especialidadBuscada.toLowerCase())
        );
        if (porBusquedaParcial) {
          console.log('[EncuentroDetailModal] ✅ Especialidad encontrada por búsqueda parcial:', porBusquedaParcial.nombre);
          return porBusquedaParcial;
        }
      }
    }
    
    // Estrategia 5: Buscar por cargo/nombre en la lista de especialidades (fallback final)
    if (encuentro.createdBy.cargo) {
      const cargoLower = encuentro.createdBy.cargo.toLowerCase();
      const porCargo = ESPECIALIDADES_MEDICAS.find(e => 
        cargoLower.includes(e.id.toLowerCase()) || 
        cargoLower.includes(e.nombre.toLowerCase()) ||
        e.nombre.toLowerCase().includes(cargoLower)
      );
      if (porCargo) {
        console.log('[EncuentroDetailModal] ✅ Especialidad encontrada por cargo:', porCargo.nombre);
        return porCargo;
      }
    }
    
    // Si no encuentra especialidad
    console.warn('[EncuentroDetailModal] ⚠️ No se encontró especialidad para:', {
      especialidadId: encuentro.createdBy?.especialidad,
      cargo: encuentro.createdBy?.cargo,
      metadataId: encuentro.examenFisico?.['__especialidadId'],
      medicoNombre: encuentro.createdBy?.nombre,
    });
    return null;
  };

  const especialidad = obtenerEspecialidad();
  const formularioEspecializado = especialidad?.formularioEspecializado;

  // Función para renderizar un valor según su tipo
  const renderizarValor = (valor: any) => {
    if (valor === null || valor === undefined || valor === '') return '—';
    if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
    if (typeof valor === 'object') return JSON.stringify(valor);
    return String(valor);
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      EMERGENCIA: 'Emergencia',
      HOSPITALIZACION: 'Hospitalización',
      CONSULTA: 'Consulta',
      OTRO: 'Otro',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Detalle del Encuentro Médico</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Información General */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>📋 Información General</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tipo de encuentro:</span>
                <span className={styles.value}>{getTipoLabel(encuentro.tipo)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Fecha:</span>
                <span className={styles.value}>{formatDateLocal(encuentro.fecha)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Hora:</span>
                <span className={styles.value}>{encuentro.hora && formatTimeMilitaryVenezuela(encuentro.hora)}</span>
              </div>
              {encuentro.nroCama && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Nro. Cama:</span>
                  <span className={styles.value}>{encuentro.nroCama}</span>
                </div>
              )}
              {encuentro.procedencia && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Procedencia:</span>
                  <span className={styles.value}>{encuentro.procedencia}</span>
                </div>
              )}
            </div>
          </section>

          {/* Médico Tratante */}
          {encuentro.createdBy && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>👨‍⚕️ Médico Tratante</h3>
              <div className={styles.medicoCard}>
                <div className={styles.medicoInfo}>
                  <strong>{encuentro.createdBy.nombre}</strong>
                  {encuentro.createdBy.cargo && (
                    <span className={styles.cargo}>{encuentro.createdBy.cargo}</span>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Motivo y Enfermedad Actual */}
          {(encuentro.motivoConsulta || encuentro.enfermedadActual) && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>📝 Motivo de Consulta</h3>
              {encuentro.motivoConsulta && (
                <div className={styles.textBlock}>
                  <strong>Motivo:</strong>
                  <p>{encuentro.motivoConsulta}</p>
                </div>
              )}
              {encuentro.enfermedadActual && (
                <div className={styles.textBlock}>
                  <strong>Enfermedad Actual:</strong>
                  <p>{encuentro.enfermedadActual}</p>
                </div>
              )}
            </section>
          )}

          {/* Signos Vitales - Extraer desde examenFisico */}
          {encuentro.examenFisico && (
            (() => {
              // Campos de signos vitales que buscamos en examenFisico
              const signosVitalesFields = ['taSistolica', 'taDiastolica', 'pulso', 'fr', 'temperatura', 'saturacionO2'];
              const signosEncontrados = signosVitalesFields.filter(campo => 
                encuentro.examenFisico?.[campo] !== undefined && 
                encuentro.examenFisico[campo] !== null && 
                encuentro.examenFisico[campo] !== ''
              );

              // Si hay algún signo vital registrado
              if (signosEncontrados.length > 0) {
                return (
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>💓 Signos Vitales</h3>
                    <div className={styles.signosCard}>
                      <div className={styles.signosGrid}>
                        {encuentro.examenFisico?.taSistolica && encuentro.examenFisico?.taDiastolica && (
                          <div className={styles.signoItem}>
                            <span className={styles.signoLabel}>Presión Arterial</span>
                            <span className={styles.signoValue}>
                              {encuentro.examenFisico.taSistolica}/{encuentro.examenFisico.taDiastolica} mmHg
                            </span>
                          </div>
                        )}
                        {encuentro.examenFisico?.pulso && (
                          <div className={styles.signoItem}>
                            <span className={styles.signoLabel}>Frecuencia Cardíaca</span>
                            <span className={styles.signoValue}>{encuentro.examenFisico.pulso} lpm</span>
                          </div>
                        )}
                        {encuentro.examenFisico?.temperatura && (
                          <div className={styles.signoItem}>
                            <span className={styles.signoLabel}>Temperatura</span>
                            <span className={styles.signoValue}>{encuentro.examenFisico.temperatura}°C</span>
                          </div>
                        )}
                        {encuentro.examenFisico?.fr && (
                          <div className={styles.signoItem}>
                            <span className={styles.signoLabel}>Frecuencia Respiratoria</span>
                            <span className={styles.signoValue}>{encuentro.examenFisico.fr} rpm</span>
                          </div>
                        )}
                        {encuentro.examenFisico?.saturacionO2 && (
                          <div className={styles.signoItem}>
                            <span className={styles.signoLabel}>Saturación de Oxígeno</span>
                            <span className={styles.signoValue}>{encuentro.examenFisico.saturacionO2} %</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                );
              }
              return null;
            })()
          )}

          {/* Signos Vitales - Dejar fallback para compatibilidad con datos antiguos */}
          {encuentro.signosVitales && encuentro.signosVitales.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>💓 Signos Vitales (Registro antiguo)</h3>
              {encuentro.signosVitales.map((signos, index) => (
                <div key={signos.id} className={styles.signosCard}>
                  {encuentro.signosVitales.length > 1 && (
                    <div className={styles.registroLabel}>Registro #{index + 1}</div>
                  )}
                  <div className={styles.signosGrid}>
                    {signos.taSistolica && signos.taDiastolica && (
                      <div className={styles.signoItem}>
                        <span className={styles.signoLabel}>Presión Arterial</span>
                        <span className={styles.signoValue}>
                          {signos.taSistolica}/{signos.taDiastolica} mmHg
                        </span>
                      </div>
                    )}
                    {signos.pulso && (
                      <div className={styles.signoItem}>
                        <span className={styles.signoLabel}>Frecuencia Cardíaca</span>
                        <span className={styles.signoValue}>{signos.pulso} lpm</span>
                      </div>
                    )}
                    {signos.temperatura && (
                      <div className={styles.signoItem}>
                        <span className={styles.signoLabel}>Temperatura</span>
                        <span className={styles.signoValue}>{signos.temperatura}°C</span>
                      </div>
                    )}
                    {signos.fr && (
                      <div className={styles.signoItem}>
                        <span className={styles.signoLabel}>Frecuencia Respiratoria</span>
                        <span className={styles.signoValue}>{signos.fr} rpm</span>
                      </div>
                    )}
                  </div>
                  {signos.observaciones && (
                    <div className={styles.observaciones}>
                      <strong>Observaciones:</strong>
                      <p>{signos.observaciones}</p>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Impresión Diagnóstica */}
          {encuentro.impresiones && encuentro.impresiones.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>🔬 Impresión Diagnóstica</h3>
              <div className={styles.diagnosticosList}>
                {encuentro.impresiones.map((impresion, index) => (
                  <div key={impresion.id} className={styles.diagnosticoCard}>
                    <div className={styles.diagnosticoHeader}>
                      <span className={styles.diagnosticoNum}>#{index + 1}</span>
                      {impresion.clase && (
                        <span className={styles.diagnosticoTipo}>{impresion.clase}</span>
                      )}
                    </div>
                    <div className={styles.diagnosticoBody}>
                      {impresion.codigoCie && (
                        <div className={styles.codigoCie}>
                          CIE: <strong>{impresion.codigoCie}</strong>
                        </div>
                      )}
                      <p className={styles.descripcion}>{impresion.descripcion || 'Sin descripción'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Datos Especializados del Formulario */}
          {encuentro.examenFisico && Object.keys(encuentro.examenFisico).length > 0 && (
            <>
              {formularioEspecializado ? (
                // Renderizar dinámicamente según el formularioEspecializado
                formularioEspecializado.pasos.map((paso) => {
                  // Campos de signos vitales que ya se muestran en la sección dedicada
                  const camposSignosVitales = new Set(['taSistolica', 'taDiastolica', 'pulso', 'fr', 'temperatura', 'saturacionO2']);
                  
                  // Filtrar campos que tengan datos en examenFisico (excluir metadata y signos vitales)
                  const camposConDatos = paso.campos.filter(
                    campo => encuentro.examenFisico?.[campo.id] !== undefined && 
                             encuentro.examenFisico[campo.id] !== null &&
                             encuentro.examenFisico[campo.id] !== '' &&
                             !campo.id.startsWith('__') && // Excluir metadata
                             !camposSignosVitales.has(campo.id) // Excluir signos vitales (ya se muestran arriba)
                  );

                  // Solo mostrar el paso si tiene campos con datos
                  if (camposConDatos.length === 0) return null;

                  return (
                    <section key={paso.numero} className={styles.section}>
                      <h3 className={styles.sectionTitle}>
                        {paso.emoji && <span>{paso.emoji} </span>}
                        {paso.titulo}
                      </h3>
                      
                      {/* Agrupar campos por grupo pero sin mostrar sub-títulos */}
                      {(() => {
                        const grupos = new Map<string, typeof camposConDatos>();
                        camposConDatos.forEach(campo => {
                          const grupo = campo.grupo || 'general';
                          if (!grupos.has(grupo)) {
                            grupos.set(grupo, []);
                          }
                          grupos.get(grupo)!.push(campo);
                        });

                        return Array.from(grupos.entries()).map(([grupo, campos]) => (
                          <div key={grupo} className={styles.campoGrupo}>
                            {/* NO mostrar sub-títulos de grupo - solo mostrar campos directamente */}
                            <div className={styles.infoGrid}>
                              {campos.map(campo => (
                                <div key={campo.id} className={styles.infoItem}>
                                  <span className={styles.label}>
                                    {campo.emoji && <span>{campo.emoji} </span>}
                                    {campo.label}:
                                  </span>
                                  <span className={styles.value}>
                                    {campo.tipo === 'textarea' ? (
                                      <div className={styles.textContent}>
                                        {renderizarValor(encuentro.examenFisico?.[campo.id])}
                                      </div>
                                    ) : (
                                      renderizarValor(encuentro.examenFisico?.[campo.id])
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </section>
                  );
                })
              ) : (
                // FALLBACK: Si NO hay formularioEspecializado, mostrar TODOS los datos de examenFisico
                // Esto asegura que NUNCA se pierda información
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>⚕️ Datos Especializados del Encuentro</h3>
                  <div className={styles.infoGrid}>
                    {Object.entries(encuentro.examenFisico)
                      .filter(([key]) => !key.startsWith('__')) // Excluir metadata
                      .map(([key, value]) => (
                        <div key={key} className={styles.infoItem}>
                          <span className={styles.label}>
                            {/* Convertir camelCase a palabras legibles */}
                            {key.replace(/([A-Z])/g, ' $1')
                               .replace(/^./, str => str.toUpperCase())
                               .trim()}:
                          </span>
                          <span className={styles.value}>
                            {typeof value === 'object' ? (
                              <div className={styles.textContent}>
                                {JSON.stringify(value, null, 2)}
                              </div>
                            ) : typeof value === 'string' && value.length > 100 ? (
                              <div className={styles.textContent}>
                                {renderizarValor(value)}
                              </div>
                            ) : (
                              renderizarValor(value)
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                  {!especialidad && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255, 193, 7, 0.1)', borderRadius: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      ℹ️ Nota: Especialidad no identificada. Se muestran todos los datos registrados.
                    </div>
                  )}
                </section>
              )}
            </>
          )}

          {/* Admisión Relacionada */}
          {encuentro.admision && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>🏥 Admisión Relacionada</h3>
              <div className={styles.admisionCard}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Tipo:</span>
                    <span className={styles.value}>{encuentro.admision.tipo || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Servicio:</span>
                    <span className={styles.value}>{encuentro.admision.servicio || 'N/A'}</span>
                  </div>
                  {encuentro.admision.fechaAdmision && (
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Fecha Ingreso:</span>
                      <span className={styles.value}>
                        {formatDateLocal(encuentro.admision.fechaAdmision)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCerrar} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EncuentroDetailModal;
