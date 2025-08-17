
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
        if (!response.ok) {
            console.error('Failed to fetch admissions');
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load admissions data.' });
            setApplications([]);
            return;
        };
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load admissions data.' });
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmissions();
  }, [toast]);

  const addApplication = useCallback(async (applicationData: Omit<Admission, 'id' | 'status' | 'date' | 'documents'>) => {
    // This part should be implemented with a POST request to a new /api/admissions route
    toast({ title: "Mock Action", description: `Application submission is not implemented.` });
  }, [toast]);
  
  const updateApplicationStatus = useCallback(async (id: string, status: Admission['status']) => {
    // This part should be implemented with a PUT request to /api/admissions/[id]
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
