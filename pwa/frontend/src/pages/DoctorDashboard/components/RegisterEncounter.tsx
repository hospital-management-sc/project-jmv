// ==========================================
// COMPONENTE: Registrar Encuentro (DINÁMICO)
// ==========================================
import { useState, useMemo, useRef, useEffect } from "react";
import styles from "../DoctorDashboard.module.css";
import { IconClipboard, IconPlus, IconTrash } from "@/components/icons";
import type { PatientBasic } from "../interfaces";
import { API_BASE_URL } from "@/utils/constants";
import { getTodayVenezuelaISO, getCurrentTimeVenezuela } from "@/utils/dateUtils";
import { encuentrosService } from "@/services";
import { obtenerEspecialidadPorId, type CampoFormulario } from "@/config/especialidades.config";
import { toastCustom } from "@/utils/toastCustom";

interface Props {
  patient: PatientBasic | null;
  doctorId: number;
  especialidadId: string; // NUEVO: ID de especialidad para personalización
  onEncounterRegistered?: () => void; // Callback para refresco después de registrar encuentro
}

export default function RegisterEncounter({ patient = null, doctorId, especialidadId, onEncounterRegistered }: Props) {
  // ⚠️ VALIDACIÓN CRÍTICA - doctorId es requerido para createdById
  if (!doctorId) {
    // doctorId is missing - will throw error when trying to submit
  }
  
  // Referencia para hacer scroll automático al cambiar de paso
  const formTopRef = useRef<HTMLDivElement>(null);
  
  // Obtener configuración de especialidad por ID
  const especialidad = useMemo(() => obtenerEspecialidadPorId(especialidadId), [especialidadId]);
  
  // Configuración por defecto si no tiene formulario especializado
  const defaultFormularioConfig = useMemo(() => ({
    pasos: [
      {
        numero: 1,
        titulo: "Buscar Paciente",
        campos: [
          {
            id: "ciTipo",
            tipo: "select" as const,
            label: "Tipo de Cédula",
            requerido: true,
            opciones: [
              { valor: "V", etiqueta: "V (Venezolano)" },
              { valor: "E", etiqueta: "E (Extranjero)" },
              { valor: "P", etiqueta: "P (Pasaporte)" }
            ]
          },
          {
            id: "ciNumeros",
            tipo: "input" as const,
            label: "Número de Cédula",
            placeholder: "12345678",
            requerido: true
          }
        ]
      },
      {
        numero: 2,
        titulo: "Anamnesis e Historia",
        campos: [
          {
            id: "tipo",
            tipo: "select" as const,
            label: "Tipo de Encuentro",
            requerido: true,
            opciones: [
              { valor: "CONSULTA", etiqueta: "Consulta" },
              { valor: "EMERGENCIA", etiqueta: "Emergencia" },
              { valor: "HOSPITALIZACION", etiqueta: "Hospitalización" },
              { valor: "OTRO", etiqueta: "Otro" }
            ]
          },
          { id: "fecha", tipo: "date" as const, label: "Fecha de Atención" },
          { id: "hora", tipo: "time" as const, label: "Hora de Atención" },
          {
            id: "motivoConsulta",
            tipo: "textarea" as const,
            label: "Motivo de Consulta *",
            placeholder: "Escriba la razón de la consulta...",
            requerido: true
          },
          {
            id: "enfermedadActual",
            tipo: "textarea" as const,
            label: "Enfermedad Actual",
            placeholder: "Detalle la enfermedad actual..."
          }
        ]
      },
      {
        numero: 3,
        titulo: "Signos Vitales y Examen Físico",
        campos: [
          { id: "taSistolica", tipo: "number" as const, label: "Tensión Arterial Sistólica (mmHg)", placeholder: "120" },
          { id: "taDiastolica", tipo: "number" as const, label: "Tensión Arterial Diastólica (mmHg)", placeholder: "80" },
          { id: "pulso", tipo: "number" as const, label: "Pulso / Frecuencia Cardíaca (lpm)", placeholder: "70" },
          { id: "temperatura", tipo: "number" as const, label: "Temperatura (°C)", placeholder: "36.5", step: "0.1" },
          { id: "fr", tipo: "number" as const, label: "Frecuencia Respiratoria (rpm)", placeholder: "18" },
          { id: "examenGeneral", tipo: "textarea" as const, label: "Examen Físico General", placeholder: "Inspección general del paciente..." }
        ]
      },
      {
        numero: 4,
        titulo: "Diagnóstico y Plan",
        campos: [
          { id: "codigoCie", tipo: "input" as const, label: "Código CIE-10 (Opcional)", placeholder: "E11.9" },
          { id: "impresionDx", tipo: "textarea" as const, label: "Impresión Diagnóstica *", placeholder: "Diagnóstico presuntivo o definitivo...", requerido: true },
          { id: "observaciones", tipo: "textarea" as const, label: "Tratamiento e Indicaciones", placeholder: "Indique las recetas médicas o indicaciones..." }
        ]
      }
    ]
  }), []);

  const formularioConfig = especialidad?.formularioEspecializado || defaultFormularioConfig;

  interface CampoPersonalizado {
    id: string;
    label: string;
    tipo: 'input' | 'textarea' | 'number';
    paso: number;
  }
  const [camposPersonalizados, setCamposPersonalizados] = useState<CampoPersonalizado[]>([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<'input' | 'textarea' | 'number'>("input");

  const [step, setStep] = useState(patient ? 2 : 1);
  const [paciente, setPaciente] = useState<PatientBasic | null>(patient);
  const [searching, setSearching] = useState(false);
  const [guardando, setGuardando] = useState(false);
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

  const agregarCampoPersonalizado = (pasoNumero: number) => {
    if (!newFieldName.trim()) {
      toastCustom.error("Escriba el nombre del campo");
      return;
    }
    const cleanLabel = newFieldName.trim();
    const cleanId = `custom_${cleanLabel.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    
    const existsInDefault = formularioConfig.pasos.some(p => p.campos.some(c => c.id === cleanId));
    const existsInCustom = camposPersonalizados.some(c => c.id === cleanId);
    
    if (existsInDefault || existsInCustom) {
      toastCustom.error("Ya existe un campo con este nombre o similar");
      return;
    }
    
    const nuevoCampo: CampoPersonalizado = {
      id: cleanId,
      label: cleanLabel,
      tipo: newFieldType,
      paso: pasoNumero
    };
    
    setCamposPersonalizados([...camposPersonalizados, nuevoCampo]);
    setFormData(prev => ({ ...prev, [cleanId]: "" }));
    setNewFieldName("");
    toastCustom.success(`Campo "${cleanLabel}" agregado`);
  };

  // ✅ Scroll automático al cambiar de paso
  useEffect(() => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [step]);

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
    try {
      const response = await fetch(
        `${API_BASE_URL}/pacientes/search?ci=${fullCI}`
      );
      const result = await response.json();
      if (result.success && result.data) {
        setPaciente(result.data);
        setStep(2);
      } else {
        toastCustom.error('Paciente no encontrado')
      }
    } catch (err) {
      toastCustom.error("Error al buscar paciente");
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paciente) {
      toastCustom.error('Debe seleccionar un paciente')
      return;
    }

    if (!formData.motivoConsulta) {
      toastCustom.error('El motivo de consulta es obligatorio')
      return;
    }

    setGuardando(true);

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
      // SOLO si hay codigoCie o campos genéricos de impresión (impresionDx, impresionDiagnostica)
      // El campo 'diagnostico' es especializado y debe ir en examenFisico
      const diagnosticoFieldsGenericos = ['impresionDx', 'impresionDiagnostica'];
      const fieldDiagnostico = diagnosticoFieldsGenericos.find(field => formData[field]);
      const fieldCodigoCie = 'codigoCie';
      
      const impresionDiagnostica = fieldDiagnostico || formData[fieldCodigoCie]
        ? {
            descripcion: fieldDiagnostico ? String(formData[fieldDiagnostico]) : undefined,
            codigoCie: formData[fieldCodigoCie] ? String(formData[fieldCodigoCie]) : undefined,
          }
        : undefined;

      // Construir objeto de examen físico (JSONB) desde campos dinámicos
      // ⚠️ CAPTURAR TODOS LOS PASOS (excepto paso 1 que es búsqueda y pasos que contengan tipo/fecha/hora)
      const examenFisico: {[key: string]: any} = {};
      const camposExcluidos = new Set([
        'ciTipo', 'ciNumeros', // Paso 1 - búsqueda
        'tipo', 'fecha', 'hora', 'procedencia', 'nroCama', // Campos que ya están mapeados en encuentroData
        'motivoConsulta', 'enfermedadActual', // Campos que ya están mapeados en encuentroData
        fieldDiagnostico, fieldCodigoCie, // Solo campos de diagnóstico GENÉRICO (impresionDx, codigoCie)
        // NOTA: 'diagnostico', 'observaciones' NO se excluyen - son campos especializados que van en examenFisico
      ]);

      if (formularioConfig) {
        // Iterar sobre TODOS los pasos
        formularioConfig.pasos.forEach(paso => {
          paso.campos.forEach(campo => {
            // Solo incluir si el campo tiene dato y no está en la lista de excluidos
            if (formData[campo.id] !== undefined && formData[campo.id] !== null && formData[campo.id] !== '' && !camposExcluidos.has(campo.id)) {
              examenFisico[campo.id] = formData[campo.id];
            }
          });
        });
      }

      // Capturar campos personalizados
      const camposPersonalizadosMetadata: {[key: string]: string} = {};
      camposPersonalizados.forEach(campo => {
        const value = formData[campo.id];
        if (value !== undefined && value !== null && value !== '') {
          examenFisico[campo.id] = value;
          camposPersonalizadosMetadata[campo.id] = campo.label;
        }
      });

      if (Object.keys(camposPersonalizadosMetadata).length > 0) {
        examenFisico['__campos_personalizados'] = camposPersonalizadosMetadata;
      }

      // ✅ NUEVO: Incluir signos vitales directamente en examenFisico (porque la tabla SignosVitales no existe)
      if (signosVitales) {
        examenFisico['taSistolica'] = signosVitales.taSistolica;
        examenFisico['taDiastolica'] = signosVitales.taDiastolica;
        examenFisico['pulso'] = signosVitales.pulso;
        examenFisico['temperatura'] = signosVitales.temperatura;
        examenFisico['fr'] = signosVitales.fr;
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
        throw new Error('Error crítico: No se puede identificar al médico. Por favor, recarga la página.');
      }

      // 🆕 Si viene de una cita (tiene citaId), usar endpoint /desde-cita que actualiza la cita
      if (paciente.citaId) {
        // Registrando encuentro desde cita
        
        // Preparar datos para endpoint /desde-cita
        const encuentroDesdeCitaData = {
          citaId: paciente.citaId,
          medicoId: doctorId,
          motivoConsulta: String(formData.motivoConsulta),
          enfermedadActual: formData.enfermedadActual ? String(formData.enfermedadActual) : undefined,
          procedencia: formData.procedencia ? String(formData.procedencia) : undefined,
          nroCama: formData.nroCama ? String(formData.nroCama) : undefined,
          examenFisico: Object.keys(examenFisico).length > 0 ? examenFisico : undefined, // ✅ Ahora incluye signos vitales
          impresionDiagnostica: impresionDiagnostica,
          tratamiento: impresionDiagnostica?.descripcion,
          observaciones: formData.observaciones ? String(formData.observaciones) : undefined,
        };

        // Enviar al endpoint de encuentros desde cita
        
        // Usar endpoint que actualiza la cita a COMPLETADA
        const response = await fetch(`${API_BASE_URL}/encuentros/desde-cita`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(encuentroDesdeCitaData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al registrar encuentro desde cita');
        }

        await response.json();
      } else {
        // Si NO viene de una cita, usar endpoint genérico
        await encuentrosService.crearEncuentro(encuentroData);
      }

      toastCustom.success("Encuentro registrado exitosamente");

      // Limpiar formulario después de éxito
      setTimeout(() => {
        setStep(1);
        setPaciente(null);
        setCamposPersonalizados([]);
        setFormData({
          tipo: "CONSULTA",
          fecha: getTodayVenezuelaISO(),
          hora: getCurrentTimeVenezuela(),
          ciTipo: "V",
          ciNumeros: "",
          ...initializeFormDataFromConfig(formularioConfig),
        });
        setFieldErrors({});
        // Llamar callback para refresco de citas
        if (onEncounterRegistered) {
          onEncounterRegistered();
        }
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al guardar el encuentro";
      toastCustom.error(errorMessage)
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className={styles["view-section"]}>
      <div className={styles["section-header"]}>
        <h2>Registrar Nuevo Encuentro</h2>
        <p className={styles["section-subtitle"]}>
          Documente atenciones médicas
        </p>
      </div>

        <>
          {/* Step Indicator Dinámico */}
          <div ref={formTopRef} className={styles["step-indicator"]}>
            {/* Vista Desktop: Mostrar todos los pasos */}
            <div className={styles["step-indicator-desktop"]}>
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
            
            {/* Vista Móvil: Mostrar solo el paso activo */}
            <div className={styles["step-indicator-mobile"]}>
              {formularioConfig.pasos.find(paso => paso.numero === step) && (
                <div className={`${styles.step} ${styles.active}`}>
                  <span className={styles["step-number"]}>{step}</span>
                  <span className={styles["step-label"]}>
                    {formularioConfig.pasos.find(p => p.numero === step)?.titulo}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Step 1: Buscar Paciente */}
          {step === 1 && (
            <div className={styles["form-card"]}>
              <h3>Buscar Paciente por Cédula</h3>
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
                    inputMode="numeric"
                  />
                </div>
                <button onClick={buscarPaciente} disabled={searching}>
                  {searching ? "Buscando..." : "Buscar"}
                </button>
              </div>
              {fieldErrors.ciNumeros && <p className={styles["error-text"]}>{fieldErrors.ciNumeros}</p>}
            </div>
          )}

          {/* Steps 2+ Dinámicos */}
          {step > 1 && formularioConfig.pasos.map(paso => 
            paso.numero === step && (
              <div key={paso.numero} className={styles["form-card"]}>
                <h3>{paso.titulo}</h3>

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

                  {/* Renderizar campos personalizados agregados en este paso */}
                  {camposPersonalizados.filter(c => c.paso === step).length > 0 && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px dashed rgba(255, 255, 255, 0.15)', paddingTop: '1.5rem' }}>
                      <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                        <IconClipboard size={14} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Campos Personalizados agregados:
                      </h4>
                      <div className={styles["form-grid"]}>
                        {camposPersonalizados.filter(c => c.paso === step).map(campo => (
                          <div 
                            key={campo.id}
                            className={`${styles["form-group"]} ${
                              campo.tipo === 'textarea' ? styles["full-width"] : ''
                            }`}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                              <label style={{ fontWeight: '600' }}>{campo.label}</label>
                              <button
                                type="button"
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                onClick={() => {
                                  setCamposPersonalizados(camposPersonalizados.filter(c => c.id !== campo.id));
                                  setFormData(prev => {
                                    const next = { ...prev };
                                    delete next[campo.id];
                                    return next;
                                  });
                                }}
                              >
                                <IconTrash size={12} style={{ verticalAlign: 'middle', marginRight: '0.25em' }} /> Eliminar
                              </button>
                            </div>
                            {campo.tipo === 'textarea' && (
                              <textarea
                                rows={3}
                                value={String(formData[campo.id] || '')}
                                onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                              />
                            )}
                            {campo.tipo === 'input' && (
                              <input
                                type="text"
                                value={String(formData[campo.id] || '')}
                                onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                              />
                            )}
                            {campo.tipo === 'number' && (
                              <input
                                type="number"
                                value={String(formData[campo.id] || '')}
                                onChange={(e) => handleFieldChange(campo.id, e.target.value)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Creador de campos personalizados en el paso actual */}
                  <div style={{ 
                    marginTop: '2rem', 
                    padding: '1.25rem', 
                    backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                    borderRadius: '0.5rem', 
                    border: '1px solid rgba(255, 255, 255, 0.08)' 
                  }}>
                    <h5 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}><IconPlus size={13} style={{ verticalAlign: 'middle', marginRight: '0.3em' }} /> Agregar Campo Personalizado a este Paso</h5>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Ej. Fondo de Ojo, Presión Intraocular, etc."
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        style={{ 
                          flex: 1, 
                          minWidth: '200px', 
                          padding: '0.5rem 0.75rem', 
                          borderRadius: '0.375rem', 
                          border: '1px solid var(--border-color)', 
                          backgroundColor: 'var(--bg-secondary)', 
                          color: 'var(--text-primary)' 
                        }}
                      />
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value as any)}
                        style={{ 
                          padding: '0.5rem 0.75rem', 
                          borderRadius: '0.375rem', 
                          border: '1px solid var(--border-color)', 
                          backgroundColor: 'var(--bg-secondary)', 
                          color: 'var(--text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="input">Texto Corto</option>
                        <option value="textarea">Texto Largo</option>
                        <option value="number">Número</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => agregarCampoPersonalizado(step)}
                        style={{ 
                          padding: '0.5rem 1.25rem', 
                          borderRadius: '0.375rem', 
                          backgroundColor: '#3B82F6', 
                          color: '#fff', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontWeight: '600',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  <div className={styles["form-actions"]}>
                    {paso.numero > 1 && (
                      <button
                        type="button"
                        className={styles["btn-secondary"]}
                        onClick={() => setStep(paso.numero - 1)}
                        disabled={guardando}
                      >
                        Atrás
                      </button>
                    )}
                    <button
                      type="submit"
                      className={styles["btn-primary"]}
                      disabled={guardando}
                    >
                      {guardando 
                        ? "Guardando..." 
                        : paso.numero < formularioConfig.pasos.length 
                        ? "Continuar" 
                        : "Guardar Encuentro"
                      }
                    </button>
                  </div>
                </form>
              </div>
            )
          )}
        </>
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
