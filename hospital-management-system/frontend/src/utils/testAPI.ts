/**
 * Frontend Testing Script
 * 
 * Ejecutar en la consola del navegador (F12):
 * 1. Esperar a que la página cargue
 * 2. Abrir la consola (F12)
 * 3. Copiar y pegar este código
 * 
 * O simplemente copiar el contenido en window._testAPI
 */

export const testAPI = {
  async testHealth() {
    console.log('🧪 Testing /api/health...')
    try {
      const response = await fetch('http://localhost:3001/api/health')
      const data = await response.json()
      console.log('✅ Health check:', data)
      return data
    } catch (error) {
      console.error('❌ Error:', error)
    }
  },

  async testLogin() {
    console.log('🧪 Testing login...')
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@hospital.com',
          password: 'admin123456',
        }),
      })
      const data = await response.json()
      console.log('✅ Login response:', data)
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token)
        console.log('✅ Token saved to localStorage')
      }
      return data
    } catch (error) {
      console.error('❌ Error:', error)
    }
  },

  async testGetMe() {
    console.log('🧪 Testing /api/auth/me...')
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('❌ No token found. Run testLogin() first')
        return
      }

      const response = await fetch('http://localhost:3001/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      console.log('✅ User data:', data)
      return data
    } catch (error) {
      console.error('❌ Error:', error)
    }
  },

  async runAllTests() {
    console.log('🚀 Running all tests...\n')
    await this.testHealth()
    console.log('\n')
    await this.testLogin()
    console.log('\n')
    await this.testGetMe()
    console.log('\n✅ All tests completed')
  },
}

// Hacer disponible en la consola
if (typeof window !== 'undefined') {
  ;(window as any)._testAPI = testAPI
  console.log(
    '✅ Testing API available. Run: window._testAPI.runAllTests() in console'
  )
}
