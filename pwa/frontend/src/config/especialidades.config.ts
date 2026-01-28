/**
 * Configuración Centralizada de Especialidades Médicas
 * FUENTE ÚNICA DE VERDAD para todas las especialidades del hospital
 * 
 * Sincronizado con: backend/src/config/especialidades.config.ts
 */

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
