/**
 * Example: Frontend Integration with Backend
 * 
 * Este archivo muestra cómo integrar el backend con el frontend
 * 
 * Ubicación recomendada: frontend/src/examples/backendIntegration.example.ts
 */

import { authService } from '@/services/auth';
import { apiService } from '@/services/api';

/**
 * ============================================
 * EJEMPLO 1: Registro de Usuario
 * ============================================
 */

async function exampleRegister() {
  try {
    const response = await authService.register({
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'MiContraseña123',
      ci: 'V12345678',
      role: 'USUARIO', // opcional
    });

    if (response.success) {
      // Guardar token
      authService.setToken(response.data.token);

      // Usuario registrado
      console.log('Usuario registrado:', response.data);

      // Redirigir a dashboard
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('Error en registro:', error);
  }
}

/**
 * ============================================
 * EJEMPLO 2: Login de Usuario
 * ============================================
 */

async function exampleLogin() {
  try {
    const response = await authService.login({
      email: 'admin@hospital.com',
      password: 'admin123456',
    });

    if (response.success) {
      // Guardar token
      authService.setToken(response.data.token);

      // Guardar datos del usuario (opcional)
      localStorage.setItem('user', JSON.stringify(response.data));

      console.log('Login exitoso:', response.data);

      // El interceptor del API service automáticamente
      // incluirá el token en futuras requests
    }
  } catch (error) {
    console.error('Error en login:', error);
  }
}

/**
 * ============================================
 * EJEMPLO 3: Obtener Usuario Actual
 * ============================================
 */

async function exampleGetCurrentUser() {
  try {
    // El token se incluye automáticamente en el header
    const response = await apiService.get('/auth/me');

    console.log('Usuario actual:', response);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
  }
}

/**
 * ============================================
 * EJEMPLO 4: Logout
 * ============================================
 */

function exampleLogout() {
  // Eliminar token
  authService.logout();

  // Redirigir a login
  window.location.href = '/login';
}

/**
 * ============================================
 * EJEMPLO 5: Verificar si usuario está autenticado
 * ============================================
 */

function exampleCheckAuth() {
  if (authService.isAuthenticated()) {
    console.log('Usuario autenticado');
  } else {
    console.log('Usuario no autenticado');
    // Redirigir a login
  }
}

/**
 * ============================================
 * EJEMPLO 6: Uso en Componente React
 * ============================================
 */

// import { useState, useEffect } from 'react';
// import { authService } from '@/services/auth';
// import { apiService } from '@/services/api';

// function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await authService.login({ email, password });

//       if (response.success) {
//         authService.setToken(response.data.token);
//         window.location.href = '/dashboard';
//       }
//     } catch (err) {
//       setError('Credenciales inválidas');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//         required
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Contraseña"
//         required
//       />
//       {error && <p>{error}</p>}
//       <button type="submit" disabled={loading}>
//         {loading ? 'Iniciando...' : 'Iniciar Sesión'}
//       </button>
//     </form>
//   );
// }

/**
 * ============================================
 * EJEMPLO 7: Hook personalizado para Auth
 * ============================================
 */

// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authService } from '@/services/auth';
// import { apiService } from '@/services/api';

// export function useAuth() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         if (authService.isAuthenticated()) {
//           const userData = await apiService.get('/auth/me');
//           setUser(userData.data);
//           setIsAuthenticated(true);
//         }
//       } catch {
//         authService.logout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   return { isAuthenticated, user, loading };
// }

/**
 * ============================================
 * CONFIGURACIÓN NECESARIA EN FRONTEND
 * ============================================
 */

// 1. Asegurarse de que API_BASE_URL está correcto:
//    frontend/src/utils/constants.ts:
//    export const API_BASE_URL = 'http://localhost:3001/api'

// 2. El apiService debe incluir el token automáticamente:
//    Debe tener un interceptor que agregue:
//    headers.Authorization = `Bearer ${token}`

// 3. Actualizar frontend/src/services/api.ts si es necesario:

// export const apiService = {
//   get: <T,>(endpoint: string) => {
//     const token = localStorage.getItem('token');
//     const headers = token ? { Authorization: `Bearer ${token}` } : {};
//     return request<T>(endpoint, { method: 'GET', headers });
//   },

//   post: <T,>(endpoint: string, data: any) => {
//     const token = localStorage.getItem('token');
//     const headers = token ? { Authorization: `Bearer ${token}` } : {};
//     return request<T>(endpoint, { method: 'POST', body: JSON.stringify(data), headers });
//   },
// };

/**
 * ============================================
 * TESTING CON POSTMAN
 * ============================================
 */

// 1. Crear nuevo usuario:
//    POST http://localhost:3001/api/auth/register
//    Body (JSON):
//    {
//      "nombre": "Test User",
//      "email": "test@example.com",
//      "password": "password123456",
//      "ci": "V12345678",
//      "role": "USUARIO"
//    }

// 2. Obtener token:
//    POST http://localhost:3001/api/auth/login
//    Body (JSON):
//    {
//      "email": "admin@hospital.com",
//      "password": "admin123456"
//    }
//    Response: { token: "eyJhbGci..." }

// 3. Usar token en requests protegidos:
//    GET http://localhost:3001/api/auth/me
//    Headers:
//    Authorization: Bearer eyJhbGci...

export {};
