

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { students as initialStudents, grades as initialGrades, Student, Grade, exams as initialExams, Exam } from '@/lib/data';
import { generateMockStudents } from '@/lib/mockData';

export interface AttendanceRecord {
    studentId: string;
    date: string; // YYYY-MM-DD
    present: boolean;
}

interface StudentContextType {
  students: Student[];
  grades: Grade[];
  exams: Exam[];
  attendance: AttendanceRecord[];
  addStudent: (student: Omit<Student, 'id' | 'discipline'>) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateGrades: (newGrade: Grade) => void;
  logAttendance: (classId: string, studentStatuses: { studentId: string; present: boolean }[]) => void;
  getStudentById: (id: string) => Student | undefined;
  getGradesByStudentId: (id: string) => Grade[];
  getAttendanceByStudentId: (id: string) => AttendanceRecord[];
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const generateStudentId = (existingStudents: Student[]): string => {
    const maxId = existingStudents.reduce((max, student) => {
        const idNum = parseInt(student.id.replace('S', ''), 10);
        return idNum > max ? idNum : max;
    }, 0);
    return `S${(maxId + 1).toString().padStart(3, '0')}`;
}

const generateExamId = (existingExams: Exam[]): string => {
    const maxId = existingExams.reduce((max, exam) => {
        const idNum = parseInt(exam.id.replace('E', ''), 10);
        return idNum > max ? idNum : max;
    }, 0);
    return `E${(maxId + 1).toString().padStart(2, '0')}`;
}

const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (useMockData) {
          const mockData = generateMockStudents(50);
          setStudents(mockData.students);
          setGrades(mockData.grades);
          setExams(mockData.exams);
          setAttendance(mockData.attendance);
      } else {
          const storedStudents = localStorage.getItem('campus-connect-students');
          const storedGrades = localStorage.getItem('campus-connect-grades');
          const storedExams = localStorage.getItem('campus-connect-exams');
          const storedAttendance = localStorage.getItem('campus-connect-attendance');
          
          setStudents(storedStudents ? JSON.parse(storedStudents) : initialStudents);
          setGrades(storedGrades ? JSON.parse(storedGrades) : initialGrades);
          setExams(storedExams ? JSON.parse(storedExams) : initialExams);
          setAttendance(storedAttendance ? JSON.parse(storedAttendance) : []);
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      setStudents(initialStudents);
      setGrades(initialGrades);
      setExams(initialExams);
      setAttendance([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistStudents = (data: Student[]) => {
    if (useMockData) return;
    localStorage.setItem('campus-connect-students', JSON.stringify(data));
  };
  
  const persistGrades = (data: Grade[]) => {
    if (useMockData) return;
    localStorage.setItem('campus-connect-grades', JSON.stringify(data));
  };

  const persistExams = (data: Exam[]) => {
     if (useMockData) return;
    localStorage.setItem('campus-connect-exams', JSON.stringify(data));
  };

  const persistAttendance = (data: AttendanceRecord[]) => {
    if (useMockData) return;
    localStorage.setItem('campus-connect-attendance', JSON.stringify(data));
  };

  const addStudent = useCallback((studentData: Omit<Student, 'id' | 'discipline'>) => {
    setStudents(prevStudents => {
        const newStudent: Student = {
            ...studentData,
            id: generateStudentId(prevStudents),
        };
        const newStudents = [...prevStudents, newStudent];
        persistStudents(newStudents);
        return newStudents;
    });
  }, []);
  
  const addExam = useCallback((examData: Omit<Exam, 'id'>) => {
    setExams(prevExams => {
        const newExam: Exam = {
            ...examData,
            id: generateExamId(prevExams),
        };
        const newExams = [...prevExams, newExam];
        persistExams(newExams);
        return newExams;
    });
  }, []);

  const updateGrades = useCallback((newGrade: Grade) => {
    setGrades(currentGrades => {
        const index = currentGrades.findIndex(g => g.studentId === newGrade.studentId && g.examId === newGrade.examId);
        let updatedGrades;
        if (index > -1) {
            updatedGrades = [...currentGrades];
            updatedGrades[index] = newGrade;
        } else {
            updatedGrades = [...currentGrades, newGrade];
        }
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
