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

export interface EspecialidadConfig {
  id: string;
  nombre: string;
  codigo: string;
  departamento: string;
  descripcion: string;
  icono?: string;
  color?: string;
  // Configuración de vista del dashboard
  vistaDashboard: VistaDashboard;
  // Configuración dinámica del formulario por especialidad
  formularioEspecializado?: FormularioEspecializado;
}

export const ESPECIALIDADES_MEDICAS: EspecialidadConfig[] = [
  {
    id: 'medicina-interna',
    nombre: 'Medicina Interna',
    codigo: 'MI',
    departamento: 'Medicina Interna',
    descripcion: 'Especialidad en el diagnóstico y tratamiento de enfermedades internas',
    color: '#3B82F6',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'medicina-paliativa',
    nombre: 'Medicina Paliativa',
    codigo: 'MP',
    departamento: 'Medicina Paliativa',
    descripcion: 'Cuidados paliativos y control de síntomas en enfermedades terminales',
    color: '#8B5CF6',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'cirugia-general',
    nombre: 'Cirugía General',
    codigo: 'CG',
    departamento: 'Cirugía General',
    descripcion: 'Intervenciones quirúrgicas generales',
    color: '#DC2626',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'pediatria',
    nombre: 'Pediatría',
    codigo: 'PD',
    departamento: 'Pediatría',
    descripcion: 'Atención médica de niños y adolescentes',
    color: '#EC4899',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'neumologia-pediatrica',
    nombre: 'Neumología Pediátrica',
    codigo: 'NP',
    departamento: 'Pediatría',
    descripcion: 'Enfermedades respiratorias en niños',
    color: '#06B6D4',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'traumatologia',
    nombre: 'Traumatología',
    codigo: 'TR',
    departamento: 'Traumatología',
    descripcion: 'Lesiones óseas, articulares y del aparato locomotor',
    color: '#F59E0B',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'cirugia-manos',
    nombre: 'Cirugía de Manos',
    codigo: 'CM',
    departamento: 'Cirugía General',
    descripcion: 'Cirugía especializada de manos y extremidades superiores',
    color: '#A16207',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'cirugia-pediatrica',
    nombre: 'Cirugía Pediátrica',
    codigo: 'CP',
    departamento: 'Cirugía General',
    descripcion: 'Intervenciones quirúrgicas en pacientes pediátricos',
    color: '#FB7185',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'odontologia',
    nombre: 'Odontología',
    codigo: 'OD',
    departamento: 'Odontología',
    descripcion: 'Cuidado y tratamiento de dientes y encías',
    color: '#FBBF24',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'otorrinolaringologia',
    nombre: 'Otorrinolaringología',
    codigo: 'ORL',
    departamento: 'Otorrinolaringología',
    descripcion: 'Enfermedades del oído, nariz y garganta',
    color: '#10B981',
    vistaDashboard: {
      metricas: ['citasHoy', 'encuentrosHoy'],
      acciones: ['registrar-encuentro', 'today-encounters', 'search-patient', 'my-appointments'],
    },
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
    color: '#F97316',
    vistaDashboard: {
      metricas: ['citasHoy', 'encuentrosHoy'],
      acciones: ['registrar-encuentro', 'today-encounters', 'search-patient', 'my-appointments'],
    },
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
          titulo: "Datos del Encuentro e Historia",
          emoji: "📋",
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              grupo: "encuentro",
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
              requerido: true,
              grupo: "encuentro"
            },
            {
              id: "hora",
              tipo: "time",
              label: "Hora",
              requerido: true,
              grupo: "encuentro"
            },
            {
              id: "procedencia",
              tipo: "input",
              label: "Procedencia",
              placeholder: "Ej: Consulta externa, Referido de...",
              grupo: "encuentro"
            },
            {
              id: "motivoConsulta",
              tipo: "textarea",
              label: "Motivo de Consulta",
              placeholder: "Describa el motivo de la consulta...",
              requerido: true,
              rows: 3,
              grupo: "historia"
            },
            {
              id: "enfermedadActual",
              tipo: "textarea",
              label: "Enfermedad Actual",
              placeholder: "Historia de la enfermedad actual...",
              rows: 4,
              grupo: "historia"
            },
            {
              id: "antecedentesFamiliares",
              tipo: "textarea",
              label: "Antecedentes Familiares",
              placeholder: "Enfermedades hereditarias, condiciones dermatológicas familiares...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "antecedentesPersonales",
              tipo: "textarea",
              label: "Antecedentes Personales",
              placeholder: "Alergias, enfermedades previas, cirugías, medicamentos actuales...",
              rows: 3,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Examen Físico y Exploración Dermatológica",
          emoji: "🔬",
          campos: [
            {
              id: "respiratorioFR",
              tipo: "number",
              label: "Respiratorio - FR (rpm)",
              placeholder: "18",
              grupo: "examenFisico"
            },
            {
              id: "cardiovascularFC",
              tipo: "number",
              label: "C/P - FC (lpm)",
              placeholder: "72",
              grupo: "examenFisico"
            },
            {
              id: "neurologico",
              tipo: "textarea",
              label: "Neurológico",
              placeholder: "Estado neurológico general...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "digestivo",
              tipo: "textarea",
              label: "Digestivo",
              placeholder: "Evaluación del sistema digestivo...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "genitourinario",
              tipo: "textarea",
              label: "Genitourinario",
              placeholder: "Evaluación del sistema genitourinario...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "musculoEsqueletico",
              tipo: "textarea",
              label: "Músculo-esquelético",
              placeholder: "Evaluación del sistema músculo-esquelético...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "fototipoPiel",
              tipo: "select",
              label: "🌞 Fototipo de Piel (Fitzpatrick)",
              grupo: "examenFisico",
              opciones: [
                { valor: "I", etiqueta: "I - Muy clara (siempre se quema, nunca se broncea)" },
                { valor: "II", etiqueta: "II - Clara (se quema fácilmente, se broncea mínimamente)" },
                { valor: "III", etiqueta: "III - Intermedia (se quema moderadamente, se broncea uniformemente)" },
                { valor: "IV", etiqueta: "IV - Oliva (se quema mínimamente, se broncea fácilmente)" },
                { valor: "V", etiqueta: "V - Oscura (raramente se quema, se broncea mucho)" },
                { valor: "VI", etiqueta: "VI - Muy oscura (nunca se quema, muy pigmentada)" }
              ]
            },
            {
              id: "topografia",
              tipo: "textarea",
              label: "📍 Topografía (Localización)",
              placeholder: "Ubicación anatómica de las lesiones (ej: cara, tronco, extremidades)...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "tipoTopografico",
              tipo: "select",
              label: "Tipo Topográfico",
              grupo: "examenFisico",
              opciones: [
                { valor: "localizada", etiqueta: "Localizada" },
                { valor: "regional", etiqueta: "Regional" },
                { valor: "generalizada", etiqueta: "Generalizada" },
                { valor: "universal", etiqueta: "Universal" }
              ]
            },
            {
              id: "segmentoAfectado",
              tipo: "input",
              label: "Segmento Afectado",
              placeholder: "Ej: Hemicuerpo derecho, miembros inferiores...",
              grupo: "examenFisico"
            },
            {
              id: "extension",
              tipo: "select",
              label: "Extensión",
              grupo: "examenFisico",
              opciones: [
                { valor: "puntual", etiqueta: "Puntual" },
                { valor: "pequeña", etiqueta: "Pequeña (<10%)" },
                { valor: "moderada", etiqueta: "Moderada (10-30%)" },
                { valor: "extensa", etiqueta: "Extensa (>30%)" }
              ]
            },
            {
              id: "simetria",
              tipo: "select",
              label: "Simetría o Asimetría",
              grupo: "examenFisico",
              opciones: [
                { valor: "simetrica", etiqueta: "Simétrica" },
                { valor: "asimetrica", etiqueta: "Asimétrica" }
              ]
            },
            {
              id: "descripcionTopografica",
              tipo: "textarea",
              label: "Descripción Topográfica",
              placeholder: "Descripción detallada de la distribución y localización...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "tipoMorfologico",
              tipo: "select",
              label: "🔍 Tipo Morfológico",
              grupo: "examenFisico",
              opciones: [
                { valor: "elemental", etiqueta: "Elemental (única lesión)" },
                { valor: "multiple", etiqueta: "Múltiple (varias lesiones similares)" },
                { valor: "mixto", etiqueta: "Mixto (diferentes tipos de lesiones)" }
              ]
            },
            {
              id: "lesionElemental",
              tipo: "select",
              label: "Lesión Elemental Predominante",
              grupo: "examenFisico",
              opciones: [
                { valor: "macula", etiqueta: "Mácula" },
                { valor: "papula", etiqueta: "Pápula" },
                { valor: "nodulo", etiqueta: "Nódulo" },
                { valor: "placa", etiqueta: "Placa" },
                { valor: "vesicula", etiqueta: "Vesícula" },
                { valor: "ampolla", etiqueta: "Ampolla" },
                { valor: "pustula", etiqueta: "Pústula" },
                { valor: "escama", etiqueta: "Escama" },
                { valor: "costra", etiqueta: "Costra" },
                { valor: "erosion", etiqueta: "Erosión" },
                { valor: "ulcera", etiqueta: "Úlcera" },
                { valor: "fisura", etiqueta: "Fisura" },
                { valor: "cicatriz", etiqueta: "Cicatriz" },
                { valor: "atrofia", etiqueta: "Atrofia" },
                { valor: "liquenificacion", etiqueta: "Liquenificación" }
              ]
            },
            {
              id: "numeroLesiones",
              tipo: "input",
              label: "Número de Lesiones",
              placeholder: "Ej: 1, múltiples, incontables...",
              grupo: "examenFisico"
            },
            {
              id: "tamano",
              tipo: "input",
              label: "Tamaño",
              placeholder: "Ej: 2x3 cm, 5 mm...",
              grupo: "examenFisico"
            },
            {
              id: "color",
              tipo: "input",
              label: "Color",
              placeholder: "Ej: Eritematoso, hiperpigmentado, violáceo...",
              grupo: "examenFisico"
            },
            {
              id: "bordes",
              tipo: "select",
              label: "Bordes",
              grupo: "examenFisico",
              opciones: [
                { valor: "bien-definidos", etiqueta: "Bien definidos" },
                { valor: "mal-definidos", etiqueta: "Mal definidos" },
                { valor: "regulares", etiqueta: "Regulares" },
                { valor: "irregulares", etiqueta: "Irregulares" },
                { valor: "elevados", etiqueta: "Elevados" },
                { valor: "planos", etiqueta: "Planos" }
              ]
            },
            {
              id: "superficie",
              tipo: "select",
              label: "Superficie",
              grupo: "examenFisico",
              opciones: [
                { valor: "lisa", etiqueta: "Lisa" },
                { valor: "rugosa", etiqueta: "Rugosa" },
                { valor: "escamosa", etiqueta: "Escamosa" },
                { valor: "verrugosa", etiqueta: "Verrugosa" },
                { valor: "umbilicada", etiqueta: "Umbilicada" },
                { valor: "costrosa", etiqueta: "Costrosa" }
              ]
            },
            {
              id: "evolucion",
              tipo: "textarea",
              label: "Evolución",
              placeholder: "Tiempo de evolución, cambios observados, progresión...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "sintomas",
              tipo: "textarea",
              label: "Síntomas",
              placeholder: "Prurito, dolor, ardor, sensación de quemazón...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "descripcionGeneral",
              tipo: "textarea",
              label: "📝 Descripción General Dermatológica",
              placeholder: "Resumen descriptivo completo de los hallazgos dermatológicos...",
              rows: 4,
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
              id: "peso",
              tipo: "number",
              label: "Peso (kg)",
              placeholder: "70",
              step: "0.1",
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
              id: "diagnostico",
              tipo: "textarea",
              label: "Diagnóstico Dermatológico",
              placeholder: "Describa el diagnóstico dermatológico...",
              requerido: true,
              rows: 3,
              grupo: "diagnostico"
            },
            {
              id: "codigoCie",
              tipo: "input",
              label: "Código CIE-10 (opcional)",
              placeholder: "Ej: L20.9 (Dermatitis atópica)",
              grupo: "diagnostico"
            },
            {
              id: "tratamiento",
              tipo: "textarea",
              label: "Tratamiento e Indicaciones",
              placeholder: "Medicamentos tópicos, sistémicos, indicaciones generales, cuidados de la piel...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "observaciones",
              tipo: "textarea",
              label: "Observaciones Adicionales",
              placeholder: "Seguimiento, interconsultas, estudios complementarios...",
              rows: 2,
              grupo: "tratamiento"
            }
          ]
        }
      ]
    }
  },
  {
    id: 'fisiatra',
    nombre: 'Fisiatría',
    codigo: 'FI',
    departamento: 'Fisiatría',
    descripcion: 'Medicina física y rehabilitación',
    color: '#14B8A6',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'ginecologia',
    nombre: 'Ginecología',
    codigo: 'GI',
    departamento: 'Ginecología y Obstetricia',
    descripcion: 'Salud reproductiva femenina y obstetricia',
    color: '#D946EF',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'gastroenterologia',
    nombre: 'Gastroenterología',
    codigo: 'GA',
    departamento: 'Gastroenterología',
    descripcion: 'Enfermedades del tracto gastrointestinal',
    color: '#6366F1',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'hematologia',
    nombre: 'Hematología',
    codigo: 'HE',
    departamento: 'Hematología',
    descripcion: 'Enfermedades de la sangre y médula ósea',
    color: '#EF4444',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
    },
  },
  {
    id: 'psicologia',
    nombre: 'Psicología',
    codigo: 'PS',
    departamento: 'Psicología',
    descripcion: 'Evaluación y tratamiento de problemas de salud mental',
    color: '#8B5CF6',
    vistaDashboard: {
      metricas: ['pacientesHospitalizados', 'pacientesEnEmergencia', 'encuentrosHoy', 'citasHoy', 'altasPendientes'],
      acciones: ['registrar-emergency', 'registrar-encuentro', 'hospitalized-patients', 'pacientes-emergencia', 'today-encounters', 'search-patient', 'my-appointments', 'interconsultas', 'registrar-alta'],
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
