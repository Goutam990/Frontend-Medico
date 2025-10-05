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
    // Since we don't have an endpoint to verify the token, we'll assume it's valid if it exists.
    // In a real-world application, you would make an API call here to get the user's data.
    if (token) {
      // For now, we can create a placeholder user object if a token is present.
      // This part would be replaced by an API call to a `/api/auth/me` endpoint.
      setUser({ id: '-1', username: 'Authenticated User', email: '' });
    }
    setIsLoading(false);
  }, [token]);

  const login = async (username: string, password: string) => {
    const response = await authApi.login({ username, password });
    // The new API returns the token directly, not nested in a data object.
    const newToken = response.data.token;

    localStorage.setItem('authToken', newToken);
    setToken(newToken);

    // Since the login endpoint doesn't return a user object,
    // we cannot set the user here. A call to a 'get current user' endpoint would be needed.
    // For now, we will leave the user as null.
    // setUser(newUser);
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