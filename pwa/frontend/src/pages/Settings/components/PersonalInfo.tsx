/**
 * Componente de Información Personal del Médico
 * Muestra los datos del doctor desde la whitelist de personal autorizado
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './PersonalInfo.module.css';

// --- Field icons ---
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IconEmail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);
const IconSpecialty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
const IconCargo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IconDepartamento = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);
const IconTelefono = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <circle cx="12" cy="17" r="1" />
  </svg>
);
const IconCI = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="8" cy="12" r="2" />
    <path d="M13 10h5M13 14h3" />
  </svg>
);
const IconEstado = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

interface PersonalData {
  nombre: string;
  email: string;
  especialidad?: string;
  cargo?: string;
  departamento?: string;
  telefono?: string;
  ci?: string;
  estado?: string;
}

export default function PersonalInfo() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setPersonalData({
            nombre: d.nombre || '',
            email: d.email || '',
            especialidad: d.especialidad || '',
            cargo: d.cargo || '',
            departamento: d.departamento || '',
            telefono: d.telefono || '',
            ci: d.ci || '',
            estado: d.estado || 'ACTIVO',
          });
        } else {
          // Fallback to JWT data if endpoint fails
          setPersonalData({
            nombre: user.nombre || '',
            email: user.email || '',
            especialidad: user.especialidad || '',
            cargo: (user as any).cargo || '',
            departamento: user.departamento || '',
            telefono: '',
            ci: (user as any).ci || '',
            estado: (user as any).estado || 'ACTIVO',
          });
        }
      })
      .catch(() => {
        // Fallback to JWT data on network error
        setPersonalData({
          nombre: user.nombre || '',
          email: user.email || '',
          especialidad: user.especialidad || '',
          cargo: (user as any).cargo || '',
          departamento: user.departamento || '',
          telefono: '',
          ci: (user as any).ci || '',
          estado: (user as any).estado || 'ACTIVO',
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando información...</p>
      </div>
    );
  }

  if (!personalData) {
    return (
      <div className={styles.error}>
        <p>No se pudo cargar la información personal</p>
      </div>
    );
  }

  const infoFields = [
    { label: 'Nombre',       value: personalData.nombre,                        Icon: IconUser },
    { label: 'Email',        value: personalData.email,                         Icon: IconEmail },
    { label: 'Especialidad', value: personalData.especialidad || 'No especificada', Icon: IconSpecialty },
    { label: 'Cargo',        value: personalData.cargo || 'No especificado',    Icon: IconCargo },
    { label: 'Departamento', value: personalData.departamento || 'No especificado', Icon: IconDepartamento },
    { label: 'Teléfono',     value: personalData.telefono || 'No registrado',   Icon: IconTelefono },
    { label: 'Cédula',       value: personalData.ci || 'No registrada',         Icon: IconCI },
    { label: 'Estado',       value: personalData.estado,                        Icon: IconEstado },
  ];

  return (
    <div className={styles.personalInfoContainer}>
      <div className={styles.header}>
        <h3>Información Personal</h3>
        <p className={styles.subtitle}>Datos registrados en el sistema</p>
      </div>

      <div className={styles.infoGrid}>
        {infoFields.map((field, index) => (
          <div key={index} className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}><field.Icon /></span>
              <label>{field.label}</label>
            </div>
            <div className={styles.cardValue}>
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
