
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Assignment, CourseMaterial, OnlineClass } from '@prisma/client';
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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        const { assignments, courseMaterials, onlineClasses } = await import('@/lib/data');
        const storedAssignments = localStorage.getItem('campus-connect-assignments');
        const storedCourseMaterials = localStorage.getItem('campus-connect-courseMaterials');
        const storedOnlineClasses = localStorage.getItem('campus-connect-onlineClasses');

        setAssignments(storedAssignments ? JSON.parse(storedAssignments) : assignments);
        setCourseMaterials(storedCourseMaterials ? JSON.parse(storedCourseMaterials) : courseMaterials);
        setOnlineClasses(storedOnlineClasses ? JSON.parse(storedOnlineClasses) : onlineClasses);
    } catch(e) {
        console.error("Failed to load LMS data", e);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const persistData = (key: string, data: any) => {
    localStorage.setItem(`campus-connect-${key}`, JSON.stringify(data));
  };
  
  const submitAssignment = useCallback(async (assignmentId: string) => {
    setAssignments(prev => {
        const updated = prev.map(a => a.id === assignmentId ? { ...a, status: 'Submitted' } : a);
        persistData('assignments', updated);
        return updated;
    });
    toast({
        title: "Assignment Submitted",
        description: "Your assignment has been submitted successfully.",
    });
  }, [toast]);

  const addAssignment = useCallback(async (data: Omit<Assignment, 'id' | 'status'>) => {
    setAssignments(prev => {
        const newAssignment: Assignment = { ...data, id: `AS${Date.now()}`, status: 'Pending' };
        const updated = [...prev, newAssignment];
        persistData('assignments', updated);
        toast({ title: 'Assignment Created', description: `The assignment "${data.title}" has been created.` });
        return updated;
    })
  }, [toast]);

  const addCourseMaterial = useCallback(async (data: Omit<CourseMaterial, 'id'>) => {
    setCourseMaterials(prev => {
        const newMaterial: CourseMaterial = { ...data, id: `CM${Date.now()}`};
        const updated = [...prev, newMaterial];
        persistData('courseMaterials', updated);
        toast({ title: 'Course Material Added' });
        return updated;
    });
  }, [toast]);

  const addOnlineClass = useCallback(async (data: Omit<OnlineClass, 'id'>) => {
    setOnlineClasses(prev => {
        const newClass: OnlineClass = { ...data, id: `OC${Date.now()}`};
        const updated = [...prev, newClass];
        persistData('onlineClasses', updated);
        toast({ title: 'Online Class Scheduled' });
        return updated;
    });
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

    