/**
 * Application constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Hospital Management System'

// Detectar si estamos en Codespace y construir URLs correctamente
function getApiBaseUrl(): string {
  // Si hay variable de entorno explícita Y no estamos en Codespace, usarla
  if (import.meta.env.VITE_API_URL && typeof window === 'undefined') {
    return import.meta.env.VITE_API_URL
  }

  // Detectar Codespace por hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const protocol = window.location.protocol
    
    console.log('[CONSTANTS] Detected hostname:', hostname)
    console.log('[CONSTANTS] Detected protocol:', protocol)
    
    // Si estamos en Codespace (app.github.dev)
    if (hostname.includes('app.github.dev')) {
      const apiHostname = hostname.replace('-5173.', '-3001.')
      const apiUrl = `${protocol}//${apiHostname}/api`
      console.log('[CONSTANTS] Codespace detected. API URL:', apiUrl)
      return apiUrl
    }
    
    // Si hay VITE_API_URL y es localhost, pero hostname NO es localhost, estamos probablemente en port forward
    if (import.meta.env.VITE_API_URL && hostname === 'localhost') {
      console.log('[CONSTANTS] Using VITE_API_URL for localhost:', import.meta.env.VITE_API_URL)
      return import.meta.env.VITE_API_URL
    }
  }

  // Default para desarrollo local
  const defaultUrl = 'http://localhost:3001/api'
  console.log('[CONSTANTS] Using default localhost URL:', defaultUrl)
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

