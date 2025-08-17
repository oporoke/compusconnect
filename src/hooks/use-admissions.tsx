
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Admission } from '@/lib/data';
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

  useEffect(() => {
    const fetchAdmissions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admissions');
        if (!response.ok) throw new Error('Failed to fetch admissions');
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load admissions data.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmissions();
  }, [toast]);

  const addApplication = useCallback(async (applicationData: Omit<Admission, 'id' | 'status' | 'date' | 'documents'>) => {
    // This part should be implemented with a POST request to a new /api/admissions route
    // For now, we'll just update the local state to keep UI interactive
    const newApplication: Admission = {
      ...applicationData,
      id: `APP${(applications.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      documents: [],
    };
    setApplications(prev => [...prev, newApplication]);
    toast({ title: "Application Submitted", description: "Your application has been received (mock)." });
  }, [applications.length, toast]);
  
  const updateApplicationStatus = useCallback(async (id: string, status: Admission['status']) => {
    // This part should be implemented with a PUT request to /api/admissions/[id]
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    toast({ title: "Status Updated", description: `Application status has been changed to ${status} (mock).` });
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
