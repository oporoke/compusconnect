
"use client";

import React, { useMemo, useState } from 'react';
import { useStudents } from '@/hooks/use-students';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Download, FileWarning, CalendarCheck } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from '@/components/ui/progress';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';


export default function StudentAnalyticsPage() {
    const { students, exams, getGradesByStudentId, getAttendanceByStudentId, isLoading } = useStudents();
    const [selectedStudentId, setSelectedStudentId] = useState('');

    const student = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);
    const studentGrades = useMemo(() => getGradesByStudentId(selectedStudentId), [getGradesByStudentId, selectedStudentId]);
    const studentAttendance = useMemo(() => getAttendanceByStudentId(selectedStudentId), [getAttendanceByStudentId, selectedStudentId]);
    
    const attendancePercentage = useMemo(() => {
        if (studentAttendance.length === 0) return 100;
        const presentDays = studentAttendance.filter(a => a.present).length;
        return Math.round((presentDays / studentAttendance.length) * 100);
    }, [studentAttendance]);

    const gradeTrendData = useMemo(() => {
        if (!studentGrades.length) return [];
        return exams
            .filter(exam => studentGrades.some(g => g.examId === exam.id))
            .map(exam => {
                const grade = studentGrades.find(g => g.examId === exam.id);
                if (!grade) return null;
                const scores = Object.values(grade.scores);
                const average = scores.reduce((a, b) => a + b, 0) / scores.length;
                return { name: exam.name, average: parseFloat(average.toFixed(2)) };
            }).filter(Boolean);
    }, [studentGrades, exams]);

    const latestExamGradesData = useMemo(() => {
        if (!studentGrades.length) return [];
        const latestExam = exams.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        const latestGrade = studentGrades.find(g => g.examId === latestExam.id);
        if(!latestGrade) return [];
        return Object.entries(latestGrade.scores).map(([subject, grade]) => ({ subject, grade }));
    }, [studentGrades, exams]);

    const exportToPDF = () => {
        if (!student) return;
        const doc = new jsPDF();
        doc.text(`Student Performance Report: ${student.name}`, 14, 16);
        autoTable(doc, {
            startY: 22,
            head: [['Metric', 'Value']],
            body: [
                ['Overall Attendance', `${attendancePercentage}%`],
                ['Disciplinary Actions', `${student.discipline?.length || 0}`]
            ]
        });
        if(gradeTrendData.length > 0) {
            autoTable(doc, {
                head: [['Exam', 'Average Grade']],
                body: gradeTrendData.map(d => [d?.name, d?.average]),
                startY: (doc as any).lastAutoTable.finalY + 10
            });
        }
        doc.save(`${student.name}_performance_report.pdf`);
    };

    const exportToExcel = () => {
        if (!student) return;
        const wb = XLSX.utils.book_new();
        const summary_ws = XLSX.utils.json_to_sheet([
            { Metric: "Overall Attendance", Value: `${attendancePercentage}%` },
            { Metric: "Disciplinary Actions", Value: student.discipline?.length || 0 }
        ]);
        XLSX.utils.book_append_sheet(wb, summary_ws, "Summary");
        if(gradeTrendData.length > 0) {
            const grades_ws = XLSX.utils.json_to_sheet(gradeTrendData);
            XLSX.utils.book_append_sheet(wb, grades_ws, "Grade Trends");
        }
        XLSX.writeFile(wb, `${student.name}_performance_report.xlsx`);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Student Performance Analytics</h1>
                <p className="text-muted-foreground">Select a student to view their academic and behavioral trends.</p>
            </div>
            
            <div className="flex justify-between items-center">
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a student..." />
                    </SelectTrigger>
                    <SelectContent>
                        {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                {selectedStudentId && (
                    <div className="flex gap-2">
                        <Button onClick={exportToPDF} variant="outline"><Download className="mr-2"/>PDF</Button>
                        <Button onClick={exportToExcel} variant="outline"><Download className="mr-2"/>Excel</Button>
                    </div>
                )}
            </div>

            {selectedStudentId && !isLoading && (
                <div className="space-y-6">
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>Grade Trend</CardTitle>
                                <CardDescription>Average performance across exams.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={{}} className="h-[250px] w-full">
                                    <LineChart data={gradeTrendData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Line type="monotone" dataKey="average" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Latest Exam Breakdown</CardTitle>
                                <CardDescription>Scores from the most recent examination.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={{}} className="h-[250px] w-full">
                                     <BarChart data={latestExamGradesData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="subject" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis domain={[0, 100]}/>
                                        <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                        <Bar dataKey="grade" fill="hsl(var(--primary))" radius={8} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                     <div className="grid md:grid-cols-2 gap-6">
                         <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2"><CalendarCheck/>Attendance Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center gap-4">
                                <div className="text-6xl font-bold">{attendancePercentage}%</div>
                                <Progress value={attendancePercentage} className="w-full" />
                                <p className="text-sm text-muted-foreground">{studentAttendance.filter(a=>a.present).length} of {studentAttendance.length} days present</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><FileWarning />Disciplinary Records</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow><TableHead>Date</TableHead><TableHead>Reason</TableHead></TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {student?.discipline?.length ? student.discipline.map(d => (
                                            <TableRow key={d.id}>
                                                <TableCell>{d.date}</TableCell>
                                                <TableCell>{d.reason}</TableCell>
                                            </TableRow>
                                        )) : <TableRow><TableCell colSpan={2} className="text-center">No records found.</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                     </div>
                </div>
            )}
        </div>
    );
}


    