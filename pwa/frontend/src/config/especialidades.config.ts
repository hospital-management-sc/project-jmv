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
    formularioEspecializado: {
      pasos: [
        {
          numero: 1,
          titulo: "Buscar Paciente",
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
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              grupo: "encuentro",
              opciones: [
                { valor: "CONSULTA", etiqueta: "Consulta" },
                { valor: "EMERGENCIA", etiqueta: "Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "Otro" }
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
              id: "motivoConsulta",
              tipo: "textarea",
              label: "Motivo de Consulta",
              placeholder: "Describa el motivo de consulta...",
              requerido: true,
              rows: 3,
              grupo: "principal"
            },
            {
              id: "enfermedadActual",
              tipo: "textarea",
              label: "Enfermedad Actual",
              placeholder: "Describa la enfermedad actual...",
              rows: 4,
              grupo: "principal"
            },
            {
              id: "antecedentesPersonales",
              tipo: "textarea",
              label: "Antecedentes Personales",
              placeholder: "Antecedentes personales relevantes...",
              rows: 3,
              grupo: "antecedentes"
            },
            {
              id: "antecedentesQuirurgicos",
              tipo: "textarea",
              label: "Antecedentes Quirúrgicos",
              placeholder: "Cirugías previas, fechas y complicaciones...",
              rows: 3,
              grupo: "antecedentes"
            },
            {
              id: "habitosPsicobiologicos",
              tipo: "textarea",
              label: "Hábitos Psicobiológicos",
              placeholder: "Sueño, alimentación, hábitos y otras observaciones...",
              rows: 3,
              grupo: "antecedentes"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Examen Físico",
          campos: [
            {
              id: "examenGeneral",
              tipo: "textarea",
              label: "General",
              placeholder: "Hallazgos generales del examen físico...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "piel",
              tipo: "textarea",
              label: "Piel",
              placeholder: "Hallazgos en piel...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "cabeza",
              tipo: "textarea",
              label: "Cabeza",
              placeholder: "Hallazgos en cabeza...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "ojos",
              tipo: "textarea",
              label: "Ojos",
              placeholder: "Hallazgos en ojos...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "oidos",
              tipo: "textarea",
              label: "Oídos",
              placeholder: "Hallazgos en oídos...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "nariz",
              tipo: "textarea",
              label: "Nariz",
              placeholder: "Hallazgos en nariz...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "cuelloTorax",
              tipo: "textarea",
              label: "Cuello / Tórax",
              placeholder: "Hallazgos en cuello y tórax...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "abdomen",
              tipo: "textarea",
              label: "Abdomen",
              placeholder: "Hallazgos abdominales...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "extremidades",
              tipo: "textarea",
              label: "Extremidades",
              placeholder: "Hallazgos en extremidades...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "neurologico",
              tipo: "textarea",
              label: "Neurológico",
              placeholder: "Hallazgos neurológicos...",
              rows: 2,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Diagnóstico y Conducta",
          campos: [
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
              id: "plan",
              tipo: "textarea",
              label: "Plan",
              placeholder: "Plan terapéutico y estudios complementarios...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "tratamiento",
              tipo: "textarea",
              label: "Tratamiento",
              placeholder: "Indique tratamiento y recomendaciones...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "observaciones",
              tipo: "textarea",
              label: "Observaciones",
              placeholder: "Observaciones adicionales...",
              rows: 2,
              grupo: "tratamiento"
            }
          ]
        }
      ]
    }
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
    formularioEspecializado: {
      pasos: [
        {
          numero: 1,
          titulo: "Buscar Paciente",
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
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              grupo: "encuentro",
              opciones: [
                { valor: "CONSULTA", etiqueta: "Consulta" },
                { valor: "EMERGENCIA", etiqueta: "Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "Otro" }
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
              id: "motivoConsulta",
              tipo: "textarea",
              label: "Motivo de Consulta",
              placeholder: "Describa el motivo de consulta...",
              requerido: true,
              rows: 3,
              grupo: "principal"
            },
            {
              id: "enfermedadActual",
              tipo: "textarea",
              label: "Enfermedad Actual",
              placeholder: "Describa la enfermedad actual...",
              rows: 4,
              grupo: "principal"
            },
            {
              id: "antecedentesPersonales",
              tipo: "textarea",
              label: "Antecedentes Personales",
              placeholder: "Antecedentes personales relevantes...",
              rows: 3,
              grupo: "antecedentes"
            },
            {
              id: "antecedentesQuirurgicos",
              tipo: "textarea",
              label: "Antecedentes Quirúrgicos",
              placeholder: "Cirugías previas, fechas y complicaciones...",
              rows: 3,
              grupo: "antecedentes"
            },
            {
              id: "habitosPsicobiologicos",
              tipo: "textarea",
              label: "Hábitos Psicobiológicos",
              placeholder: "Sueño, alimentación, hábitos y otras observaciones...",
              rows: 3,
              grupo: "antecedentes"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Examen Físico",
          campos: [
            {
              id: "examenGeneral",
              tipo: "textarea",
              label: "General",
              placeholder: "Hallazgos generales del examen físico...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "piel",
              tipo: "textarea",
              label: "Piel",
              placeholder: "Hallazgos en piel...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "cabeza",
              tipo: "textarea",
              label: "Cabeza",
              placeholder: "Hallazgos en cabeza...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "ojos",
              tipo: "textarea",
              label: "Ojos",
              placeholder: "Hallazgos en ojos...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "oidos",
              tipo: "textarea",
              label: "Oídos",
              placeholder: "Hallazgos en oídos...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "nariz",
              tipo: "textarea",
              label: "Nariz",
              placeholder: "Hallazgos en nariz...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "cuelloTorax",
              tipo: "textarea",
              label: "Cuello / Tórax",
              placeholder: "Hallazgos en cuello y tórax...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "abdomen",
              tipo: "textarea",
              label: "Abdomen",
              placeholder: "Hallazgos abdominales...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "extremidades",
              tipo: "textarea",
              label: "Extremidades",
              placeholder: "Hallazgos en extremidades...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "neurologico",
              tipo: "textarea",
              label: "Neurológico",
              placeholder: "Hallazgos neurológicos...",
              rows: 2,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Diagnóstico y Conducta",
          campos: [
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
              id: "plan",
              tipo: "textarea",
              label: "Plan",
              placeholder: "Plan terapéutico y estudios complementarios...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "tratamiento",
              tipo: "textarea",
              label: "Tratamiento",
              placeholder: "Indique tratamiento y recomendaciones...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "observaciones",
              tipo: "textarea",
              label: "Observaciones",
              placeholder: "Observaciones adicionales...",
              rows: 2,
              grupo: "tratamiento"
            }
          ]
        }
      ]
    }
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
    formularioEspecializado: {
      pasos: [
        {
          numero: 1,
          titulo: "Buscar Paciente",
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
          titulo: "Datos del Paciente y Representantes",
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              grupo: "encuentro",
              opciones: [
                { valor: "CONSULTA", etiqueta: "Consulta" },
                { valor: "EMERGENCIA", etiqueta: "Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "Otro" }
              ]
            },
            {
              id: "fecha",
              tipo: "date",
              label: "Fecha de Consulta",
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
              id: "fechaNacimiento",
              tipo: "date",
              label: "F/N (Fecha de Nacimiento)",
              grupo: "datosPaciente"
            },
            {
              id: "edad",
              tipo: "input",
              label: "Edad",
              placeholder: "Ej: 5 años",
              grupo: "datosPaciente"
            },
            {
              id: "peso",
              tipo: "number",
              label: "Peso (kg)",
              placeholder: "20.5",
              step: "0.1",
              grupo: "datosPaciente"
            },
            {
              id: "talla",
              tipo: "number",
              label: "Talla (cm)",
              placeholder: "110",
              step: "0.1",
              grupo: "datosPaciente"
            },
            {
              id: "cc",
              tipo: "number",
              label: "CC",
              placeholder: "Perímetro cefálico",
              step: "0.1",
              grupo: "datosPaciente"
            },
            {
              id: "ct",
              tipo: "number",
              label: "CT",
              placeholder: "Perímetro torácico",
              step: "0.1",
              grupo: "datosPaciente"
            },
            {
              id: "ca",
              tipo: "number",
              label: "CA",
              placeholder: "Perímetro abdominal",
              step: "0.1",
              grupo: "datosPaciente"
            },
            {
              id: "madreNombre",
              tipo: "input",
              label: "Madre",
              placeholder: "Nombre y apellido",
              grupo: "representantes"
            },
            {
              id: "madreEdad",
              tipo: "number",
              label: "Edad (Madre)",
              placeholder: "35",
              grupo: "representantes"
            },
            {
              id: "madreCi",
              tipo: "input",
              label: "CI (Madre)",
              placeholder: "V-12345678",
              grupo: "representantes"
            },
            {
              id: "madreTelefono",
              tipo: "input",
              label: "Teléfono (Madre)",
              placeholder: "0412-0000000",
              grupo: "representantes"
            },
            {
              id: "padreNombre",
              tipo: "input",
              label: "Padre",
              placeholder: "Nombre y apellido",
              grupo: "representantes"
            },
            {
              id: "padreEdad",
              tipo: "number",
              label: "Edad (Padre)",
              placeholder: "38",
              grupo: "representantes"
            },
            {
              id: "padreCi",
              tipo: "input",
              label: "CI (Padre)",
              placeholder: "V-12345678",
              grupo: "representantes"
            },
            {
              id: "padreTelefono",
              tipo: "input",
              label: "Teléfono (Padre)",
              placeholder: "0412-0000000",
              grupo: "representantes"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Antecedentes y Desarrollo",
          campos: [
            {
              id: "antecedentePrenatal",
              tipo: "textarea",
              label: "Antecedente Prenatal",
              placeholder: "Describa antecedentes prenatales...",
              rows: 3,
              grupo: "antecedentes"
            },
            {
              id: "periodoNeonatal",
              tipo: "textarea",
              label: "Período Neonatal",
              placeholder: "Describa datos del período neonatal...",
              rows: 3,
              grupo: "antecedentes"
            },
            {
              id: "habitosPsicobiologicos",
              tipo: "textarea",
              label: "Hábitos Psicobiológicos",
              placeholder: "Sueño, eliminación, conducta alimentaria y otros hábitos...",
              rows: 3,
              grupo: "antecedentes"
            },
            {
              id: "sostenCefalico",
              tipo: "input",
              label: "Sostén Cefálico",
              placeholder: "Edad o fecha aproximada",
              grupo: "desarrolloPsicomotor"
            },
            {
              id: "seSento",
              tipo: "input",
              label: "Se sentó",
              placeholder: "Edad o fecha aproximada",
              grupo: "desarrolloPsicomotor"
            },
            {
              id: "seParo",
              tipo: "input",
              label: "Se paró",
              placeholder: "Edad o fecha aproximada",
              grupo: "desarrolloPsicomotor"
            },
            {
              id: "camino",
              tipo: "input",
              label: "Caminó",
              placeholder: "Edad o fecha aproximada",
              grupo: "desarrolloPsicomotor"
            },
            {
              id: "primerDiente",
              tipo: "input",
              label: "Primer diente",
              placeholder: "Edad o fecha aproximada",
              grupo: "desarrolloPsicomotor"
            },
            {
              id: "primerasPalabras",
              tipo: "input",
              label: "Primeras palabras",
              placeholder: "Edad o fecha aproximada",
              grupo: "desarrolloPsicomotor"
            },
            {
              id: "controloEsfinter",
              tipo: "input",
              label: "Controló esfínter",
              placeholder: "Edad o fecha aproximada",
              grupo: "desarrolloPsicomotor"
            },
            {
              id: "escolaridad",
              tipo: "input",
              label: "Escolaridad",
              placeholder: "Nivel actual y rendimiento",
              grupo: "desarrolloPsicomotor"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Alimentación y Antecedentes Personales",
          campos: [
            {
              id: "alimentacion",
              tipo: "textarea",
              label: "Alimentación",
              placeholder: "Describa lactancia, dieta actual, apetito, intolerancias...",
              rows: 4,
              grupo: "antecedentes"
            },
            {
              id: "antecedentesPersonales",
              tipo: "textarea",
              label: "Antecedentes Personales",
              placeholder: "Antecedentes médicos personales relevantes...",
              rows: 4,
              grupo: "antecedentes"
            },
            {
              id: "observaciones",
              tipo: "textarea",
              label: "Observaciones",
              placeholder: "Observaciones adicionales...",
              rows: 3,
              grupo: "antecedentes"
            }
          ]
        }
      ]
    }
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
      metricas: ['citasHoy', 'encuentrosHoy'],
      acciones: ['registrar-encuentro', 'today-encounters', 'search-patient', 'my-appointments'],
    },
    formularioEspecializado: {
      pasos: [
        {
          numero: 1,
          titulo: "Buscar Paciente",
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
          titulo: "Datos del Encuentro y Antecedentes",
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              grupo: "encuentro",
              opciones: [
                { valor: "CONSULTA", etiqueta: "Consulta" },
                { valor: "EMERGENCIA", etiqueta: "Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "Otro" }
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
              placeholder: "Describa el motivo de la consulta odontológica...",
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
            },
            {
              id: "hospitalizacion",
              tipo: "textarea",
              label: "Hospitalización en los Últimos Años",
              placeholder: "Motivo y fecha si aplica...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "atencionMedica",
              tipo: "textarea",
              label: "Atención por Médico (Últimos 6 Meses)",
              placeholder: "Describa cualquier atención médica reciente...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "atencionOdontologica",
              tipo: "textarea",
              label: "Atención Odontológica (Últimos 6 Meses)",
              placeholder: "Tratamientos odontológicos previos...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "problemasAnestesia",
              tipo: "input",
              label: "Problemas Durante Anestesia Local",
              placeholder: "Sí/No y descripción si aplica",
              grupo: "examenFisico"
            },
            {
              id: "problemasCoagulacion",
              tipo: "input",
              label: "Problemas de Coagulación",
              placeholder: "Sí/No y descripción si aplica",
              grupo: "examenFisico"
            },
            {
              id: "adiciones",
              tipo: "textarea",
              label: "Adicciones / Hábitos",
              placeholder: "Tabaquismo, consumo de alcohol, etc...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "alergias",
              tipo: "textarea",
              label: "Alergias a Medicamentos",
              placeholder: "Alergias conocidas a anestésicos, antibióticos, etc...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "enfermedades",
              tipo: "textarea",
              label: "Padecimiento de Enfermedades",
              placeholder: "Enfermedades crónicas, sistémicas, etc...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "medicamentos",
              tipo: "textarea",
              label: "Medicamentos que Toma",
              placeholder: "Listado de medicamentos actuales...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "menstruacion",
              tipo: "input",
              label: "Frecuencia de la Menstruación",
              placeholder: "Regular/Irregular, ciclo en días",
              grupo: "examenFisico"
            },
            {
              id: "ultimoPeriodo",
              tipo: "date",
              label: "Fecha de Último Período",
              grupo: "examenFisico"
            },
            {
              id: "embarazada",
              tipo: "input",
              label: "¿Embarazada?",
              placeholder: "Sí/No y semana de gestación si aplica",
              grupo: "examenFisico"
            },
            {
              id: "amamantando",
              tipo: "input",
              label: "¿Amamantando?",
              placeholder: "Sí/No",
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Exploración Odontológica",
          campos: [
            {
              id: "cuadrante1",
              tipo: "textarea",
              label: "Cuadrante I - Superior Derecho",
              placeholder: "Ej: 11-Sano, 12-Caries, 13-Restaurado, 14-Extracción...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "cuadrante2",
              tipo: "textarea",
              label: "Cuadrante II - Superior Izquierdo",
              placeholder: "Ej: 21-Sano, 22-Caries, 23-Restaurado, 24-Extracción...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "cuadrante3",
              tipo: "textarea",
              label: "Cuadrante III - Inferior Izquierdo",
              placeholder: "Ej: 31-Sano, 32-Caries, 33-Restaurado, 34-Extracción...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "cuadrante4",
              tipo: "textarea",
              label: "Cuadrante IV - Inferior Derecho",
              placeholder: "Ej: 41-Sano, 42-Caries, 43-Restaurado, 44-Extracción...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "estadoGeneral",
              tipo: "textarea",
              label: "Estado General de la Cavidad Oral",
              placeholder: "Higiene oral, estado de encías, lengua, paladar, mucosa...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "hallazgos",
              tipo: "textarea",
              label: "Hallazgos Significativos",
              placeholder: "Presencia de cálculos, halitosis, lesiones, infecciones, etc...",
              rows: 3,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Diagnóstico y Evolución",
          campos: [
            {
              id: "diagnostico",
              tipo: "textarea",
              label: "Diagnóstico Odontológico",
              placeholder: "Describa el diagnóstico odontológico...",
              requerido: true,
              rows: 3,
              grupo: "diagnostico"
            },
            {
              id: "codigoCie",
              tipo: "input",
              label: "Código CIE-10 (opcional)",
              placeholder: "Ej: K02.9 (Caries dental)",
              grupo: "diagnostico"
            },
            {
              id: "plan",
              tipo: "textarea",
              label: "Plan de Tratamiento",
              placeholder: "Tratamientos propuestos, procedimientos a realizar...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "indicaciones",
              tipo: "textarea",
              label: "Indicaciones y Recomendaciones",
              placeholder: "Cuidados bucales, higiene, medicamentos, seguimiento...",
              rows: 3,
              grupo: "tratamiento"
            },
            {
              id: "observaciones",
              tipo: "textarea",
              label: "Observaciones Adicionales",
              placeholder: "Notas adicionales, interconsultas si requiere...",
              rows: 2,
              grupo: "tratamiento"
            }
          ]
        }
      ]
    }
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
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              opciones: [
                { valor: "CONSULTA", etiqueta: "Consulta" },
                { valor: "EMERGENCIA", etiqueta: "Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "Otro" }
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
          campos: [
            {
              id: "oido",
              tipo: "textarea",
              label: "Oído",
              placeholder: "Hallazgos del examen del oído (conducto auditivo, tímpano, audición)...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "nariz",
              tipo: "textarea",
              label: "Nariz",
              placeholder: "Hallazgos del examen de la nariz (fosas nasales, tabique, mucosa)...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "bocaGarganta",
              tipo: "textarea",
              label: "Boca y Garganta",
              placeholder: "Hallazgos del examen de cavidad oral, faringe y laringe...",
              rows: 3,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Signos Vitales y Diagnóstico",
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
      acciones: ['registrar-encuentro', 'search-patient', 'my-appointments', 'today-encounters'],
    },
    formularioEspecializado: {
      pasos: [
        {
          numero: 1,
          titulo: "Buscar Paciente",
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
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              grupo: "encuentro",
              opciones: [
                { valor: "CONSULTA", etiqueta: "Consulta" },
                { valor: "EMERGENCIA", etiqueta: "Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "Otro" }
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
              label: "Fototipo de Piel (Fitzpatrick)",
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
              label: "Topografía (Localización)",
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
                { valor: "diseminada", etiqueta: "Diseminada" },
                { valor: "generalizada", etiqueta: "Generalizada" }
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
              tipo: "textarea",
              label: "Extensión",
              placeholder: "Describa la extensión y zona del cuerpo afectada (ej: región abdominal, 15% de superficie corporal)...",
              rows: 2,
              grupo: "examenFisico"
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
              label: "Tipo Morfológico",
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
              label: "Descripción General Dermatológica",
              placeholder: "Resumen descriptivo completo de los hallazgos dermatológicos...",
              rows: 4,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Signos Vitales y Diagnóstico",
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
              id: "tratamiento",
              tipo: "textarea",
              label: "Tratamiento e Indicaciones",
              placeholder: "Medicamentos tópicos, sistémicos, indicaciones generales, cuidados de la piel...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "notaQuirurgica",
              tipo: "textarea",
              label: "Nota Quirúrgica",
              placeholder: "Describe procedimientos quirúrgicos realizados, técnicas utilizadas, hallazgos intraoperatorios...",
              rows: 3,
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
    formularioEspecializado: {
      pasos: [
        {
          numero: 1,
          titulo: "Buscar Paciente",
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
          titulo: "Datos del Paciente",
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              grupo: "encuentro",
              opciones: [
                { valor: "CONSULTA", etiqueta: "Consulta" },
                { valor: "EMERGENCIA", etiqueta: "Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "Otro" }
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
              id: "nombreApellido",
              tipo: "input",
              label: "Nombre y Apellido",
              placeholder: "Nombre completo",
              grupo: "datosPaciente"
            },
            {
              id: "cedula",
              tipo: "input",
              label: "Cédula",
              placeholder: "V-12345678",
              grupo: "datosPaciente"
            },
            {
              id: "edad",
              tipo: "number",
              label: "Edad",
              placeholder: "45",
              grupo: "datosPaciente"
            },
            {
              id: "peso",
              tipo: "number",
              label: "Peso (kg)",
              placeholder: "70",
              step: "0.1",
              grupo: "datosPaciente"
            },
            {
              id: "talla",
              tipo: "number",
              label: "Talla (cm)",
              placeholder: "170",
              step: "0.1",
              grupo: "datosPaciente"
            },
            {
              id: "ocupacion",
              tipo: "input",
              label: "Ocupación",
              placeholder: "Profesión u oficio",
              grupo: "datosPaciente"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Historia Clínica",
          campos: [
            {
              id: "antecedentesPersonales",
              tipo: "textarea",
              label: "Antecedentes Personales",
              placeholder: "Describa antecedentes personales relevantes...",
              rows: 3,
              grupo: "antecedentes"
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
              placeholder: "Describa la evolución de la enfermedad...",
              rows: 4,
              grupo: "principal"
            },
            {
              id: "examenFisicoRelevante",
              tipo: "textarea",
              label: "Examen Físico Relevante",
              placeholder: "Hallazgos del examen físico relacionados con la patología...",
              rows: 4,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Evaluación y Plan",
          campos: [
            {
              id: "examenesParaclínicos",
              tipo: "textarea",
              label: "Exámenes Paraclínicos",
              placeholder: "Resultados de laboratorio, imagenología u otros exámenes relevantes...",
              rows: 3,
              grupo: "examenes"
            },
            {
              id: "planTratamiento",
              tipo: "textarea",
              label: "Plan de Tratamiento",
              placeholder: "Plan terapéutico incluyendo terapia física, farmacología, etc...",
              requerido: true,
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "evolucion",
              tipo: "textarea",
              label: "Evolución",
              placeholder: "Notas de seguimiento y evolución del paciente...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "observaciones",
              tipo: "textarea",
              label: "Observaciones",
              placeholder: "Observaciones adicionales o interconsultas...",
              rows: 2,
              grupo: "tratamiento"
            }
          ]
        }
      ]
    }
  },
  {
    id: 'ginecologia',
    nombre: 'Ginecología',
    codigo: 'GI',
    departamento: 'Ginecología',
    descripcion: 'Salud reproductiva femenina y obstetricia',
    color: '#D946EF',
    vistaDashboard: {
      metricas: ['citasHoy', 'encuentrosHoy'],
      acciones: ['registrar-encuentro', 'today-encounters', 'search-patient', 'my-appointments'],
    },
    formularioEspecializado: {
      pasos: [
        {
          numero: 1,
          titulo: "Buscar Paciente",
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
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              grupo: "encuentro",
              opciones: [
                { valor: "CONSULTA", etiqueta: "Consulta" },
                { valor: "EMERGENCIA", etiqueta: "Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "Otro" }
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
              placeholder: "Describa el motivo de la consulta ginecológica...",
              requerido: true,
              rows: 3,
              grupo: "principal"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Antecedentes Obstétricos y Examen Físico",
          campos: [
            {
              id: "partos",
              tipo: "number",
              label: "Partos",
              placeholder: "0",
              grupo: "antecedentesObstetricos"
            },
            {
              id: "cesareas",
              tipo: "number",
              label: "Cesáreas",
              placeholder: "0",
              grupo: "antecedentesObstetricos"
            },
            {
              id: "abortos",
              tipo: "number",
              label: "Abortos",
              placeholder: "0",
              grupo: "antecedentesObstetricos"
            },
            {
              id: "fur",
              tipo: "date",
              label: "FUR (Fecha Última Regla)",
              grupo: "antecedentesObstetricos"
            },
            {
              id: "primerasRelaciones",
              tipo: "number",
              label: "Edad de Primeras Relaciones Sexuales",
              placeholder: "Ej: 18",
              grupo: "antecedentesObstetricos"
            },
            {
              id: "parejasSexuales",
              tipo: "number",
              label: "Número de Parejas Sexuales",
              placeholder: "0",
              grupo: "antecedentesObstetricos"
            },
            {
              id: "metodosAnticonceptivos",
              tipo: "textarea",
              label: "Métodos Anticonceptivos (Actuales/Previos)",
              placeholder: "Ej: Píldora anticonceptiva, DIU, condón, etc...",
              rows: 2,
              grupo: "antecedentesObstetricos"
            },
            {
              id: "condicionesGenerales",
              tipo: "textarea",
              label: "Condiciones Generales",
              placeholder: "Estado general de la paciente, hidratación, nutrición, palidez, etc...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "mamas",
              tipo: "textarea",
              label: "Mamas",
              placeholder: "Simetría, masas, secreciones, dolor a la palpación, hallazgos relevantes...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "abdomen",
              tipo: "textarea",
              label: "Abdomen",
              placeholder: "Forma, distensión, cicatrices, masas, sensibilidad, sonidos intestinales...",
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "genitales",
              tipo: "textarea",
              label: "Genitales",
              placeholder: "Inspección externa, especuloscopía, tacto vaginal, cervicitis, flujo, masas...",
              rows: 4,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Diagnóstico",
          campos: [
            {
              id: "diagnostico",
              tipo: "textarea",
              label: "Diagnóstico Ginecológico",
              placeholder: "Describa el diagnóstico ginecológico...",
              requerido: true,
              rows: 4,
              grupo: "diagnostico"
            },
            {
              id: "plan",
              tipo: "textarea",
              label: "Plan de Tratamiento",
              placeholder: "Tratamientos propuestos, procedimientos, medicamentos, seguimiento...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "observaciones",
              tipo: "textarea",
              label: "Observaciones Adicionales",
              placeholder: "Interconsultas si requiere, estudios complementarios, seguimiento...",
              rows: 2,
              grupo: "tratamiento"
            }
          ]
        }
      ]
    }
  },
  {
    id: 'gastroenterologia',
    nombre: 'Gastroenterología',
    codigo: 'GA',
    departamento: 'Gastroenterología',
    descripcion: 'Enfermedades del tracto gastrointestinal',
    color: '#6366F1',
    vistaDashboard: {
      metricas: ['citasHoy', 'encuentrosHoy'],
      acciones: ['registrar-encuentro', 'today-encounters', 'search-patient', 'my-appointments'],
    },
    formularioEspecializado: {
      pasos: [
        {
          numero: 1,
          titulo: "Buscar Paciente",
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
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              grupo: "encuentro",
              opciones: [
                { valor: "CONSULTA", etiqueta: "Consulta" },
                { valor: "EMERGENCIA", etiqueta: "Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "Otro" }
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
              placeholder: "Describa el motivo de la consulta gastroenterológica...",
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
          titulo: "Examen Físico",
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
              label: "Frecuencia Cardíaca (lpm)",
              placeholder: "72",
              grupo: "signosVitales"
            },
            {
              id: "fr",
              tipo: "number",
              label: "Frecuencia Respiratoria (rpm)",
              placeholder: "18",
              grupo: "signosVitales"
            },
            {
              id: "saturacionO2",
              tipo: "number",
              label: "Saturación de Oxígeno (%)",
              placeholder: "98",
              step: "0.1",
              min: "0",
              max: "100",
              grupo: "signosVitales"
            },
            {
              id: "examenAbdominal",
              tipo: "textarea",
              label: "Examen Abdominal",
              placeholder: "Inspección, palpación, percusión, auscultación. Hallazgos de dolor, masas, visceromegalias, soplos...",
              rows: 4,
              grupo: "examenFisico"
            },
            {
              id: "examenEcografico",
              tipo: "textarea",
              label: "Examen Ecográfico",
              placeholder: "Hallazgos ecográficos: estado del hígado, vesícula, páncreas, riñones, aorta, evaluación de la pared abdominal...",
              rows: 4,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Diagnóstico",
          campos: [
            {
              id: "diagnostico",
              tipo: "textarea",
              label: "Diagnóstico Gastroenterológico",
              placeholder: "Describa el diagnóstico gastroenterológico...",
              requerido: true,
              rows: 4,
              grupo: "diagnostico"
            },
            {
              id: "plan",
              tipo: "textarea",
              label: "Plan de Tratamiento",
              placeholder: "Tratamientos propuestos, medicamentos, dieta, endoscopias, estudios complementarios, seguimiento...",
              rows: 4,
              grupo: "tratamiento"
            },
            {
              id: "observaciones",
              tipo: "textarea",
              label: "Observaciones Adicionales",
              placeholder: "Interconsultas si requiere, estudios complementarios, seguimiento...",
              rows: 2,
              grupo: "tratamiento"
            }
          ]
        }
      ]
    }
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
      metricas: ['citasHoy', 'encuentrosHoy'],
      acciones: ['registrar-encuentro', 'today-encounters', 'search-patient', 'my-appointments'],
    },
    formularioEspecializado: {
      pasos: [
        {
          numero: 1,
          titulo: "Buscar Paciente",
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
          titulo: "Antecedentes Personales",
          campos: [
            {
              id: "tipo",
              tipo: "select",
              label: "Tipo de Encuentro",
              requerido: true,
              grupo: "encuentro",
              opciones: [
                { valor: "CONSULTA", etiqueta: "Consulta" },
                { valor: "EMERGENCIA", etiqueta: "Emergencia" },
                { valor: "HOSPITALIZACION", etiqueta: "Evolución Hospitalización" },
                { valor: "OTRO", etiqueta: "Otro" }
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
              id: "antecedentesPersonales",
              tipo: "textarea",
              label: "Antecedentes Personales (últimos 6 meses)",
              placeholder: "Seleccione los antecedentes que apliquen al paciente. Estos incluyen eventos estresantes y condiciones que afectan su salud mental...",
              rows: 4,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Evaluación Psicológica",
          campos: [
            {
              id: "motivoConsulta",
              tipo: "textarea",
              label: "Motivo de Consulta",
              placeholder: "Principal razón de la consulta psicológica...",
              requerido: true,
              rows: 3,
              grupo: "examenFisico"
            },
            {
              id: "examenMental",
              tipo: "textarea",
              label: "Examen Mental",
              placeholder: "Describa estado general, orientación, atención, memoria, pensamiento, afectividad...",
              rows: 4,
              grupo: "examenFisico"
            },
            {
              id: "atencion",
              tipo: "input",
              label: "Atención",
              placeholder: "Normal / Alterada - Describa hallazgos",
              grupo: "examenFisico"
            },
            {
              id: "orientacion",
              tipo: "input",
              label: "Orientación",
              placeholder: "Tiempo, lugar, persona - Normal/Alterada",
              grupo: "examenFisico"
            },
            {
              id: "percepciones",
              tipo: "textarea",
              label: "Senso-Percepción",
              placeholder: "Alucinaciones, ilusiones, percepción distorsionada...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "pensamiento",
              tipo: "textarea",
              label: "Pensamiento",
              placeholder: "Forma y contenido del pensamiento, ideas delirantes...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "suenio",
              tipo: "input",
              label: "Sueño / Vigilia",
              placeholder: "Normal / Alterado - Insomnio, hipersomnia, etc...",
              grupo: "examenFisico"
            },
            {
              id: "lenguaje",
              tipo: "input",
              label: "Lenguaje",
              placeholder: "Fluido, coherente, pressurizado, mutismo...",
              grupo: "examenFisico"
            },
            {
              id: "memoria",
              tipo: "textarea",
              label: "Memoria",
              placeholder: "Inmediata, corto plazo, largo plazo - Normal/Alterada",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "afectividad",
              tipo: "textarea",
              label: "Afectividad",
              placeholder: "Humor, afecto, labilidad emocional, apropiabilidad...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "juicio",
              tipo: "textarea",
              label: "Juicio",
              placeholder: "Capacidad de discernimiento y evaluación de situaciones...",
              rows: 2,
              grupo: "examenFisico"
            },
            {
              id: "voluntad",
              tipo: "textarea",
              label: "Voluntad",
              placeholder: "Motivación, iniciativa, anergia, apergimiento...",
              rows: 2,
              grupo: "examenFisico"
            }
          ]
        },
        {
          numero: 4,
          titulo: "Evaluación Laboral y Conclusiones",
          campos: [
            {
              id: "arealaboral",
              tipo: "textarea",
              label: "Área Laboral - Satisfacción y Factores",
              placeholder: "Describa el entorno laboral, satisfacción, relaciones con supervisor y compañeros, autonomía, recursos, ambiente...",
              rows: 4,
              grupo: "diagnostico"
            },
            {
              id: "fortalezas",
              tipo: "textarea",
              label: "Fortalezas",
              placeholder: "Fortalezas identificadas en la evaluación...",
              rows: 2,
              grupo: "diagnostico"
            },
            {
              id: "debilidades",
              tipo: "textarea",
              label: "Debilidades",
              placeholder: "Áreas de mejora identificadas...",
              rows: 2,
              grupo: "diagnostico"
            },
            {
              id: "evaluacionNeuropsicologica",
              tipo: "textarea",
              label: "Evaluación Neuropsicológica",
              placeholder: "Resultados de pruebas neuropsicológicas, si aplica...",
              rows: 3,
              grupo: "diagnostico"
            },
            {
              id: "impresionDx",
              tipo: "textarea",
              label: "Impresión Diagnóstica",
              placeholder: "Diagnóstico preliminar según DSM-5 o clasificación utilizada...",
              requerido: true,
              rows: 3,
              grupo: "diagnostico"
            },
            {
              id: "codigoCie",
              tipo: "input",
              label: "Código CIE-10 (opcional)",
              placeholder: "Ej: F41.1 (Trastorno de ansiedad)",
              grupo: "diagnostico"
            },
            {
              id: "referenciaPsicoterapia",
              tipo: "textarea",
              label: "Referencia a Psicoterapia",
              placeholder: "Tipo de terapia recomendada, frecuencia, objetivos...",
              rows: 3,
              grupo: "tratamiento"
            },
            {
              id: "observaciones",
              tipo: "textarea",
              label: "Observaciones Adicionales",
              placeholder: "Recomendaciones de seguimiento, interconsultas, medicación, etc...",
              rows: 2,
              grupo: "tratamiento"
            }
          ]
        }
      ]
    }
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
