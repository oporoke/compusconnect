
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStudents } from '@/hooks/use-students';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Wand2, Printer, Bot, Save, ListChecks } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock API functions for this feature
const getExamSolutions = async (examId: string) => {
    console.log(`Fetching solutions for exam: ${examId}`);
    return { 'Math': ['A', 'C', 'B', 'D'], 'Science': ['B', 'A', 'A', 'C'] };
};

const saveExamSolutions = async (examId: string, solutions: Record<string, string[]>) => {
    console.log(`Saving solutions for exam ${examId}:`, solutions);
    return { success: true };
};

const saveStudentAnswers = async (examId: string, studentId: string, answers: Record<string, string[]>) => {
    console.log(`Saving answers for student ${studentId} on exam ${examId}:`, answers);
    return { success: true, score: 85 }; // return mock score
}

function SolutionEntry() {
    const { exams } = useStudents();
    const [selectedExamId, setSelectedExamId] = useState('');
    const [solutions, setSolutions] = useState<Record<string, string>>({});
    const { toast } = useToast();

    const selectedExam = useMemo(() => exams.find(e => e.id === selectedExamId), [exams, selectedExamId]);

    const handleSolutionChange = (subject: string, value: string) => {
        setSolutions(prev => ({ ...prev, [subject]: value }));
    }

    const handleSaveSolutions = async () => {
        if (!selectedExam) return;
        const formattedSolutions = Object.entries(solutions).reduce((acc, [key, value]) => {
            acc[key] = value.split(',').map(s => s.trim());
            return acc;
        }, {} as Record<string, string[]>);
        
        await saveExamSolutions(selectedExamId, formattedSolutions);
        toast({ title: "Solutions Saved", description: `Answer key for ${selectedExam.name} has been saved.` });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound /> Exam Solution Entry</CardTitle>
                <CardDescription>Enter the correct answers for each subject in an exam. This will be used for automated marking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                    <SelectTrigger><SelectValue placeholder="Select an exam..." /></SelectTrigger>
                    <SelectContent>{exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                </Select>

                {selectedExam && (
                    <div className="space-y-2">
                        {selectedExam.subjects.map(subject => (
                            <div key={subject}>
                                <Label htmlFor={`solution-${subject}`}>{subject} Answers (comma-separated)</Label>
                                <Input 
                                    id={`solution-${subject}`} 
                                    placeholder="e.g., A, B, C, D, A"
                                    value={solutions[subject] || ''}
                                    onChange={e => handleSolutionChange(subject, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveSolutions} disabled={!selectedExamId || Object.keys(solutions).length === 0}><Save className="mr-2"/>Save Solutions</Button>
            </CardFooter>
        </Card>
    )
}

function AutomatedMarking() {
    const { students, exams, updateGrades } = useStudents();
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
    const [markedResult, setMarkedResult] = useState<{ score: number, details: any[] } | null>(null);
    const { toast } = useToast();

    const selectedExam = useMemo(() => exams.find(e => e.id === selectedExamId), [exams, selectedExamId]);
    
    const handleAnswerChange = (subject: string, value: string) => {
        setStudentAnswers(prev => ({...prev, [subject]: value}));
    }

    const handleAutomark = async () => {
        if (!selectedExam || !selectedStudentId) return;

        const answers = Object.entries(studentAnswers).reduce((acc, [key, value]) => {
            acc[key] = value.split(',').map(s => s.trim());
            return acc;
        }, {} as Record<string, string[]>);
        
        const solutions = await getExamSolutions(selectedExamId);
        
        let totalCorrect = 0;
        let totalQuestions = 0;
        const details: any[] = [];

        for (const subject in answers) {
            const studentAns = answers[subject];
            const correctAns = solutions[subject] || [];
            totalQuestions += correctAns.length;
            let subjectCorrect = 0;
            const questionDetails = [];

            for(let i = 0; i < correctAns.length; i++) {
                const isCorrect = studentAns[i] === correctAns[i];
                if (isCorrect) {
                    totalCorrect++;
                    subjectCorrect++;
                }
                questionDetails.push({ question: i + 1, student: studentAns[i] || '-', correct: correctAns[i], isCorrect });
            }
            details.push({ subject, questions: questionDetails, subjectScore: `${subjectCorrect}/${correctAns.length}` });
        }
        
        const finalScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        
        // This is where you would update the gradebook
        updateGrades({ studentId: selectedStudentId, examId: selectedExamId, scores: { [selectedExam.name]: finalScore } });

        setMarkedResult({ score: finalScore, details });
        toast({ title: 'Marking Complete', description: `Final score is ${finalScore}%.` });
    }
    
    const handlePrint = () => {
        window.print();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 /> Automated Marking</CardTitle>
                <CardDescription>Select a student and exam, then enter their answers for instant, AI-assisted grading.</CardDescription>
            </CardHeader>
             <CardContent className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-4">
                     <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                        <SelectTrigger><SelectValue placeholder="Select an exam..." /></SelectTrigger>
                        <SelectContent>{exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                    </Select>
                     <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={!selectedExamId}>
                        <SelectTrigger><SelectValue placeholder="Select a student..." /></SelectTrigger>
                        <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                 {selectedExam && selectedStudentId && (
                     <div className="space-y-2 pt-4">
                         {selectedExam.subjects.map(subject => (
                            <div key={subject}>
                                <Label htmlFor={`answers-${subject}`}>{subject} Student Answers (comma-separated)</Label>
                                <Input 
                                    id={`answers-${subject}`} 
                                    placeholder="e.g., A, C, B, D"
                                    value={studentAnswers[subject] || ''}
                                    onChange={e => handleAnswerChange(subject, e.target.value)}
                                />
                            </div>
                        ))}
                     </div>
                 )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={handleAutomark} disabled={!selectedExam || !selectedStudentId}><Bot className="mr-2"/> Auto-Mark</Button>
                {markedResult && <Button onClick={handlePrint} variant="outline"><Printer className="mr-2"/> Print Results</Button>}
            </CardFooter>
            
            {markedResult && (
                 <CardContent className="pt-6 print-area">
                    <h3 className="font-bold text-lg">Marking Report</h3>
                    <p>Student: {students.find(s=>s.id === selectedStudentId)?.name}</p>
                    <p>Exam: {selectedExam?.name}</p>
                    <p className="text-xl font-bold">Final Score: {markedResult.score}%</p>
                    <div className="space-y-4 mt-4">
                        {markedResult.details.map((sub: any) => (
                             <div key={sub.subject}>
                                <h4 className="font-semibold">{sub.subject} ({sub.subjectScore})</h4>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Q#</TableHead><TableHead>Your Answer</TableHead><TableHead>Correct Answer</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {sub.questions.map((q: any) => (
                                            <TableRow key={q.question} className={q.isCorrect ? 'bg-green-100' : 'bg-red-100'}>
                                                <TableCell>{q.question}</TableCell>
                                                <TableCell>{q.student}</TableCell>
                                                <TableCell>{q.correct}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export default function AutomatedMarkingPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Automated Marking & Grading</h1>
                <p className="text-muted-foreground">Streamline the exam marking process with automated and manual tools.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
                <SolutionEntry />
                <AutomatedMarking />
            </div>
             <style jsx global>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  .print-area, .print-area * {
                    visibility: visible;
                  }
                  .print-area {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                  }
                }
            `}</style>
        </div>
    )
}
