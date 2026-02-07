// ==========================================
// COMPONENTE: Registrar Encuentro (DINÁMICO)
// ==========================================
import { useState, useMemo } from "react";
import styles from "../DoctorDashboard.module.css";
import type { PatientBasic } from "../interfaces";
import { API_BASE_URL } from "@/utils/constants";
import { getTodayVenezuelaISO, getCurrentTimeVenezuela } from "@/utils/dateUtils";
import { encuentrosService } from "@/services";
import { obtenerEspecialidadPorId, type CampoFormulario } from "@/config/especialidades.config";
import { toast } from "sonner";

interface Props {
  patient: PatientBasic | null;
  doctorId: number;
  especialidadId: string; // NUEVO: ID de especialidad para personalización
}

export default function RegisterEncounter({ patient = null, doctorId, especialidadId }: Props) {
  // ⚠️ VALIDACIÓN CRÍTICA - doctorId es requerido para createdById
  if (!doctorId) {
    console.error('[RegisterEncounter] ⚠️ CRITICAL: doctorId is missing!', { doctorId });
  } else {
    console.log('[RegisterEncounter] ✅ doctorId available:', doctorId);
  }
  
  // Obtener configuración de especialidad por ID
  const especialidad = useMemo(() => obtenerEspecialidadPorId(especialidadId), [especialidadId]);
  const formularioConfig = especialidad?.formularioEspecializado;

  // Log para debugging
  if (!formularioConfig) {
    console.warn(`⚠️ No hay formularioEspecializado para ID: ${especialidadId}. Especialidad encontrada:`, especialidad?.nombre);
  }

  const [step, setStep] = useState(patient ? 2 : 1);
  const [paciente, setPaciente] = useState<PatientBasic | null>(patient);
  const [searching, setSearching] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  
  // FormData dinámico: inicializar todos los campos de la configuración
  const [formData, setFormData] = useState<{[key: string]: string | number}>({
    tipo: "CONSULTA",
    ciTipo: "V",
    ciNumeros: patient ? patient?.ci.split('-')[1] : "",
    ...initializeFormDataFromConfig(formularioConfig),
    // Estos valores SIEMPRE deben tener la fecha/hora actual de Venezuela
    fecha: getTodayVenezuelaISO(),
    hora: getCurrentTimeVenezuela(),
  });

  function initializeFormDataFromConfig(config?: typeof formularioConfig): {[key: string]: string} {
    if (!config) return {};
    const initial: {[key: string]: string} = {};
    config.pasos.forEach(paso => {
      paso.campos.forEach(campo => {
        // NO inicializar fecha y hora aquí, se establecen después
        if (campo.id !== 'fecha' && campo.id !== 'hora') {
          initial[campo.id] = "";
        }
      });
    });
    return initial;
  }

  // Validar números de cédula (7-9 dígitos)
  const validateCINumeros = (value: string): boolean => {
    const pattern = /^\d{0,9}$/
    return pattern.test(value)
  }

  // Validar que la cédula tenga mínimo 7 dígitos
  const validateCINumerosLength = (value: string): boolean => {
    return value.length >= 7 && value.length <= 9
  }

  const handleFieldChange = (fieldId: string, value: string | number) => {
    setFormData({ ...formData, [fieldId]: value });
    setFieldErrors({ ...fieldErrors, [fieldId]: '' });
  }

  const handleCINumerosChange = (value: string) => {
    if (validateCINumeros(value)) {
      handleFieldChange('ciNumeros', value);
    }
  }

  const buscarPaciente = async () => {
    const newErrors: {[key: string]: string} = {}
    const ciNumeros = String(formData.ciNumeros || "").trim();
    const ciTipo = String(formData.ciTipo || "V").trim();
    
    if (!ciNumeros) {
      newErrors.ciNumeros = "Ingrese un número de cédula";
    }
    if (ciNumeros && !validateCINumerosLength(ciNumeros)) {
      newErrors.ciNumeros = "Debe tener entre 7 y 9 dígitos";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors)
      return;
    }

    const fullCI = `${ciTipo}-${ciNumeros}`;
    setSearching(true);
    setError("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/pacientes/search?ci=${fullCI}`
      );
      const result = await response.json();
      if (result.success && result.data) {
        setPaciente(result.data);
        setStep(2);
      } else {
        toast.error('Paciente no encontrado')
        setError("Paciente no encontrado");
      }
    } catch (err) {
      console.error("Error buscando paciente:", err);
      setError("Error al buscar paciente");
      toast.error("Error al buscar paciente");
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

    if (!formData.motivoConsulta) {
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
                ? parseInt(String(formData.taSistolica))
                : undefined,
              taDiastolica: formData.taDiastolica
                ? parseInt(String(formData.taDiastolica))
                : undefined,
              pulso: formData.pulso ? parseInt(String(formData.pulso)) : undefined,
              temperatura: formData.temperatura
                ? parseFloat(String(formData.temperatura))
                : undefined,
              fr: formData.fr ? parseInt(String(formData.fr)) : undefined,
            }
          : undefined;

      // Construir objeto de impresión diagnóstica
      // Buscar campos de diagnóstico: puede ser "diagnostico", "impresionDx", u otros nombres
      const diagnosticoFields = ['diagnostico', 'impresionDx', 'impresionDiagnostica'];
      const fieldDiagnostico = diagnosticoFields.find(field => formData[field]);
      const fieldCodigoCie = 'codigoCie';
      
      const impresionDiagnostica = fieldDiagnostico || formData[fieldCodigoCie]
        ? {
            descripcion: fieldDiagnostico ? String(formData[fieldDiagnostico]) : undefined,
            codigoCie: formData[fieldCodigoCie] ? String(formData[fieldCodigoCie]) : undefined,
          }
        : undefined;

      // Construir objeto de examen físico (JSONB) desde campos dinámicos
      // ⚠️ CAPTURAR TODOS LOS PASOS (excepto paso 1 que es búsqueda y pasos que contengan tipo/fecha/hora)
      const examenFisico: {[key: string]: string | undefined} = {};
      const camposExcluidos = new Set([
        'ciTipo', 'ciNumeros', // Paso 1 - búsqueda
        'tipo', 'fecha', 'hora', 'procedencia', 'nroCama', // Campos que ya están mapeados en encuentroData
        'motivoConsulta', 'enfermedadActual', // Campos que ya están mapeados en encuentroData
        'taSistolica', 'taDiastolica', 'pulso', 'temperatura', 'fr', 'observaciones', // Signos vitales
        fieldDiagnostico, fieldCodigoCie, // Campos de diagnóstico (ya mapeados)
      ]);

      if (formularioConfig) {
        // Iterar sobre TODOS los pasos
        formularioConfig.pasos.forEach(paso => {
          paso.campos.forEach(campo => {
            // Solo incluir si el campo tiene dato y no está en la lista de excluidos
            if (formData[campo.id] && !camposExcluidos.has(campo.id)) {
              examenFisico[campo.id] = String(formData[campo.id]);
            }
          });
        });
      }

      // ✅ IMPORTANTE: Incluir especialidadId como metadata para ayudar a identificar la especialidad
      if (especialidadId && especialidad) {
        examenFisico['__especialidadId'] = especialidadId;
        examenFisico['__especialidadNombre'] = especialidad.nombre;
      }

      const encuentroData = {
        pacienteId: parseInt(paciente.id),
        tipo: String(formData.tipo) as "CONSULTA" | "EMERGENCIA" | "HOSPITALIZACION" | "OTRO",
        fecha: String(formData.fecha),
        hora: String(formData.hora),
        motivoConsulta: String(formData.motivoConsulta),
        enfermedadActual: formData.enfermedadActual ? String(formData.enfermedadActual) : undefined,
        procedencia: formData.procedencia ? String(formData.procedencia) : undefined,
        nroCama: formData.nroCama ? String(formData.nroCama) : undefined,
        createdById: doctorId,
        signosVitales,
        impresionDiagnostica,
        examenFisico: Object.keys(examenFisico).length > 0 ? examenFisico : undefined,
      };

      // ⚠️ VALIDACIÓN ANTES DE ENVIAR
      if (!encuentroData.createdById) {
        console.error('[RegisterEncounter] ❌ createdById is missing before sending to API!', { encuentroData, doctorId });
        throw new Error('Error crítico: No se puede identificar al médico. Por favor, recarga la página.');
      }

      console.log('[RegisterEncounter] ✅ Sending encuentroData:', encuentroData);

      await encuentrosService.crearEncuentro(encuentroData);

      setSuccessMessage("✅ Encuentro registrado exitosamente");
      toast.success("✅ Encuentro registrado exitosamente");

      // Limpiar formulario después de éxito
      setTimeout(() => {
        setStep(1);
        setPaciente(null);
        setFormData({
          tipo: "CONSULTA",
          fecha: getTodayVenezuelaISO(),
          hora: getCurrentTimeVenezuela(),
          ciTipo: "V",
          ciNumeros: "",
          ...initializeFormDataFromConfig(formularioConfig),
        });
        setSuccessMessage("");
        setFieldErrors({});
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
          {especialidad?.nombre || "Especialidad"} - Documente atenciones médicas
        </p>
      </div>

      {!formularioConfig ? (
        <div className={styles["form-card"]}>
          <p style={{ color: 'var(--error-color)' }}>
            ⚠️ Configuración de formulario no disponible para esta especialidad
          </p>
        </div>
      ) : (
        <>
          {/* Step Indicator Dinámico */}
          <div className={styles["step-indicator"]}>
            {formularioConfig.pasos.map((paso, idx) => (
              <div key={paso.numero}>
                <div className={`${styles.step} ${step >= paso.numero ? styles.active : ""}`}>
                  <span className={styles["step-number"]}>{paso.numero}</span>
                  <span className={styles["step-label"]}>{paso.titulo}</span>
                </div>
                {idx < formularioConfig.pasos.length - 1 && (
                  <div className={styles["step-line"]}></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Buscar Paciente */}
          {step === 1 && (
            <div className={styles["form-card"]}>
              <h3>🔍 Buscar Paciente por Cédula</h3>
              <div className={styles["search-box"]}>
                <div className={styles["dual-input-group"]}>
                  <select
                    value={formData.ciTipo}
                    onChange={(e) => handleFieldChange('ciTipo', e.target.value)}
                  >
                    <option value="V">V</option>
                    <option value="E">E</option>
                    <option value="P">P</option>
                  </select>
                  <input
                    type="text"
                    placeholder="12345678"
                    value={formData.ciNumeros}
                    onChange={(e) => handleCINumerosChange(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && buscarPaciente()}
                    maxLength={9}
                  />
                </div>
                <button onClick={buscarPaciente} disabled={searching}>
                  {searching ? "🔄 Buscando..." : "🔍 Buscar"}
                </button>
              </div>
              {fieldErrors.ciNumeros && <p className={styles["error-text"]}>{fieldErrors.ciNumeros}</p>}
              {error && <p className={styles["error-text"]}>{error}</p>}
            </div>
          )}

          {/* Steps 2+ Dinámicos */}
          {step > 1 && formularioConfig.pasos.map(paso => 
            paso.numero === step && (
              <div key={paso.numero} className={styles["form-card"]}>
                <h3>{paso.emoji} {paso.titulo}</h3>

                {/* Mostrar info del paciente en paso 2 */}
                {paso.numero === 2 && paciente && (
                  <div className={styles["patient-summary"]}>
                    <h4>Paciente Seleccionado</h4>
                    <div className={styles["patient-details"]}>
                      <p><strong>Nombre:</strong> {paciente.apellidosNombres}</p>
                      <p><strong>CI:</strong> {paciente.ci}</p>
                      <p><strong>Historia:</strong> {paciente.nroHistoria}</p>
                    </div>
                    <button
                      className={styles["change-patient-btn"]}
                      onClick={() => { setStep(1); setPaciente(null); }}
                    >
                      Cambiar paciente
                    </button>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (paso.numero < formularioConfig.pasos.length) {
                      setStep(paso.numero + 1);
                    } else {
                      handleSubmit(e);
                    }
                  }}
                >
                  <RenderizarCampos 
                    campos={paso.campos}
                    formData={formData}
                    handleFieldChange={handleFieldChange}
                    styles={styles}
                  />

                  {error && paso.numero === formularioConfig.pasos.length && (
                    <div className={styles["error-alert"]}>{error}</div>
                  )}
                  {successMessage && (
                    <div className={styles["success-alert"]}>{successMessage}</div>
                  )}

                  <div className={styles["form-actions"]}>
                    {paso.numero > 1 && (
                      <button
                        type="button"
                        className={styles["btn-secondary"]}
                        onClick={() => setStep(paso.numero - 1)}
                        disabled={guardando}
                      >
                        ← Atrás
                      </button>
                    )}
                    <button
                      type="submit"
                      className={styles["btn-primary"]}
                      disabled={guardando}
                    >
                      {guardando 
                        ? "⏳ Guardando..." 
                        : paso.numero < formularioConfig.pasos.length 
                        ? "Continuar →" 
                        : "💾 Guardar Encuentro"
                      }
                    </button>
                  </div>
                </form>
              </div>
            )
          )}
        </>
      )}
    </section>
  );
}

// Componente auxiliar para renderizar campos dinámicamente
function RenderizarCampos({ 
  campos, 
  formData, 
  handleFieldChange, 
  styles 
}: {
  campos: CampoFormulario[];
  formData: {[key: string]: string | number};
  handleFieldChange: (id: string, value: string | number) => void;
  styles: any;
}) {
  // Agrupar campos por grupo
  const camposPorGrupo = campos.reduce((acc, campo) => {
    const grupo = campo.grupo || 'general';
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(campo);
    return acc;
  }, {} as {[key: string]: CampoFormulario[]});

  return (
    <>
      {Object.entries(camposPorGrupo).map(([grupo, camposGrupo]) => (
        <div key={grupo} className={styles["form-grid"]}>
          {camposGrupo.map(campo => (
            <div 
              key={campo.id}
              className={`${styles["form-group"]} ${
                campo.tipo === 'textarea' ? styles["full-width"] : ''
              }`}
            >
              <label>{campo.label}</label>
              {campo.tipo === 'textarea' && (
                <textarea
                  rows={campo.rows || 3}
                  placeholder={campo.placeholder}
                  value={formData[campo.id] || ''}
                  onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                />
              )}
              {campo.tipo === 'input' && (
                <input
                  type="text"
                  placeholder={campo.placeholder}
                  value={formData[campo.id] || ''}
                  onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                  maxLength={campo.max ? parseInt(campo.max) : undefined}
                />
              )}
              {campo.tipo === 'number' && (
                <input
                  type="number"
                  placeholder={campo.placeholder}
                  value={formData[campo.id] || ''}
                  onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                  step={campo.step || '1'}
                  min={campo.min}
                  max={campo.max}
                />
              )}
              {campo.tipo === 'date' && (
                <input
                  type="date"
                  disabled={campo.id === 'fecha'}
                  value={formData[campo.id] || ''}
                  onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                  title={campo.id === 'fecha' ? 'La fecha se establece automáticamente a hoy' : ''}
                />
              )}
              {campo.tipo === 'time' && (
                <input
                  type="time"
                  disabled={campo.id === 'hora'}
                  value={formData[campo.id] || ''}
                  onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                  title={campo.id === 'hora' ? 'La hora se establece automáticamente a la actual' : ''}
                />
              )}
              {campo.tipo === 'select' && (
                <select
                  value={formData[campo.id] || ''}
                  onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  {campo.opciones?.map(opt => (
                    <option key={opt.valor} value={opt.valor}>
                      {opt.etiqueta}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
