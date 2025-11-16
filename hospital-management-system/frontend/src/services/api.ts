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

  console.log('API Request:', { url, method: options.method || 'GET', headers })

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'include',
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API Error:', errorData)
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('API Response data:', data)
    return data
  } catch (error) {
    console.error('Fetch error:', error)
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
