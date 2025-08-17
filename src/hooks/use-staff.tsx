
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { staff as initialStaff, Staff } from '@/lib/data';

interface StaffContextType {
  staff: Staff[];
  addStaff: (staffMember: Omit<Staff, 'id' | 'leavesTaken' | 'leavesAvailable' | 'performanceNotes' | 'schoolId' | 'deductions'>) => void;
  updateStaff: (staffMember: Staff) => void;
  getStaffById: (id: string) => Staff | undefined;
  isLoading: boolean;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This hook will now fetch from an API route
  useEffect(() => {
    const fetchStaff = async () => {
        setIsLoading(true);
        // const response = await fetch('/api/staff');
        // const data = await response.json();
        // setStaff(data);
        setStaff(initialStaff);
        setIsLoading(false);
    }
    fetchStaff();
  }, []);

  const addStaff = useCallback(async (staffData: Omit<Staff, 'id' | 'leavesTaken' | 'leavesAvailable' | 'performanceNotes' | 'schoolId' | 'deductions'>) => {
    // API call to POST /api/staff
  }, []);
  
  const updateStaff = useCallback(async (updatedStaffMember: Staff) => {
    // API call to PUT /api/staff/:id
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
