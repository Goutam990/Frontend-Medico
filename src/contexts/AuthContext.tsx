import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real-world application, you would make an API call here to verify the token
    // and get the user's data. Since the current backend does not support a 'get me' endpoint,
    // we will simply finish loading and rely on the token's presence for authentication.
    setIsLoading(false);
  }, [token]);

  const login = async (username: string, password: string) => {
    const response = await authApi.login({ username, password });
    const newToken = response.data.token;

    localStorage.setItem('authToken', newToken);
    setToken(newToken);

    // The user object is not returned from the login endpoint, so we leave it as null.
    // The application should rely on `isAuthenticated` for protecting routes.
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}