/**
 * Application constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Hospital Management System'

// Detectar si estamos en Codespace y construir URLs correctamente
function getApiBaseUrl(): string {
  // Si hay variable de entorno explícita, usarla primero
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // Detectar Codespace por hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const protocol = window.location.protocol
    
    // Si estamos en Codespace (app.github.dev)
    if (hostname.includes('app.github.dev')) {
      const apiHostname = hostname.replace('-5173.', '-3001.')
      const apiUrl = `${protocol}//${apiHostname}/api`
      return apiUrl
    }
    
    // Si estamos en Vercel o producción, usar el backend de producción
    if (hostname.includes('vercel.app') || hostname.includes('project-jmv')) {
      const productionUrl = 'https://project-jmv.onrender.com/api'
      return productionUrl
    }
  }

  // Default para desarrollo local
  const defaultUrl = 'http://localhost:3001/api'
  return defaultUrl
}

export const API_BASE_URL = getApiBaseUrl()

/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PATIENTS: '/patients',
  DOCTORS: '/doctors',
  APPOINTMENTS: '/appointments',
} as const

