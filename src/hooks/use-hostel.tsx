
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { hostels as initialHostels, students as initialStudents, Hostel, Student } from '@/lib/data';
import { useToast } from './use-toast';

interface HostelContextType {
  hostels: Hostel[];
  assignStudentToRoom: (hostelId: string, roomId: string, studentId: string) => void;
  getStudentById: (studentId: string) => Student | undefined;
  isLoading: boolean;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  // We need student data to display names, but we won't modify students here
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedHostels = localStorage.getItem('campus-connect-hostels');
      const storedStudents = localStorage.getItem('campus-connect-students');
      
      setHostels(storedHostels ? JSON.parse(storedHostels) : initialHostels);
      // Load students for display purposes
      setStudents(storedStudents ? JSON.parse(storedStudents) : initialStudents);

    } catch (error) {
      console.error("Failed to parse hostel data from localStorage", error);
      setHostels(initialHostels);
      setStudents(initialStudents);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistHostels = (data: Hostel[]) => {
    localStorage.setItem('campus-connect-hostels', JSON.stringify(data));
  };

  const assignStudentToRoom = useCallback((hostelId: string, roomId: string, studentId: string) => {
    setHostels(prevHostels => {
      const newHostels = JSON.parse(JSON.stringify(prevHostels));
      const hostel = newHostels.find((h: Hostel) => h.id === hostelId);
      if (!hostel) return prevHostels;
      
      const room = hostel.rooms.find((r: any) => r.id === roomId);
      if (!room || room.occupants.length >= room.capacity) {
          toast({ variant: 'destructive', title: "Room Full", description: "Cannot assign student to a full room."});
          return prevHostels;
      }
      
      // Prevent assigning a student who is already in a room
      const alreadyAssigned = newHostels.some((h: Hostel) => h.rooms.some((r: any) => r.occupants.includes(studentId)));
      if (alreadyAssigned) {
          toast({ variant: 'destructive', title: "Already Assigned", description: "This student is already assigned to a room."});
          return prevHostels;
      }

      room.occupants.push(studentId);
      persistHostels(newHostels);
      return newHostels;
    });
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
