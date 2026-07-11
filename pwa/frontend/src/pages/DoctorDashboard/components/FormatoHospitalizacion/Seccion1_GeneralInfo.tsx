// ==========================================
// SECCIÓN 1: Datos Generales del Formato
// Información básica y metadata
// ==========================================

import styles from './Secciones.module.css';
import type { FormatoHospitalizacion } from '@/services/formatoHospitalizacion.service';
import type { Admision } from '@/services/admisiones.service';
import { formatDateVenezuela, formatTimeVenezuela } from '@/utils/dateUtils';
import { IconClipboard, IconFile, IconHospital, IconEmergency, IconUser, IconPhone, IconInfo } from '@/components/icons';

interface Props {
  formato: FormatoHospitalizacion;
  admision: Admision;
  onUpdate: () => void;
  setSaving: (saving: boolean) => void;
}

export default function Seccion1_GeneralInfo({ formato, admision }: Props) {
  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return 'N/A';
    const hoy = new Date();
    const nac = new Date(fechaNac);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return `${edad} años`;
  };

  const calcularDiasHospitalizacion = (fechaIngreso?: string) => {
    if (!fechaIngreso) return 0;
    const hoy = new Date();
    const ingreso = new Date(fechaIngreso);
    const diff = hoy.getTime() - ingreso.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={styles.seccion}>
      <div className={styles.seccionHeader}>
        <h3><IconClipboard size={16} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Información General del Formato</h3>
        <p className={styles.seccionDescription}>
          Datos básicos de la admisión y del paciente
        </p>
      </div>

      <div className={styles.infoGrid}>
        {/* Datos del Formato */}
        <div className={styles.infoCard}>
          <h4><IconFile size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Formato de Hospitalización</h4>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>ID Formato:</span>
            <span className={styles.infoValue}>#{formato.id}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de Creación:</span>
            <span className={styles.infoValue}>
              {formatDateVenezuela(formato.fechaCreacion)} - {formatTimeVenezuela(formato.fechaCreacion)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Última Actualización:</span>
            <span className={styles.infoValue}>
              {formatDateVenezuela(formato.ultimaActualizacion)} - {formatTimeVenezuela(formato.ultimaActualizacion)}
            </span>
          </div>
        </div>

        {/* Datos de la Admisión */}
        <div className={styles.infoCard}>
          <h4><IconHospital size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Datos de Admisión</h4>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Nro. Admisión:</span>
            <span className={styles.infoValue}>#{admision.id}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Tipo:</span>
            <span className={`${styles.badge} ${styles[`badge${admision.tipo}`]}`}>
              {admision.tipo === 'HOSPITALIZACION' ? <><IconHospital size={12} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />HOSPITALIZACIÓN</> : <><IconEmergency size={12} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />EMERGENCIA</>}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Servicio:</span>
            <span className={styles.infoValue}>{admision.servicio}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Cama:</span>
            <span className={styles.infoValue}>{admision.cama || 'No asignada'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de Ingreso:</span>
            <span className={styles.infoValue}>
              {formatDateVenezuela(admision.fechaAdmision)} {admision.horaAdmision ? `- ${admision.horaAdmision}` : ''}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Días Hospitalizado:</span>
            <span className={styles.infoValue}>
              {calcularDiasHospitalizacion(admision.fechaAdmision)} días
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Estado:</span>
            <span className={`${styles.badge} ${styles[`badgeEstado${admision.estado}`]}`}>
              {admision.estado}
            </span>
          </div>
        </div>

        {/* Datos del Paciente */}
        <div className={styles.infoCard}>
          <h4><IconUser size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Datos del Paciente</h4>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Nombre Completo:</span>
            <span className={styles.infoValue}>{admision.paciente?.apellidosNombres || 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Cédula de Identidad:</span>
            <span className={styles.infoValue}>{admision.paciente?.ci || 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Historia Clínica:</span>
            <span className={styles.infoValue}>{admision.paciente?.nroHistoria || 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de Nacimiento:</span>
            <span className={styles.infoValue}>
              {admision.paciente?.fechaNacimiento 
                ? formatDateVenezuela(admision.paciente.fechaNacimiento)
                : 'N/A'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Edad:</span>
            <span className={styles.infoValue}>
              {calcularEdad(admision.paciente?.fechaNacimiento)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Sexo:</span>
            <span className={styles.infoValue}>
              {admision.paciente?.sexo === 'M' ? 'Masculino' : admision.paciente?.sexo === 'F' ? 'Femenino' : 'N/A'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Estado:</span>
            <span className={styles.infoValue}>{admision.estado || 'N/A'}</span>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className={styles.infoCard}>
          <h4><IconPhone size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Información de Contacto</h4>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Teléfono:</span>
            <span className={styles.infoValue}>{admision.paciente?.telefono || 'No registrado'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Dirección:</span>
            <span className={styles.infoValue}>{admision.paciente?.direccion || 'No registrada'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Observaciones:</span>
            <span className={styles.infoValue}>{admision.observaciones || 'No registradas'}</span>
          </div>
        </div>
      </div>

      <div className={styles.infoNote}>
        <strong><IconInfo size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Nota:</strong> Esta sección muestra datos de solo lectura. 
        Para modificar información del paciente o de la admisión, utilice las 
        interfaces administrativas correspondientes.
      </div>
    </div>
  );
}
