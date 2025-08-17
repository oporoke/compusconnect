
"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Bot, Sparkles, Download, User } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { generateReportCard, ReportCardInput } from '@/ai/flows/ai-report-card-generator';
import { useStudents } from '@/hooks/use-students';

interface ReportCardGeneratorProps {
    onDownload: (reportContent: string, studentName: string) => void;
}

export function ReportCardGenerator({ onDownload }: ReportCardGeneratorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedExamId, setSelectedExamId] = useState('');
    const [generatedReport, setGeneratedReport] = useState<{ summary: string, reportCard: string } | null>(null);
    const { toast } = useToast();
    const { students, grades, exams, isLoading: areStudentsLoading } = useStudents();

    const selectedStudent = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);

    const handleGenerate = async () => {
        if (!selectedStudentId || !selectedExamId) {
            toast({
                variant: 'destructive',
                title: "Selection Missing",
                description: "Please select a student and an exam to generate a report.",
            });
            return;
        }
        setIsLoading(true);
        setGeneratedReport(null);
        try {
            const studentGrades = grades.find(g => g.studentId === selectedStudentId && g.examId === selectedExamId);

            if (!selectedStudent || !studentGrades) {
                throw new Error('Student data or grades not found for the selected exam.');
            }
            
            const gradesString = Object.entries(studentGrades.scores)
                .map(([subject, score]) => `${subject}: ${score}`)
                .join(', ');

            const input: ReportCardInput = {
                studentName: selectedStudent.name,
                grades: gradesString,
            };
            const result = await generateReportCard(input);
            setGeneratedReport(result);
            toast({
                title: "Report Card Generated!",
                description: `AI has successfully created a report card for ${selectedStudent.name}.`,
            });
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Something went wrong.";
            toast({
                variant: 'destructive',
                title: "Generation Failed",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const studentExams = useMemo(() => {
        if (!selectedStudentId) return [];
        const studentGradeExams = grades.filter(g => g.studentId === selectedStudentId).map(g => g.examId);
        return exams.filter(e => studentGradeExams.includes(e.id));
    }, [selectedStudentId, grades, exams]);

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Select Student & Exam</CardTitle>
                    <CardDescription>Choose a student and an exam to generate their report card.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {areStudentsLoading ? (
                        <Skeleton className="h-10 w-full" />
                    ) : (
                        <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                            <SelectTrigger id="student-select" className="w-full">
                                <SelectValue placeholder="Select a student..." />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map(student => (
                                    <SelectItem key={student.id} value={student.id}>
                                        {student.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                     <Select value={selectedExamId} onValueChange={setSelectedExamId} disabled={!selectedStudentId}>
                        <SelectTrigger id="exam-select" className="w-full">
                            <SelectValue placeholder="Select an exam..." />
                        </SelectTrigger>
                        <SelectContent>
                            {studentExams.length > 0 ? studentExams.map(exam => (
                                <SelectItem key={exam.id} value={exam.id}>
                                    {exam.name}
                                </SelectItem>
                            )) : (
                                <div className="p-4 text-center text-sm text-muted-foreground">No graded exams for this student.</div>
                            )}
                        </SelectContent>
                    </Select>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerate} disabled={isLoading || !selectedStudentId || !selectedExamId} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        {isLoading ? (
                            <>
                                <Bot className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Report Card
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Generated Report Card</CardTitle>
                    <CardDescription>AI-generated summary and report card.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[80%]" />
                            <div className="pt-4">
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </div>
                    ) : (
                        generatedReport ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">AI Summary</h3>
                                    <p className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
                                        {generatedReport.summary}
                                    </p>
                                </div>
                                 <div>
                                    <h3 className="font-semibold mb-2">Full Report</h3>
                                    <pre className="p-4 bg-muted rounded-md text-sm text-muted-foreground whitespace-pre-wrap font-code">
                                        {generatedReport.reportCard}
                                    </pre>
                                </div>
                                <Button className="w-full" onClick={() => onDownload(generatedReport.reportCard, selectedStudent?.name || 'student')}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download as PDF
                                </Button>
                            </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                                <User className="h-12 w-12 mb-4" />
                                <p>The student's report card will appear here.</p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
