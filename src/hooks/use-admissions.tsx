
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Admission } from '@prisma/client';
import { useToast } from './use-toast';

interface AdmissionsContextType {
  applications: Admission[];
  addApplication: (application: Omit<Admission, 'id' | 'status' | 'date' | 'documents'>) => void;
  updateApplicationStatus: (id: string, status: Admission['status']) => void;
  isLoading: boolean;
}

const AdmissionsContext = createContext<AdmissionsContextType | undefined>(undefined);

export const AdmissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdmissions = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admissions', { signal });
      if (!response.ok) {
        throw new Error('Failed to fetch admissions from API.');
      }
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to fetch admissions:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load admissions data.' });
        setApplications([]); // Reset to a safe state
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchAdmissions(abortController.signal);

    return () => {
      abortController.abort(); // Cancel the fetch request on component unmount
    };
  }, [fetchAdmissions]);

  const addApplication = useCallback(async (applicationData: Omit<Admission, 'id' | 'status' | 'date' | 'documents'>) => {
    toast({ title: "Mock Action", description: `Application submission is not implemented.` });
  }, [toast]);
  
  const updateApplicationStatus = useCallback(async (id: string, status: Admission['status']) => {
    toast({ title: "Mock Action", description: `Status update is not implemented.` });
  }, [toast]);

  return (
    <AdmissionsContext.Provider value={{ applications, addApplication, updateApplicationStatus, isLoading }}>
      {children}
    </AdmissionsContext.Provider>
  );
};

export const useAdmissions = () => {
  const context = useContext(AdmissionsContext);
  if (context === undefined) {
    throw new Error('useAdmissions must be used within an AdmissionsProvider');
  }
  return context;
};
