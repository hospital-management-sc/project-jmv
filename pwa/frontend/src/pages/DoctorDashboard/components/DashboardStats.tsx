import { useEffect, useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { DoctorStats } from "../interfaces";
import { useEspecialidad } from "@/hooks/useEspecialidad";
import { useAuth } from "@/contexts/AuthContext";
import admisionesService from "@/services/admisiones.service";
import { encuentrosService } from "@/services";
import * as citasService from "@/services/citas.service";

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
  const { user } = useAuth();
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
    if (user?.id) {
      fetchStats();
      const interval = setInterval(fetchStats, 60000); // Actualizar cada minuto
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      // Obtener stats del médico actual
      
      // 1. Pacientes hospitalizados del médico
      let pacientesHospitalizados = 0;
      try {
        const admisionesResponse = await admisionesService.listarAdmisionesActivasMedico(user.id);
        pacientesHospitalizados = (admisionesResponse as any).total || 0;
      } catch (err) {
        console.warn("Error obteniendo admisiones del médico:", err);
      }

      // 2. Encuentros del médico hoy
      let encuentrosHoyCount = 0;
      try {
        const encuentrosHoy = await encuentrosService.obtenerHoyDelMedico(user.id);
        encuentrosHoyCount = encuentrosHoy.length || 0;
      } catch (err) {
        console.warn("Error obteniendo encuentros del médico:", err);
      }

      // 3. Citas del médico hoy
      let citasHoyCount = 0;
      try {
        const citasDia = await citasService.obtenerCitasDelDia(Number(user.id));
        citasHoyCount = citasDia.length || 0;
      } catch (err) {
        console.warn("Error obteniendo citas del médico:", err);
      }

      setStats({
        pacientesHospitalizados,
        encuentrosHoy: encuentrosHoyCount,
        citasHoy: citasHoyCount,
        altasPendientes: 0, // Por implementar
        pacientesEnEmergencia: 0, // Por implementar
      });
    } catch (error) {
      // Error fetching doctor statistics
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
