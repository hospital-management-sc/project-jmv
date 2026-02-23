import { apiService } from './api';

// ============================================
// INTERFACES - Tipos TypeScript
// ============================================

export interface FormatoHospitalizacion {
  id: number;
  admisionId: number;
  pacienteId: number;
  fechaCreacion: string;
  ultimaActualizacion: string;
  
  // Sub-documentos relacionados
  signosVitales?: SignosVitalesHosp[];
  laboratorios?: Laboratorio[];
  estudiosEspeciales?: EstudioEspecial[];
  electrocardiogramas?: Electrocardiograma[];
  antecedentesDetallados?: AntecedentesDetallados;
  examenFuncional?: ExamenFuncional;
  examenFisicoCompleto?: ExamenFisicoCompleto;
  resumenIngreso?: ResumenIngreso;
  ordenesMedicas?: OrdenMedica[];
  evolucionesMedicas?: EvolucionMedica[];
}

export interface SignosVitalesHosp {
  id?: number;
  formatoHospId?: number;
  fecha: string;
  hora: string;
  taSistolica?: number;
  taDiastolica?: number;
  tam?: number;
  fc?: number;
  fr?: number;
  temperatura?: number;
  spo2?: number;
  observacion?: string;
  registradoPor?: number;
  createdAt?: string;
}

export interface Laboratorio {
  id?: number;
  formatoHospId?: number;
  fecha: string;
  hora?: string;
  
  // Hematología
  hgb?: number;
  hct?: number;
  vcm?: number;
  chcm?: number;
  leucocitos?: number;
  neutrofilos?: number;
  linfocitos?: number;
  eosinofilos?: number;
  plaquetas?: number;
  
  // Coagulación
  pt?: number;
  ptt?: number;
  inr?: number;
  fibrinogeno?: number;
  
  // Reactantes
  vsg?: number;
  pcr?: number;
  
  // Química Sanguínea
  glicemia?: number;
  urea?: number;
  creatinina?: number;
  amilasa?: number;
  lipasa?: number;
  tgo?: number;
  tgp?: number;
  troponina?: number;
  fosfatasa_alcalina?: number;
  bilirrubina_total?: number;
  bilirrubina_directa?: number;
  bilirrubina_indirecta?: number;
  acido_urico?: number;
  proteinas_totales?: number;
  albumina?: number;
  globulina?: number;
  ldh?: number;
  colesterol?: number;
  trigliceridos?: number;
  
  // Electrolitos
  sodio?: number;
  potasio?: number;
  cloro?: number;
  calcio?: number;
  magnesio?: number;
  fosforo?: number;
  
  observacion?: string;
  createdAt?: string;
}

export interface EstudioEspecial {
  id?: number;
  formatoHospId?: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  resultado?: string;
  interpretacion?: string;
  createdAt?: string;
}

export interface Electrocardiograma {
  id?: number;
  formatoHospId?: number;
  fecha: string;
  hora?: string;
  ritmo?: string;
  frecuencia?: number;
  pr?: number;
  qrs?: number;
  qt?: number;
  qtc?: number;
  eje?: string;
  interpretacion?: string;
  hallazgos?: string;
  createdAt?: string;
}

export interface AntecedentesDetallados {
  id?: number;
  formatoHospId?: number;
  
  // Antecedentes Personales
  medicos?: string;
  quirurgicos?: string;
  traumaticos?: string;
  alergias?: string;
  transfusionales?: string;
  toxicomanias?: string;
  
  // Antecedentes Familiares
  familiares?: string;
  
  // Gineco-obstétricos (si aplica)
  menarquia?: number;
  ciclos?: string;
  gesta?: number;
  para?: number;
  aborto?: number;
  cesareas?: number;
  fum?: string;
  fur?: string;
  planificacion?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamenFuncional {
  id?: number;
  formatoHospId?: number;
  
  // Sistemas
  cardiovascular?: string;
  respiratorio?: string;
  digestivo?: string;
  genitourinario?: string;
  nervioso?: string;
  musculoesqueletico?: string;
  endocrino?: string;
  piel?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamenFisicoCompleto {
  id?: number;
  formatoHospId?: number;
  
  // Examen Físico General
  peso?: number;
  talla?: number;
  imc?: number;
  estadoGeneral?: string;
  hidratacion?: string;
  coloracion?: string;
  
  // Por sistemas
  general?: string;
  cabeza?: string;
  ojos?: string;
  oidos?: string;
  nariz?: string;
  boca?: string;
  cuello?: string;
  torax?: string;
  pulmones?: string;
  cardiovascular?: string;
  cardiopulmonar?: string;
  abdomen?: string;
  genitourinario?: string;
  extremidades?: string;
  piel?: string;
  neurologico?: string;
  muscEsqueletico?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

// Alias para compatibilidad
export type ExamenFisico = ExamenFisicoCompleto;

export interface ResumenIngreso {
  id?: number;
  formatoHospId?: number;
  
  diagnosticoPrincipal?: string;
  diagnosticosSecundarios?: string[];
  padecimientoActual?: string;
  resumenClinico?: string;
  impresionDiagnostica?: string;
  planDiagnostico?: string;
  planTerapeutico?: string;
  pronostico?: string;
  observaciones?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface OrdenMedica {
  id: string;
  formatoHospId?: number;
  fecha?: string;
  hora?: string;
  tipo: string;
  descripcion: string;
  dosis?: string;
  via?: string;
  frecuencia?: string;
  duracion?: string;
  indicaciones?: string;
  estado: 'ACTIVA' | 'SUSPENDIDA' | 'COMPLETADA';
  observacion?: string;
  registradoPor?: number;
  fechaCreacion?: string;
  createdAt?: string;
}

export interface EvolucionMedica {
  id?: number;
  formatoHospId?: number;
  fecha: string;
  hora: string;
  
  // Formato SOAP
  subjetivo?: string;
  objetivo?: string;
  analisis?: string;
  plan?: string;
  
  registradoPor?: number;
  createdAt?: string;
}

// ============================================
// SERVICIOS API
// ============================================

/**
 * Obtener formato de hospitalización por ID de admisión
 */
export const getFormatoByAdmision = async (admisionId: number): Promise<FormatoHospitalizacion | null> => {
  try {
    return await apiService.get<FormatoHospitalizacion>(`/formato-hospitalizacion/admision/${admisionId}`);
  } catch (error: any) {
    if (error.message?.includes('404')) {
      return null; // No existe aún
    }
    console.error('Error al obtener formato de hospitalización:', error);
    throw error;
  }
};

/**
 * Crear un nuevo formato de hospitalización
 */
export const createFormato = async (admisionId: number, pacienteId: number): Promise<FormatoHospitalizacion> => {
  try {
    return await apiService.post<FormatoHospitalizacion>('/formato-hospitalizacion', {
      admisionId,
      pacienteId
    });
  } catch (error) {
    console.error('Error al crear formato de hospitalización:', error);
    throw error;
  }
};

/**
 * Obtener o crear formato (helper)
 */
export const getOrCreateFormato = async (admisionId: number, pacienteId: number): Promise<FormatoHospitalizacion> => {
  let formato = await getFormatoByAdmision(admisionId);
  if (!formato) {
    formato = await createFormato(admisionId, pacienteId);
  }
  return formato;
};

// ============================================
// SIGNOS VITALES
// ============================================

export const addSignosVitales = async (formatoHospId: number, data: Omit<SignosVitalesHosp, 'id' | 'formatoHospId' | 'createdAt'>): Promise<SignosVitalesHosp> => {
  try {
    return await apiService.post<SignosVitalesHosp>(`/formato-hospitalizacion/${formatoHospId}/signos-vitales`, data);
  } catch (error) {
    console.error('Error al agregar signos vitales:', error);
    throw error;
  }
};

export const updateSignosVitales = async (id: number, data: Partial<SignosVitalesHosp>): Promise<SignosVitalesHosp> => {
  try {
    return await apiService.put<SignosVitalesHosp>(`/formato-hospitalizacion/signos-vitales/${id}`, data);
  } catch (error) {
    console.error('Error al actualizar signos vitales:', error);
    throw error;
  }
};

export const deleteSignosVitales = async (id: number): Promise<void> => {
  try {
    await apiService.delete(`/formato-hospitalizacion/signos-vitales/${id}`);
  } catch (error) {
    console.error('Error al eliminar signos vitales:', error);
    throw error;
  }
};

// ============================================
// LABORATORIOS
// ============================================

export const addLaboratorio = async (formatoHospId: number, data: Omit<Laboratorio, 'id' | 'formatoHospId' | 'createdAt'>): Promise<Laboratorio> => {
  try {
    return await apiService.post<Laboratorio>(`/formato-hospitalizacion/${formatoHospId}/laboratorio`, data);
  } catch (error) {
    console.error('Error al agregar laboratorio:', error);
    throw error;
  }
};

export const updateLaboratorio = async (id: number, data: Partial<Laboratorio>): Promise<Laboratorio> => {
  try {
    return await apiService.put<Laboratorio>(`/formato-hospitalizacion/laboratorio/${id}`, data);
  } catch (error) {
    console.error('Error al actualizar laboratorio:', error);
    throw error;
  }
};

// ============================================
// ESTUDIOS ESPECIALES
// ============================================

export const addEstudioEspecial = async (formatoHospId: number, data: Omit<EstudioEspecial, 'id' | 'formatoHospId' | 'createdAt'>): Promise<EstudioEspecial> => {
  try {
    return await apiService.post<EstudioEspecial>(`/formato-hospitalizacion/${formatoHospId}/estudio-especial`, data);
  } catch (error) {
    console.error('Error al agregar estudio especial:', error);
    throw error;
  }
};

export const updateEstudioEspecial = async (id: number, data: Partial<EstudioEspecial>): Promise<EstudioEspecial> => {
  try {
    return await apiService.put<EstudioEspecial>(`/formato-hospitalizacion/estudio-especial/${id}`, data);
  } catch (error) {
    console.error('Error al actualizar estudio especial:', error);
    throw error;
  }
};

// ============================================
// ELECTROCARDIOGRAMA
// ============================================

export const addElectrocardiograma = async (formatoHospId: number, data: Omit<Electrocardiograma, 'id' | 'formatoHospId' | 'createdAt'>): Promise<Electrocardiograma> => {
  try {
    return await apiService.post<Electrocardiograma>(`/formato-hospitalizacion/${formatoHospId}/electrocardiograma`, data);
  } catch (error) {
    console.error('Error al agregar electrocardiograma:', error);
    throw error;
  }
};

export const updateElectrocardiograma = async (id: number, data: Partial<Electrocardiograma>): Promise<Electrocardiograma> => {
  try {
    return await apiService.put<Electrocardiograma>(`/formato-hospitalizacion/electrocardiograma/${id}`, data);
  } catch (error) {
    console.error('Error al actualizar electrocardiograma:', error);
    throw error;
  }
};

// ============================================
// ANTECEDENTES DETALLADOS
// ============================================

export const updateAntecedentesDetallados = async (formatoHospId: number, data: Partial<AntecedentesDetallados>): Promise<AntecedentesDetallados> => {
  try {
    return await apiService.put<AntecedentesDetallados>(`/formato-hospitalizacion/${formatoHospId}/antecedentes-detallados`, data);
  } catch (error) {
    console.error('Error al actualizar antecedentes detallados:', error);
    throw error;
  }
};

// ============================================
// EXAMEN FUNCIONAL
// ============================================

export const updateExamenFuncional = async (formatoHospId: number, data: Partial<ExamenFuncional>): Promise<ExamenFuncional> => {
  try {
    return await apiService.put<ExamenFuncional>(`/formato-hospitalizacion/${formatoHospId}/examen-funcional`, data);
  } catch (error) {
    console.error('Error al actualizar examen funcional:', error);
    throw error;
  }
};

// ============================================
// EXAMEN FÍSICO COMPLETO
// ============================================

export const updateExamenFisicoCompleto = async (formatoHospId: number, data: Partial<ExamenFisicoCompleto>): Promise<ExamenFisicoCompleto> => {
  try {
    return await apiService.put<ExamenFisicoCompleto>(`/formato-hospitalizacion/${formatoHospId}/examen-fisico-completo`, data);
  } catch (error) {
    console.error('Error al actualizar examen físico completo:', error);
    throw error;
  }
};

// ============================================
// RESUMEN DE INGRESO
// ============================================

export const updateResumenIngreso = async (formatoHospId: number, data: Partial<ResumenIngreso>): Promise<ResumenIngreso> => {
  try {
    return await apiService.put<ResumenIngreso>(`/formato-hospitalizacion/${formatoHospId}/resumen-ingreso`, data);
  } catch (error) {
    console.error('Error al actualizar resumen de ingreso:', error);
    throw error;
  }
};

// ============================================
// ÓRDENES MÉDICAS
// ============================================

export const addOrdenMedica = async (formatoHospId: number, data: Omit<OrdenMedica, 'id' | 'formatoHospId' | 'createdAt'>): Promise<OrdenMedica> => {
  try {
    return await apiService.post<OrdenMedica>(`/formato-hospitalizacion/${formatoHospId}/orden-medica`, data);
  } catch (error) {
    console.error('Error al agregar orden médica:', error);
    throw error;
  }
};

export const updateOrdenMedica = async (id: string | number, data: Partial<OrdenMedica>): Promise<OrdenMedica> => {
  try {
    return await apiService.put<OrdenMedica>(`/formato-hospitalizacion/orden-medica/${id}`, data);
  } catch (error) {
    console.error('Error al actualizar orden médica:', error);
    throw error;
  }
};

// ============================================
// EVOLUCIONES MÉDICAS
// ============================================

export const addEvolucionMedica = async (formatoHospId: number, data: Omit<EvolucionMedica, 'id' | 'formatoHospId' | 'createdAt'>): Promise<EvolucionMedica> => {
  try {
    return await apiService.post<EvolucionMedica>(`/formato-hospitalizacion/${formatoHospId}/evolucion-medica`, data);
  } catch (error) {
    console.error('Error al agregar evolución médica:', error);
    throw error;
  }
};

export const updateEvolucionMedica = async (id: number, data: Partial<EvolucionMedica>): Promise<EvolucionMedica> => {
  try {
    return await apiService.put<EvolucionMedica>(`/formato-hospitalizacion/evolucion-medica/${id}`, data);
  } catch (error) {
    console.error('Error al actualizar evolución médica:', error);
    throw error;
  }
};

export const deleteEvolucionMedica = async (id: number): Promise<void> => {
  try {
    await apiService.delete(`/formato-hospitalizacion/evolucion-medica/${id}`);
  } catch (error) {
    console.error('Error al eliminar evolución médica:', error);
    throw error;
  }
};

// ============================================
// FUNCIONES ADICIONALES
// ============================================

// Alias para examen físico
export const updateExamenFisico = updateExamenFisicoCompleto;

// Obtener órdenes médicas
export const getOrdenesMedicas = async (formatoHospId: number): Promise<OrdenMedica[]> => {
  try {
    return await apiService.get<OrdenMedica[]>(`/formato-hospitalizacion/${formatoHospId}/ordenes-medicas`);
  } catch (error) {
    console.error('Error al obtener órdenes médicas:', error);
    throw error;
  }
};

// Eliminar orden médica
export const deleteOrdenMedica = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/formato-hospitalizacion/orden-medica/${id}`);
  } catch (error) {
    console.error('Error al eliminar orden médica:', error);
    throw error;
  }
};

// Eliminar laboratorio
export const deleteLaboratorio = async (id: number): Promise<void> => {
  try {
    await apiService.delete(`/formato-hospitalizacion/laboratorio/${id}`);
  } catch (error) {
    console.error('Error al eliminar laboratorio:', error);
    throw error;
  }
};

// Eliminar estudio especial
export const deleteEstudioEspecial = async (id: number): Promise<void> => {
  try {
    await apiService.delete(`/formato-hospitalizacion/estudio-especial/${id}`);
  } catch (error) {
    console.error('Error al eliminar estudio especial:', error);
    throw error;
  }
};

// Eliminar electrocardiograma
export const deleteElectrocardiograma = async (id: number): Promise<void> => {
  try {
    await apiService.delete(`/formato-hospitalizacion/electrocardiograma/${id}`);
  } catch (error) {
    console.error('Error al eliminar electrocardiograma:', error);
    throw error;
  }
};
