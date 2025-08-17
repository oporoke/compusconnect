
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { staff as initialStaff, Staff } from '@/lib/data';

interface StaffContextType {
  staff: Staff[];
  addStaff: (staffMember: Omit<Staff, 'id'>) => void;
  getStaffById: (id: string) => Staff | undefined;
  isLoading: boolean;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

const generateStaffId = (existingStaff: Staff[]): string => {
    const maxId = existingStaff.reduce((max, staff) => {
        const idNum = parseInt(staff.id.replace('T', ''), 10);
        return idNum > max ? idNum : max;
    }, 0);
    return `T${(maxId + 1).toString().padStart(2, '0')}`;
}

export const StaffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedStaff = localStorage.getItem('campus-connect-staff');
      setStaff(storedStaff ? JSON.parse(storedStaff) : initialStaff);
    } catch (error) {
      console.error("Failed to parse staff data from localStorage", error);
      setStaff(initialStaff);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistStaff = (data: Staff[]) => {
    localStorage.setItem('campus-connect-staff', JSON.stringify(data));
  };

  const addStaff = useCallback((staffData: Omit<Staff, 'id'>) => {
    setStaff(prevStaff => {
        const newStaffMember: Staff = {
            ...staffData,
            id: generateStaffId(prevStaff),
        };
        const newStaff = [...prevStaff, newStaffMember];
        persistStaff(newStaff);
        return newStaff;
    });
  }, []);

  const getStaffById = useCallback((id: string) => {
    return staff.find(s => s.id === id);
  }, [staff]);

  return (
    <StaffContext.Provider value={{ staff, addStaff, getStaffById, isLoading }}>
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
