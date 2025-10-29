
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole, AuthResponse, ApiResponse } from '../types';
import { JWT_TOKEN_KEY, USER_INFO_KEY } from '../constants';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<ApiResponse<AuthResponse>>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<ApiResponse<AuthResponse>>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(JWT_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_INFO_KEY);

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user info from localStorage", error);
        localStorage.removeItem(JWT_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    setIsLoading(true);
    const response = await authService.login(email, password);
    if (response.success && response.data) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem(JWT_TOKEN_KEY, receivedToken);
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
    }
    setIsLoading(false);
    return response;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string): Promise<ApiResponse<AuthResponse>> => {
    setIsLoading(true);
    const response = await authService.register(name, email, password, phone);
    if (response.success && response.data) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem(JWT_TOKEN_KEY, receivedToken);
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
    }
    setIsLoading(false);
    return response;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!user && !!token;
  const role = user ? user.role : null;

  const value = {
    user,
    token,
    isAuthenticated,
    role,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
