

"use client";

import React, { useMemo } from 'react';
import { useStaff } from '@/hooks/use-staff';
import { useStudents } from '@/hooks/use-students';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

export default function StaffAnalyticsPage() {
    const { staff, isLoading: staffLoading } = useStaff();
    const { grades, isLoading: studentsLoading } = useStudents();

    const teacherGradeAverages = useMemo(() => {
        const teacherData: Record<string, { total: number, count: number }> = {};
        
        // This is a simplified simulation. A real implementation would link grades to teachers.
        // For now, we'll assign teachers to subjects somewhat randomly to get data.
        const subjectTeacherMap: Record<string, string> = {
            'Math': 'Mr. Samuel Jones',
            'Science': 'Ms. Clara Oswald',
            'English': 'Mr. Samuel Jones',
            'History': 'Ms. Clara Oswald',
            'Art': 'Mr. Samuel Jones'
        };

        grades.forEach(grade => {
            Object.entries(grade.scores).forEach(([subject, score]) => {
                const teacherName = subjectTeacherMap[subject];
                if(teacherName) {
                    if(!teacherData[teacherName]) {
                        teacherData[teacherName] = { total: 0, count: 0 };
                    }
                    teacherData[teacherName].total += score;
                    teacherData[teacherName].count++;
                }
            });
        });
        
        return Object.entries(teacherData).map(([name, data]) => ({
            name,
            averageGrade: parseFloat((data.total / data.count).toFixed(2))
        }));

    }, [grades]);

    const leaveData = useMemo(() => {
        return staff.map(s => ({
            name: s.name,
            leavePercentage: (s.leavesTaken / s.leavesAvailable) * 100
        }));
    }, [staff]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Staff Evaluation Analytics</h1>
                <p className="text-muted-foreground">Comparative insights into staff attendance and performance.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Leave Utilization</CardTitle>
                        <CardDescription>Percentage of used leave days by staff member.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                             <BarChart data={leaveData} layout="vertical">
                                <XAxis type="number" domain={[0,100]} />
                                <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="leavePercentage" fill="hsl(var(--primary))" radius={5} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Average Grades by Teacher (Simulated)</CardTitle>
                         <CardDescription>Average student scores in subjects taught by each teacher.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={{}} className="h-[300px] w-full">
                            <BarChart data={teacherGradeAverages} layout="vertical">
                                <XAxis type="number" domain={[0,100]} />
                                <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="averageGrade" fill="hsl(var(--primary))" radius={5} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Staff Overview</CardTitle>
                    <CardDescription>A summary of all staff members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Leave Taken</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staff.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{s.role}</Badge></TableCell>
                                    <TableCell><Badge variant="outline">{s.department}</Badge></TableCell>
                                    <TableCell>{s.leavesTaken} / {s.leavesAvailable}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}


    