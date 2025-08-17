
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

  useEffect(() => {
    try {
      const storedAssignments = localStorage.getItem('campus-connect-assignments');
      const storedCourseMaterials = localStorage.getItem('campus-connect-course-materials');
      const storedOnlineClasses = localStorage.getItem('campus-connect-online-classes');
      
      setAssignments(storedAssignments ? JSON.parse(storedAssignments) : initialAssignments);
      setCourseMaterials(storedCourseMaterials ? JSON.parse(storedCourseMaterials) : initialCourseMaterials);
      setOnlineClasses(storedOnlineClasses ? JSON.parse(storedOnlineClasses) : initialOnlineClasses);

    } catch (error) {
      console.error("Failed to parse LMS data from localStorage", error);
      setAssignments(initialAssignments);
      setCourseMaterials(initialCourseMaterials);
      setOnlineClasses(initialOnlineClasses);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistAssignments = (data: Assignment[]) => {
    localStorage.setItem('campus-connect-assignments', JSON.stringify(data));
  };
  
  const persistCourseMaterials = (data: CourseMaterial[]) => {
    localStorage.setItem('campus-connect-course-materials', JSON.stringify(data));
  };

  const persistOnlineClasses = (data: OnlineClass[]) => {
    localStorage.setItem('campus-connect-online-classes', JSON.stringify(data));
  };
  
  const submitAssignment = useCallback((assignmentId: string) => {
    setAssignments(prev => {
        const newAssignments = prev.map(a => a.id === assignmentId ? { ...a, status: 'Submitted' as const } : a);
        persistAssignments(newAssignments);
        toast({ title: "Assignment Submitted", description: "Your assignment has been marked as submitted." });
        return newAssignments;
    });
  }, [toast]);

  const addAssignment = useCallback((data: Omit<Assignment, 'id' | 'status'>) => {
    setAssignments(prev => {
        const newAssignment: Assignment = {
            ...data,
            id: `AS${prev.length + 1}`,
            status: 'Pending',
        }
        const newAssignments = [...prev, newAssignment];
        persistAssignments(newAssignments);
        toast({ title: "Assignment Created", description: "The new assignment has been added." });
        return newAssignments;
    })
  }, [toast]);

  const addCourseMaterial = useCallback((data: Omit<CourseMaterial, 'id'>) => {
    setCourseMaterials(prev => {
        const newMaterial: CourseMaterial = {
            ...data,
            id: `CM${prev.length + 1}`,
        }
        const newMaterials = [...prev, newMaterial];
        persistCourseMaterials(newMaterials);
        toast({ title: "Course Material Added", description: "The new material is now available." });
        return newMaterials;
    })
  }, [toast]);

  const addOnlineClass = useCallback((data: Omit<OnlineClass, 'id'>) => {
    setOnlineClasses(prev => {
        const newClass: OnlineClass = {
            ...data,
            id: `OC${prev.length + 1}`,
        }
        const newClasses = [...prev, newClass];
        persistOnlineClasses(newClasses);
        toast({ title: "Online Class Scheduled", description: "The new class has been added to the schedule." });
        return newClasses;
    })
  }, [toast]);


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
