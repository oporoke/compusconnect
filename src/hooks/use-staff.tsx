
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Staff } from '@prisma/client';

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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        const { staff } = await import('@/lib/data');
        const storedStaff = localStorage.getItem('campus-connect-staff');
        setStaff(storedStaff ? JSON.parse(storedStaff) : staff);
    } catch(e) {
        console.error("Failed to load staff data", e);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const persistData = (data: Staff[]) => {
    localStorage.setItem('campus-connect-staff', JSON.stringify(data));
  };

  const addStaff = useCallback(async (staffData: Omit<Staff, 'id' | 'leavesTaken' | 'leavesAvailable' | 'performanceNotes' | 'schoolId' | 'taxDeduction' | 'insuranceDeduction'>) => {
    setStaff(prev => {
        const newStaff: Staff = {
            ...staffData,
            joiningDate: new Date(staffData.joiningDate),
            id: `T${(prev.length + 1).toString().padStart(2, '0')}`,
            leavesTaken: 0,
            leavesAvailable: 15,
            performanceNotes: '',
            taxDeduction: 12, // default
            insuranceDeduction: 400, // default
            schoolId: 'school-a' // default
        };
        const updatedStaff = [...prev, newStaff];
        persistData(updatedStaff);
        return updatedStaff;
    });
  }, []);
  
  const updateStaff = useCallback(async (updatedStaffMember: Staff) => {
    setStaff(prev => {
        const updatedStaff = prev.map(s => s.id === updatedStaffMember.id ? updatedStaffMember : s);
        persistData(updatedStaff);
        return updatedStaff;
    });
  }, []);

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

    