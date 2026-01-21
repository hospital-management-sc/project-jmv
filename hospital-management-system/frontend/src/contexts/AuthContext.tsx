import { createContext } from 'react';

import type { JWTPayload } from '@/types/auth';

interface AuthContextType {
  user: JWTPayload | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: JWTPayload, token: string) => void;
  logout: () => void;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;