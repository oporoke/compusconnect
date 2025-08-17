"use client";

import { useState, useMemo, useEffect } from 'react';
import { students, grades as initialGrades } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

type Grade = {
    studentId: string;
    math: number;
    science: number;
    english: number;
};

export function GradebookTable() {
    const [grades, setGrades] = useState<Grade[]>(initialGrades);
    const { toast } = useToast();

    const studentData = useMemo(() => {
        return students.map(student => {
            const studentGrades = grades.find(g => g.studentId === student.id);
            const math = studentGrades?.math || 0;
            const science = studentGrades?.science || 0;
            const english = studentGrades?.english || 0;
            const average = (math + science + english) / 3;

            return {
                ...student,
                math,
                science,
                english,
                average: average.toFixed(2),
            };
        });
    }, [grades]);
    
    const [editableGrades, setEditableGrades] = useState(studentData);
    
    useEffect(() => {
        setEditableGrades(studentData);
    }, [studentData]);


    const handleGradeChange = (studentId: string, subject: 'math' | 'science' | 'english', value: string) => {
        const numericValue = Number(value);
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) return;

        setEditableGrades(currentGrades => 
            currentGrades.map(student => 
                student.id === studentId ? { ...student, [subject]: numericValue } : student
            )
        );
    };

    const handleSaveChanges = () => {
        const updatedGrades: Grade[] = editableGrades.map(s => ({
            studentId: s.id,
            math: s.math,
            science: s.science,
            english: s.english,
        }));
        setGrades(updatedGrades);
        toast({
            title: "Grades Saved",
            description: "Student grades have been successfully updated.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Student Grades</CardTitle>
                <CardDescription>Click on a grade to edit. Remember to save your changes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-center">Math</TableHead>
                                <TableHead className="text-center">Science</TableHead>
                                <TableHead className="text-center">English</TableHead>
                                <TableHead className="text-center">Average</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {editableGrades.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            value={student.math} 
                                            onChange={(e) => handleGradeChange(student.id, 'math', e.target.value)}
                                            className="w-20 text-center mx-auto"
                                        />
                                    </TableCell>
                                    <TableCell>
                                         <Input 
                                            type="number" 
                                            value={student.science}
                                            onChange={(e) => handleGradeChange(student.id, 'science', e.target.value)}
                                            className="w-20 text-center mx-auto"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            value={student.english}
                                            onChange={(e) => handleGradeChange(student.id, 'english', e.target.value)}
                                            className="w-20 text-center mx-auto"
                                        />
                                    </TableCell>
                                    <TableCell className="text-center font-medium">{student.average}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    );
}
