/**
 * Servicio para gestionar pacientes
 */

import { apiService } from './api';

export interface Paciente {
  id: number;
  nroHistoria: string;
  apellidosNombres: string;
  ci: string;
  fechaNacimiento: Date | string;
  sexo: string;
  telefono?: string;
  direccion?: string;
  nacionalidad?: string;
  estado?: string;
  lugarNacimiento?: string;
  religion?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  // Relaciones
  admisiones?: any[];
  encuentros?: any[];
  citas?: any[];
  personalMilitar?: any;
  afiliado?: any;
}

class PacientesService {
  async buscarPorCI(ci: string): Promise<Paciente> {
    const response = await apiService.get<{ success: boolean; data: Paciente }>(`/pacientes/search?ci=${encodeURIComponent(ci)}`);
    return response.data;
  }

  async buscarPorId(id: number): Promise<Paciente> {
    const response = await apiService.get<{ success: boolean; data: Paciente }>(`/pacientes/${id}`);
    return response.data;
  }
}

export const pacientesService = new PacientesService();
export default pacientesService;
