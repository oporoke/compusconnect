
"use client";

import { useStudents } from "@/hooks/use-students";
import { useFinance } from "@/hooks/use-finance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Calendar, DollarSign, FileText, GraduationCap, MessageSquare, Video } from "lucide-react";
import React from 'react';

export function ParentDashboard({ studentId }: { studentId: string }) {
    const { getStudentById, getGradesByStudentId, getAttendanceByStudentId, exams, isLoading: studentsLoading } = useStudents();
    const { getInvoicesByStudent, isLoading: financeLoading } = useFinance();

    const student = getStudentById(studentId);
    const studentGrades = getGradesByStudentId(studentId);
    const studentAttendance = getAttendanceByStudentId(studentId);
    const studentInvoices = getInvoicesByStudent(studentId);

    const latestExamGrades = React.useMemo(() => {
        if (studentGrades.length === 0 || exams.length === 0) return null;
        const sortedExams = [...exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latestExam = sortedExams[0];
        const grades = studentGrades.find(g => g.examId === latestExam.id);
        if(!grades) return null;

        const scores = Object.values(grades.scores);
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        return { examName: latestExam.name, average: average.toFixed(1) };
    }, [studentGrades, exams]);

    const attendancePercentage = React.useMemo(() => {
        if (studentAttendance.length === 0) return 100;
        const presentDays = studentAttendance.filter(a => a.present).length;
        return Math.round((presentDays / studentAttendance.length) * 100);
    }, [studentAttendance]);

    const pendingDues = studentInvoices
        .filter(inv => inv.status === 'Unpaid' || inv.status === 'Overdue')
        .reduce((acc, inv) => acc + inv.total, 0);
        
    const quickLinks = [
        { title: "Announcements", href: "/announcements", icon: FileText },
        { title: "Timetable", href: "/timetable", icon: Calendar },
        { title: "Messages", href: "/messages", icon: MessageSquare },
        { title: "Events", href: "/events", icon: BookOpenCheck },
    ]

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinks.map(link => (
                    <Link href={link.href} key={link.title}>
                        <Card className="hover:shadow-lg transition-shadow h-full flex flex-col justify-center items-center py-4">
                            <link.icon className="h-8 w-8 text-primary mb-2" />
                            <CardTitle className="text-lg">{link.title}</CardTitle>
                        </Card>
                    </Link>
                ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><GraduationCap /> Latest Exam Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {latestExamGrades ? (
                            <>
                                <p className="text-sm text-muted-foreground">{latestExamGrades.examName}</p>
                                <p className="text-4xl font-bold">{latestExamGrades.average}%</p>
                                <p className="text-xs text-muted-foreground">Overall Average</p>
                            </>
                        ) : (
                            <p className="text-muted-foreground">No recent grades.</p>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar /> Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{attendancePercentage}%</p>
                        <Progress value={attendancePercentage} className="mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DollarSign /> Pending Dues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">${pendingDues.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{studentInvoices.filter(i => i.status !== 'Paid').length} unpaid invoice(s)</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Fee Payments</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentInvoices.slice(0, 5).map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.id.split('-')[1]}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>${invoice.total.toLocaleString()}</TableCell>
                                    <TableCell><Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'}>{invoice.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                             {studentInvoices.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No financial records found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
