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
    console.warn(`Especialidad "${user.especialidad}" no encontrada, usando ORL como fallback`);
    return obtenerEspecialidadPorCodigo("ORL");
  }, [user?.especialidad]);
  
  const [viewMode, setViewMode] = useState<ViewMode>("main");
  const [selectedPatient, setSelectedPatient] = useState<PatientBasic | null>(
    null
  );

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
            >
              ← Volver al Dashboard
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
          <RegisterEncounter
            patient={selectedPatient}
            doctorId={user?.id as number}
            especialidadId={especialidad?.id || 'otorrinolaringologia'}
          />
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
          <MyAppointments doctorId={user?.id as number} />
        )}
        {viewMode === "interconsultas" && (
          <Interconsultas doctorId={user?.id as number} />
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
