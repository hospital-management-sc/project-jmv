/**
 * Componente para Visualizar Pacientes Hospitalizados Actualmente
 * Vista de solo lectura para personal administrativo
 */

import { useState, useEffect } from 'react';
import styles from './PacientesHospitalizados.module.css';
import admisionesService from '../services/admisiones.service';
import type { Admision } from '../services/admisiones.service';
import { VENEZUELA_TIMEZONE, VENEZUELA_LOCALE } from '../utils/dateUtils';

interface PacientesHospitalizadosProps {
  onBack: () => void;
}

const SERVICIOS = [
  { value: '', label: 'Todos los servicios' },
  { value: 'EMERGENCIA', label: 'Emergencia' },
  { value: 'MEDICINA_INTERNA', label: 'Medicina Interna' },
  { value: 'CIRUGIA_GENERAL', label: 'Cirugía General' },
  { value: 'TRAUMATOLOGIA', label: 'Traumatología' },
  { value: 'UCI', label: 'UCI' },
  { value: 'PEDIATRIA', label: 'Pediatría' },
  { value: 'GINECO_OBSTETRICIA', label: 'Gineco-Obstetricia' },
  { value: 'CARDIOLOGIA', label: 'Cardiología' },
  { value: 'NEUROLOGIA', label: 'Neurología' },
];

const TIPOS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'EMERGENCIA', label: 'Emergencia' },
  { value: 'HOSPITALIZACION', label: 'Hospitalización' },
  { value: 'UCI', label: 'UCI' },
  { value: 'CIRUGIA', label: 'Cirugía' },
];

export default function PacientesHospitalizados({ onBack }: PacientesHospitalizadosProps) {
  const [admisiones, setAdmisiones] = useState<Admision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtros
  const [servicioFiltro, setServicioFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [busquedaNombre, setBusquedaNombre] = useState('');

  // Detalle expandido
  const [admisionExpandida, setAdmisionExpandida] = useState<string | null>(null);

  useEffect(() => {
    cargarAdmisionesActivas();
  }, [servicioFiltro, tipoFiltro]);

  const cargarAdmisionesActivas = async () => {
    setLoading(true);
    setError('');

    try {
      const filters: any = {};
      if (servicioFiltro) filters.servicio = servicioFiltro;
      if (tipoFiltro) filters.tipo = tipoFiltro;

      const response = await admisionesService.listarAdmisionesActivas(filters);
      setAdmisiones(response.admisiones);
    } catch (err: any) {
      setError(err.message || 'Error al cargar pacientes hospitalizados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcularEdad = (fechaNac: string | undefined) => {
    if (!fechaNac) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const formatearFecha = (fecha: string | Date | undefined) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString(VENEZUELA_LOCALE, {
      timeZone: VENEZUELA_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatearHora = (hora: string | Date | undefined) => {
    if (!hora) return 'N/A';
    const date = new Date(hora);
    return date.toLocaleTimeString(VENEZUELA_LOCALE, {
      timeZone: VENEZUELA_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleExpandir = (admisionId: string) => {
    setAdmisionExpandida(admisionExpandida === admisionId ? null : admisionId);
  };

  // Filtrar por nombre/CI localmente
  const admisionesFiltradas = admisiones.filter((admision) => {
    if (!busquedaNombre) return true;
    const busqueda = busquedaNombre.toLowerCase();
    return (
      admision.paciente?.apellidosNombres?.toLowerCase().includes(busqueda) ||
      admision.paciente?.ci?.toLowerCase().includes(busqueda) ||
      admision.paciente?.nroHistoria?.toLowerCase().includes(busqueda)
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Pacientes Hospitalizados Actualmente</h1>
          <p className={styles.subtitle}>Vista de control para gestión administrativa</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statBadge}>
            <span className={styles.statLabel}>Total Hospitalizados:</span>
            <span className={styles.statValue}>{admisionesFiltradas.length}</span>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <label>Servicio:</label>
          <select value={servicioFiltro} onChange={(e) => setServicioFiltro(e.target.value)}>
            {SERVICIOS.map((servicio) => (
              <option key={servicio.value} value={servicio.value}>
                {servicio.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Tipo:</label>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            {TIPOS.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Buscar por nombre, CI o historia..."
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
          />
        </div>

        <button onClick={cargarAdmisionesActivas} className={styles.refreshBtn} disabled={loading}>
          {loading ? '🔄 Actualizando...' : '🔄 Actualizar'}
        </button>
      </div>

      {/* Contenido */}
      {error && <div className={styles.errorAlert}>{error}</div>}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando pacientes hospitalizados...</p>
        </div>
      ) : admisionesFiltradas.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🏥</span>
          <h3>No hay pacientes hospitalizados actualmente</h3>
          <p>No se encontraron admisiones activas con los filtros seleccionados</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Historia</th>
                <th>Paciente</th>
                <th>CI</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Tipo</th>
                <th>Servicio</th>
                <th>Habitación</th>
                <th>Cama</th>
                <th>Fecha Ingreso</th>
                <th>Días Hosp.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admisionesFiltradas.map((admision) => (
                <>
                  <tr key={admision.id} className={admisionExpandida === admision.id ? styles.rowExpanded : ''}>
                    <td>
                      <strong>{admision.paciente?.nroHistoria || 'N/A'}</strong>
                    </td>
                    <td>{admision.paciente?.apellidosNombres || 'N/A'}</td>
                    <td>{admision.paciente?.ci || 'N/A'}</td>
                    <td>{calcularEdad(admision.paciente?.fechaNacimiento)} años</td>
                    <td>
                      <span className={styles.badge}>
                        {admision.paciente?.sexo === 'M' ? '♂ M' : '♀ F'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          admision.tipo === 'EMERGENCIA' 
                            ? styles.badgeEmergencia 
                            : admision.tipo === 'UCI'
                            ? styles.badgeUCI
                            : admision.tipo === 'CIRUGIA'
                            ? styles.badgeCirugia
                            : styles.badgeHospitalizacion
                        }`}
                      >
                        {admision.tipo === 'EMERGENCIA' 
                          ? '🚨 Emergencia' 
                          : admision.tipo === 'UCI'
                          ? '🏥 UCI'
                          : admision.tipo === 'CIRUGIA'
                          ? '⚕️ Cirugía'
                          : '🏥 Hospitalización'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.servicioBadge}>
                        {admision.servicio ? admision.servicio.replace(/_/g, ' ') : 'N/A'}
                      </span>
                    </td>
                    <td>{admision.habitacion || '-'}</td>
                    <td>{admision.cama || '-'}</td>
                    <td>
                      <div className={styles.fechaHora}>
                        <span>{formatearFecha(admision.fechaAdmision)}</span>
                        <small>{formatearHora(admision.horaAdmision)}</small>
                      </div>
                    </td>
                    <td>
                      <span className={styles.diasBadge}>
                        {admision.diasHospitalizacion || 0} días
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleExpandir(admision.id)}
                        className={styles.detailBtn}
                        title="Ver detalles"
                      >
                        {admisionExpandida === admision.id ? '▲ Ocultar' : '▼ Ver más'}
                      </button>
                    </td>
                  </tr>

                  {/* Fila expandida con detalles */}
                  {admisionExpandida === admision.id && (
                    <tr className={styles.detailRow}>
                      <td colSpan={12}>
                        <div className={styles.detailContent}>
                          <div className={styles.detailGrid}>
                            <div className={styles.detailSection}>
                              <h4>📋 Información de Admisión</h4>
                              <div className={styles.detailItem}>
                                <strong>ID Admisión:</strong> {admision.id}
                              </div>
                              <div className={styles.detailItem}>
                                <strong>Forma de Ingreso:</strong>{' '}
                                {admision.formaIngreso || 'No especificado'}
                              </div>
                              <div className={styles.detailItem}>
                                <strong>Estado:</strong>{' '}
                                <span className={styles.estadoActiva}>● ACTIVA</span>
                              </div>
                            </div>

                            <div className={styles.detailSection}>
                              <h4>👤 Datos del Paciente</h4>
                              <div className={styles.detailItem}>
                                <strong>Fecha Nacimiento:</strong>{' '}
                                {formatearFecha(admision.paciente?.fechaNacimiento)}
                              </div>
                              <div className={styles.detailItem}>
                                <strong>Teléfono:</strong> {admision.paciente?.telefono || 'N/A'}
                              </div>
                              <div className={styles.detailItem}>
                                <strong>Dirección:</strong> {admision.paciente?.direccion || 'N/A'}
                              </div>
                            </div>

                            <div className={styles.detailSection}>
                              <h4>👨‍⚕️ Personal Responsable</h4>
                              <div className={styles.detailItem}>
                                <strong>Registrado por:</strong>{' '}
                                {admision.createdBy?.nombre || 'No disponible'}
                              </div>
                              <div className={styles.detailItem}>
                                <strong>Cargo:</strong> {admision.createdBy?.cargo || 'N/A'}
                              </div>
                            </div>

                            {admision.observaciones && (
                              <div className={styles.detailSection} style={{ gridColumn: '1 / -1' }}>
                                <h4>📝 Observaciones</h4>
                                <div className={styles.observaciones}>{admision.observaciones}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.footer}>
        <button onClick={onBack} className={styles.backBtn}>
          ← Volver al Dashboard
        </button>
        <div className={styles.footerInfo}>
          <span>📊 Total de registros: {admisionesFiltradas.length}</span>
          <span>🏥 Vista de solo lectura - Personal Administrativo</span>
        </div>
      </div>
    </div>
  );
}
