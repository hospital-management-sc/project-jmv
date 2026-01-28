import { useEffect, useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { DoctorStats } from "../interfaces";
import { useEspecialidad } from "@/hooks/useEspecialidad";
import admisionesService from "@/services/admisiones.service";
import { encuentrosService } from "@/services";
import { API_BASE_URL } from "@/utils/constants";

interface Props {}

interface MetricaConfig {
  id: string;
  titulo: string;
  label: string;
  key: keyof DoctorStats;
}

const METRICAS_DISPONIBLES: Record<string, MetricaConfig> = {
  pacientesHospitalizados: {
    id: 'pacientesHospitalizados',
    titulo: 'Pacientes Hospitalizados',
    label: 'Actualmente internados',
    key: 'pacientesHospitalizados',
  },
  citasHoy: {
    id: 'citasHoy',
    titulo: 'Citas Programadas',
    label: 'Para hoy',
    key: 'citasHoy',
  },
  encuentrosHoy: {
    id: 'encuentrosHoy',
    titulo: 'Atenciones Hoy',
    label: 'Encuentros registrados',
    key: 'encuentrosHoy',
  },
  pacientesEnEmergencia: {
    id: 'pacientesEnEmergencia',
    titulo: '🚨 Pacientes en Emergencia',
    label: 'Atención de emergencia',
    key: 'pacientesEnEmergencia',
  },
  altasPendientes: {
    id: 'altasPendientes',
    titulo: 'Altas Pendientes',
    label: 'Por procesar',
    key: 'altasPendientes',
  },
};

export default function DashboardStats({}: Props) {
  const { vistaDashboard } = useEspecialidad();
  const [stats, setStats] = useState<DoctorStats>({
    pacientesHospitalizados: 0,
    encuentrosHoy: 0,
    citasHoy: 0,
    altasPendientes: 0,
    pacientesEnEmergencia: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      // Obtener stats globales del dashboard
      let dashboardData = null;
      try {
        const dashboardResponse = await fetch(`${API_BASE_URL}/dashboard/stats`);
        const dashboardResult = await dashboardResponse.json();
        dashboardData = dashboardResult.data;
      } catch {
        // Si falla, continuamos con otros stats
      }

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

      setStats({
        pacientesHospitalizados: dashboardData?.pacientesHospitalizados || admisionesResponse.total || 0,
        encuentrosHoy: encuentrosHoyCount,
        citasHoy: dashboardData?.citasProgramadasHoy || 0,
        altasPendientes: 0, // Por implementar
        pacientesEnEmergencia: dashboardData?.pacientesEnEmergencia || 0,
      });
    } catch (error) {
      console.error("Error fetching doctor stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Si no hay configuración de vista, mostrar todas las métricas por defecto
  const metricasAMostrar = vistaDashboard?.metricas || 
    ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'];

  return (
    <section className={styles["dashboard-stats"]}>
      {metricasAMostrar.map((metricaId) => {
        const metrica = METRICAS_DISPONIBLES[metricaId];
        if (!metrica) return null;

        return (
          <div key={metricaId} className={styles.card}>
            <h2>{metrica.titulo}</h2>
            <div className={styles["stat-value"]}>
              {loading ? "..." : stats[metrica.key]}
            </div>
            <span className={styles["stat-label"]}>{metrica.label}</span>
          </div>
        );
      })}
    </section>
  );
}
