// ==========================================
// COMPONENTE: Formato de Hospitalización
// Sistema de 11 secciones/tabs para documentación clínica completa
// ==========================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './FormatoHospitalizacion.module.css';
import admisionesService, { type Admision } from '@/services/admisiones.service';
import * as formatoService from '@/services/formatoHospitalizacion.service';
import type { FormatoHospitalizacion } from '@/services/formatoHospitalizacion.service';

// Importar componentes de secciones
import Seccion1_GeneralInfo from './FormatoHospitalizacion/Seccion1_GeneralInfo';
import Seccion2_SignosVitales from './FormatoHospitalizacion/Seccion2_SignosVitales';
import Seccion3_Laboratorios from './FormatoHospitalizacion/Seccion3_Laboratorios';
import Seccion4_EstudiosEspeciales from './FormatoHospitalizacion/Seccion4_EstudiosEspeciales';
import Seccion5_Electrocardiograma from './FormatoHospitalizacion/Seccion5_Electrocardiograma';
import Seccion6_Clinica1 from './FormatoHospitalizacion/Seccion6_Clinica1';
import Seccion7_Clinica2 from './FormatoHospitalizacion/Seccion7_Clinica2';
import Seccion8_Clinica3 from './FormatoHospitalizacion/Seccion8_Clinica3';
import Seccion9_ResumenIngreso from './FormatoHospitalizacion/Seccion9_ResumenIngreso';
import Seccion10_OrdenesMedicas from './FormatoHospitalizacion/Seccion10_OrdenesMedicas';
import Seccion11_Evoluciones from './FormatoHospitalizacion/Seccion11_Evoluciones';

interface Props {}

type TabKey = 
  | 'general'
  | 'signos'
  | 'laboratorio'
  | 'estudios'
  | 'ekg'
  | 'clinica1'
  | 'clinica2'
  | 'clinica3'
  | 'resumen'
  | 'ordenes'
  | 'evoluciones';

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
  component?: React.ComponentType<any>;
  implemented: boolean;
}

const TABS: Tab[] = [
  { key: 'general', label: 'Datos Generales', icon: '📋', component: Seccion1_GeneralInfo, implemented: true },
  { key: 'signos', label: 'Signos Vitales', icon: '💓', component: Seccion2_SignosVitales, implemented: true },
  { key: 'laboratorio', label: 'Laboratorio', icon: '🔬', component: Seccion3_Laboratorios, implemented: true },
  { key: 'estudios', label: 'Estudios Especiales', icon: '🩻', component: Seccion4_EstudiosEspeciales, implemented: true },
  { key: 'ekg', label: 'Electrocardiograma', icon: '📈', component: Seccion5_Electrocardiograma, implemented: true },
  { key: 'clinica1', label: 'Clínica I', icon: '🏥', component: Seccion6_Clinica1, implemented: true },
  { key: 'clinica2', label: 'Clínica II', icon: '🩺', component: Seccion7_Clinica2, implemented: true },
  { key: 'clinica3', label: 'Clínica III', icon: '📋', component: Seccion8_Clinica3, implemented: true },
  { key: 'resumen', label: 'Resumen', icon: '📝', component: Seccion9_ResumenIngreso, implemented: true },
  { key: 'ordenes', label: 'Órdenes Médicas', icon: '💊', component: Seccion10_OrdenesMedicas, implemented: true },
  { key: 'evoluciones', label: 'Evoluciones', icon: '📅', component: Seccion11_Evoluciones, implemented: true },
];

export default function FormatoHospitalizacionView({}: Props) {
  const { admisionId } = useParams<{ admisionId: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [admision, setAdmision] = useState<Admision | null>(null);
  const [formato, setFormato] = useState<FormatoHospitalizacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!admisionId) {
      setError('No se proporcionó ID de admisión');
      setLoading(false);
      return;
    }
    cargarDatos();
  }, [admisionId]);

  const cargarDatos = async () => {
    if (!admisionId) return;
    
    setLoading(true);
    setError('');
    
    try {
      // 1. Cargar admisión
      const admisionData = await admisionesService.obtenerAdmision(admisionId);
      setAdmision(admisionData);

      // 2. Obtener o crear formato de hospitalización
      const formatoData = await formatoService.getOrCreateFormato(
        parseInt(admisionData.id),
        parseInt(admisionData.pacienteId)
      );
      setFormato(formatoData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabKey: TabKey) => {
    const tab = TABS.find(t => t.key === tabKey);
    if (tab && !tab.implemented) {
      alert(`La sección "${tab.label}" aún no está implementada.\nPróximamente disponible.`);
      return;
    }
    setActiveTab(tabKey);
  };

  const handleBack = () => {
    navigate('/doctor/pacientes-hospitalizados');
  };

  const handleRefresh = async () => {
    await cargarDatos();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando formato de hospitalización...</p>
        </div>
      </div>
    );
  }

  if (error || !admision || !formato) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h3>❌ Error</h3>
          <p>{error || 'No se pudo cargar la información'}</p>
          <button onClick={handleBack} className={styles.btnSecondary}>
            ← Volver a Pacientes
          </button>
        </div>
      </div>
    );
  }

  const currentTab = TABS.find(t => t.key === activeTab);
  const CurrentComponent = currentTab?.component;

  return (
    <div className={styles.container}>
      {/* Header con información del paciente */}
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.btnBack}>
          ← Volver
        </button>
        
        <div className={styles.patientInfo}>
          <h2>📋 Formato de Hospitalización</h2>
          <div className={styles.patientDetails}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Paciente:</span>
              <span className={styles.value}>{admision.paciente?.apellidosNombres || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>CI:</span>
              <span className={styles.value}>{admision.paciente?.ci || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Historia:</span>
              <span className={styles.value}>{admision.paciente?.nroHistoria || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Servicio:</span>
              <span className={styles.value}>{admision.servicio}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Cama:</span>
              <span className={styles.value}>{admision.cama || 'N/A'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Admisión:</span>
              <span className={styles.value}>#{admision.id}</span>
            </div>
          </div>
        </div>

        {saving && (
          <div className={styles.savingIndicator}>
            💾 Guardando...
          </div>
        )}
      </div>

      {/* Sistema de Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''} ${!tab.implemented ? styles.disabled : ''}`}
              onClick={() => handleTabChange(tab.key)}
              title={!tab.implemented ? 'Próximamente' : tab.label}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
              {!tab.implemented && <span className={styles.comingSoon}>🚧</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de la sección activa */}
      <div className={styles.contentContainer}>
        {CurrentComponent ? (
          <CurrentComponent
            formato={formato}
            admision={admision}
            onUpdate={handleRefresh}
            setSaving={setSaving}
          />
        ) : (
          <div className={styles.notImplemented}>
            <h3>🚧 En Construcción</h3>
            <p>La sección <strong>"{currentTab?.label}"</strong> está en desarrollo.</p>
            <p>Próximamente disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
}
