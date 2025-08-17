
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
    assignments as initialAssignments, 
    courseMaterials as initialCourseMaterials, 
    onlineClasses as initialOnlineClasses, 
    Assignment, 
    CourseMaterial, 
    OnlineClass 
} from '@/lib/data';
import { useToast } from './use-toast';

interface LMSContextType {
  assignments: Assignment[];
  courseMaterials: CourseMaterial[];
  onlineClasses: OnlineClass[];
  submitAssignment: (assignmentId: string) => void;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'status'>) => void;
  addCourseMaterial: (material: Omit<CourseMaterial, 'id'>) => void;
  addOnlineClass: (onlineClass: Omit<OnlineClass, 'id'>) => void;
  isLoading: boolean;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const LMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>([]);
  const [onlineClasses, setOnlineClasses] = useState<OnlineClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // This hook will now fetch from an API route
  useEffect(() => {
    const fetchLMSData = async () => {
        setIsLoading(true);
        // ... API calls to fetch assignments, materials, etc.
        setAssignments(initialAssignments);
        setCourseMaterials(initialCourseMaterials);
        setOnlineClasses(initialOnlineClasses);
        setIsLoading(false);
    }
    fetchLMSData();
  }, []);
  
  const submitAssignment = useCallback(async (assignmentId: string) => {
    // API call to POST /api/assignments/:id/submit
  }, []);

  const addAssignment = useCallback(async (data: Omit<Assignment, 'id' | 'status'>) => {
    // API call to POST /api/assignments
  }, []);

  const addCourseMaterial = useCallback(async (data: Omit<CourseMaterial, 'id'>) => {
    // API call to POST /api/materials
  }, []);

  const addOnlineClass = useCallback(async (data: Omit<OnlineClass, 'id'>) => {
    // API call to POST /api/online-classes
  }, []);


  return (
    <LMSContext.Provider value={{ assignments, courseMaterials, onlineClasses, submitAssignment, addAssignment, addCourseMaterial, addOnlineClass, isLoading }}>
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (context === undefined) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
