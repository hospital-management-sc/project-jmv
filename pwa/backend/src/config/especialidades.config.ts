/**
 * Configuración Centralizada de Especialidades Médicas (Backend)
 * FUENTE ÚNICA DE VERDAD para todas las especialidades del hospital
 * 
 * Sincronizado con: frontend/src/config/especialidades.config.ts
 */

export type MetricaDashboard = 'pacientesHospitalizados' | 'citasHoy' | 'encuentrosHoy' | 'pacientesEnEmergencia' | 'altasPendientes';
export type AccionClinica = 'registrar-emergency' | 'registrar-encuentro' | 'hospitalized-patients' | 'pacientes-emergencia' | 'today-encounters' | 'search-patient' | 'my-appointments' | 'interconsultas' | 'registrar-alta';

export interface VistaDashboard {
  metricas: MetricaDashboard[];
  acciones: AccionClinica[];
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
      metricas: ['citasHoy', 'encuentrosHoy'],
      acciones: ['registrar-encuentro', 'today-encounters', 'search-patient', 'my-appointments'],
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
    departamento: 'Ginecología',
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
      metricas: ['citasHoy', 'encuentrosHoy'],
      acciones: ['registrar-encuentro', 'today-encounters', 'search-patient', 'my-appointments'],
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
