
"use client";

import { useStudents } from "@/hooks/use-students";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, User as UserIcon, CalendarCheck } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import React from 'react';

export default function StudentProfilePage({ params }: { params: { id: string } }) {
    const { getStudentById, getGradesByStudentId, getAttendanceByStudentId, isLoading } = useStudents();
    
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

    if (!student || !studentGrades) {
        notFound();
    }

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[1][0]}`;
        }
        return name.substring(0, 2);
    };

    const gradeData = [
        { subject: "Math", grade: studentGrades.math },
        { subject: "Science", grade: studentGrades.science },
        { subject: "English", grade: studentGrades.english },
    ];
    
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
                <CardHeader className="flex flex-row items-center gap-4">
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                         <CardTitle className="text-lg">Academic Performance</CardTitle>
                         <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Attendance Overview</CardTitle>
                        <CalendarCheck className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                        <CardTitle className="text-lg">Contact Information</CardTitle>
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="text-sm">
                        <p><strong>Email:</strong> {student.name.toLowerCase().replace(' ', '.')}@example.com</p>
                        <p><strong>Parent/Guardian:</strong> Parent of {student.name}</p>
                        <p><strong>Contact:</strong> (123) 456-7890</p>
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
                                <TableHead>Term</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Overall Grade</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Fall</TableCell>
                                <TableCell>2023</TableCell>
                                <TableCell>A-</TableCell>
                                <TableCell><Badge>Promoted</Badge></TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Spring</TableCell>
                                <TableCell>2023</TableCell>
                                <TableCell>B+</TableCell>
                                <TableCell><Badge>Promoted</Badge></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}

