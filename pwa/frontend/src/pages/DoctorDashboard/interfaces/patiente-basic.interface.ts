export interface PatientBasic {
  id: string
  nroHistoria: string
  apellidosNombres: string
  ci: string
  fechaNacimiento?: string
  sexo?: string
  telefono?: string
  direccion?: string
  citaId?: number // ID de la cita si se registra desde MyAppointments
  personalMilitar?: {
    grado?: string
    componente?: string
    unidad?: string
    estadoMilitar?: string
  }
  admisiones?: any[]
  encuentros?: any[]
}