// ==========================================
// COMPONENTE: Registrar Encuentro
// ==========================================
import { useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { PatientBasic } from "../interfaces";
import { API_BASE_URL } from "@/utils/constants";
import { encuentrosService } from "@/services";
import { toast } from "sonner";

interface Props {
  patient: PatientBasic | null;
  doctorId: number;
}
export default function RegisterEncounter({ patient = null, doctorId }: Props) {
  const [step, setStep] = useState(patient ? 2 : 1);
  const [searchCI, setSearchCI] = useState(patient ? patient?.ci : "");
  const [paciente, setPaciente] = useState<PatientBasic | null>(patient);
  const [searching, setSearching] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    tipo: "CONSULTA" as "EMERGENCIA" | "HOSPITALIZACION" | "CONSULTA" | "OTRO",
    fecha: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().slice(0, 5),
    motivoConsulta: "",
    enfermedadActual: "",
    procedencia: "",
    nroCama: "",
    // Signos vitales
    taSistolica: "",
    taDiastolica: "",
    pulso: "",
    temperatura: "",
    fr: "",
    // Diagnóstico
    diagnostico: "",
    codigoCie: "",
    tratamiento: "",
    observaciones: "",
  });

  // TODO: Obtener ID del médico del contexto de autenticación
  // const medicoId = 1;

  const buscarPaciente = async () => {
    if (!searchCI.trim()) {
      setError("Ingrese un número de cédula");
      return;
    }
    setSearching(true);
    setError("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/pacientes/search?ci=${searchCI}`
      );
      const result = await response.json();
      if (result.success && result.data) {
        setPaciente(result.data);
        setStep(2);
      } else {
        toast.error('Paciente no encontrado')
        setError("Paciente no encontrado");
      }
    } catch {
      setError("Error al buscar paciente");
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paciente) {
      toast.error('Debe seleccionar un paciente')
      setError("Debe seleccionar un paciente");
      return;
    }

    if (!formData.motivoConsulta.trim()) {
      toast.error('El motivo de consulta es obligatorio')
      setError("El motivo de consulta es obligatorio");
      return;
    }

    setGuardando(true);
    setError("");
    setSuccessMessage("");

    try {
      // Construir objeto de signos vitales solo si hay datos
      const signosVitales =
        formData.taSistolica ||
        formData.taDiastolica ||
        formData.pulso ||
        formData.temperatura ||
        formData.fr
          ? {
              taSistolica: formData.taSistolica
                ? parseInt(formData.taSistolica)
                : undefined,
              taDiastolica: formData.taDiastolica
                ? parseInt(formData.taDiastolica)
                : undefined,
              pulso: formData.pulso ? parseInt(formData.pulso) : undefined,
              temperatura: formData.temperatura
                ? parseFloat(formData.temperatura)
                : undefined,
              fr: formData.fr ? parseInt(formData.fr) : undefined,
            }
          : undefined;

      // Construir objeto de impresión diagnóstica solo si hay datos
      const impresionDiagnostica = formData.diagnostico
        ? {
            descripcion: formData.diagnostico,
            codigoCie: formData.codigoCie || undefined,
          }
        : undefined;

      const encuentroData = {
        pacienteId: parseInt(paciente.id),
        tipo: formData.tipo,
        fecha: formData.fecha,
        hora: formData.hora,
        motivoConsulta: formData.motivoConsulta,
        enfermedadActual: formData.enfermedadActual || undefined,
        procedencia: formData.procedencia || undefined,
        nroCama: formData.nroCama || undefined,
        createdById: doctorId,
        signosVitales,
        impresionDiagnostica,
      };

      await encuentrosService.crearEncuentro(encuentroData);

      setSuccessMessage("✅ Encuentro registrado exitosamente");
      toast.success("✅ Encuentro registrado exitosamente");

      // Limpiar formulario después de éxito
      setTimeout(() => {
        setStep(1);
        setPaciente(null);
        setSearchCI("");
        setFormData({
          tipo: "CONSULTA",
          fecha: new Date().toISOString().split("T")[0],
          hora: new Date().toTimeString().slice(0, 5),
          motivoConsulta: "",
          enfermedadActual: "",
          procedencia: "",
          nroCama: "",
          taSistolica: "",
          taDiastolica: "",
          pulso: "",
          temperatura: "",
          fr: "",
          diagnostico: "",
          codigoCie: "",
          tratamiento: "",
          observaciones: "",
        });
        setSuccessMessage("");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al guardar el encuentro";
      setError(errorMessage);
      toast.error(errorMessage)
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className={styles["view-section"]}>
      <div className={styles["section-header"]}>
        <h2>📝 Registrar Nuevo Encuentro</h2>
        <p className={styles["section-subtitle"]}>
          Documente atenciones médicas: consultas, emergencias o evoluciones
          hospitalarias
        </p>
      </div>

      {/* Step Indicator */}
      <div className={styles["step-indicator"]}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ""}`}>
          <span className={styles["step-number"]}>1</span>
          <span className={styles["step-label"]}>Buscar Paciente</span>
        </div>
        <div className={styles["step-line"]}></div>
        <div className={`${styles.step} ${step >= 2 ? styles.active : ""}`}>
          <span className={styles["step-number"]}>2</span>
          <span className={styles["step-label"]}>Datos del Encuentro</span>
        </div>
        <div className={styles["step-line"]}></div>
        <div className={`${styles.step} ${step >= 3 ? styles.active : ""}`}>
          <span className={styles["step-number"]}>3</span>
          <span className={styles["step-label"]}>Signos y Diagnóstico</span>
        </div>
      </div>

      {/* Step 1: Buscar Paciente */}
      {step === 1 && (
        <div className={styles["form-card"]}>
          <h3>Buscar Paciente por Cédula</h3>
          <div className={styles["search-box"]}>
            <input
              type="text"
              placeholder="Ej: V-12345678"
              value={searchCI}
              onChange={(e) => setSearchCI(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && buscarPaciente()}
            />
            <button onClick={buscarPaciente} disabled={searching}>
              {searching ? "🔄 Buscando..." : "🔍 Buscar"}
            </button>
          </div>
          {error && <p className={styles["error-text"]}>{error}</p>}
        </div>
      )}

      {/* Step 2: Datos del Encuentro */}
      {step === 2 && paciente && (
        <div className={styles["form-card"]}>
          {/* Info del paciente */}
          <div className={styles["patient-summary"]}>
            <h3>Paciente Seleccionado</h3>
            <div className={styles["patient-details"]}>
              <p>
                <strong>Nombre:</strong> {paciente.apellidosNombres}
              </p>
              <p>
                <strong>CI:</strong> {paciente.ci}
              </p>
              <p>
                <strong>Historia:</strong> {paciente.nroHistoria}
              </p>
            </div>
            <button
              className={styles["change-patient-btn"]}
              onClick={() => {
                setStep(1);
                setPaciente(null);
              }}
            >
              Cambiar paciente
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
          >
            <div className={styles["form-grid"]}>
              <div className={styles["form-group"]}>
                <label>Tipo de Encuentro *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo: e.target.value as
                        | "EMERGENCIA"
                        | "HOSPITALIZACION"
                        | "CONSULTA"
                        | "OTRO",
                    })
                  }
                >
                  <option value="CONSULTA">🩺 Consulta</option>
                  <option value="EMERGENCIA">🚨 Emergencia</option>
                  <option value="HOSPITALIZACION">
                    🛏️ Evolución Hospitalización
                  </option>
                  <option value="OTRO">📋 Otro</option>
                </select>
              </div>

              <div className={styles["form-group"]}>
                <label>Fecha *</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Hora *</label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) =>
                    setFormData({ ...formData, hora: e.target.value })
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>Procedencia</label>
                <input
                  type="text"
                  placeholder="Ej: Consulta externa, Referido de..."
                  value={formData.procedencia}
                  onChange={(e) =>
                    setFormData({ ...formData, procedencia: e.target.value })
                  }
                />
              </div>

              <div
                className={`${styles["form-group"]} ${styles["full-width"]}`}
              >
                <label>Motivo de Consulta *</label>
                <textarea
                  rows={3}
                  placeholder="Describa el motivo de la consulta..."
                  value={formData.motivoConsulta}
                  onChange={(e) =>
                    setFormData({ ...formData, motivoConsulta: e.target.value })
                  }
                />
              </div>

              <div
                className={`${styles["form-group"]} ${styles["full-width"]}`}
              >
                <label>Enfermedad Actual</label>
                <textarea
                  rows={4}
                  placeholder="Historia de la enfermedad actual..."
                  value={formData.enfermedadActual}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enfermedadActual: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className={styles["form-actions"]}>
              <button
                type="button"
                className={styles["btn-secondary"]}
                onClick={() => setStep(1)}
              >
                ← Atrás
              </button>
              <button type="submit" className={styles["btn-primary"]}>
                Continuar →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Signos Vitales y Diagnóstico */}
      {step === 3 && (
        <div className={styles["form-card"]}>
          <h3>Signos Vitales y Diagnóstico</h3>

          <form onSubmit={handleSubmit}>
            {/* Signos Vitales */}
            <div className={styles["form-section"]}>
              <h4>📊 Signos Vitales</h4>
              <div className={styles["form-grid"]}>
                <div className={styles["form-group"]}>
                  <label>T.A. Sistólica (mmHg)</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={formData.taSistolica}
                    onChange={(e) =>
                      setFormData({ ...formData, taSistolica: e.target.value })
                    }
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>T.A. Diastólica (mmHg)</label>
                  <input
                    type="number"
                    placeholder="80"
                    value={formData.taDiastolica}
                    onChange={(e) =>
                      setFormData({ ...formData, taDiastolica: e.target.value })
                    }
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Pulso (lpm)</label>
                  <input
                    type="number"
                    placeholder="72"
                    value={formData.pulso}
                    onChange={(e) =>
                      setFormData({ ...formData, pulso: e.target.value })
                    }
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={formData.temperatura}
                    onChange={(e) =>
                      setFormData({ ...formData, temperatura: e.target.value })
                    }
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Frec. Respiratoria (rpm)</label>
                  <input
                    type="number"
                    placeholder="18"
                    value={formData.fr}
                    onChange={(e) =>
                      setFormData({ ...formData, fr: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Diagnóstico */}
            <div className={styles["form-section"]}>
              <h4>🩺 Impresión Diagnóstica</h4>
              <div className={styles["form-grid"]}>
                <div
                  className={`${styles["form-group"]} ${styles["full-width"]}`}
                >
                  <label>Diagnóstico *</label>
                  <textarea
                    rows={3}
                    placeholder="Describa el diagnóstico..."
                    value={formData.diagnostico}
                    onChange={(e) =>
                      setFormData({ ...formData, diagnostico: e.target.value })
                    }
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Código CIE-10 (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: J06.9"
                    value={formData.codigoCie}
                    onChange={(e) =>
                      setFormData({ ...formData, codigoCie: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Tratamiento */}
            <div className={styles["form-section"]}>
              <h4>💊 Plan de Tratamiento</h4>
              <div className={styles["form-grid"]}>
                <div
                  className={`${styles["form-group"]} ${styles["full-width"]}`}
                >
                  <label>Indicaciones y Tratamiento</label>
                  <textarea
                    rows={4}
                    placeholder="Indique el tratamiento y recomendaciones..."
                    value={formData.tratamiento}
                    onChange={(e) =>
                      setFormData({ ...formData, tratamiento: e.target.value })
                    }
                  />
                </div>
                <div
                  className={`${styles["form-group"]} ${styles["full-width"]}`}
                >
                  <label>Observaciones Adicionales</label>
                  <textarea
                    rows={2}
                    placeholder="Notas adicionales..."
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        observaciones: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {error && <div className={styles["error-alert"]}>{error}</div>}
            {successMessage && (
              <div className={styles["success-alert"]}>{successMessage}</div>
            )}

            <div className={styles["form-actions"]}>
              <button
                type="button"
                className={styles["btn-secondary"]}
                onClick={() => setStep(2)}
                disabled={guardando}
              >
                ← Atrás
              </button>
              <button
                type="submit"
                className={styles["btn-primary"]}
                disabled={guardando}
              >
                {guardando ? "⏳ Guardando..." : "💾 Guardar Encuentro"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
