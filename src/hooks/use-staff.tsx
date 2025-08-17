
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

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/staff');
            if(!res.ok) throw new Error("Failed to fetch staff data");
            const data = await res.json();
            setStaff(data);
        } catch(e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load staff data.' });
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [toast]);


  const addStaff = useCallback(async (staffData: Omit<Staff, 'id' | 'leavesTaken' | 'leavesAvailable' | 'performanceNotes' | 'schoolId' | 'taxDeduction' | 'insuranceDeduction'>) => {
    // This should be a POST request to /api/staff
    toast({ title: "Staff Member Added (Mock)", description: `The profile for ${staffData.name} has been created.` });
  }, [toast]);
  
  const updateStaff = useCallback(async (updatedStaffMember: Staff) => {
     // This should be a PUT request to /api/staff/[id]
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
