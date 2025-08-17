"use client";

import { useState } from 'react';
import { students, grades } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Bot, Sparkles, Download, User } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { generateReportCard, ReportCardInput } from '@/ai/flows/ai-report-card-generator';

export function ReportCardGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [generatedReport, setGeneratedReport] = useState<{ summary: string, reportCard: string } | null>(null);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!selectedStudentId) {
            toast({
                variant: 'destructive',
                title: "No Student Selected",
                description: "Please select a student to generate a report card.",
            });
            return;
        }
        setIsLoading(true);
        setGeneratedReport(null);
        try {
            const student = students.find(s => s.id === selectedStudentId);
            const studentGrades = grades.find(g => g.studentId === selectedStudentId);

            if (!student || !studentGrades) {
                throw new Error('Student data not found');
            }

            const input: ReportCardInput = {
                studentName: student.name,
                grades: `Math: ${studentGrades.math}, Science: ${studentGrades.science}, English: ${studentGrades.english}`,
            };
            const result = await generateReportCard(input);
            setGeneratedReport(result);
            toast({
                title: "Report Card Generated!",
                description: `AI has successfully created a report card for ${student.name}.`,
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: "Generation Failed",
                description: "Something went wrong while generating the report card.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Select Student</CardTitle>
                    <CardDescription>Choose a student to generate their report card.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerate} disabled={isLoading || !selectedStudentId} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
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
                                <Button className="w-full">
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
