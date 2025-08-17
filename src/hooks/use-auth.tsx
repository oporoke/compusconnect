
"use client";

import { User, Role, USERS } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuditLog } from './use-audit-log';

type AuthState = 'unauthenticated' | 'awaitingMfa' | 'authenticated';

interface AuthContextType {
  user: User | null;
  authState: AuthState;
  login: (role: Role) => void;
  submitMfa: (code: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const router = useRouter();
  const { logAction } = useAuditLog();

  const checkUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const { user: sessionUser } = await res.json();
        if (sessionUser) {
            setUser(sessionUser);
            setAuthState('authenticated');
        } else {
            setUser(null);
            setAuthState('unauthenticated');
        }
      } else {
        setAuthState('unauthenticated');
      }
    } catch (error) {
      console.error("Failed to fetch session", error);
      setAuthState('unauthenticated');
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const login = useCallback(async (role: Role) => {
    // This is a mock login. In a real app, you'd verify password here.
    // For the demo, we just proceed to the MFA step.
    setPendingRole(role);
    setAuthState('awaitingMfa');
  }, []);
  
  const submitMfa = useCallback(async (code: string) => {
      // Mock MFA verification. Any 6-digit code works.
      if (!pendingRole || code.length !== 6) return;

      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: pendingRole }),
        });
        if(res.ok) {
            const { user: loggedInUser } = await res.json();
            setUser(loggedInUser);
            setAuthState('authenticated');
            logAction('User Logged In', { userId: loggedInUser.name, role: loggedInUser.role });
            router.push('/dashboard');
        }
      } catch (error) {
          console.error("Login failed", error);
          setAuthState('unauthenticated');
      } finally {
          setIsLoading(false);
          setPendingRole(null);
      }
  }, [pendingRole, router, logAction]);
  
  const logout = useCallback(async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        if(user) {
            logAction('User Logged Out', { userId: user.name });
        }
    } catch(error) {
        console.error("Logout failed", error);
    } finally {
        setUser(null);
        setAuthState('unauthenticated');
        setPendingRole(null);
        router.push('/login');
    }
  }, [router, user, logAction]);

  return (
    <AuthContext.Provider value={{ user, authState, login, logout, submitMfa, isLoading }}>
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
