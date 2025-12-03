import { useEffect, useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { DoctorStats } from "../interfaces";
import admisionesService from "@/services/admisiones.service";
import { encuentrosService } from "@/services";
import { API_BASE_URL } from "@/utils/constants";

interface Props {}

export default function DashboardStats({}: Props) {
  const [stats, setStats] = useState<DoctorStats>({
    pacientesHospitalizados: 0,
    encuentrosHoy: 0,
    citasHoy: 0,
    altasPendientes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      // Obtener pacientes hospitalizados activos
      const admisionesResponse =
        await admisionesService.listarAdmisionesActivas({});

      // Obtener encuentros de hoy
      let encuentrosHoyCount = 0;
      try {
        const encuentrosHoy = await encuentrosService.obtenerHoy();
        encuentrosHoyCount = encuentrosHoy.length || 0;
      } catch {
        // Si falla, dejamos en 0
      }

      // Obtener citas de hoy
      let citasHoyCount = 0;
      try {
        const citasResponse = await fetch(`${API_BASE_URL}/dashboard/stats`);
        const citasData = await citasResponse.json();
        citasHoyCount = citasData.data?.citasProgramadasHoy || 0;
      } catch {
        // Si falla, dejamos en 0
      }

      setStats({
        pacientesHospitalizados: admisionesResponse.total || 0,
        encuentrosHoy: encuentrosHoyCount,
        citasHoy: citasHoyCount,
        altasPendientes: 0, // Por implementar
      });
    } catch (error) {
      console.error("Error fetching doctor stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles["dashboard-stats"]}>
      <div className={styles.card}>
        <h2>Pacientes Hospitalizados</h2>
        <div className={styles["stat-value"]}>
          {loading ? "..." : stats?.pacientesHospitalizados}
        </div>
        <span className={styles["stat-label"]}>Actualmente internados</span>
      </div>
      <div className={styles.card}>
        <h2>Atenciones Hoy</h2>
        <div className={styles["stat-value"]}>
          {loading ? "..." : stats?.encuentrosHoy}
        </div>
        <span className={styles["stat-label"]}>Encuentros registrados</span>
      </div>
      <div className={styles.card}>
        <h2>Citas Programadas</h2>
        <div className={styles["stat-value"]}>
          {loading ? "..." : stats?.citasHoy}
        </div>
        <span className={styles["stat-label"]}>Para hoy</span>
      </div>
      <div className={styles.card}>
        <h2>Altas Pendientes</h2>
        <div className={styles["stat-value"]}>
          {loading ? "..." : stats?.altasPendientes}
        </div>
        <span className={styles["stat-label"]}>Por procesar</span>
      </div>
    </section>
  );
}
