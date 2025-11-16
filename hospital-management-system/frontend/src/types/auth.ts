/**
 * User roles in the hospital management system
 */
export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  COORDINATOR = 'coordinator',
  STAFF = 'staff',
}

/**
 * User types that can register
 */
export enum UserType {
  MEDICAL = 'medical', // Médicos y coordinadores
  ADMINISTRATIVE = 'administrative', // Personal administrativo
}

/**
 * User interface
 */
export interface User {
  id: string
  ci: string // Cédula de identidad
  firstName: string
  lastName: string
  email: string
  role: UserRole
  type: UserType
  createdAt: string
  updatedAt: string
}

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
  ci?: string
  role?: string
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
    token: string
    refreshToken?: string
  }
  error?: string
  message?: string
}
