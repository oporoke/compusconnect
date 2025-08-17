
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { students as initialStudents, grades as initialGrades, Student, Grade } from '@/lib/data';

export interface AttendanceRecord {
    studentId: string;
    date: string; // YYYY-MM-DD
    present: boolean;
}

interface StudentContextType {
  students: Student[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateGrades: (newGrades: Grade[]) => void;
  logAttendance: (classId: string, studentStatuses: { studentId: string; present: boolean }[]) => void;
  getStudentById: (id: string) => Student | undefined;
  getGradesByStudentId: (id: string) => Grade | undefined;
  getAttendanceByStudentId: (id: string) => AttendanceRecord[];
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// Helper to generate a unique ID for new students
const generateStudentId = (existingStudents: Student[]): string => {
    const maxId = existingStudents.reduce((max, student) => {
        const idNum = parseInt(student.id.replace('S', ''), 10);
        return idNum > max ? idNum : max;
    }, 0);
    return `S${(maxId + 1).toString().padStart(3, '0')}`;
}

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem('campus-connect-students');
      const storedGrades = localStorage.getItem('campus-connect-grades');
      const storedAttendance = localStorage.getItem('campus-connect-attendance');
      
      setStudents(storedStudents ? JSON.parse(storedStudents) : initialStudents);
      setGrades(storedGrades ? JSON.parse(storedGrades) : initialGrades);
      setAttendance(storedAttendance ? JSON.parse(storedAttendance) : []);

    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      setStudents(initialStudents);
      setGrades(initialGrades);
      setAttendance([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistStudents = (data: Student[]) => {
    localStorage.setItem('campus-connect-students', JSON.stringify(data));
  };
  
  const persistGrades = (data: Grade[]) => {
    localStorage.setItem('campus-connect-grades', JSON.stringify(data));
  };

  const persistAttendance = (data: AttendanceRecord[]) => {
    localStorage.setItem('campus-connect-attendance', JSON.stringify(data));
  };

  const addStudent = useCallback((studentData: Omit<Student, 'id'>) => {
    setStudents(prevStudents => {
        const newStudent: Student = {
            ...studentData,
            id: generateStudentId(prevStudents),
        };
        const newStudents = [...prevStudents, newStudent];
        persistStudents(newStudents);

        setGrades(prevGrades => {
            const newGradeEntry: Grade = {
                studentId: newStudent.id,
                math: 0,
                science: 0,
                english: 0,
            };
            const newGrades = [...prevGrades, newGradeEntry];
            persistGrades(newGrades);
            return newGrades;
        });

        return newStudents;
    });
  }, []);
  
  const updateGrades = useCallback((newGrades: Grade[]) => {
    setGrades(currentGrades => {
        const updatedGrades = currentGrades.map(cg => {
            const incoming = newGrades.find(ng => ng.studentId === cg.studentId);
            return incoming ? incoming : cg;
        });
        persistGrades(updatedGrades);
        return updatedGrades;
    });
  }, []);

  const logAttendance = useCallback((classId: string, studentStatuses: { studentId: string; present: boolean }[]) => {
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    setAttendance(prevAttendance => {
      const otherDaysAttendance = prevAttendance.filter(att => att.date !== today);
      const newAttendanceForToday = studentStatuses.map(s => ({
        studentId: s.studentId,
        date: today,
        present: s.present,
      }));
      const updatedAttendance = [...otherDaysAttendance, ...newAttendanceForToday];
      persistAttendance(updatedAttendance);
      return updatedAttendance;
    });
  }, []);


  const getStudentById = useCallback((id: string) => {
    return students.find(s => s.id === id);
  }, [students]);

  const getGradesByStudentId = useCallback((id: string) => {
    return grades.find(g => g.studentId === id);
  }, [grades]);

  const getAttendanceByStudentId = useCallback((id: string) => {
    return attendance.filter(a => a.studentId === id);
  }, [attendance]);


  return (
    <StudentContext.Provider value={{ students, grades, attendance, addStudent, updateGrades, logAttendance, getStudentById, getGradesByStudentId, getAttendanceByStudentId, isLoading }}>
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
