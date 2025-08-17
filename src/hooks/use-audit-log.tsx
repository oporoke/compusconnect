
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: Record<string, any>;
}

interface AuditLogContextType {
  logs: AuditLog[];
  logAction: (action: string, details?: Record<string, any>) => void;
  isLoading: boolean;
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

export const AuditLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem('campus-connect-audit-log');
      setLogs(storedLogs ? JSON.parse(storedLogs) : []);
    } catch (error) {
      console.error("Failed to parse audit logs from localStorage", error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistLogs = (data: AuditLog[]) => {
    localStorage.setItem('campus-connect-audit-log', JSON.stringify(data));
  };

  const logAction = useCallback((action: string, details: Record<string, any> = {}) => {
    setLogs(prev => {
        // In a real app, we'd get the user from the session on the server.
        // Here, we'll try to get it from details or localStorage as a fallback.
        let userName = details.userId || 'System';
        try {
            const storedUser = localStorage.getItem('campus-connect-user');
            if (storedUser) {
                userName = JSON.parse(storedUser).name;
            }
        } catch {}


        const newLog: AuditLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action,
            user: userName,
            details,
        };
        const updatedLogs = [newLog, ...prev];
        persistLogs(updatedLogs);
        return updatedLogs;
    });
  }, []);

  return (
    <AuditLogContext.Provider value={{ logs, logAction, isLoading }}>
      {children}
    </AuditLogContext.Provider>
  );
};

export const useAuditLog = () => {
  const context = useContext(AuditLogContext);
  if (context === undefined) {
    throw new Error('useAuditLog must be used within an AuditLogProvider');
  }
  return context;
};
