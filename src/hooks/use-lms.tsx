
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Assignment, CourseMaterial, OnlineClass, Badge, DiscussionThread, DiscussionReply } from '@prisma/client';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

type ThreadWithReplies = DiscussionThread & { replies: DiscussionReply[] };

interface LMSContextType {
  assignments: Assignment[];
  courseMaterials: CourseMaterial[];
  onlineClasses: OnlineClass[];
  badges: Badge[];
  threads: ThreadWithReplies[];
  submitAssignment: (assignmentId: string) => void;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'status'>) => void;
  addCourseMaterial: (material: Omit<CourseMaterial, 'id'>) => void;
  addOnlineClass: (onlineClass: Omit<OnlineClass, 'id'>) => void;
  postReply: (threadId: string, content: string, authorName: string) => void;
  isLoading: boolean;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const LMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>([]);
  const [onlineClasses, setOnlineClasses] = useState<OnlineClass[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [threads, setThreads] = useState<ThreadWithReplies[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuth();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const [assRes, matRes, clsRes, badgeRes, threadRes] = await Promise.all([
        fetch('/api/lms/assignments', { signal }),
        fetch('/api/lms/materials', { signal }),
        fetch('/api/lms/classes', { signal }),
        fetch('/api/lms/badges', { signal }),
        fetch('/api/lms/threads', { signal }),
      ]);
      if (!assRes.ok || !matRes.ok || !clsRes.ok || !badgeRes.ok || !threadRes.ok) {
        throw new Error('Failed to fetch LMS data');
      }

      setAssignments(await assRes.json());
      setCourseMaterials(await matRes.json());
      setOnlineClasses(await clsRes.json());
      setBadges(await badgeRes.json());
      setThreads(await threadRes.json());
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Failed to load LMS data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load LMS data.' });
        setAssignments([]);
        setCourseMaterials([]);
        setOnlineClasses([]);
        setBadges([]);
        setThreads([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (authState === 'authenticated') {
      const abortController = new AbortController();
      fetchData(abortController.signal);
      return () => {
          abortController.abort();
      }
    } else {
        setAssignments([]);
        setCourseMaterials([]);
        setOnlineClasses([]);
        setBadges([]);
        setThreads([]);
        setIsLoading(false);
    }
  }, [fetchData, authState]);

  const submitAssignment = useCallback(async (assignmentId: string) => {
    // Optimistic update
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'Submitted' } : a));
    try {
        // API call to persist
        // await fetch(`/api/lms/assignments/${assignmentId}/submit`, { method: 'POST' });
        toast({ title: "Assignment Submitted", description: "Your assignment has been submitted." });
    } catch (error) {
        // Revert on error
        setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'Pending' } : a));
        toast({ variant: 'destructive', title: "Submission Failed" });
    }
  }, [toast]);

  const addAssignment = useCallback(async (data: Omit<Assignment, 'id' | 'status'>) => {
    // API call would go here
    const newAssignment = { ...data, id: `AS${Date.now()}`, status: 'Pending' as const };
    setAssignments(prev => [...prev, newAssignment]);
    toast({ title: 'Assignment Created', description: `The assignment "${data.title}" has been created.` });
  }, [toast]);

  const addCourseMaterial = useCallback(async (data: Omit<CourseMaterial, 'id'>) => {
    // API call
    toast({ title: 'Course Material Added' });
  }, [toast]);

  const addOnlineClass = useCallback(async (data: Omit<OnlineClass, 'id'>) => {
    // API call
    toast({ title: 'Online Class Scheduled' });
  }, [toast]);
  
  const postReply = useCallback(async (threadId: string, content: string, authorName: string) => {
    // Optimistic update
    const newReply = { id: `temp-${Date.now()}`, threadId, authorName, content, createdAt: new Date() };
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t));
    
    // API Call
    // This is a mock. A real implementation would send to a proper endpoint.
    toast({ title: "Reply Posted" });
  }, [toast]);

  return (
    <LMSContext.Provider value={{ assignments, courseMaterials, onlineClasses, badges, threads, submitAssignment, addAssignment, addCourseMaterial, addOnlineClass, postReply, isLoading }}>
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
