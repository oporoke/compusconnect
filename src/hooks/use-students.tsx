
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Student as PrismaStudent, Grade as PrismaGrade, Exam as PrismaExam, AttendanceRecord as PrismaAttendanceRecord, DisciplinaryRecord, Skill } from '@/lib/data';
import { useAuditLog } from './use-audit-log';
import { useToast } from './use-toast';
import { useLMS } from './use-lms';
import { useAuth } from './use-auth';

// Re-exporting Prisma types for client-side usage if needed
export interface Student extends PrismaStudent {
  discipline: DisciplinaryRecord[];
}
export type Grade = PrismaGrade;
export type Exam = PrismaExam;
export type AttendanceRecord = PrismaAttendanceRecord;

interface StudentContextType {
  students: Student[];
  grades: Grade[];
  exams: Exam[];
  attendance: AttendanceRecord[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'discipline' | 'hostelRoomId'>) => void;
  deleteStudent: (id: string) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateGrades: (newGrade: Omit<Grade, 'id'>) => void;
  logAttendance: (classId: string, studentStatuses: { studentId: string; present: boolean }[]) => void;
  getStudentById: (id: string) => Student | undefined;
  getGradesByStudentId: (id: string) => Grade[];
  getAttendanceByStudentId: (id: string) => AttendanceRecord[];
  getSkillsByStudentId: (id: string) => (Skill & { source: string })[];
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { logAction } = useAuditLog();
  const { toast } = useToast();
  const { assignments } = useLMS(); // Use LMS to get assignment data
  const { authState } = useAuth();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const [studentsRes, gradesRes, examsRes, attendanceRes] = await Promise.all([
        fetch('/api/students', { signal }),
        fetch('/api/grades', { signal }),
        fetch('/api/exams', { signal }),
        fetch('/api/attendance', { signal })
      ]);

      if (!studentsRes.ok || !gradesRes.ok || !examsRes.ok || !attendanceRes.ok) {
        throw new Error('Failed to fetch one or more student-related resources.');
      }

      setStudents(await studentsRes.json());
      setGrades(await gradesRes.json());
      setExams(await examsRes.json());
      setAttendance(await attendanceRes.json());

    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Failed to fetch data from API:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load student data.' });
        setStudents([]);
        setGrades([]);
        setExams([]);
        setAttendance([]);
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
        setStudents([]);
        setGrades([]);
        setExams([]);
        setAttendance([]);
        setIsLoading(false);
    }
  }, [fetchData, authState]);

  const addStudent = useCallback(async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'discipline' | 'hostelRoomId'>) => {
    try {
      const studentId = `S${Math.floor(1000 + Math.random() * 9000)}`;
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...studentData, id: studentId }),
      });
      if (!response.ok) throw new Error('Failed to create student');
      
      const newStudent = await response.json();
      setStudents(prev => [...prev, newStudent]);

      logAction('Student Created', { studentId: studentId, studentName: studentData.name });
      toast({
        title: "Student Created",
        description: `The profile for ${studentData.name} has been successfully created.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "Creation Failed",
        description: "Could not create the student profile.",
      });
    }
  }, [logAction, toast]);
  
  const deleteStudent = useCallback(async (id: string) => {
    const originalStudents = students;
    setStudents(prev => prev.filter(s => s.id !== id));
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete student');
      
      logAction('Student Deleted', { studentId: id });
      toast({
        title: "Student Deleted",
        description: `The student profile has been successfully deleted.`,
      });
    } catch (error) {
      console.error(error);
      setStudents(originalStudents);
      toast({
        variant: 'destructive',
        title: "Deletion Failed",
        description: "Could not delete the student profile.",
      });
    }
  }, [students, logAction, toast]);

  const addExam = useCallback((examData: Omit<Exam, 'id'>) => {
    toast({ title: 'Mock Action', description: `Exam creation is not implemented.` });
  }, [toast]);

  const updateGrades = useCallback((newGrade: Omit<Grade, 'id'>) => {
    toast({ title: "Mock Action", description: `Grade update is not implemented.` });
  }, [toast]);

  const logAttendance = useCallback((classId: string, studentStatuses: { studentId: string; present: boolean }[]) => {
    logAction("Attendance Logged", { classId, count: studentStatuses.length });
    toast({ title: "Mock Action", description: `Attendance logging is not implemented.` });
  }, [toast, logAction]);

  const getStudentById = useCallback((id: string) => {
    return students.find(s => s.id === id);
  }, [students]);

  const getGradesByStudentId = useCallback((id: string) => {
    return grades.filter(g => g.studentId === id);
  }, [grades]);

  const getAttendanceByStudentId = useCallback((id: string) => {
    return attendance.filter(a => a.studentId === id);
  }, [attendance]);

  const getSkillsByStudentId = useCallback((studentId: string) => {
    const studentGrades = getGradesByStudentId(studentId);
    if (!studentGrades) return [];
  
    // Map submitted/graded assignments to skills
    const acquiredSkills: Record<string, { level: number; source: string }> = {};
    assignments.forEach(assignment => {
      const isCompleted = assignment.status === 'Submitted' || assignment.status === 'Graded';
      if (isCompleted && assignment.skills) {
        (assignment.skills as unknown as string[]).forEach(skillName => {
          if (!acquiredSkills[skillName]) {
            acquiredSkills[skillName] = { level: 0, source: assignment.title };
          }
          acquiredSkills[skillName].level += 1; // Increment level for each completed assignment
        });
      }
    });
  
    return Object.entries(acquiredSkills).map(([name, data]) => ({
      name,
      level: Math.min(5, data.level), // Cap level at 5
      source: data.source,
      id: name, // Mock id
      studentId, // Mock studentId
    }));
  }, [getGradesByStudentId, assignments]);

  return (
    <StudentContext.Provider value={{ students, grades, exams, attendance, addStudent, deleteStudent, addExam, updateGrades, logAttendance, getStudentById, getGradesByStudentId, getAttendanceByStudentId, getSkillsByStudentId, isLoading }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
