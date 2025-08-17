
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { students as initialStudents, grades as initialGrades, Student, Grade } from '@/lib/data';

interface StudentContextType {
  students: Student[];
  grades: Grade[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateGrades: (newGrades: Grade[]) => void;
  getStudentById: (id: string) => Student | undefined;
  getGradesByStudentId: (id: string) => Grade | undefined;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem('campus-connect-students');
      const storedGrades = localStorage.getItem('campus-connect-grades');
      
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      } else {
        setStudents(initialStudents);
      }

      if (storedGrades) {
        setGrades(JSON.parse(storedGrades));
      } else {
        setGrades(initialGrades);
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      setStudents(initialStudents);
      setGrades(initialGrades);
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

  const addStudent = useCallback((studentData: Omit<Student, 'id'>) => {
    setStudents(prevStudents => {
        const newStudent: Student = {
            ...studentData,
            id: generateStudentId(prevStudents),
        };
        const newStudents = [...prevStudents, newStudent];
        persistStudents(newStudents);

        // Also add a default grade entry for the new student
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
    setGrades(newGrades);
    persistGrades(newGrades);
  }, []);

  const getStudentById = useCallback((id: string) => {
    return students.find(s => s.id === id);
  }, [students]);

  const getGradesByStudentId = useCallback((id: string) => {
    return grades.find(g => g.studentId === id);
  }, [grades]);


  return (
    <StudentContext.Provider value={{ students, grades, addStudent, updateGrades, getStudentById, getGradesByStudentId, isLoading }}>
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
