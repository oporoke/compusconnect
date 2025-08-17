
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Hostel as PrismaHostel, Student as PrismaStudent } from '@prisma/client';
import { useToast } from './use-toast';
import { useStudents } from './use-students';

// Define a more detailed Room type for the frontend
export interface Room {
  id: string;
  number: string;
  capacity: number;
  occupants: string[]; // array of student IDs
}

// Define the Hostel type for the frontend, using the detailed Room type
export interface Hostel extends Omit<PrismaHostel, 'rooms'> {
  rooms: Room[];
}

interface HostelContextType {
  hostels: Hostel[];
  assignStudentToRoom: (hostelId: string, roomId: string, studentId: string) => void;
  getStudentById: (studentId: string) => PrismaStudent | undefined;
  isLoading: boolean;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { students } = useStudents(); // Use the existing student context

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
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchData]);

  const assignStudentToRoom = useCallback((hostelId: string, roomId: string, studentId: string) => {
    // This is a mock implementation. In a real app, this would be a POST/PUT request to an API endpoint.
    setHostels(prevHostels => {
      const newHostels = JSON.parse(JSON.stringify(prevHostels));
      const hostel = newHostels.find((h: Hostel) => h.id === hostelId);
      if (!hostel) return prevHostels;
      
      const room = hostel.rooms.find((r: any) => r.id === roomId);
      if (!room || room.occupants.length >= room.capacity) {
          toast({ variant: 'destructive', title: "Room Full", description: "Cannot assign student to a full room."});
          return prevHostels;
      }
      
      const alreadyAssigned = newHostels.some((h: Hostel) => h.rooms.some((r: any) => r.occupants.includes(studentId)));
      if (alreadyAssigned) {
          toast({ variant: 'destructive', title: "Already Assigned", description: "This student is already assigned to a room."});
          return prevHostels;
      }

      room.occupants.push(studentId);
      // In a real app, you would not persist to localStorage. This is for demo purposes.
      localStorage.setItem('campus-connect-hostels', JSON.stringify(newHostels));
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
