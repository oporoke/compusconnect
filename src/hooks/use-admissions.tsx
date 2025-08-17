
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { admissions as initialAdmissions, Admission } from '@/lib/data';

interface AdmissionsContextType {
  applications: Admission[];
  addApplication: (application: Omit<Admission, 'id' | 'status' | 'date'>) => void;
  updateApplicationStatus: (id: string, status: Admission['status']) => void;
  isLoading: boolean;
}

const AdmissionsContext = createContext<AdmissionsContextType | undefined>(undefined);

export const AdmissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAdmissions = localStorage.getItem('campus-connect-admissions');
      setApplications(storedAdmissions ? JSON.parse(storedAdmissions) : initialAdmissions);
    } catch (error) {
      console.error("Failed to parse admissions data from localStorage", error);
      setApplications(initialAdmissions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistApplications = (data: Admission[]) => {
    localStorage.setItem('campus-connect-admissions', JSON.stringify(data));
  };

  const addApplication = useCallback((applicationData: Omit<Admission, 'id' | 'status' | 'date'>) => {
    setApplications(prev => {
      const newApplication: Admission = {
        ...applicationData,
        id: `APP${(prev.length + 1).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };
      const newApplications = [...prev, newApplication];
      persistApplications(newApplications);
      return newApplications;
    });
  }, []);
  
  const updateApplicationStatus = useCallback((id: string, status: Admission['status']) => {
    setApplications(prev => {
        const newApplications = prev.map(app => app.id === id ? { ...app, status } : app);
        persistApplications(newApplications);
        return newApplications;
    });
  }, []);

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
