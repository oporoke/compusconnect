
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Admission, AdmissionRequirement } from '@/lib/data';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

interface AdmissionsContextType {
  applications: Admission[];
  admissionRequirements: AdmissionRequirement[];
  addApplication: (application: Omit<Admission, 'id' | 'status' | 'date' | 'documents'>) => void;
  updateApplicationStatus: (id: string, status: Admission['status']) => void;
  fetchAdmissionRequirements: () => void;
  isLoading: boolean;
}

const AdmissionsContext = createContext<AdmissionsContextType | undefined>(undefined);

export const AdmissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Admission[]>([]);
  const [admissionRequirements, setAdmissionRequirements] = useState<AdmissionRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuth();

  const fetchAdmissions = useCallback(async (signal: AbortSignal) => {
    if (authState !== 'authenticated' && authState !== 'unauthenticated') return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/admissions', { signal });
      if (!response.ok) {
        // Use console.log instead of console.error to avoid Next.js overlay
        console.log('Failed to fetch admissions from API.');
      }
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to fetch admissions:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load admissions data.' });
        setApplications([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, authState]);
  
  const fetchAdmissionRequirements = useCallback(async () => {
     try {
       const response = await fetch('/api/admission-requirements');
       if (!response.ok) throw new Error('Failed to fetch requirements');
       const data = await response.json();
       setAdmissionRequirements(data);
     } catch(e) {
        console.error(e);
        setAdmissionRequirements([]);
     }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchAdmissions(abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [fetchAdmissions]);

  const addApplication = useCallback(async (applicationData: Omit<Admission, 'id' | 'status' | 'date' | 'documents'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticApp: Admission = { 
        id: tempId, 
        ...applicationData, 
        status: 'Pending', 
        date: new Date(), 
        documents: [] 
    };
    setApplications(prev => [optimisticApp, ...prev]);
    try {
        const response = await fetch('/api/admissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(applicationData)
        });
        if (!response.ok) throw new Error("Server failed to add application");
        const newApp = await response.json();
        setApplications(prev => prev.map(a => a.id === tempId ? newApp : a));
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: "Submission Failed" });
        setApplications(prev => prev.filter(a => a.id !== tempId));
    }
  }, [toast]);
  
  const updateApplicationStatus = useCallback(async (id: string, status: Admission['status']) => {
    const originalApps = applications;
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    try {
        const response = await fetch('/api/admissions', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
        });
        if (!response.ok) throw new Error("Server failed to update status");
        toast({
            title: "Status Updated",
            description: `Application status has been changed to ${status}.`
        });
    } catch (error) {
        console.error(error);
        setApplications(originalApps);
        toast({ variant: 'destructive', title: "Update Failed" });
    }
  }, [applications, toast]);

  return (
    <AdmissionsContext.Provider value={{ applications, admissionRequirements, addApplication, updateApplicationStatus, fetchAdmissionRequirements, isLoading }}>
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
