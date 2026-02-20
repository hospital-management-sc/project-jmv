import { apiService } from './api';

export interface CrearAdmisionDTO {
  pacienteId: string;
  tipo: 'EMERGENCIA' | 'HOSPITALIZACION' | 'CONSULTA_EXTERNA' | 'UCI' | 'CIRUGIA';
  servicio?: string;
  fechaAdmision: string;
  horaAdmision?: string;
  formaIngreso?: 'AMBULANTE' | 'AMBULANCIA' | 'TRANSFERENCIA';
  habitacion?: string;
  cama?: string;
  observaciones?: string;
  createdById?: string;
}

export interface RegistrarAltaDTO {
  fechaAlta: string;
  horaAlta?: string;
  tipoAlta: 'MEJORIA' | 'VOLUNTARIA' | 'TRANSFERENCIA' | 'FALLECIMIENTO' | 'FUGA' | 'ADMINISTRATIVA';
}

export interface ActualizarAdmisionDTO {
  servicio?: string;
  habitacion?: string;
  cama?: string;
  formaIngreso?: string;
  observaciones?: string;
}

export interface Admision {
  id: string;
  pacienteId: string;
  tipo: string;
  servicio?: string;
  fechaAdmision: string;
  horaAdmision?: string;
  fechaAlta?: string;
  horaAlta?: string;
  formaIngreso?: string;
  habitacion?: string;
  cama?: string;
  estado: string;
  tipoAlta?: string;
  firmaFacultativo?: string;
  observaciones?: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  diasHospitalizacion?: number;
  paciente?: {
    id: string;
    nroHistoria: string;
    apellidosNombres: string;
    ci: string;
    fechaNacimiento?: string;
    sexo?: string;
    telefono?: string;
    direccion?: string;
  };
  createdBy?: {
    id: string;
    nombre: string;
    cargo?: string;
  };
  estanciaHospitalaria?: any;
  formatoEmergencia?: any;
  formatoHospitalizacion?: any;
}

const admisionesService = {
  /**
   * Crear nueva admisión
   */
  crearAdmision: async (data: CrearAdmisionDTO) => {
    return await apiService.post<{ message: string; admision: Admision }>('/admisiones', data);
  },

  /**
   * Obtener admisión por ID
   */
  obtenerAdmision: async (id: string) => {
    return await apiService.get<Admision>(`/admisiones/${id}`);
  },

  /**
   * Listar admisiones de un paciente
   */
  listarAdmisionesPaciente: async (pacienteId: string) => {
    return await apiService.get<{ total: number; admisiones: Admision[] }>(`/admisiones/paciente/${pacienteId}`);
  },

  /**
   * Actualizar admisión
   */
  actualizarAdmision: async (id: string, data: ActualizarAdmisionDTO) => {
    return await apiService.put<{ message: string; admision: Admision }>(`/admisiones/${id}`, data);
  },

  /**
   * Registrar alta del paciente
   */
  registrarAlta: async (id: string, data: RegistrarAltaDTO) => {
    return await apiService.patch<{ message: string; admision: Admision; diasHospitalizacion: number }>(`/admisiones/${id}/alta`, data);
  },

  /**
   * Activar una admisión que está en espera
   */
  activarAdmision: async (id: string) => {
    return await apiService.patch<{ message: string; admision: Admision }>(`/admisiones/${id}/activar`, {});
  },

  /**
   * Listar pacientes hospitalizados actualmente
   */
  listarAdmisionesActivas: async (filters?: { servicio?: string; tipo?: string }) => {
    const params = new URLSearchParams();
    if (filters?.servicio) params.append('servicio', filters.servicio);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    
    return await apiService.get<{ total: number; admisiones: Admision[] }>(`/admisiones/activas?${params.toString()}`);
  },

  /**
   * Listar admisiones por servicio
   */
  listarAdmisionesPorServicio: async (servicio: string, estado?: string) => {
    const params = estado ? `?estado=${estado}` : '';
    return await apiService.get<{ total: number; servicio: string; admisiones: Admision[] }>(`/admisiones/servicio/${servicio}${params}`);
  },

  /**
   * Listar admisiones activas de un médico específico
   */
  listarAdmisionesActivasMedico: async (medicoId: string | number) => {
    return await apiService.get<{ success: boolean; data: Admision[]; total: number; medicoId: number }>(
      `/admisiones/medico/${medicoId}/activas`
    );
  },
};

export default admisionesService;
