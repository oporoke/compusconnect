
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { admissions as initialAdmissions, Admission } from '@/lib/data';

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

  // This hook will now fetch from an API route
  useEffect(() => {
    const fetchAdmissions = async () => {
      setIsLoading(true);
      // In a real app:
      // const response = await fetch('/api/admissions');
      // const data = await response.json();
      // setApplications(data);
      // For now, we continue using mock data as the API doesn't exist yet
      setApplications(initialAdmissions);
      setIsLoading(false);
    };
    fetchAdmissions();
  }, []);

  const addApplication = useCallback(async (applicationData: Omit<Admission, 'id' | 'status' | 'date' | 'documents'>) => {
    // In a real app:
    // const response = await fetch('/api/admissions', { method: 'POST', body: JSON.stringify(applicationData) });
    // const newApplication = await response.json();
    // setApplications(prev => [...prev, newApplication]);

    // Mock implementation:
     const newApplication: Admission = {
        ...applicationData,
        id: `APP${(applications.length + 1).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        documents: [],
      };
    setApplications(prev => [...prev, newApplication]);
  }, [applications.length]);
  
  const updateApplicationStatus = useCallback(async (id: string, status: Admission['status']) => {
    // In a real app:
    // const response = await fetch(`/api/admissions/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    // const updatedApplication = await response.json();
    // setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app));

    // Mock implementation:
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
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
