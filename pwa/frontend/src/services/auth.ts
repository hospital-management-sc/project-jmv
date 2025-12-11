import { apiService } from './api'
import { API_ENDPOINTS, STORAGE_KEYS } from '@/utils/constants'
import type { AuthResponse, LoginCredentials, RegisterData } from '../types/auth'

export const authService = {
  /**
   * Login user with CI, email and password
   */
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials)
  },

  /**
   * Register new user
   */
  register: (data: RegisterData): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(API_ENDPOINTS.REGISTER, data)
  },

  /**
   * Logout user (optional - mainly for clearing client state)
   */
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  /**
   * Get stored token
   */
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  },

  /**
   * Save token to localStorage
   */
  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN)
  },

  /**
   * Forgot password - Reset password with email + CI verification
   */
  forgotPassword: (data: { email: string; ci: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
    return apiService.post<{ success: boolean; message: string }>('/auth/forgot-password', data)
  },
}
