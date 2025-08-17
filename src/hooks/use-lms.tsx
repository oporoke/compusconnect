
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Assignment, CourseMaterial, OnlineClass } from '@/lib/data';
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

  const fetchData = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const [assRes, matRes, clsRes] = await Promise.all([
        fetch('/api/lms/assignments', { signal }),
        fetch('/api/lms/materials', { signal }),
        fetch('/api/lms/classes', { signal }),
      ]);
      if (!assRes.ok || !matRes.ok || !clsRes.ok) {
        throw new Error('Failed to fetch LMS data');
      }

      setAssignments(await assRes.json());
      setCourseMaterials(await matRes.json());
      setOnlineClasses(await clsRes.json());
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Failed to load LMS data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load LMS data.' });
        setAssignments([]);
        setCourseMaterials([]);
        setOnlineClasses([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController.signal);
    return () => {
        abortController.abort();
    }
  }, [fetchData]);

  const submitAssignment = useCallback(async (assignmentId: string) => {
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'Submitted' } : a));
    toast({ title: "Assignment Submitted (Mock)", description: "Your assignment has been submitted." });
  }, [toast]);

  const addAssignment = useCallback(async (data: Omit<Assignment, 'id' | 'status'>) => {
    const newAssignment = { ...data, id: `AS${Date.now()}`, status: 'Pending' as const };
    setAssignments(prev => [...prev, newAssignment]);
    toast({ title: 'Assignment Created (Mock)', description: `The assignment "${data.title}" has been created.` });
  }, [toast]);

  const addCourseMaterial = useCallback(async (data: Omit<CourseMaterial, 'id'>) => {
    toast({ title: 'Course Material Added (Mock)' });
  }, [toast]);

  const addOnlineClass = useCallback(async (data: Omit<OnlineClass, 'id'>) => {
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
