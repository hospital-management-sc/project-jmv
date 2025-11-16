/**
 * Diagnostics utility to check API connectivity and configuration
 */

export async function runDiagnostics() {
  console.group('[DIAGNOSTICS] Starting diagnostics...')

  // Get the actual API_BASE_URL that's being used
  const { API_BASE_URL } = await import('./constants')

  // 1. Check environment variables
  console.log('[DIAGNOSTICS] Environment Variables:')
  console.table({
    'VITE_API_URL (from .env)': import.meta.env.VITE_API_URL || '❌ Not set',
    'MODE': import.meta.env.MODE,
    'DEV': import.meta.env.DEV,
    'PROD': import.meta.env.PROD,
  })

  // 2. Check if we're in Codespace
  const hostname = window.location.hostname
  const isCodespace = hostname.includes('app.github.dev')
  const codespaceMatch = hostname.match(/^(.+?)-5173\./)
  const codespaceName = codespaceMatch ? codespaceMatch[1] : 'N/A'

  console.log('[DIAGNOSTICS] Environment Detection:')
  console.table({
    'Current Hostname': hostname,
    'Is Codespace': isCodespace ? '✅ YES' : '❌ NO',
    'Codespace Name': codespaceName,
    'Frontend URL': window.location.href,
    'Protocol': window.location.protocol,
  })

  // 3. Check what API URL is actually being used
  console.log('[DIAGNOSTICS] API URL Resolution:')
  console.table({
    'Computed API_BASE_URL': API_BASE_URL,
    'Expected for Codespace': isCodespace 
      ? `https://${hostname.replace('-5173.', '-3001.')}/api`
      : 'http://localhost:3001/api',
  })

  // 4. Check localStorage
  console.log('[DIAGNOSTICS] LocalStorage:')
  console.log('- Token stored:', !!localStorage.getItem('token'))
  console.log('- All keys:', Object.keys(localStorage))

  // 5. Try to ping the backend
  console.log('[DIAGNOSTICS] Testing backend connectivity...')
  try {
    const healthUrl = API_BASE_URL.replace('/api', '') + '/health'
    
    console.log('[DIAGNOSTICS] Attempting GET to:', healthUrl)
    const response = await fetch(healthUrl, {
      method: 'GET',
      mode: 'cors',
    })
    
    console.log('[DIAGNOSTICS] Health check response:', {
      status: response.status,
      statusText: response.statusText,
    })
    
    const data = await response.json()
    console.log('[DIAGNOSTICS] ✅ Backend is reachable:', data)
  } catch (error) {
    console.error('[DIAGNOSTICS] ❌ Backend connectivity error:', error)
  }

  // 6. Test CORS headers
  console.log('[DIAGNOSTICS] Browser info:')
  console.log('- User Agent:', navigator.userAgent)

  console.groupEnd()
}

/**
 * Quick login test
 */
export async function quickLoginTest() {
  console.group('[TEST-LOGIN] Quick login test')

  try {
    const { API_BASE_URL } = await import('./constants')
    const loginUrl = `${API_BASE_URL}/auth/login`
    
    console.log('[TEST-LOGIN] Attempting login to:', loginUrl)

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@hospital.com',
        password: 'admin123456',
      }),
      mode: 'cors',
    })

    console.log('[TEST-LOGIN] Response status:', response.status)

    const data = await response.json()
    console.log('[TEST-LOGIN] Response data:', data)

    if (data.success && data.data?.token) {
      console.log('[TEST-LOGIN] ✅ Login successful! Token:', data.data.token.substring(0, 20) + '...')
      return true
    } else {
      console.error('[TEST-LOGIN] ❌ Login failed:', data.error)
      return false
    }
  } catch (error) {
    console.error('[TEST-LOGIN] Exception:', error)
    return false
  } finally {
    console.groupEnd()
  }
}

export function setupDiagnosticsCommand() {
  // Make diagnostics available globally for easy testing
  ;(window as any).runDiagnostics = runDiagnostics
  ;(window as any).quickLoginTest = quickLoginTest

  console.log('[SETUP] ✅ Available commands:')
  console.log('  - window.runDiagnostics()  : Full diagnostics')
  console.log('  - window.quickLoginTest()  : Test login endpoint')
}
