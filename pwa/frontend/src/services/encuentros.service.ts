/**
 * Servicio para gestionar encuentros médicos (solo lectura para administrativos)
 */

import { apiService } from './api';

export interface SignosVitales {
  id: string;
  encuentroId: string;
  taSistolica?: number;
  taDiastolica?: number;
  pulso?: number;
  temperatura?: number;
  fr?: number;
  observaciones?: string;
  registradoEn: string;
}

export interface ImpresionDiagnostica {
  id: string;
  encuentroId: string;
  codigoCie?: string;
  descripcion?: string;
  clase?: string;
  createdAt: string;
}

export interface Encuentro {
  id: string;
  pacienteId: string;
  admisionId?: string;
  tipo: 'EMERGENCIA' | 'HOSPITALIZACION' | 'CONSULTA' | 'OTRO';
  fecha: string;
  hora?: string;
  motivoConsulta?: string;
  enfermedadActual?: string;
  procedencia?: string;
  nroCama?: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  paciente?: {
    id: string;
    nroHistoria: string;
    apellidosNombres: string;
    ci: string;
  };
  createdBy?: {
    id: string;
    nombre: string;
    cargo?: string;
    role?: string;
    especialidad?: string;
  };
  signosVitales: SignosVitales[];
  impresiones: ImpresionDiagnostica[];
  examenFisico?: {
    [key: string]: string | number | boolean | undefined;
  };
  admision?: {
    id: string;
    tipo?: string;
    servicio?: string;
    fechaAdmision?: string;
    formaIngreso?: string;
  };
}

export interface EncuentrosResponse {
  success: boolean;
  data: Encuentro[];
  count: number;
}

export interface EncuentroResponse {
  success: boolean;
  data: Encuentro;
}

// DTOs para crear/actualizar
export interface CrearEncuentroDTO {
  pacienteId: number;
  tipo: 'EMERGENCIA' | 'HOSPITALIZACION' | 'CONSULTA' | 'OTRO';
  fecha?: string;
  hora?: string;
  motivoConsulta?: string;
  enfermedadActual?: string;
  procedencia?: string;
  nroCama?: string;
  createdById?: number;
  admisionId?: number;
  citaId?: number;
  // Signos vitales opcionales
  signosVitales?: {
    taSistolica?: number;
    taDiastolica?: number;
    pulso?: number;
    temperatura?: number;
    fr?: number;
    observaciones?: string;
  };
  // Impresión diagnóstica opcional
  impresionDiagnostica?: {
    codigoCie?: string;
    descripcion?: string;
    clase?: string;
  };
  // Examen físico genérico (JSONB) - personalizable por especialidad
  examenFisico?: {
    [key: string]: string | number | boolean | undefined;
  };
}

export interface AgregarEvolucionDTO {
  nota: string;
  tipo?: string;
  usuarioId?: number;
}

class EncuentrosService {
  /**
   * Obtener todos los encuentros de un paciente
   */
  async obtenerPorPaciente(pacienteId: string | number): Promise<Encuentro[]> {
    const response = await apiService.get<EncuentrosResponse>(
      `/encuentros/paciente/${pacienteId}`
    );
    return response.data;
  }

  /**
   * Obtener detalle de un encuentro específico
   */
  async obtenerPorId(id: string | number): Promise<Encuentro> {
    const response = await apiService.get<EncuentroResponse>(
      `/encuentros/${id}`
    );
    return response.data;
  }

  /**
   * Obtener encuentros del día actual
   */
  async obtenerHoy(): Promise<Encuentro[]> {
    const response = await apiService.get<EncuentrosResponse>(
      `/encuentros/hoy`
    );
    return response.data;
  }

  /**
   * Obtener encuentros por tipo
   */
  async obtenerPorTipo(tipo: 'EMERGENCIA' | 'HOSPITALIZACION' | 'CONSULTA' | 'OTRO'): Promise<Encuentro[]> {
    const response = await apiService.get<EncuentrosResponse>(
      `/encuentros/tipo/${tipo}`
    );
    return response.data;
  }

  /**
   * Crear un nuevo encuentro médico
   */
  async crearEncuentro(datos: CrearEncuentroDTO): Promise<Encuentro> {
    const response = await apiService.post<EncuentroResponse>(
      `/encuentros`,
      datos
    );
    return response.data;
  }

  /**
   * Agregar nota de evolución a un encuentro existente
   */
  async agregarEvolucion(encuentroId: string | number, datos: AgregarEvolucionDTO): Promise<{ success: boolean; message: string }> {
    return await apiService.post<{ success: boolean; message: string }>(
      `/encuentros/${encuentroId}/evolucion`,
      datos
    );
  }
}

export const encuentrosService = new EncuentrosService();
export default encuentrosService;
