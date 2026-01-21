// ** Dependencies
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// ** Utils
import { testAPI } from './utils/testAPI';
import { setupDiagnosticsCommand } from './utils/diagnostics';

// ** Providers
import ThemeProvider from './providers/ThemeProvider';

// ** Components
import App from './App.tsx'

// ** Styles
import './index.css';

// Make testAPI available in console for debugging
if ( typeof window !== 'undefined' ) {
  (window as any)._testAPI = testAPI;
  
  // Setup diagnostics
  setupDiagnosticsCommand();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
