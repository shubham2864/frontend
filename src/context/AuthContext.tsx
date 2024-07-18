// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  authenticate: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    if (email && token) {
      setUser({ email });
      setIsAuthenticated(true);
      const otpVerified = localStorage.getItem('otpVerified');
      if (otpVerified == 'true') {
        router.push('/dashboard'); // Redirect to dashboard if OTP is verified
      } else {
        router.push('/dashboard'); // Redirect to OTP page if OTP not verified
      }
    }
  }, []);

  const login = (email: string) => {
    setUser({ email });
    localStorage.setItem('email', email);
  };

  const authenticate = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('otpVerified'); // Clear OTP verification flag
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
