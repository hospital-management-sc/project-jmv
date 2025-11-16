/**
 * Application constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Hospital Management System'
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

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
