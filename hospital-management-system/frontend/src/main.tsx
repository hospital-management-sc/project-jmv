import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { testAPI } from './utils/testAPI'

// Make testAPI available in console for debugging
if (typeof window !== 'undefined') {
  ;(window as any)._testAPI = testAPI
  console.log('✅ Testing API available. Run: window._testAPI.runAllTests()')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
