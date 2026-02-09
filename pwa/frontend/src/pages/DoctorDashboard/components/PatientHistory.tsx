// ==========================================
// COMPONENTE: Historia del Paciente
// ==========================================
import { useEffect, useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { PatientBasic } from "../interfaces";
import {
  encuentrosService,
  type Encuentro,
} from "@/services/encuentros.service";
import pacientesService from "@/services/pacientes.service";
import { EncuentroDetailModal } from "@/components";
import { formatDateVenezuela, formatDateLocal, formatTimeMilitaryVenezuela, calculateAge } from "@/utils/dateUtils";

interface Props {
  patient: PatientBasic;
  onBack: () => void;
}

export default function PatientHistory({ patient, onBack }: Props) {
  const [historiaCompleta, setHistoriaCompleta] = useState<any>(null);
  const [encuentros, setEncuentros] = useState<Encuentro[]>([]);
  const [loading, setLoading] = useState(true);
  const [encuentroSeleccionado, setEncuentroSeleccionado] = useState<Encuentro | null>(null);

  useEffect(() => {
    cargarHistoriaCompleta();
    cargarEncuentros();
  }, [patient?.id]);

  const cargarHistoriaCompleta = async () => {
    setLoading(true);
    try {
      const data = await pacientesService.buscarPorId(Number(patient.id));
      console.log("📊 Datos completos del paciente:", data);
      setHistoriaCompleta(data);
    } catch (err) {
      console.error("Error al cargar historia:", err);
    } finally {
      setLoading(false);
    }
  };

  const cargarEncuentros = async () => {
    try {
      const data = await encuentrosService.obtenerPorPaciente(Number(patient.id));
      setEncuentros(data);
      console.log("✅ Encuentros cargados:", data.length);
    } catch (err) {
      console.error("Error al cargar encuentros:", err);
      setEncuentros([]);
    }
  };

  const handleVerDetalleEncuentro = (encuentro: Encuentro) => {
    setEncuentroSeleccionado(encuentro);
  };

  const handleCerrarDetalle = () => {
    setEncuentroSeleccionado(null);
  };

  // Construir timeline de eventos (misma lógica que PatientHistoryView.tsx)
  const construirTimeline = () => {
    if (!historiaCompleta) return [];

    const eventos: any[] = [];

    // Evento: Registro inicial
    // Obtener información del usuario que registró el paciente
    const admisionInicial = historiaCompleta.admisiones?.find((a: any) => !a.tipo && !a.servicio);
    const usuarioRegistrador = admisionInicial?.createdBy;
    
    if (historiaCompleta.createdAt) {
      // Para REGISTRO, usar solo la fecha sin hora (es un evento del sistema del día completo)
      const fechaRegistro = typeof historiaCompleta.createdAt === 'string'
        ? historiaCompleta.createdAt.split('T')[0]
        : new Date(historiaCompleta.createdAt).toISOString().split('T')[0]
      
      eventos.push({
        tipo: "REGISTRO",
        fecha: fechaRegistro,
        hora: null,
        icono: "📋",
        titulo: "Registro en el Sistema",
        descripcion: `Paciente registrado en el sistema hospitalario.`,
        color: "#10b981",
        // Auditoría - Quién registró
        registradoPor: usuarioRegistrador
          ? {
              nombre: usuarioRegistrador.nombre || "Administrativo",
              cargo: usuarioRegistrador.cargo || "Administrativo",
              especialidad: usuarioRegistrador.especialidad,
              role: usuarioRegistrador.role,
            }
          : null,
      });
    }

    // Eventos: Admisiones
    // Nota: Las admisiones iniciales (tipo: null, servicio: null) NO se muestran como eventos separados
    // porque forman parte del evento 'Registro en el Sistema'.
    // Solo se muestran admisiones específicas (EMERGENCIA, HOSPITALIZACION, etc.)
    if (historiaCompleta.admisiones && historiaCompleta.admisiones.length > 0) {
      historiaCompleta.admisiones.forEach((admision: any) => {
        const esAdmisionInicial = !admision.tipo && !admision.servicio;

        // Solo mostrar admisiones específicas (no iniciales)
        if (!esAdmisionInicial) {
          const tipoAdmision = admision.tipo || "HOSPITALIZACIÓN";
          const servicioAdmision = admision.servicio || "No especificado";
          const estadoAdmision = admision.estado || "ACTIVA";

          eventos.push({
            tipo: "ADMISION",
            fecha: admision.fechaAdmision || admision.createdAt,
            hora: admision.horaAdmision || admision.createdAt,
            icono: tipoAdmision === "EMERGENCIA" ? "🚨" : "🏥",
            titulo: `Admisión: ${tipoAdmision}`,
            descripcion: `Servicio: ${servicioAdmision}. Estado: ${estadoAdmision}`,
            detalles: admision,
            color: tipoAdmision === "EMERGENCIA" ? "#ef4444" : "#3b82f6",
            // Auditoría - Quién creó la admisión
            registradoPor: admision.createdBy
              ? {
                  nombre: admision.createdBy.nombre || "Usuario desconocido",
                  cargo: admision.createdBy.cargo || "No especificado",
                  especialidad: admision.createdBy.especialidad,
                  role: admision.createdBy.role,
                }
              : null,
          });

          // Eventos: Información completada en Formato de Emergencia
          if (admision.formatoEmergencia) {
            const formato = admision.formatoEmergencia;
            let resumenDatos = [];
            
            if (formato.motivoConsulta) resumenDatos.push(`Motivo: ${formato.motivoConsulta.substring(0, 40)}`);
            if (formato.signosVitales && formato.signosVitales.length > 0) {
              resumenDatos.push(`Signos vitales registrados (${formato.signosVitales.length})`);
            }
            if (formato.diagnostico) resumenDatos.push(`Diagnóstico: ${formato.diagnostico.substring(0, 40)}`);

            eventos.push({
              tipo: "FORMATO_EMERGENCIA",
              fecha: formato.createdAt || admision.fechaAdmision,
              hora: formato.createdAt || admision.horaAdmision,
              icono: "📋",
              titulo: "Formato de Emergencia Completado",
              descripcion: resumenDatos.length > 0 ? resumenDatos.join(" • ") : "Información clínica de emergencia registrada",
              detalles: formato,
              color: "#ec4899",
            });
          }

          // Eventos: Información completada en Formato de Hospitalización
          if (admision.formatoHospitalizacion) {
            const formato = admision.formatoHospitalizacion;
            let resumenDatos = [];
            
            if (formato.signosVitales && formato.signosVitales.length > 0) {
              resumenDatos.push(`Signos vitales (${formato.signosVitales.length})`);
            }
            if (formato.laboratorios && formato.laboratorios.length > 0) {
              resumenDatos.push(`Laboratorios (${formato.laboratorios.length})`);
            }
            if (formato.evolucionesMedicas && formato.evolucionesMedicas.length > 0) {
              resumenDatos.push(`Evoluciones (${formato.evolucionesMedicas.length})`);
            }
            if (formato.resumenIngreso?.diagnostico) {
              resumenDatos.push(`Diagnóstico: ${formato.resumenIngreso.diagnostico.substring(0, 40)}`);
            }

            eventos.push({
              tipo: "FORMATO_HOSPITALIZACION",
              fecha: formato.createdAt || admision.fechaAdmision,
              hora: formato.createdAt || admision.horaAdmision,
              icono: "📊",
              titulo: "Formato de Hospitalización Completado",
              descripcion: resumenDatos.length > 0 ? resumenDatos.join(" • ") : "Documentación clínica de hospitalización registrada",
              detalles: formato,
              color: "#06b6d4",
            });
          }
        }
      });
    }

    // Eventos: Encuentros médicos
    if (encuentros && encuentros.length > 0) {
      encuentros.forEach((encuentro: any) => {
        let icono = "⚕️";
        let color = "#8b5cf6";

        if (encuentro.tipo === "EMERGENCIA") {
          icono = "🚨";
          color = "#ef4444";
        } else if (encuentro.tipo === "HOSPITALIZACION") {
          icono = "🛏️";
          color = "#3b82f6";
        } else if (encuentro.tipo === "CONSULTA") {
          icono = "🩺";
          color = "#10b981";
        }

        const motivoTexto = encuentro.motivoConsulta
          ? ` - ${encuentro.motivoConsulta.substring(0, 50)}...`
          : "";
        const diagnostico =
          encuentro.impresiones && encuentro.impresiones.length > 0
            ? encuentro.impresiones[0].descripcion
            : "Sin diagnóstico";

        eventos.push({
          tipo: "ENCUENTRO",
          fecha: encuentro.fecha,
          hora: encuentro.hora || encuentro.createdAt,
          icono: icono,
          titulo: `Encuentro Médico: ${encuentro.tipo}`,
          descripcion: `${motivoTexto}`,
          detalles: encuentro,
          color: color,
          diagnostico: diagnostico,
          // Auditoría - Médico que realizó el encuentro
          registradoPor: encuentro.createdBy
            ? {
                nombre: encuentro.createdBy.nombre || "Médico no registrado",
                cargo: encuentro.createdBy.cargo || "Médico",
                especialidad: encuentro.createdBy.especialidad,
                role: encuentro.createdBy.role,
              }
            : null,
        });
      });
    }

    // Eventos: Citas médicas
    if (historiaCompleta.citas && historiaCompleta.citas.length > 0) {
      historiaCompleta.citas.forEach((cita: any) => {
        const estadoCita = cita.estado || "PROGRAMADA";
        const especialidad = cita.especialidad || "No especificado";
        const motivo = cita.motivo ? ` - ${cita.motivo}` : "";

        let icono = "📅";
        let color = "#f59e0b";
        let estadoTexto = "Programada";

        if (estadoCita === "COMPLETADA") {
          icono = "✅";
          color = "#10b981";
          estadoTexto = "Completada";
        }

        eventos.push({
          tipo: "CITA",
          fecha: cita.fechaCita,
          hora: cita.horaCita,
          icono: icono,
          titulo: `Cita Médica (${estadoTexto})`,
          descripcion: `Especialidad: ${especialidad}${motivo}`,
          detalles: cita,
          color: color,
        });
      });
    }

    // Ordenar por fecha y hora descendente (más reciente primero)
    eventos.sort((a, b) => {
      try {
        let fechaA = a.fecha;
        let fechaB = b.fecha;

        if (fechaA instanceof Date) {
          fechaA = fechaA.toISOString();
        }
        if (fechaB instanceof Date) {
          fechaB = fechaB.toISOString();
        }

        if (typeof fechaA === "string" && fechaA.includes("T")) {
          fechaA = fechaA.split("T")[0];
        }
        if (typeof fechaB === "string" && fechaB.includes("T")) {
          fechaB = fechaB.split("T")[0];
        }

        let horaA = "00:00:00";
        let horaB = "00:00:00";

        if (a.hora) {
          let horaTemp = a.hora;
          if (horaTemp instanceof Date) {
            horaTemp = horaTemp.toISOString();
          }

          if (typeof horaTemp === "string") {
            if (horaTemp.includes("T")) {
              const timeMatch = horaTemp.match(/T(\d{2}:\d{2}:\d{2})/);
              horaA = timeMatch ? timeMatch[1] : "00:00:00";
            } else {
              horaA = horaTemp.length === 5 ? `${horaTemp}:00` : horaTemp;
            }
          }
        }

        if (b.hora) {
          let horaTemp = b.hora;
          if (horaTemp instanceof Date) {
            horaTemp = horaTemp.toISOString();
          }

          if (typeof horaTemp === "string") {
            if (horaTemp.includes("T")) {
              const timeMatch = horaTemp.match(/T(\d{2}:\d{2}:\d{2})/);
              horaB = timeMatch ? timeMatch[1] : "00:00:00";
            } else {
              horaB = horaTemp.length === 5 ? `${horaTemp}:00` : horaTemp;
            }
          }
        }

        const fechaHoraA = new Date(`${fechaA}T${horaA}`).getTime();
        const fechaHoraB = new Date(`${fechaB}T${horaB}`).getTime();

        return fechaHoraB - fechaHoraA;
      } catch (err) {
        console.error("Error ordenando eventos:", err, { a, b });
        return 0;
      }
    });

    return eventos;
  };

  const timeline = construirTimeline();

  if (loading) {
    return (
      <section className={styles["view-section"]}>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>
            Cargando historia clínica...
          </p>
        </div>
      </section>
    );
  }

  const datosCompletos = historiaCompleta || patient;

  return (
    <section className={styles["view-section"]}>
      <div className={styles["section-header"]}>
        <h2>📋 Historia Clínica Completa</h2>
        <button className={styles["back-link"]} onClick={onBack}>
          ← Volver a búsqueda
        </button>
      </div>

      {/* Información del paciente */}
      <div
        style={{
          backgroundColor: "var(--bg-tertiary)",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          marginBottom: "2rem",
          border: "1px solid var(--border-color)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>
          📋 Datos del Paciente
        </h3>

        {/* Sección 1: Identificación */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4
            style={{
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "var(--text-secondary)",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Identificación
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Nro. Historia Clínica:
              </strong>
              <span style={{ fontSize: "1rem" }}>
                {datosCompletos?.nroHistoria || "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Nombre Completo:
              </strong>
              <span style={{ fontSize: "1rem", fontWeight: "500" }}>
                {datosCompletos?.apellidosNombres || "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Cédula de Identidad:
              </strong>
              <span style={{ fontSize: "1rem" }}>
                {datosCompletos?.ci || "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Tipo de Paciente:
              </strong>
              <span style={{ fontSize: "1rem" }}>
                {datosCompletos?.tipoPaciente || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Sección 2: Información Personal */}
        <div
          style={{
            marginBottom: "1.5rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          <h4
            style={{
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "var(--text-secondary)",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Información Personal
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Fecha de Nacimiento:
              </strong>
              <span style={{ fontSize: "1rem" }}>
                {formatDateLocal(datosCompletos?.fechaNacimiento)}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Edad:
              </strong>
              <span style={{ fontSize: "1rem", fontWeight: "500" }}>
                {calculateAge(datosCompletos?.fechaNacimiento)} años
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Sexo:
              </strong>
              <span style={{ fontSize: "1rem" }}>
                {datosCompletos?.sexo === "M"
                  ? "Masculino"
                  : datosCompletos?.sexo === "F"
                  ? "Femenino"
                  : "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Nacionalidad:
              </strong>
              <span style={{ fontSize: "1rem" }}>
                {datosCompletos?.nacionalidad || "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Lugar de Nacimiento:
              </strong>
              <span style={{ fontSize: "1rem" }}>
                {datosCompletos?.lugarNacimiento || "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Estado de Residencia:
              </strong>
              <span style={{ fontSize: "1rem" }}>
                {datosCompletos?.estado || "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Religión:
              </strong>
              <span style={{ fontSize: "1rem" }}>
                {datosCompletos?.religion || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Sección 3: Información de Contacto */}
        <div
          style={{
            marginBottom: "0",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          <h4
            style={{
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "var(--text-secondary)",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Información de Contacto
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                📞 Teléfono Principal:
              </strong>
              <span style={{ fontSize: "1rem", fontWeight: "500" }}>
                {datosCompletos?.telefono || "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                🚨 Teléfono de Emergencia:
              </strong>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                  color: "#ef4444",
                }}
              >
                {datosCompletos?.telefonoEmergencia || "No registrado"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                gridColumn: "1 / -1",
              }}
            >
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                🏠 Dirección Completa:
              </strong>
              <span style={{ fontSize: "1rem" }}>
                {datosCompletos?.direccion || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Datos Militares */}
      {(datosCompletos?.personalMilitar || datosCompletos?.grado) && (
        <div
          style={{
            backgroundColor: "rgba(124, 58, 237, 0.1)",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            marginBottom: "2rem",
            border: "1px solid rgba(124, 58, 237, 0.3)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#7c3aed" }}>
            🎖️ Datos Militares
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Grado:
              </strong>
              <span>
                {(datosCompletos?.personalMilitar || datosCompletos)?.grado ||
                  "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Componente:
              </strong>
              <span>
                {(datosCompletos?.personalMilitar || datosCompletos)
                  ?.componente || "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Unidad:
              </strong>
              <span>
                {(datosCompletos?.personalMilitar || datosCompletos)?.unidad ||
                  "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Estado Militar:
              </strong>
              <span>
                {(() => {
                  const estado = (datosCompletos?.personalMilitar || datosCompletos)
                    ?.estadoMilitar;
                  if (!estado) return "N/A";
                  if (estado === "activo") return "Activo";
                  if (estado === "disponible") return "Disponible";
                  if (estado === "resActiva") return "Reserva Activa";
                  return "N/A";
                })()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Timeline de eventos */}
      <div>
        <h3 style={{ marginBottom: "1.5rem" }}>
          📅 Línea de Tiempo (Más Reciente Primero)
        </h3>

        {timeline.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "0.5rem",
              border: "1px solid var(--border-color)",
            }}
          >
            <p style={{ color: "var(--text-secondary)" }}>
              No hay eventos registrados en la historia clínica
            </p>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            {/* Línea vertical del timeline */}
            <div
              style={{
                position: "absolute",
                left: "2rem",
                top: "1rem",
                bottom: "1rem",
                width: "2px",
                backgroundColor: "var(--border-color)",
              }}
            />

            {timeline.map((evento, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  paddingLeft: "5rem",
                  paddingBottom: "2rem",
                }}
              >
                {/* Icono del evento */}
                <div
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "0",
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: evento.color,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    border: "3px solid var(--bg-primary)",
                    zIndex: 1,
                  }}
                >
                  {evento.icono}
                </div>

                {/* Contenido del evento */}
                <div
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    padding: "1.25rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border-color)",
                    borderLeft: `4px solid ${evento.color}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {evento.titulo}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                          backgroundColor: "var(--bg-secondary)",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "1rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {evento.tipo === 'CITA' || evento.tipo === 'ADMISION' || evento.tipo === 'ADMISION_INICIAL' || evento.tipo === 'ENCUENTRO' || evento.tipo === 'REGISTRO'
                          ? formatDateLocal(evento.fecha)
                          : formatDateVenezuela(evento.fecha)
                        }
                      </span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                          backgroundColor: "var(--bg-secondary)",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "1rem",
                          whiteSpace: "nowrap",
                          fontWeight: "600",
                          fontFamily: "monospace",
                        }}
                      >
                        🕐 {formatTimeMilitaryVenezuela(evento.hora)}
                      </span>
                    </div>
                  </div>
                  {evento.tipo !== "ENCUENTRO" && (
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        color: "var(--text-secondary)",
                        fontSize: "0.95rem",
                      }}
                    >
                      {evento.descripcion}
                    </p>
                  )}

                  {/* Detalles adicionales según tipo de evento */}
                  {evento.detalles && evento.tipo === "ENCUENTRO" && (
                    <div
                      style={{
                        marginTop: "1rem",
                        paddingTop: "1rem",
                        borderTop: "1px solid var(--border-color)",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleVerDetalleEncuentro(evento.detalles)
                        }
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                        }}
                      >
                        Ver detalle completo del encuentro →
                      </button>
                    </div>
                  )}
                  {evento.detalles &&
                    (evento.tipo === "ADMISION" ||
                      evento.tipo === "ADMISION_INICIAL") && (
                      <div
                        style={{
                          marginTop: "1rem",
                          paddingTop: "1rem",
                          borderTop: "1px solid var(--border-color)",
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: "0.75rem",
                          fontSize: "0.85rem",
                        }}
                      >
                        <div>
                          <strong style={{ color: "var(--text-secondary)" }}>
                            Forma Ingreso:
                          </strong>
                          <span style={{ marginLeft: "0.5rem" }}>
                            {evento.detalles.formaIngreso || "N/A"}
                          </span>
                        </div>
                        {evento.detalles.habitacion && (
                          <div>
                            <strong style={{ color: "var(--text-secondary)" }}>
                              Habitación:
                            </strong>
                            <span style={{ marginLeft: "0.5rem" }}>
                              {evento.detalles.habitacion}
                            </span>
                          </div>
                        )}
                        {evento.detalles.cama && (
                          <div>
                            <strong style={{ color: "var(--text-secondary)" }}>
                              Cama:
                            </strong>
                            <span style={{ marginLeft: "0.5rem" }}>
                              {evento.detalles.cama}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                  {/* Información de auditoría - Quién registró el evento (aparece al final) */}
                  {evento.registradoPor && (
                    <div
                      style={{
                        marginTop: "1rem",
                        paddingTop: "1rem",
                        borderTop: "1px solid var(--border-color)",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontStyle: "italic" }}>Registrado por:</span>
                      <strong style={{ color: "var(--text-primary)" }}>
                        {evento.registradoPor.nombre}
                      </strong>
                      {evento.registradoPor.cargo && (
                        <span>
                          • {evento.registradoPor.cargo}
                          {evento.registradoPor.especialidad &&
                            ` (${evento.registradoPor.especialidad})`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle de encuentro */}
      {encuentroSeleccionado && (
        <EncuentroDetailModal
          encuentro={encuentroSeleccionado}
          onClose={handleCerrarDetalle}
        />
      )}
    </section>
  );
}
