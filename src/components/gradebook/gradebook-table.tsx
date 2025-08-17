
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { useStudents } from '@/hooks/use-students';
import type { Grade, Student, Exam } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type EditableGrade = {
    studentId: string;
    studentName: string;
    scores: Record<string, number>;
};

export function GradebookTable() {
    const { students, grades, exams, updateGrades, isLoading } = useStudents();
    const { toast } = useToast();
    
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [editableGrades, setEditableGrades] = useState<EditableGrade[]>([]);

    useEffect(() => {
        if (exams.length > 0 && !selectedExamId) {
            setSelectedExamId(exams[0].id);
        }
    }, [exams, selectedExamId]);

    useEffect(() => {
        if (selectedExamId) {
            const exam = exams.find(e => e.id === selectedExamId) || null;
            setSelectedExam(exam);

            const studentData = students.map(student => {
                const studentGrades = grades.find(g => g.studentId === student.id && g.examId === selectedExamId);
                const initialScores: Record<string, number> = {};
                if (exam) {
                    exam.subjects.forEach(subject => {
                        initialScores[subject] = studentGrades?.scores[subject] || 0;
                    });
                }

                return {
                    studentId: student.id,
                    studentName: student.name,
                    scores: initialScores,
                };
            });
            setEditableGrades(studentData);
        }
    }, [selectedExamId, students, grades, exams]);

    const handleGradeChange = (studentId: string, subject: string, value: string) => {
        const numericValue = Number(value);
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) return;

        setEditableGrades(currentGrades => 
            currentGrades.map(student => 
                student.studentId === studentId ? { ...student, scores: { ...student.scores, [subject]: numericValue } } : student
            )
        );
    };

    const handleSaveChanges = () => {
        if (!selectedExamId) return;
        
        editableGrades.forEach(studentGrade => {
            const gradeData: Grade = {
                studentId: studentGrade.studentId,
                examId: selectedExamId,
                scores: studentGrade.scores,
            };
            updateGrades(gradeData);
        });

        toast({
            title: "Grades Saved",
            description: `Grades for ${selectedExam?.name} have been successfully updated.`,
        });
    };
    
    const calculateAverage = (scores: Record<string, number>) => {
        const subjectScores = Object.values(scores);
        if (subjectScores.length === 0) return 'N/A';
        const total = subjectScores.reduce((acc, score) => acc + score, 0);
        return (total / subjectScores.length).toFixed(2);
    }

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Enter Student Grades</CardTitle>
                <CardDescription>Select an exam and enter the grades for each student. Remember to save your changes.</CardDescription>
                <div className="pt-4">
                    <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select an examination..." />
                        </SelectTrigger>
                        <SelectContent>
                            {exams.map(exam => (
                                <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {selectedExam ? (
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    {selectedExam.subjects.map(subject => (
                                        <TableHead key={subject} className="text-center">{subject}</TableHead>
                                    ))}
                                    <TableHead className="text-center">Average</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {editableGrades.map((student) => (
                                    <TableRow key={student.studentId}>
                                        <TableCell className="font-medium">{student.studentName}</TableCell>
                                        {selectedExam.subjects.map(subject => (
                                            <TableCell key={subject}>
                                                <Input 
                                                    type="number" 
                                                    value={student.scores[subject] || ''} 
                                                    onChange={(e) => handleGradeChange(student.studentId, subject, e.target.value)}
                                                    className="w-20 text-center mx-auto"
                                                />
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-center font-medium">{calculateAverage(student.scores)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : <p className="text-center text-muted-foreground">Please select an exam to enter grades.</p>}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={!selectedExam}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    );
}
