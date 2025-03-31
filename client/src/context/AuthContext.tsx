import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import { useLocation } from 'wouter';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: any;
  register: any;
  logout: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { 
    user, 
    isLoading, 
    isAuthenticated,
    login,
    register,
    logout
  } = useUser();
  
  const [, navigate] = useLocation();
  
  // Redirect unauthenticated users to login
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
