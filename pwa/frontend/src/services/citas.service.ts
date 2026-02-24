/**
 * Servicio para gestionar citas médicas
 */

import { apiService } from './api';

// Tipos
export type EstadoCita = 'PROGRAMADA' | 'COMPLETADA';

export interface Cita {
  id: number;
  pacienteId: number;
  medicoId?: number | null;
  createdById?: number | null; // Quién agendó la cita
  servicio?: string;
  especialidad: string;
  fechaHora?: string; // Campo alternativo
  fechaCita?: string | Date; // Campo del backend
  horaCita?: string; // Campo del backend
  motivo: string;
  estado: string; // PROGRAMADA o COMPLETADA
  notas?: string | null;
  horaLlegada?: string | null;
  horaAtencion?: string | null;
  horaFinalizacion?: string | null;
  createdAt?: string;
  updatedAt?: string;
  paciente?: {
    id: number;
    nroHistoria: string;
    apellidosNombres: string;
    ci: string;
    fechaNacimiento?: string;
    sexo?: string;
  };
  medico?: {
    id: number;
    nombre: string;
    apellido?: string;
    especialidad?: string | null;
    cargo?: string;
    role?: string;
  } | null;
  createdBy?: {
    id: number;
    nombre: string;
    cargo?: string;
    especialidad?: string;
    role?: string;
  } | null;
  encuentro?: {
    id: number;
    tipo: string;
    estado: string;
  } | null;
}

export interface CrearCitaDTO {
  pacienteId: number;
  medicoId?: number | null;
  createdById?: number | null; // Quién agendó la cita
  servicio?: string;
  especialidad: string;
  fechaHora?: string;
  fechaCita?: string; // Alternativa a fechaHora
  horaCita?: string;
  motivo: string;
  notas?: string;
}

export interface ActualizarCitaDTO {
  fechaHora?: string;
  motivo?: string;
  notas?: string;
  estado?: EstadoCita;
}

// Funciones del servicio

/**
 * Obtener todas las citas
 */
export async function obtenerCitas(): Promise<Cita[]> {
  return apiService.get<Cita[]>('/citas');
}

/**
 * Obtener una cita por ID
 */
export async function obtenerCitaPorId(id: number): Promise<Cita> {
  return apiService.get<Cita>(`/citas/${id}`);
}

/**
 * Crear una nueva cita
 */
export async function crearCita(datos: CrearCitaDTO): Promise<Cita> {
  return apiService.post<Cita>('/citas', datos);
}

/**
 * Actualizar una cita existente
 */
export async function actualizarCita(id: number, datos: ActualizarCitaDTO): Promise<Cita> {
  return apiService.put<Cita>(`/citas/${id}`, datos);
}

/**
 * Cancelar una cita
 */
export async function cancelarCita(id: number, motivo?: string): Promise<Cita> {
  return apiService.patch<Cita>(`/citas/${id}/cancelar`, { motivo });
}

/**
 * Obtener citas del día actual para un médico específico
 */
export async function obtenerCitasDelDia(medicoId: number): Promise<Cita[]> {
  const response = await apiService.get<{
    success: boolean;
    data: Cita[];
    count: number;
    fecha: string;
  }>(`/citas/medico/${medicoId}/hoy`);
  
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Obtener citas de los próximos días para un médico específico
 */
export async function obtenerCitasProximos(medicoId: number, dias: number = 7): Promise<Cita[]> {
  const response = await apiService.get<{
    success: boolean;
    data: Cita[];
    count: number;
    fechaInicio: string;
    fechaFinal: string;
    dias: number;
  }>(`/citas/medico/${medicoId}/proximos?dias=${dias}`);
  
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Marcar una cita como atendida (el paciente llegó y está siendo atendido)
 */
export async function atenderCita(id: number): Promise<Cita> {
  const response = await apiService.patch<{
    success: boolean;
    message: string;
    data: Cita;
  }>(`/citas/${id}/iniciar`, {});
  
  return response.data || {} as Cita;
}

/**
 * Completar una cita (finalizar la atención)
 */
export async function completarCita(id: number, notas?: string): Promise<Cita> {
  const response = await apiService.patch<{
    success: boolean;
    message: string;
    data: Cita;
  }>(`/citas/${id}/completar`, { notas });
  
  return response.data || {} as Cita;
}

/**
 * Marcar como no asistió
 */
export async function marcarNoAsistio(id: number): Promise<Cita> {
  return apiService.patch<Cita>(`/citas/${id}`, { estado: 'NO_ASISTIO' });
}

/**
 * Obtener citas de un paciente
 */
export async function obtenerCitasPorPaciente(pacienteId: number): Promise<Cita[]> {
  const response = await apiService.get<{
    success: boolean;
    data: Cita[];
  }>(`/citas/paciente/${pacienteId}`);
  
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Obtener citas de un médico
 */
export async function obtenerCitasPorMedico(medicoId: number): Promise<Cita[]> {
  const response = await apiService.get<{
    success: boolean;
    data: Cita[];
  }>(`/citas/medico/${medicoId}`);
  
  return Array.isArray(response.data) ? response.data : [];
}

// Constantes útiles
export const ESTADOS_CITA: { value: EstadoCita; label: string; color: string }[] = [
  { value: 'PROGRAMADA', label: 'Programada', color: '#007bff' },
  { value: 'COMPLETADA', label: 'Completada', color: '#28a745' },
];

export const SERVICIOS_MEDICOS = [
  'CONSULTA EXTERNA',
  'EMERGENCIA',
  'HOSPITALIZACIÓN',
  'CIRUGÍA',
  'LABORATORIO',
  'IMAGENOLOGÍA',
  'REHABILITACIÓN',
  'ODONTOLOGÍA',
];
