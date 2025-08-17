
"use client";

import { User, Role, USERS } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuditLog } from './use-audit-log';

type AuthState = 'unauthenticated' | 'authenticated';

interface AuthContextType {
  user: User | null;
  authState: AuthState;
  login: (role: Role) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role }),
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
    } finally {
        setIsLoading(false);
    }
  }, [router, logAction]);
  
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
        router.push('/login');
    }
  }, [router, user, logAction]);

  return (
    <AuthContext.Provider value={{ user, authState, login, logout, isLoading }}>
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
