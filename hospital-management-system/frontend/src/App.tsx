import AuthProvider from '@/providers/AuthProvider';
import Router from './router';

// Styles
import '@styles/globals.css';
import '@styles/dashboard.css';

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}

