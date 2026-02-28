// ==========================================
// COMPONENTE: Historia del Paciente
// ==========================================
import React, { useEffect, useState } from "react";
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
  // Buscador y filtros
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtrosTipo, setFiltrosTipo] = useState<{
    REGISTRO: boolean;
    ADMISION: boolean;
    FORMATO_EMERGENCIA: boolean;
    FORMATO_HOSPITALIZACION: boolean;
    ENCUENTRO: boolean;
    CITA: boolean;
  }>({
    REGISTRO: true,
    ADMISION: true,
    FORMATO_EMERGENCIA: true,
    FORMATO_HOSPITALIZACION: true,
    ENCUENTRO: true,
    CITA: true,
  });

  useEffect(() => {
    cargarHistoriaCompleta();
    cargarEncuentros();
  }, [patient?.id]);

  const cargarHistoriaCompleta = async () => {
    setLoading(true);
    try {
      const data = await pacientesService.buscarPorId(Number(patient.id));
      setHistoriaCompleta(data);
    } catch (err) {
      // Error loading patient history
    } finally {
      setLoading(false);
    }
  };

  const cargarEncuentros = async () => {
    try {
      const data = await encuentrosService.obtenerPorPaciente(Number(patient.id));
      setEncuentros(data);
    } catch (err) {
      setEncuentros([]);
    }
  };

  const handleVerDetalleEncuentro = (encuentro: Encuentro) => {
    setEncuentroSeleccionado(encuentro);
  };

  const handleCerrarDetalle = () => {
    setEncuentroSeleccionado(null);
  };

  const crearAuditTrail = (
    source: any,
    fallback: { nombre: string; cargo: string; especialidad?: string } = {
      nombre: "Sistema",
      cargo: "Registro automático",
    }
  ) => {
    const nombreCompuesto = [source?.firstName, source?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      nombre: source?.nombre || nombreCompuesto || fallback.nombre,
      cargo: source?.cargo || fallback.cargo,
      especialidad: source?.especialidad || fallback.especialidad,
      role: source?.role,
    };
  };

  const formatearNombreDoctor = (medico?: any) => {
    if (!medico) return "Médico por asignar";
    const nombreCompleto = `${medico.nombre || ""} ${medico.apellido || ""}`.trim();
    if (!nombreCompleto) return "Médico por asignar";
    return /^dr\.?/i.test(nombreCompleto) ? nombreCompleto : `Dr. ${nombreCompleto}`;
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
        icono: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>),
        titulo: "Registro en el Sistema",
        descripcion: `Paciente registrado en el sistema hospitalario.`,
        color: "#10b981",
        // Auditoría - Quién registró
        registradoPor: crearAuditTrail(usuarioRegistrador, {
          nombre: "Administrativo",
          cargo: "Coordinador Administrativo",
        }),
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
            icono: tipoAdmision === "EMERGENCIA"
              ? (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>)
              : (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
            titulo: `Admisión: ${tipoAdmision}`,
            descripcion: `Servicio: ${servicioAdmision}. Estado: ${estadoAdmision}`,
            detalles: admision,
            color: tipoAdmision === "EMERGENCIA" ? "#ef4444" : "#3b82f6",
            // Auditoría - Quién creó la admisión
            registradoPor: crearAuditTrail(admision.createdBy || usuarioRegistrador, {
              nombre: "Usuario administrativo",
              cargo: "Admisión",
            }),
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
              icono: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>),
              titulo: "Formato de Emergencia Completado",
              descripcion: resumenDatos.length > 0 ? resumenDatos.join(" • ") : "Información clínica de emergencia registrada",
              detalles: formato,
              color: "#ec4899",
              registradoPor: crearAuditTrail(admision.createdBy || usuarioRegistrador, {
                nombre: "Equipo de Emergencia",
                cargo: "Registro clínico",
              }),
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
              icono: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
              titulo: "Formato de Hospitalización Completado",
              descripcion: resumenDatos.length > 0 ? resumenDatos.join(" • ") : "Documentación clínica de hospitalización registrada",
              detalles: formato,
              color: "#06b6d4",
              registradoPor: crearAuditTrail(admision.createdBy || usuarioRegistrador, {
                nombre: "Equipo de Hospitalización",
                cargo: "Registro clínico",
              }),
            });
          }
        }
      });
    }

    // Eventos: Encuentros médicos
    if (encuentros && encuentros.length > 0) {
      encuentros.forEach((encuentro: any) => {
        let icono: React.ReactNode = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>);
        let color = "#8b5cf6";

        if (encuentro.tipo === "EMERGENCIA") {
          icono = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
          color = "#ef4444";
        } else if (encuentro.tipo === "HOSPITALIZACION") {
          icono = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>);
          color = "#3b82f6";
        } else if (encuentro.tipo === "CONSULTA") {
          icono = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
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
          registradoPor: crearAuditTrail(encuentro.createdBy, {
            nombre: "Médico tratante",
            cargo: "Médico",
          }),
        });
      });
    }

    // Eventos: Citas médicas
    if (historiaCompleta.citas && historiaCompleta.citas.length > 0) {
      historiaCompleta.citas.forEach((cita: any) => {
        const estadoCita = cita.estado || "PROGRAMADA";
        const especialidad = cita.especialidad || "No especificado";
        const motivoConsulta = cita.motivo || "No especificado";
        
        // Información del médico agendado (puede estar vacío si aún no se asigna)
        const doctorAgendado = formatearNombreDoctor(cita.medico);
        
        const descripcionCita = [
          `Especialidad: ${especialidad}`,
          `Motivo de la Consulta: ${motivoConsulta}`,
          `Agendado con: ${doctorAgendado}`,
        ].join("\n");

        let icono: React.ReactNode = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
        let color = "#f59e0b";
        let estadoTexto = "Programada";

        if (estadoCita === "COMPLETADA") {
          icono = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
          color = "#10b981";
          estadoTexto = "Completada";
        }

        // Usar createdBy si está disponible (quién agendó), otherwise default fallback
        const agendadoPor = crearAuditTrail(cita.createdBy, {
          nombre: "Coordinador Administrativo",
          cargo: "Administración",
        });

        eventos.push({
          tipo: "CITA",
          fecha: cita.fechaCita,
          hora: cita.horaCita,
          icono: icono,
          titulo: `Cita Médica (${estadoTexto})`,
          descripcion: descripcionCita,
          detalles: cita,
          color: color,
          registradoPor: agendadoPor,
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
        // Error sorting timeline events
        return 0;
      }
    });

    return eventos;
  };

  const timeline = construirTimeline();

  // Función de filtrado de eventos
  const filtrarEventos = () => {
    return timeline.filter((evento) => {
      // Validar que el tipo esté seleccionado
      if (!filtrosTipo[evento.tipo as keyof typeof filtrosTipo]) {
        return false;
      }

      // Si no hay texto de búsqueda, mostrar el evento
      if (!filtroTexto.trim()) {
        return true;
      }

      const textoBusqueda = filtroTexto.toLowerCase();

      // Buscar en nombre del evento
      if (evento.titulo.toLowerCase().includes(textoBusqueda)) {
        return true;
      }

      // Buscar en descripción
      if (evento.descripcion.toLowerCase().includes(textoBusqueda)) {
        return true;
      }

      // Buscar en fecha (formato DD/MM/YYYY)
      const fechaFormato = formatDateLocal(evento.fecha);
      if (fechaFormato.includes(textoBusqueda)) {
        return true;
      }

      // Buscar en hora
      if (evento.hora) {
        const horaFormato = formatTimeMilitaryVenezuela(evento.hora);
        if (horaFormato.includes(textoBusqueda)) {
          return true;
        }
      }

      // Buscar en información de auditoría (nombre y especialidad del doctor)
      if (
        evento.registradoPor?.nombre.toLowerCase().includes(textoBusqueda) ||
        evento.registradoPor?.especialidad?.toLowerCase().includes(textoBusqueda) ||
        evento.registradoPor?.cargo?.toLowerCase().includes(textoBusqueda)
      ) {
        return true;
      }

      return false;
    });
  };

  const eventosFiltrados = filtrarEventos();

  if (loading) {
    return (
      <section className={styles["view-section"]}>
        <div className={styles["loading-container"]}>
          <div className="spinner" aria-hidden="true" />
          <p className="loading-text">Cargando historia clínica...</p>
        </div>
      </section>
    );
  }

  const datosCompletos = historiaCompleta || patient;

  return (
    <section className={styles["view-section"]}>
      <div className={styles["section-header"]}>
        <h2>Historia Clínica Completa</h2>
        <button className={styles["back-link"]} onClick={onBack}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver a búsqueda
        </button>
      </div>

      {/* ── Datos del Paciente ── */}
      <div className={styles["history-patient-card"]}>
        {/* Hero: avatar + nombre + badges */}
        <div className={styles["history-patient-hero"]}>
          <div className={styles["history-patient-identity"]}>
            <h3 className={styles["history-patient-name"]}>
              {datosCompletos?.apellidosNombres || "N/A"}
            </h3>
          </div>
        </div>

        {/* Identificación */}
        <div className={styles["history-section-block"]}>
          <p className={styles["history-section-label"]}>Identificación</p>
          <div className={styles["history-data-grid"]}>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Nro. Historia Clínica</span>
              <span className={styles["history-field-value-highlight"]}>
                {datosCompletos?.nroHistoria || "N/A"}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Cédula de Identidad</span>
              <span className={styles["history-field-value"]}>
                {datosCompletos?.ci || "N/A"}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Tipo de Paciente</span>
              <span className={styles["history-field-value"]}>
                {datosCompletos?.tipoPaciente || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Información Personal */}
        <div className={styles["history-section-block"]}>
          <p className={styles["history-section-label"]}>Información Personal</p>
          <div className={styles["history-data-grid"]}>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Fecha de Nacimiento</span>
              <span className={styles["history-field-value"]}>
                {formatDateLocal(datosCompletos?.fechaNacimiento)}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Edad</span>
              <span className={styles["history-field-value-highlight"]}>
                {calculateAge(datosCompletos?.fechaNacimiento)} años
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Sexo</span>
              <span className={styles["history-field-value"]}>
                {datosCompletos?.sexo === "M"
                  ? "Masculino"
                  : datosCompletos?.sexo === "F"
                  ? "Femenino"
                  : "N/A"}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Nacionalidad</span>
              <span className={styles["history-field-value"]}>
                {datosCompletos?.nacionalidad || "N/A"}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Lugar de Nacimiento</span>
              <span className={styles["history-field-value"]}>
                {datosCompletos?.lugarNacimiento || "N/A"}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Estado de Residencia</span>
              <span className={styles["history-field-value"]}>
                {datosCompletos?.estado || "N/A"}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Religión</span>
              <span className={styles["history-field-value"]}>
                {datosCompletos?.religion || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className={styles["history-section-block"]}>
          <p className={styles["history-section-label"]}>Información de Contacto</p>
          <div className={styles["history-data-grid"]}>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Teléfono Principal</span>
              <span className={styles["history-field-value-highlight"]}>
                {datosCompletos?.telefono || "N/A"}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Teléfono de Emergencia</span>
              <span className={styles["history-field-emergency"]}>
                {datosCompletos?.telefonoEmergencia || "No registrado"}
              </span>
            </div>
            <div className={`${styles["history-field"]} ${styles["history-field-full"]}`}>
              <span className={styles["history-field-label"]}>Dirección Completa</span>
              <span className={styles["history-field-value"]}>
                {datosCompletos?.direccion || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Datos Militares ── */}
      {(datosCompletos?.personalMilitar || datosCompletos?.grado) && (
        <div className={styles["history-military-card"]}>
          <h3 className={styles["history-military-title"]}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Datos Militares
          </h3>
          <div className={styles["history-data-grid"]}>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Grado</span>
              <span className={styles["history-field-value-highlight"]}>
                {(datosCompletos?.personalMilitar || datosCompletos)?.grado || "N/A"}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Componente</span>
              <span className={styles["history-field-value"]}>
                {(datosCompletos?.personalMilitar || datosCompletos)?.componente || "N/A"}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Unidad</span>
              <span className={styles["history-field-value"]}>
                {(datosCompletos?.personalMilitar || datosCompletos)?.unidad || "N/A"}
              </span>
            </div>
            <div className={styles["history-field"]}>
              <span className={styles["history-field-label"]}>Estado Militar</span>
              <span className={styles["history-field-value"]}>
                {(() => {
                  const estado = (datosCompletos?.personalMilitar || datosCompletos)?.estadoMilitar;
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

      {/* ── Línea de Tiempo ── */}
      <div className={styles["timeline-wrapper"]}>
        <h3 className={styles["timeline-heading"]}>
          Línea de Tiempo
          <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "rgba(255,255,255,0.32)" }}>
            (Más reciente primero)
          </span>
        </h3>

        {/* Search & Filter Panel */}
        <div className={styles["timeline-search-panel"]}>
          <div className={styles["timeline-search-field"]}>
            <svg className={styles["timeline-search-icon"]} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              id="buscar-eventos"
              type="text"
              className={styles["timeline-search-input"]}
              placeholder="Busca por nombre, especialidad, doctor, fecha u hora..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
          <p className={styles["timeline-filter-label"]}>Filtrar por tipo</p>
          <div className={styles["timeline-filter-chips"]}>
            {[
              { key: "REGISTRO", label: "Registro" },
              { key: "ADMISION", label: "Admisiones" },
              { key: "FORMATO_EMERGENCIA", label: "Formato Emergencia" },
              { key: "FORMATO_HOSPITALIZACION", label: "Formato Hospitalización" },
              { key: "ENCUENTRO", label: "Encuentros Médicos" },
              { key: "CITA", label: "Citas Médicas" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`${styles["timeline-chip"]} ${
                  filtrosTipo[key as keyof typeof filtrosTipo] ? styles["timeline-chip--active"] : ""
                }`}
                onClick={() =>
                  setFiltrosTipo((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof filtrosTipo],
                  }))
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {timeline.length > 0 && (
          <p className={styles["timeline-result-count"]}>
            Mostrando <strong>{eventosFiltrados.length}</strong> de{" "}
            <strong>{timeline.length}</strong> eventos
          </p>
        )}

        {/* List */}
        {timeline.length === 0 ? (
          <div className={styles["timeline-empty"]}>
            No hay eventos registrados en la historia clínica
          </div>
        ) : eventosFiltrados.length === 0 ? (
          <div className={styles["timeline-empty"]}>
            No se encontraron eventos con los filtros aplicados
          </div>
        ) : (
          <div className={styles["timeline-list"]}>
            <div className={styles["timeline-list-line"]} />
            {eventosFiltrados.map((evento, index) => (
              <div key={index} className={styles["timeline-item"]}>
                {/* Colored circle icon */}
                <div
                  className={styles["timeline-item-icon"]}
                  style={{ backgroundColor: evento.color }}
                >
                  {evento.icono}
                </div>

                {/* Card body with colored left border */}
                <div
                  className={styles["timeline-item-body"]}
                  style={{ borderLeft: `3px solid ${evento.color}` }}
                >
                  <div className={styles["timeline-item-header"]}>
                    <h4 className={styles["timeline-item-title"]}>{evento.titulo}</h4>
                    <div className={styles["timeline-item-dates"]}>
                      <span className={styles["timeline-date-badge"]}>
                        {evento.tipo === "CITA" ||
                        evento.tipo === "ADMISION" ||
                        evento.tipo === "ENCUENTRO" ||
                        evento.tipo === "REGISTRO"
                          ? formatDateLocal(evento.fecha)
                          : formatDateVenezuela(evento.fecha)}
                      </span>
                      <span className={styles["timeline-time-badge"]}>
                        {formatTimeMilitaryVenezuela(evento.hora)}
                      </span>
                    </div>
                  </div>

                  {evento.tipo === "CITA" ? (
                    <div className={styles["timeline-cita-info"]}>
                      <p><strong>Especialidad:</strong> {evento.detalles?.especialidad || "No especificado"}</p>
                      <p><strong>Motivo de la Consulta:</strong> {evento.detalles?.motivo || "No especificado"}</p>
                      <p>
                        <strong>Agendado con:</strong>{" "}
                        {formatearNombreDoctor(evento.detalles?.medico)}
                      </p>
                    </div>
                  ) : evento.tipo !== "ENCUENTRO" && (
                    <p className={styles["timeline-item-desc"]}>{evento.descripcion}</p>
                  )}

                  {/* Encuentro — Ver detalle button */}
                  {evento.detalles && evento.tipo === "ENCUENTRO" && (
                    <div className={styles["timeline-detail-section"]}>
                      <button
                        className={styles["timeline-btn-detail"]}
                        onClick={() => handleVerDetalleEncuentro(evento.detalles)}
                      >
                        Ver detalle completo del encuentro
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Admisión — extra details */}
                  {evento.detalles &&
                    (evento.tipo === "ADMISION" || evento.tipo === "ADMISION_INICIAL") && (
                      <div className={styles["timeline-detail-section"]}>
                        <div className={styles["timeline-detail-grid"]}>
                          <div>
                            <strong>Forma Ingreso: </strong>
                            {evento.detalles.formaIngreso || "N/A"}
                          </div>
                          {evento.detalles.habitacion && (
                            <div>
                              <strong>Habitación: </strong>
                              {evento.detalles.habitacion}
                            </div>
                          )}
                          {evento.detalles.cama && (
                            <div>
                              <strong>Cama: </strong>
                              {evento.detalles.cama}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Audit trail */}
                  <div className={styles["timeline-audit"]}>
                    <span className={styles["timeline-audit-label"]}>Registrado por:</span>
                    <strong className={styles["timeline-audit-name"]}>{evento.registradoPor?.nombre || "Sistema"}</strong>
                    <span className={styles["timeline-audit-meta"]}>
                      • {evento.registradoPor?.cargo || "Registro automático"}
                      {evento.registradoPor?.especialidad
                        ? ` (${evento.registradoPor.especialidad})`
                        : ""}
                    </span>
                  </div>
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
