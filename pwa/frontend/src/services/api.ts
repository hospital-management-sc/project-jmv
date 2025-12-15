import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants'

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  // Get token from localStorage
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const requestInfo = {
    url,
    method: options.method || 'GET',
    headers,
    timestamp: new Date().toISOString(),
  }

  console.log('[API] Starting request:', requestInfo)

  try {
    console.log('[API] Sending fetch to:', url)
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'include',
    })

    console.log('[API] Response received', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
    })

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }
      console.error('[API] Error response:', { status: response.status, errorData })
      
      // Si es error de autenticación (401), limpiar token y redirigir a login
      if (response.status === 401) {
        console.warn('[API] Token inválido o expirado, limpiando sesión')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Redirigir al login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('[API] Response parsed successfully:', data)
    return data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[API] Fetch failed:', {
      error: errorMessage,
      url,
      method: options.method || 'GET',
      timestamp: new Date().toISOString(),
    })
    throw error
  }
}

export const apiService = {
  get: <T,>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  post: <T,>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T,>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T,>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T,>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}
