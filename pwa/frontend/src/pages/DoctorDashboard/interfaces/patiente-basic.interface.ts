export interface PatientBasic {
  id: string
  nroHistoria: string
  apellidosNombres: string
  ci: string
  fechaNacimiento?: string
  sexo?: string
  telefono?: string
  direccion?: string
  personalMilitar?: {
    grado?: string
    componente?: string
    unidad?: string
    estadoMilitar?: string
  }
  admisiones?: any[]
  encuentros?: any[]
}