
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Student as PrismaStudent, Grade as PrismaGrade, Exam as PrismaExam, AttendanceRecord as PrismaAttendanceRecord, DisciplinaryRecord } from '@prisma/client';
import { useAuditLog } from './use-audit-log';
import { useToast } from './use-toast';

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
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateGrades: (newGrade: Omit<Grade, 'id'>) => void;
  logAttendance: (classId: string, studentStatuses: { studentId: string; present: boolean }[]) => void;
  getStudentById: (id: string) => Student | undefined;
  getGradesByStudentId: (id: string) => Grade[];
  getAttendanceByStudentId: (id: string) => AttendanceRecord[];
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logAction } = useAuditLog();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        const [studentsRes, gradesRes, examsRes, attendanceRes] = await Promise.all([
            fetch('/api/students'),
            fetch('/api/grades'),
            fetch('/api/exams'),
            fetch('/api/attendance')
        ]);

        if(!studentsRes.ok || !gradesRes.ok || !examsRes.ok || !attendanceRes.ok) {
            throw new Error('Failed to fetch initial data');
        }

        const studentsData = await studentsRes.json();
        const gradesData = await gradesRes.json();
        const examsData = await examsRes.json();
        const attendanceData = await attendanceRes.json();

        setStudents(studentsData);
        setGrades(gradesData);
        setExams(examsData);
        setAttendance(attendanceData);

    } catch (error) {
      console.error("Failed to fetch data from API", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addStudent = useCallback(async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'| 'discipline' | 'hostelRoomId'>) => {
    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData),
        });
        if (!response.ok) throw new Error('Failed to create student');
        const newStudent = await response.json();
        
        // Refetch student data to ensure UI is in sync with the database
        await fetchData();

        logAction('Student Created', { studentId: newStudent.id, studentName: newStudent.name });
        toast({
            title: "Student Created",
            description: `The profile for ${newStudent.name} has been successfully created.`,
        });
    } catch (error) {
        console.error(error);
         toast({
            variant: 'destructive',
            title: "Creation Failed",
            description: "Could not create the student profile.",
        });
    }
  }, [logAction, toast, fetchData]);
  
  const addExam = useCallback(async (examData: Omit<Exam, 'id'>) => {
    // This should be a POST to /api/exams
    toast({ title: "Mock Action", description: `Exam creation is not implemented.` });
  }, [toast]);

  const updateGrades = useCallback(async (newGrade: Omit<Grade, 'id'>) => {
    // This should be a POST to /api/grades
    toast({ title: "Mock Action", description: `Grade update is not implemented.` });
  }, [toast]);

  const logAttendance = useCallback(async (classId: string, studentStatuses: { studentId: string; present: boolean }[]) => {
    // This should be a POST to /api/attendance
    toast({ title: "Mock Action", description: `Attendance logging is not implemented.` });
  }, [toast]);

  const getStudentById = useCallback((id: string) => {
    return students.find(s => s.id === id);
  }, [students]);

  const getGradesByStudentId = useCallback((id: string) => {
    return grades.filter(g => g.studentId === id);
  }, [grades]);

  const getAttendanceByStudentId = useCallback((id: string) => {
    return attendance.filter(a => a.studentId === id);
  }, [attendance]);


  return (
    <StudentContext.Provider value={{ students, grades, exams, attendance, addStudent, addExam, updateGrades, logAttendance, getStudentById, getGradesByStudentId, getAttendanceByStudentId, isLoading }}>
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
