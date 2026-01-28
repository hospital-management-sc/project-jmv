/**
 * Configuración Centralizada de Especialidades Médicas
 * FUENTE ÚNICA DE VERDAD para todas las especialidades del hospital
 * 
 * Sincronizado con: backend/src/config/especialidades.config.ts
 */

export type MetricaDashboard = 'pacientesHospitalizados' | 'citasHoy' | 'encuentrosHoy' | 'pacientesEnEmergencia' | 'altasPendientes';
export type AccionClinica = 'registrar-emergency' | 'registrar-encuentro' | 'hospitalized-patients' | 'pacientes-emergencia' | 'today-encounters' | 'search-patient' | 'my-appointments' | 'interconsultas' | 'registrar-alta';
export type TipoCampo = 'textarea' | 'input' | 'number' | 'date' | 'time' | 'select';

export interface VistaDashboard {
  metricas: MetricaDashboard[];
  acciones: AccionClinica[];
}

export interface CampoFormulario {
  id: string;
  tipo: TipoCampo;
  label: string;
  placeholder?: string;
  emoji?: string;
  requerido?: boolean;
  grupo?: string;
  rows?: number; // para textarea
  step?: string; // para number/time
  min?: string;
  max?: string;
  opciones?: { valor: string; etiqueta: string }[]; // para select
}

export interface PasoFormulario {
  numero: number;
  titulo: string;
  emoji?: string;
  campos: CampoFormulario[];
}

export interface FormularioEspecializado {
  pasos: PasoFormulario[];
}

// Legacy: Mantener para backward compatibility
export interface FormularioEncuentro {
  camposPersonalizados: string[];
  opcionesEspeciales: string[];
}

export interface EspecialidadConfig {
  id: string;
  nombre: string;
  codigo: string;
  departamento: string;
  descripcion: string;
  formularioPersonalizado?: boolean;
  camposEspecificos?: string[];
  opcionesEspeciales?: string[];
  icono?: string;
  color?: string;
  // NUEVO: Configuración de vista del dashboard
  vistaDashboard: VistaDashboard;
  // Legacy: Configuración de formularios (deprecated)
  formularioEncuentro: FormularioEncuentro;
  // NUEVO: Configuración dinámica del formulario por especialidad
  formularioEspecializado?: FormularioEspecializado;
}

export const ESPECIALIDADES_MEDICAS: EspecialidadConfig[] = [
  {
    id: 'medicina-interna',
    nombre: 'Medicina Interna',
    codigo: 'MI',
    departamento: 'Medicina Interna',
    descripcion: 'Especialidad en el diagnóstico y tratamiento de enfermedades internas',
    formularioPersonalizado: true,
    camposEspecificos: ['sistemaOrgano', 'hallazgosLab', 'medicamentosActuales'],
    opcionesEspeciales: ['consulta', 'seguimiento', 'interconsulta'],
    color: '#3B82F6',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['sistemaOrgano', 'hallazgosLab', 'medicamentosActuales'],
      opcionesEspeciales: ['consulta', 'seguimiento', 'interconsulta'],
    },
  },
  {
    id: 'medicina-paliativa',
    nombre: 'Medicina Paliativa',
    codigo: 'MP',
    departamento: 'Medicina Paliativa',
    descripcion: 'Cuidados paliativos y control de síntomas en enfermedades terminales',
    formularioPersonalizado: true,
    camposEspecificos: ['nivelesDolorPaliativos', 'cuidadosComfortables', 'apoyo-psicosocial'],
    opcionesEspeciales: ['evaluar-dolor', 'manejo-sintomas'],
    color: '#8B5CF6',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['nivelesDolorPaliativos', 'cuidadosComfortables', 'apoyo-psicosocial'],
      opcionesEspeciales: ['evaluar-dolor', 'manejo-sintomas'],
    },
  },
  {
    id: 'cirugia-general',
    nombre: 'Cirugía General',
    codigo: 'CG',
    departamento: 'Cirugía General',
    descripcion: 'Intervenciones quirúrgicas generales',
    formularioPersonalizado: true,
    camposEspecificos: ['diagnosticoPre', 'tipoIntervencion', 'hallazgoQx', 'complicaciones'],
    opcionesEspeciales: ['programar-cirugia', 'reporte-quirurgico'],
    color: '#DC2626',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['diagnosticoPre', 'tipoIntervencion', 'hallazgoQx', 'complicaciones'],
      opcionesEspeciales: ['programar-cirugia', 'reporte-quirurgico'],
    },
  },
  {
    id: 'pediatria',
    nombre: 'Pediatría',
    codigo: 'PD',
    departamento: 'Pediatría',
    descripcion: 'Atención médica de niños y adolescentes',
    formularioPersonalizado: true,
    camposEspecificos: ['edad', 'pesoTalla', 'estadoNutricional', 'vacunacion', 'desarrolloNeuro'],
    opcionesEspeciales: ['crecimiento-desarrollo', 'evaluacion-pediatrica'],
    color: '#EC4899',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['edad', 'pesoTalla', 'estadoNutricional', 'vacunacion', 'desarrolloNeuro'],
      opcionesEspeciales: ['crecimiento-desarrollo', 'evaluacion-pediatrica'],
    },
  },
  {
    id: 'neumologia-pediatrica',
    nombre: 'Neumología Pediátrica',
    codigo: 'NP',
    departamento: 'Pediatría',
    descripcion: 'Enfermedades respiratorias en niños',
    formularioPersonalizado: true,
    camposEspecificos: ['funcionPulmonar', 'sibilancias', 'tosPatrones', 'asmaControl'],
    opcionesEspeciales: ['espirometria', 'test-asma'],
    color: '#06B6D4',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['funcionPulmonar', 'sibilancias', 'tosPatrones', 'asmaControl'],
      opcionesEspeciales: ['espirometria', 'test-asma'],
    },
  },
  {
    id: 'traumatologia',
    nombre: 'Traumatología',
    codigo: 'TR',
    departamento: 'Traumatología',
    descripcion: 'Lesiones óseas, articulares y del aparato locomotor',
    formularioPersonalizado: true,
    camposEspecificos: ['tipoLesion', 'imagenologia', 'clasificacionFractura', 'movilidad'],
    opcionesEspeciales: ['radiografia', 'cirugia-ortopedica', 'rehabilitacion'],
    color: '#F59E0B',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['tipoLesion', 'imagenologia', 'clasificacionFractura', 'movilidad'],
      opcionesEspeciales: ['radiografia', 'cirugia-ortopedica', 'rehabilitacion'],
    },
  },
  {
    id: 'cirugia-manos',
    nombre: 'Cirugía de Manos',
    codigo: 'CM',
    departamento: 'Cirugía General',
    descripcion: 'Cirugía especializada de manos y extremidades superiores',
    formularioPersonalizado: true,
    camposEspecificos: ['tipoLesion', 'nerviosaCompromiso', 'vascularizacion'],
    opcionesEspeciales: ['cirugia-reparadora', 'seguimiento-post-op'],
    color: '#A16207',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['tipoLesion', 'nerviosaCompromiso', 'vascularizacion'],
      opcionesEspeciales: ['cirugia-reparadora', 'seguimiento-post-op'],
    },
  },
  {
    id: 'odontologia',
    nombre: 'Odontología',
    codigo: 'OD',
    departamento: 'Odontología',
    descripcion: 'Cuidado y tratamiento de dientes y encías',
    formularioPersonalizado: true,
    camposEspecificos: ['diagnosticoDental', 'estadoOral', 'tratamientoRecomendado'],
    opcionesEspeciales: ['limpieza', 'tratamiento-dental'],
    color: '#FBBF24',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['diagnosticoDental', 'estadoOral', 'tratamientoRecomendado'],
      opcionesEspeciales: ['limpieza', 'tratamiento-dental'],
    },
  },
  {
    id: 'otorrinolaringologia',
    nombre: 'Otorrinolaringología',
    codigo: 'ORL',
    departamento: 'Otorrinolaringología',
    descripcion: 'Enfermedades del oído, nariz y garganta',
    formularioPersonalizado: true,
    camposEspecificos: ['audicion', 'equilibrio', 'hallazgosORL', 'sinusitis'],
    opcionesEspeciales: ['audiometria', 'endoscopia'],
    color: '#10B981',
    vistaDashboard: {
      metricas: ['citasHoy', 'encuentrosHoy'],
      acciones: ['registrar-encuentro', 'today-encounters', 'search-patient', 'my-appointments'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['audicion', 'equilibrio', 'hallazgosORL', 'sinusitis'],
      opcionesEspeciales: ['audiometria', 'endoscopia'],
    },
    // NUEVO: Formulario dinámico especializado para ORL
    formularioEspecializado: {
      pasos: [
        {
          numero: 1,
          titulo: "Buscar Paciente",
          emoji: "🔍",
          campos: [
            {
              id: "ciTipo",
              tipo: "select",
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
              tipo: "input",
              label: "Número de Cédula",
              placeholder: "12345678",
              requerido: true
            }
          ]
        },
        {
          numero: 2,
          titulo: "Datos del Encuentro",
          emoji: "📋",
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              opciones: [
                { valor: "CONSULTA", etiqueta: "🩺 Consulta" },
                { valor: "EMERGENCIA", etiqueta: "🚨 Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "🛏️ Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "📋 Otro" }
              ]
            },
            {
              id: "fecha",
              tipo: "date",
              label: "Fecha",
              requerido: true
            },
            {
              id: "hora",
              tipo: "time",
              label: "Hora",
              requerido: true
            },
            {
              id: "procedencia",
              tipo: "input",
              label: "Procedencia",
              placeholder: "Ej: Consulta externa, Referido de..."
            },
            {
              id: "motivoConsulta",
              tipo: "textarea",
              label: "Motivo de Consulta",
              placeholder: "Describa el motivo de la consulta...",
              requerido: true,
              rows: 3,
              grupo: "principal"
            },
            {
              id: "enfermedadActual",
              tipo: "textarea",
              label: "Enfermedad Actual",
              placeholder: "Historia de la enfermedad actual...",
              rows: 4,
              grupo: "principal"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Examen Físico ORL",
          emoji: "👂",
          campos: [
            {
              id: "oido",
              tipo: "textarea",
              label: "👂 Oído",
              placeholder: "Hallazgos del examen del oído (conducto auditivo, tímpano, audición)...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "nariz",
              tipo: "textarea",
              label: "👃 Nariz",
              placeholder: "Hallazgos del examen de la nariz (fosas nasales, tabique, mucosa)...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "bocaGarganta",
              tipo: "textarea",
              label: "👅 Boca y Garganta",
              placeholder: "Hallazgos del examen de cavidad oral, faringe y laringe...",
              rows: 3,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Signos Vitales y Diagnóstico",
          emoji: "📊",
          campos: [
            {
              id: "taSistolica",
              tipo: "number",
              label: "T.A. Sistólica (mmHg)",
              placeholder: "120",
              grupo: "signosVitales"
            },
            {
              id: "taDiastolica",
              tipo: "number",
              label: "T.A. Diastólica (mmHg)",
              placeholder: "80",
              grupo: "signosVitales"
            },
            {
              id: "pulso",
              tipo: "number",
              label: "Pulso (lpm)",
              placeholder: "72",
              grupo: "signosVitales"
            },
            {
              id: "temperatura",
              tipo: "number",
              label: "Temperatura (°C)",
              placeholder: "36.5",
              step: "0.1",
              grupo: "signosVitales"
            },
            {
              id: "fr",
              tipo: "number",
              label: "Frec. Respiratoria (rpm)",
              placeholder: "18",
              grupo: "signosVitales"
            },
            {
              id: "diagnostico",
              tipo: "textarea",
              label: "Diagnóstico",
              placeholder: "Describa el diagnóstico...",
              requerido: true,
              rows: 3,
              grupo: "diagnostico"
            },
            {
              id: "codigoCie",
              tipo: "input",
              label: "Código CIE-10 (opcional)",
              placeholder: "Ej: J06.9",
              grupo: "diagnostico"
            },
            {
              id: "tratamiento",
              tipo: "textarea",
              label: "Indicaciones y Tratamiento",
              placeholder: "Indique el tratamiento y recomendaciones...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "observaciones",
              tipo: "textarea",
              label: "Observaciones Adicionales",
              placeholder: "Notas adicionales...",
              rows: 2,
              grupo: "tratamiento"
            }
          ]
        }
      ]
    }
  },
  {
    id: 'dermatologia',
    nombre: 'Dermatología',
    codigo: 'DE',
    departamento: 'Dermatología',
    descripcion: 'Enfermedades de la piel, cabello y uñas',
    formularioPersonalizado: true,
    camposEspecificos: ['lesionesDescripcion', 'distribucion', 'diagnosticoDiferencial'],
    opcionesEspeciales: ['biopsia', 'tratamiento-topico'],
    color: '#F97316',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['lesionesDescripcion', 'distribucion', 'diagnosticoDiferencial'],
      opcionesEspeciales: ['biopsia', 'tratamiento-topico'],
    },
  },
  {
    id: 'fisiatra',
    nombre: 'Fisiatría',
    codigo: 'FI',
    departamento: 'Fisiatría',
    descripcion: 'Medicina física y rehabilitación',
    formularioPersonalizado: true,
    camposEspecificos: ['evaluacionMotora', 'rango-movimiento', 'discapacidad'],
    opcionesEspeciales: ['rehabilitacion', 'terapia-fisica'],
    color: '#14B8A6',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['evaluacionMotora', 'rango-movimiento', 'discapacidad'],
      opcionesEspeciales: ['rehabilitacion', 'terapia-fisica'],
    },
  },
  {
    id: 'ginecologia',
    nombre: 'Ginecología',
    codigo: 'GI',
    departamento: 'Ginecología y Obstetricia',
    descripcion: 'Salud reproductiva femenina y obstetricia',
    formularioPersonalizado: true,
    camposEspecificos: ['cicloMenstrual', 'hallazgosGineco', 'metodosAnticoncept'],
    opcionesEspeciales: ['ultrasonido', 'papanicolaou', 'control-prenatal'],
    color: '#D946EF',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['cicloMenstrual', 'hallazgosGineco', 'metodosAnticoncept'],
      opcionesEspeciales: ['ultrasonido', 'papanicolaou', 'control-prenatal'],
    },
  },
  {
    id: 'gastroenterologia',
    nombre: 'Gastroenterología',
    codigo: 'GA',
    departamento: 'Gastroenterología',
    descripcion: 'Enfermedades del tracto gastrointestinal',
    formularioPersonalizado: true,
    camposEspecificos: ['sintomasGI', 'hallazgosEndoscopicos', 'habitosAlimentarios'],
    opcionesEspeciales: ['endoscopia', 'colonoscopia'],
    color: '#6366F1',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['sintomasGI', 'hallazgosEndoscopicos', 'habitosAlimentarios'],
      opcionesEspeciales: ['endoscopia', 'colonoscopia'],
    },
  },
  {
    id: 'hematologia',
    nombre: 'Hematología',
    codigo: 'HE',
    departamento: 'Hematología',
    descripcion: 'Enfermedades de la sangre y médula ósea',
    formularioPersonalizado: true,
    camposEspecificos: ['hemoglobinaValoración', 'coagulacion', 'transfusiones'],
    opcionesEspeciales: ['hemograma', 'coagulograma'],
    color: '#EF4444',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['hemoglobinaValoración', 'coagulacion', 'transfusiones'],
      opcionesEspeciales: ['hemograma', 'coagulograma'],
    },
  },
  {
    id: 'psicologia',
    nombre: 'Psicología',
    codigo: 'PS',
    departamento: 'Psicología',
    descripcion: 'Evaluación y tratamiento de problemas de salud mental',
    formularioPersonalizado: true,
    camposEspecificos: ['estadoMental', 'historialPsicosocial', 'estrategiasCoping'],
    opcionesEspeciales: ['evaluacion-psicologica', 'terapia'],
    color: '#8B5CF6',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
    formularioEncuentro: {
      camposPersonalizados: ['estadoMental', 'historialPsicosocial', 'estrategiasCoping'],
      opcionesEspeciales: ['evaluacion-psicologica', 'terapia'],
    },
  },
];

/**
 * Obtener especialidad por nombre
 */
export function obtenerEspecialidad(nombre: string): EspecialidadConfig | undefined {
  return ESPECIALIDADES_MEDICAS.find(
    (esp) => esp.nombre.toLowerCase() === nombre.toLowerCase()
  );
}

/**
 * Obtener especialidad por ID
 */
export function obtenerEspecialidadPorId(id: string): EspecialidadConfig | undefined {
  return ESPECIALIDADES_MEDICAS.find(
    (esp) => esp.id.toLowerCase() === id.toLowerCase()
  );
}

/**
 * Obtener especialidad por código
 */
export function obtenerEspecialidadPorCodigo(codigo: string): EspecialidadConfig | undefined {
  return ESPECIALIDADES_MEDICAS.find(
    (esp) => esp.codigo.toUpperCase() === codigo.toUpperCase()
  );
}

/**
 * Obtener lista de nombres de especialidades
 */
export function obtenerNombresEspecialidades(): string[] {
  return ESPECIALIDADES_MEDICAS.map((esp) => esp.nombre);
}

/**
 * Obtener lista de departamentos únicos
 */
export function obtenerDepartamentosUnicos(): string[] {
  const depts = new Set(ESPECIALIDADES_MEDICAS.map((esp) => esp.departamento));
  return Array.from(depts);
}

/**
 * Obtener especialidades por departamento
 */
export function obtenerEspecialidadesPorDepartamento(
  departamento: string
): EspecialidadConfig[] {
  return ESPECIALIDADES_MEDICAS.filter(
    (esp) => esp.departamento.toLowerCase() === departamento.toLowerCase()
  );
}

/**
 * Validar si es especialidad válida
 */
export function esEspecialidadValida(nombre: string): boolean {
  return ESPECIALIDADES_MEDICAS.some(
    (esp) => esp.nombre.toLowerCase() === nombre.toLowerCase()
  );
}
