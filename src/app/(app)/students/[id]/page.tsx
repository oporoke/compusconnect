
"use client";

import { useStudents } from "@/hooks/use-students";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, User as UserIcon, CalendarCheck, Award, Wrench, BrainCircuit, Paintbrush } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// Mocked data for the new Skills Portfolio
const mockSkills = [
    { name: "Critical Thinking", level: 4, source: "History Essay (Term 1)"},
    { name: "Data Analysis", level: 3, source: "Science Fair Project" },
    { name: "Creative Writing", level: 5, source: "English Short Story" },
    { name: "Teamwork", level: 4, source: "Group Science Project" },
];

const skillIcons: Record<string, React.ElementType> = {
    "Critical Thinking": BrainCircuit,
    "Data Analysis": Wrench,
    "Creative Writing": Paintbrush,
    "Teamwork": UserIcon,
}

export default function StudentProfilePage({ params }: { params: { id: string } }) {
    const { getStudentById, getGradesByStudentId, getAttendanceByStudentId, exams, isLoading } = useStudents();
    
    const student = getStudentById(params.id);
    const studentGrades = getGradesByStudentId(params.id);
    const studentAttendance = getAttendanceByStudentId(params.id);

    if (isLoading) {
        return (
             <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    if (!student) {
        notFound();
    }

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[1][0]}`;
        }
        return name.substring(0, 2);
    };
    
    const latestExamGrades = React.useMemo(() => {
        if (studentGrades.length === 0 || exams.length === 0) return null;
        const sortedExams = [...exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latestExam = sortedExams[0];
        return studentGrades.find(g => g.examId === latestExam.id);
    }, [studentGrades, exams]);

    const gradeData = React.useMemo(() => {
        if (!latestExamGrades) return [];
        return Object.entries(latestExamGrades.scores).map(([subject, grade]) => ({ subject, grade }));
    }, [latestExamGrades]);
    
    const chartConfig = {
      grade: {
        label: "Grade",
        color: "hsl(var(--primary))",
      },
    }

    const attendancePercentage = React.useMemo(() => {
        if (studentAttendance.length === 0) return 100;
        const presentDays = studentAttendance.filter(a => a.present).length;
        return Math.round((presentDays / studentAttendance.length) * 100);
    }, [studentAttendance]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={`https://placehold.co/100x100.png`} alt={student.name} data-ai-hint="profile picture" />
                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl font-headline">{student.name}</CardTitle>
                        <CardDescription>
                            Student ID: {student.id} | Grade: {student.grade} | Section: {student.section}
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <Tabs defaultValue="academic">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="academic">Academic Overview</TabsTrigger>
                    <TabsTrigger value="skills">Verified Skills Portfolio</TabsTrigger>
                </TabsList>
                <TabsContent value="academic" className="mt-6 space-y-6">
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                         <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                 <CardTitle className="text-lg">Recent Performance</CardTitle>
                                 <GraduationCap className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                               {gradeData.length > 0 ? (
                                    <ChartContainer config={chartConfig} className="w-full h-[200px]">
                                        <BarChart accessibilityLayer data={gradeData}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                            dataKey="subject"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                            />
                                            <YAxis domain={[0, 100]} />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                            <Bar dataKey="grade" fill="var(--color-grade)" radius={4} />
                                        </BarChart>
                                    </ChartContainer>
                               ) : (
                                   <div className="flex items-center justify-center h-[200px] text-muted-foreground">No grades recorded yet.</div>
                               )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">Attendance Overview</CardTitle>
                                <CalendarCheck className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="flex justify-between items-center">
                                    <span>Overall Presence</span>
                                    <span className="font-bold">{attendancePercentage}%</span>
                                </div>
                                <Progress value={attendancePercentage} />
                                <p className="text-xs text-muted-foreground text-center">Based on {studentAttendance.length} recorded day(s)</p>
                            </CardContent>
                        </Card>
                        
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">Advanced Grading</CardTitle>
                                <Award className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="space-y-2 pt-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium">Cumulative GPA:</span>
                                     <span className="font-mono font-bold text-lg">3.8/4.0</span>
                                </div>
                                 <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium">Honor Roll Status:</span>
                                     <Badge variant="default">Highest Honors</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                     <Card>
                        <CardHeader>
                            <CardTitle>Academic History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Examination</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Overall Grade</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentGrades.map(grade => {
                                        const exam = exams.find(e => e.id === grade.examId);
                                        const scores = Object.values(grade.scores);
                                        const average = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 'N/A';
                                        const status = parseFloat(average) >= 40 ? "Promoted" : "Failed";
                                        return (
                                            <TableRow key={grade.examId}>
                                                <TableCell>{exam?.name || 'Unknown Exam'}</TableCell>
                                                <TableCell>{exam ? new Date(exam.date).toLocaleDateString() : 'N/A'}</TableCell>
                                                <TableCell>{average}%</TableCell>
                                                <TableCell>
                                                    <Badge variant={status === "Promoted" ? "default" : "destructive"}>{status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                      {studentGrades.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">No academic history found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="skills" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Verified Skills Portfolio</CardTitle>
                            <CardDescription>A summary of skills demonstrated through coursework and activities.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockSkills.map(skill => {
                                const Icon = skillIcons[skill.name] || Award;
                                return (
                                <Card key={skill.name} className="bg-muted/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2"><Icon/> {skill.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Progress value={skill.level * 20} />
                                        <p className="text-xs text-muted-foreground">Level: {skill.level}/5</p>
                                        <p className="text-xs text-muted-foreground">Verified via: {skill.source}</p>
                                    </CardContent>
                                </Card>
                            )})}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
