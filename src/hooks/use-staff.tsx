
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Staff } from '@prisma/client';
import { useToast } from './use-toast';

interface StaffContextType {
  staff: Staff[];
  addStaff: (staffMember: Omit<Staff, 'id' | 'leavesTaken' | 'leavesAvailable' | 'performanceNotes' | 'schoolId' | 'taxDeduction' | 'insuranceDeduction' >) => void;
  updateStaff: (staffMember: Staff) => void;
  getStaffById: (id: string) => Staff | undefined;
  isLoading: boolean;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/staff', { signal });
      if (!res.ok) {
        throw new Error("Failed to fetch staff data from API.");
      }
      const data = await res.json();
      setStaff(data);
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load staff data.' });
        setStaff([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController.signal);
    return () => {
        abortController.abort();
    }
  }, [fetchData]);

  const addStaff = useCallback(async (staffData: Omit<Staff, 'id' | 'leavesTaken' | 'leavesAvailable' | 'performanceNotes' | 'schoolId' | 'taxDeduction' | 'insuranceDeduction'>) => {
    toast({ title: "Staff Member Added (Mock)", description: `The profile for ${staffData.name} has been created.` });
  }, [toast]);
  
  const updateStaff = useCallback(async (updatedStaffMember: Staff) => {
     setStaff(prev => prev.map(s => s.id === updatedStaffMember.id ? updatedStaffMember : s));
     toast({ title: 'Staff Updated (Mock)', description: `${updatedStaffMember.name}'s profile has been updated.` });
  }, [toast]);

  const getStaffById = useCallback((id: string) => {
    return staff.find(s => s.id === id);
  }, [staff]);

  return (
    <StaffContext.Provider value={{ staff, addStaff, updateStaff, getStaffById, isLoading }}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};
