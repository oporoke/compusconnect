
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Save, Search, History } from 'lucide-react';
import { useStudents } from '@/hooks/use-students';
import type { Grade, Student, Exam } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useAuditLog } from '@/hooks/use-audit-log';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

type EditableGrade = {
    studentId: string;
    studentName: string;
    scores: Record<string, number | Record<string, number>>; // Can be a single score or question-level scores
};

export function GradebookTable() {
    const { students, grades, exams, updateGrades, isLoading } = useStudents();
    const { logAction } = useAuditLog();
    const { toast } = useToast();
    
    // Mock school level for demo
    const schoolLevel = 'High School'; // Can be 'Primary' or 'High School'

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
                const initialScores: Record<string, number | Record<string, number>> = {};
                if (exam) {
                    exam.subjects.forEach(subject => {
                        const score = studentGrades?.scores[subject];
                        if (schoolLevel === 'High School' && typeof score !== 'number') {
                             initialScores[subject] = score || {}; // Keep as object for question-level
                        } else {
                            initialScores[subject] = typeof score === 'number' ? score : 0; // Use single score
                        }
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
    }, [selectedExamId, students, grades, exams, schoolLevel]);
    
    const handlePrimaryGradeChange = (studentId: string, subject: string, value: string) => {
        const numericValue = Number(value);
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) return;

        setEditableGrades(currentGrades => 
            currentGrades.map(student => 
                student.studentId === studentId ? { ...student, scores: { ...student.scores, [subject]: numericValue } } : student
            )
        );
    };

    const handleHighSchoolGradeChange = (studentId: string, subject: string, question: number, value: string) => {
        const numericValue = Number(value);
        // Add validation as needed
        setEditableGrades(prev => prev.map(student => {
            if (student.studentId === studentId) {
                const subjectScores = typeof student.scores[subject] === 'object' ? student.scores[subject] : {};
                const newScores = {
                    ...student.scores,
                    [subject]: {
                        ...subjectScores,
                        [`q${question}`]: numericValue
                    }
                };
                return { ...student, scores: newScores };
            }
            return student;
        }));
    }

    const handleSaveChanges = () => {
        if (!selectedExamId) return;
        
        editableGrades.forEach(studentGrade => {
             const finalScores: Record<string, number> = {};
             if(schoolLevel === 'High School') {
                 Object.entries(studentGrade.scores).forEach(([subject, value]) => {
                     if(typeof value === 'object'){
                        finalScores[subject] = Object.values(value).reduce((sum, qScore) => sum + qScore, 0);
                     } else {
                         finalScores[subject] = value;
                     }
                 })
             }
            
            const gradeData: Grade = {
                studentId: studentGrade.studentId,
                examId: selectedExamId,
                scores: schoolLevel === 'High School' ? finalScores : studentGrade.scores as any,
            };
            updateGrades(gradeData);
        });
        
        logAction("Grades Updated", { exam: selectedExam?.name, grades: editableGrades });
        toast({
            title: "Grades Saved",
            description: `Grades for ${selectedExam?.name} have been successfully updated.`,
        });
    };
    
    const calculateAverage = (scores: Record<string, number | Record<string, number>>) => {
        const subjectScores = Object.values(scores).map(score => {
             if (typeof score === 'object') {
                const questionScores = Object.values(score);
                return questionScores.reduce((acc, s) => acc + s, 0);
            }
            return score;
        });

        if (subjectScores.length === 0) return 'N/A';
        const total = subjectScores.reduce((acc, score) => acc + (score || 0), 0);
        // This average might need to be weighted by total marks per subject in a real scenario
        const totalSubjectsWithScores = subjectScores.filter(s => s > 0).length;
        if(totalSubjectsWithScores === 0) return '0.00';
        return (total / (totalSubjectsWithScores * 100) * 100).toFixed(2);
    }
    
    const handleHistoryCheck = () => {
        toast({
            title: "Loading grade history... (mock action)",
            description: "A log of all changes to this grade would be displayed here.",
        });
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
                                            {schoolLevel === 'Primary' ? (
                                                <Input 
                                                    type="number" 
                                                    value={student.scores[subject] as number || ''} 
                                                    onChange={(e) => handlePrimaryGradeChange(student.studentId, subject, e.target.value)}
                                                    className="w-24 text-center mx-auto"
                                                />
                                            ) : (
                                                <Accordion type="single" collapsible className="w-full">
                                                    <AccordionItem value="item-1">
                                                        <AccordionTrigger className="text-center justify-center hover:no-underline">
                                                           {Object.values(student.scores[subject] as object).reduce((a,b) => a+b, 0)}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-2 space-y-1">
                                                           {[...Array(5)].map((_, i) => (
                                                               <div key={i} className="flex items-center gap-1">
                                                                   <Label className="text-xs">Q{i+1}</Label>
                                                                   <Input 
                                                                    type="number" 
                                                                    className="h-7 w-16" 
                                                                    value={(student.scores[subject] as any)?.[`q${i+1}`] || ''}
                                                                    onChange={(e) => handleHighSchoolGradeChange(student.studentId, subject, i + 1, e.target.value)}
                                                                   />
                                                               </div>
                                                           ))}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            )}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-center font-medium">{calculateAverage(student.scores)}%</TableCell>
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
