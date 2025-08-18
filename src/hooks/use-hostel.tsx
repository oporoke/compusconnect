
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from './use-toast';
import { useStudents } from './use-students';
import { useAuth } from './use-auth';
import type { Hostel as HostelType, Student } from '@/lib/data';

interface HostelContextType {
  hostels: HostelType[];
  assignStudentToRoom: (hostelId: string, roomId: string, studentId: string) => void;
  getStudentById: (studentId: string) => Student | undefined;
  isLoading: boolean;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hostels, setHostels] = useState<HostelType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { students } = useStudents();
  const { authState } = useAuth();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hostels', { signal });
      if (!response.ok) {
        throw new Error('Failed to fetch hostel data from API.');
      }
      const data = await response.json();
      setHostels(data);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Failed to fetch hostel data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load hostel data.' });
        setHostels([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (authState === 'authenticated') {
      const controller = new AbortController();
      fetchData(controller.signal);
      return () => {
        controller.abort();
      };
    } else {
        setHostels([]);
        setIsLoading(false);
    }
  }, [fetchData, authState]);

  const assignStudentToRoom = useCallback((hostelId: string, roomId: string, studentId: string) => {
    // This is a mock implementation. In a real app, this would be a POST/PUT request to an API endpoint.
    toast({ title: 'Mock Action', description: `Room assignment is not implemented in this demo.` });
  }, [toast]);
  
  const getStudentById = useCallback((studentId: string) => {
      return students.find(s => s.id === studentId);
  }, [students]);

  return (
    <HostelContext.Provider value={{ hostels, assignStudentToRoom, getStudentById, isLoading }}>
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (context === undefined) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};
