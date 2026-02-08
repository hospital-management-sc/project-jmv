/**
 * Servicio para gestionar interconsultas médicas
 * Las interconsultas permiten que un médico solicite evaluación de otra especialidad
 */

import { apiService } from './api';
import { obtenerNombresEspecialidades } from '@/config/especialidades.config';

// Tipos
export type PrioridadInterconsulta = 'URGENTE' | 'ALTA' | 'MEDIA' | 'BAJA';
export type EstadoInterconsulta = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';

export interface Interconsulta {
  id: number;
  pacienteId: number;
  medicoSolicitanteId: number;
  medicoDestinoId: number | null;
  especialidadDestino: string;
  prioridad: PrioridadInterconsulta;
  estado: EstadoInterconsulta;
  motivo: string;
  diagnosticoPrevio: string | null;
  observaciones: string | null;
  respuesta: string | null;
  fechaSolicitud: string;
  fechaRespuesta: string | null;
  admisionId: number | null;
  paciente?: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    fechaNacimiento: string;
  };
  medicoSolicitante?: {
    id: number;
    nombre: string;
    apellido: string;
    especialidad: string | null;
  };
  medicoDestino?: {
    id: number;
    nombre: string;
    apellido: string;
    especialidad: string | null;
  } | null;
  admision?: {
    id: number;
    tipo: string;
    servicio: string;
  } | null;
}

export interface CrearInterconsultaDTO {
  pacienteId: number;
  medicoSolicitanteId: number;
  medicoDestinoId?: number;
  especialidadDestino: string;
  prioridad: PrioridadInterconsulta;
  motivo: string;
  diagnosticoPrevio?: string;
  observaciones?: string;
  admisionId?: number;
}

export interface CompletarInterconsultaDTO {
  respuesta: string;
  observaciones?: string;
}

// Funciones del servicio

// Tipo de respuesta del API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

/**
 * Crear una nueva interconsulta (médico solicita evaluación de otra especialidad)
 */
export async function crearInterconsulta(datos: CrearInterconsultaDTO): Promise<Interconsulta> {
  const response = await apiService.post<ApiResponse<Interconsulta>>('/interconsultas', datos);
  return response.data;
}

/**
 * Obtener interconsultas pendientes enviadas por un médico
 */
export async function obtenerInterconsultasPendientes(medicoId: number): Promise<Interconsulta[]> {
  const response = await apiService.get<ApiResponse<Interconsulta[]>>(`/interconsultas/enviadas/${medicoId}`);
  return response.data || [];
}

/**
 * Obtener interconsultas recibidas (dirigidas a un médico por su especialidad)
 */
export async function obtenerInterconsultasRecibidas(medicoId: number): Promise<Interconsulta[]> {
  const response = await apiService.get<ApiResponse<Interconsulta[]>>(`/interconsultas/recibidas/${medicoId}`);
  return response.data || [];
}

/**
 * Aceptar una interconsulta (el médico destino la toma)
 */
export async function aceptarInterconsulta(interconsultaId: number, medicoId: number): Promise<Interconsulta> {
  const response = await apiService.patch<ApiResponse<Interconsulta>>(`/interconsultas/${interconsultaId}/aceptar`, { medicoDestinoId: medicoId });
  return response.data;
}

/**
 * Completar una interconsulta con la respuesta/evaluación
 */
export async function completarInterconsulta(
  interconsultaId: number,
  datos: CompletarInterconsultaDTO
): Promise<Interconsulta> {
  const response = await apiService.patch<ApiResponse<Interconsulta>>(`/interconsultas/${interconsultaId}/completar`, {
    respuestaInterconsulta: datos.respuesta,
    recomendaciones: datos.observaciones,
  });
  return response.data;
}

/**
 * Cancelar una interconsulta
 */
export async function cancelarInterconsulta(interconsultaId: number, motivo?: string): Promise<Interconsulta> {
  const response = await apiService.patch<ApiResponse<Interconsulta>>(`/interconsultas/${interconsultaId}/rechazar`, { motivoRechazo: motivo });
  return response.data;
}

/**
 * Obtener historial de interconsultas de un paciente
 */
export async function obtenerInterconsultasPorPaciente(pacienteId: number): Promise<Interconsulta[]> {
  const response = await apiService.get<ApiResponse<Interconsulta[]>>(`/interconsultas/paciente/${pacienteId}`);
  return response.data || [];
}

/**
 * Obtener detalle de una interconsulta específica
 */
export async function obtenerInterconsultaPorId(interconsultaId: number): Promise<Interconsulta> {
  const response = await apiService.get<ApiResponse<Interconsulta>>(`/interconsultas/${interconsultaId}/detalle`);
  return response.data;
}

// Lista de especialidades médicas disponibles para interconsultas
// 🎯 CENTRALIZADO - Obtenidas desde config/especialidades.config.ts como fuente única
export const ESPECIALIDADES_MEDICAS = obtenerNombresEspecialidades();

export const PRIORIDADES_INTERCONSULTA: { value: PrioridadInterconsulta; label: string; color: string }[] = [
  { value: 'URGENTE', label: 'Urgente', color: '#dc3545' },
  { value: 'ALTA', label: 'Alta', color: '#fd7e14' },
  { value: 'MEDIA', label: 'Media', color: '#ffc107' },
  { value: 'BAJA', label: 'Baja', color: '#28a745' },
];

export const ESTADOS_INTERCONSULTA: { value: EstadoInterconsulta; label: string; color: string }[] = [
  { value: 'PENDIENTE', label: 'Pendiente', color: '#6c757d' },
  { value: 'EN_PROCESO', label: 'En Proceso', color: '#007bff' },
  { value: 'COMPLETADA', label: 'Completada', color: '#28a745' },
  { value: 'CANCELADA', label: 'Cancelada', color: '#dc3545' },
];
