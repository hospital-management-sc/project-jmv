/**
 * Authentication Types
 */

import { Request } from 'express';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  role?: string;
  ci?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    id: number;
    nombre: string;
    email: string;
    role: string;
    token: string;
    refreshToken?: string;
  };
  error?: string;
  message?: string;
}

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  especialidad?: string; // Especialidad médica del usuario (si aplica)
  departamento?: string; // Departamento del usuario
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
