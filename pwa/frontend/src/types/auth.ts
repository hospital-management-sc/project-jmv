/**
 * User roles in the hospital management system
 */
export const UserRole = {
  MEDICO: 'MEDICO', // Médicos y coordinadores de área
  ADMIN: 'ADMIN', // Personal administrativo
} as const

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole]

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Registration data
 */
export interface RegisterData {
  nombre: string
  email: string
  password: string
  ci: string // Required: C.I. es un identificador único
  role: string // Required: 'MEDICO' o 'ADMIN'
}

/**
 * Authentication response
 */
export interface AuthResponse {
  success: boolean
  data?: {
    id: number
    nombre: string
    email: string
    role: string
    especialidad?: string
    token: string
    refreshToken?: string
  }
  error?: string
  message?: string
}

/**
 * JWT Payload - decodificado del token
 */
export interface JWTPayload {
  id: number
  email: string
  nombre: string
  role: string
  especialidad?: string // Especialidad médica del usuario (si aplica)
  departamento?: string // Departamento del usuario
  cargo?: string // Cargo del usuario
  telefono?: string // Teléfono del usuario
  ci?: string // Cédula de identidad
  estado?: string // Estado del usuario (ACTIVO, INACTIVO, etc)
  iat?: number
  exp?: number
}

/**
 * User interface
 */
export interface User {
  id: number
  nombre: string
  email: string
  role: UserRoleType
  ci?: string
  especialidad?: string
  createdAt?: string
  updatedAt?: string
}
