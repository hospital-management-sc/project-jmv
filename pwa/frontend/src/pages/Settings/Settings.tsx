/**
 * Página de Ajustes
 * Información personal y gestión de acceso biométrico
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';
import { PersonalInfo, BiometricManager } from './components';
import { useAuth } from '@/contexts/AuthContext';

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 1 1 14 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6zM12 14v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'biometric'>('info');

  const handleBack = () => {
    const path = user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/medico';
    navigate(path);
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>No se pudo cargar la información del usuario</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerRow}>
            <div>
              <h1>Ajustes</h1>
              <p className={styles.subtitle}>
                Gestiona tu perfil y configuración de seguridad
              </p>
            </div>
            <button className={styles.backBtn} onClick={handleBack} title="Volver al Dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Atrás</span>
            </button>
          </div>
        </div>
      </header>

      <div className={styles.tabsContainer}>
        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <span className={styles.tabIcon}><UserIcon /></span>
            <span className={styles.tabLabel}>Información Personal</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'biometric' ? styles.active : ''}`}
            onClick={() => setActiveTab('biometric')}
          >
            <span className={styles.tabIcon}><LockIcon /></span>
            <span className={styles.tabLabel}>Acceso Biométrico</span>
          </button>
        </nav>

        <div className={styles.tabContent}>
          {activeTab === 'info' && <PersonalInfo />}
          {activeTab === 'biometric' && <BiometricManager />}
        </div>
      </div>
    </div>
  );
}
