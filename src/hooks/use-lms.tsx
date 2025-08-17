
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

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [assRes, matRes, clsRes] = await Promise.all([
                fetch('/api/lms/assignments'),
                fetch('/api/lms/materials'),
                fetch('/api/lms/classes'),
            ]);
            if(!assRes.ok || !matRes.ok || !clsRes.ok) {
                console.error('Failed to fetch LMS data');
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load LMS data.' });
                setAssignments([]);
                setCourseMaterials([]);
                setOnlineClasses([]);
                setIsLoading(false);
                return;
            }
            
            const assData = await assRes.json();
            const matData = await matRes.json();
            const clsData = await clsRes.json();
            
            setAssignments(assData);
            setCourseMaterials(matData);
            setOnlineClasses(clsData);
        } catch(e) {
            console.error("Failed to load LMS data", e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load LMS data.' });
            setAssignments([]);
            setCourseMaterials([]);
            setOnlineClasses([]);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [toast]);
  
  const submitAssignment = useCallback(async (assignmentId: string) => {
    // This should be a POST to /api/lms/assignments/[id]/submit
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'Submitted' } : a));
    toast({ title: "Assignment Submitted (Mock)", description: "Your assignment has been submitted." });
  }, [toast]);

  const addAssignment = useCallback(async (data: Omit<Assignment, 'id' | 'status'>) => {
    // This should be a POST to /api/lms/assignments
     toast({ title: 'Assignment Created (Mock)', description: `The assignment "${data.title}" has been created.` });
  }, [toast]);

  const addCourseMaterial = useCallback(async (data: Omit<CourseMaterial, 'id'>) => {
    // This should be a POST to /api/lms/materials
     toast({ title: 'Course Material Added (Mock)' });
  }, [toast]);

  const addOnlineClass = useCallback(async (data: Omit<OnlineClass, 'id'>) => {
    // This should be a POST to /api/lms/classes
    toast({ title: 'Online Class Scheduled (Mock)' });
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
