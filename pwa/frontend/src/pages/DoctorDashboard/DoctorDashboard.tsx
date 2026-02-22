/**
 * Dashboard para Médicos y Personal Clínico
 * Vista especializada para atención médica y gestión de pacientes
 */

import { useState, useMemo } from "react";
import styles from "./DoctorDashboard.module.css";
import type { PatientBasic, ViewMode } from "./interfaces";
import {
  DashboardActions,
  DashboardStats,
  HospitalizedPatients,
  Interconsultas,
  MyAppointments,
  PatientHistory,
  RegisterEncounter,
  SearchPatient,
  TodayEncounters,
} from "./components/";
import { useAuth } from "@/contexts/AuthContext";
import { obtenerEspecialidadPorCodigo, obtenerEspecialidad } from "@/config/especialidades.config";
import RegistrarEmergencia from "@/components/RegistrarEmergencia";
import PacientesEnEmergencia from "@/components/PacientesEnEmergencia";

export default function DoctorDashboard() {
  const { user } = useAuth();
  
  // Obtener especialidad del usuario - intenta código primero, luego nombre, luego fallback a ORL
  const especialidad = useMemo(() => {
    if (!user?.especialidad) {
      // Fallback a Otorrinolaringología si no hay especialidad
      return obtenerEspecialidadPorCodigo("ORL");
    }
    
    // Intentar obtener por código (ej: "ORL", "MI")
    let esp = obtenerEspecialidadPorCodigo(user.especialidad);
    if (esp) return esp;
    
    // Si no funciona por código, intentar por nombre
    esp = obtenerEspecialidad(user.especialidad);
    if (esp) return esp;
    
    // Fallback: retornar ORL
    return obtenerEspecialidadPorCodigo("ORL");
  }, [user?.especialidad]);
  
  const [viewMode, setViewMode] = useState<ViewMode>("main");
  const [selectedPatient, setSelectedPatient] = useState<PatientBasic | null>(
    null
  );
  const [appointmentRefreshKey, setAppointmentRefreshKey] = useState(0); // Trigger refresco de citas

  const onEncounterRegistered = () => {
    // Actualizar citas cuando se registra un encuentro
    setAppointmentRefreshKey(prev => prev + 1);
    // Volver a MyAppointments (no a main para que vea las citas refrescadas)
    setViewMode("my-appointments");
    setSelectedPatient(null);
  };

  const onViewHistory = (patient: PatientBasic) => {
    setSelectedPatient(patient);
    setViewMode("patient-history");
  };

  const onRegisterPatientEncounter = (patient: PatientBasic) => {
    setSelectedPatient(patient);
    setViewMode("register-encounter");
  };

  const onBackPatientHistory = () => {
    setViewMode("search-patient");
    setSelectedPatient(null);
  };

  return (
    <div className={styles["dashboard-container"]}>
      <header className={styles["dashboard-header"]}>
        <div className={styles["header-content"]}>
          <div>
            <h1>Dashboard Médico</h1>
            <p className={styles.subtitle}>
              Panel de control para atención clínica
            </p>
          </div>
          {viewMode !== "main" && (
            <button
              className={styles["back-btn"]}
              onClick={() => {
                setViewMode("main");
                setSelectedPatient(null);
              }}
              title="Volver al Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Atrás</span>
            </button>
          )}
        </div>
      </header>

      <main className={styles["dashboard-main"]}>
        {viewMode === "main" && (
          <>
            {/* Sección de Estadísticas del Médico */}
            <DashboardStats />
            {/* Sección de Acciones Clínicas */}
            <DashboardActions onClick={setViewMode} />
          </>
        )}
        {viewMode === "hospitalized-patients" && <HospitalizedPatients />}
        {viewMode === "register-encounter" && (
          <>
            {!user?.id ? (
              <div style={{ padding: '2rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', textAlign: 'center' }}>
                <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
                  ⚠️ Error: No se puede obtener tu ID de usuario. Por favor, recarga la página o inicia sesión nuevamente.
                </p>
              </div>
            ) : (
              <RegisterEncounter
                patient={selectedPatient}
                doctorId={user.id}
                especialidadId={especialidad?.id || 'otorrinolaringologia'}
                onEncounterRegistered={onEncounterRegistered}
              />
            )}
          </>
        )}
        {viewMode === "search-patient" && (
          <SearchPatient
            onViewHistory={onViewHistory}
            onRegisterEncounter={onRegisterPatientEncounter}
          />
        )}
        {viewMode === "patient-history" && selectedPatient && (
          <PatientHistory
            patient={selectedPatient}
            onBack={onBackPatientHistory}
          />
        )}
        {viewMode === "today-encounters" && <TodayEncounters />}
        {viewMode === "my-appointments" && (
          <>
            {!user?.id ? (
              <div style={{ padding: '2rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', textAlign: 'center' }}>
                <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
                  ⚠️ Error: No se puede obtener tu ID de usuario. Por favor, recarga la página o inicia sesión nuevamente.
                </p>
              </div>
            ) : (
              <MyAppointments 
                doctorId={Number(user.id)}
                onRegisterEncounter={onRegisterPatientEncounter}
                refreshKey={appointmentRefreshKey}
              />
            )}
          </>
        )}
        {viewMode === "interconsultas" && (
          <>
            {!user?.id ? (
              <div style={{ padding: '2rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', textAlign: 'center' }}>
                <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
                  ⚠️ Error: No se puede obtener tu ID de usuario. Por favor, recarga la página o inicia sesión nuevamente.
                </p>
              </div>
            ) : (
              <Interconsultas doctorId={Number(user.id)} />
            )}
          </>
        )}
        {viewMode === "register-emergency" && (
          <RegistrarEmergencia onBack={() => setViewMode("main")} />
        )}
        {viewMode === "pacientes-emergencia" && (
          <PacientesEnEmergencia onBack={() => setViewMode("main")} />
        )}
      </main>
    </div>
  );
}
