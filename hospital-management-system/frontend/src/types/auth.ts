/**
 * User roles in the hospital management system
 */
export const UserRole = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  COORDINATOR: 'coordinator',
  STAFF: 'staff',
} as const

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole]

/**
 * User types that can register
 */
export const UserType = {
  MEDICAL: 'medical', // Médicos y coordinadores
  ADMINISTRATIVE: 'administrative', // Personal administrativo
} as const

export type UserTypeType = (typeof UserType)[keyof typeof UserType]

/**
 * User interface
 */
export interface User {
  id: string
  ci: string // Cédula de identidad
  firstName: string
  lastName: string
  email: string
  role: UserRoleType
  type: UserTypeType
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
