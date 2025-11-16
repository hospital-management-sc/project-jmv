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
  ci: string
  email: string
  password: string
}

/**
 * Registration data
 */
export interface RegisterData {
  ci: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  type: UserType
  role?: UserRole // Optional - puede ser asignado por admin después
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}
