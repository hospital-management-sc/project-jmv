/**
 * Dashboard para Médicos y Personal Clínico
 * Vista especializada para atención médica y gestión de pacientes
 */

import { useState } from "react";
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
import RegistrarEmergencia from "@/components/RegistrarEmergencia";
import PacientesEnEmergencia from "@/components/PacientesEnEmergencia";

export default function DoctorDashboard() {
  const { user } = useAuth();
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
