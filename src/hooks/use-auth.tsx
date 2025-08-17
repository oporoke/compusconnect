
"use client";

import { User, Role, USERS } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuditLog } from './use-audit-log';

type AuthState = 'unauthenticated' | 'mfa_required' | 'authenticated';

interface AuthContextType {
  user: User | null;
  authState: AuthState;
  login: (role: Role, password?: string) => void;
  submitMfa: (code: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { logAction } = useAuditLog();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('campus-connect-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setAuthState('authenticated');
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('campus-connect-user');
      setAuthState('unauthenticated');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((role: Role, password?: string) => {
    const userToLogin = USERS.find(u => u.role === role);
    if (userToLogin) {
      // Mock password check - in a real app, this would be a secure check
      // For now, any password works. The existence of the password field triggers MFA.
      setPendingUser(userToLogin);
      setAuthState('mfa_required');
    }
  }, []);
  
  const submitMfa = useCallback((code: string) => {
      // Mock MFA check - any 6-digit code works
      if(pendingUser && code.length === 6) {
        localStorage.setItem('campus-connect-user', JSON.stringify(pendingUser));
        setUser(pendingUser);
        setAuthState('authenticated');
        logAction('User Logged In', { userId: pendingUser.name, role: pendingUser.role });
        router.push('/dashboard');
        setPendingUser(null);
      }
  }, [pendingUser, router, logAction]);

  const logout = useCallback(() => {
    if(user) {
        logAction('User Logged Out', { userId: user.name });
    }
    localStorage.removeItem('campus-connect-user');
    setUser(null);
    setPendingUser(null);
    setAuthState('unauthenticated');
    router.push('/login');
  }, [router, user, logAction]);

  return (
    <AuthContext.Provider value={{ user, authState, login, submitMfa, logout, isLoading }}>
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
