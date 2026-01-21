import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { JWTPayload } from '@/types/auth';

import AuthContext from '@/contexts/AuthContext';

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider(props: AuthProviderProps) {

  const { children } = props;
  
  const [ user, setUser ] = useState<JWTPayload | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    // Cargar usuario del localStorage al iniciar
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if ( storedUser && token ) {
      try {
        const parsedUser = JSON.parse(storedUser) as JWTPayload;
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false)
  }, [])

  const login = ( userData: JWTPayload, token: string ) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  }

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  }

  const hasRole = (roles: string | string[]) => {
    if ( ! user ) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
      }}
    >
      { children }
    </AuthContext.Provider>
  )
}

export default AuthProvider;