
"use client";

import { User, Role } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuditLog } from './use-audit-log';
import { useToast } from './use-toast';

type AuthState = 'unauthenticated' | 'awaitingMfa' | 'authenticated';

interface AuthContextType {
  user: User | null;
  authState: AuthState;
  login: (credentials: { email: string; role: Role }) => void;
  signup: (credentials: { name: string; email: string; role: Role; password?: string }) => void;
  submitMfa: (code: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCredentials, setPendingCredentials] = useState<{ email: string, role: Role} | null>(null);
  const router = useRouter();
  const { logAction } = useAuditLog();
  const { toast } = useToast();

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

  const login = useCallback(async (credentials: { email: string; role: Role }) => {
    setPendingCredentials(credentials);
    setAuthState('awaitingMfa');
  }, []);

  const signup = useCallback(async (credentials: { name: string; email: string; role: Role; password?: string }) => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || "Sign-up failed");
        }
        toast({
            title: "Sign Up Successful",
            description: "Your account has been created. You can now log in.",
        });
        // After successful signup, take them to the login view
        // This is a client-side navigation that won't re-trigger the page load fully,
        // so the login form will appear.
        router.push('/login');

    } catch (error) {
        console.error("Signup failed", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: 'destructive', title: "Sign Up Failed", description: errorMessage });
    } finally {
        setIsLoading(false);
    }
  }, [toast, router]);
  
  const submitMfa = useCallback(async (code: string) => {
      if (!pendingCredentials || code.length !== 6) return;

      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: pendingCredentials.email, role: pendingCredentials.role }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Login failed');
        }
        
        const { user: loggedInUser } = await res.json();
        setUser(loggedInUser);
        setAuthState('authenticated');
        logAction('User Logged In', { userId: loggedInUser.name, role: loggedInUser.role });
        router.push('/dashboard');
      } catch (error) {
          console.error("Login failed", error);
          setAuthState('unauthenticated');
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
          toast({ variant: 'destructive', title: 'Login Failed', description: errorMessage });

      } finally {
          setIsLoading(false);
          setPendingCredentials(null);
      }
  }, [pendingCredentials, router, logAction, toast]);
  
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
        setPendingCredentials(null);
        router.push('/login');
    }
  }, [router, user, logAction]);

  return (
    <AuthContext.Provider value={{ user, authState, login, signup, logout, submitMfa, isLoading }}>
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
