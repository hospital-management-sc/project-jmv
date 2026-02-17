/**
 * Diagnostics utility to check API connectivity and configuration
 */

export async function runDiagnostics() {
  // Diagnostics can be enabled by uncommenting console.log statements
}

/**
 * Quick login test
 */
export async function quickLoginTest() {
  try {
    const { API_BASE_URL } = await import('./constants')
    const loginUrl = `${API_BASE_URL}/auth/login`

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@hospital.com',
        password: 'admin123456',
      }),
      mode: 'cors',
    })

    const data = await response.json()

    if (data.success && data.data?.token) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export function setupDiagnosticsCommand() {
  // Make diagnostics available globally for easy testing
  ;(window as any).runDiagnostics = runDiagnostics
  ;(window as any).quickLoginTest = quickLoginTest
}
