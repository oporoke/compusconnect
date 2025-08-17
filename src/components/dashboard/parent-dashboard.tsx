
"use client";

import { useStudents } from "@/hooks/use-students";
import { useFinance } from "@/hooks/use-finance";
import { useCommunication } from "@/hooks/use-communication";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Calendar, DollarSign, FileText, GraduationCap, MessageSquare, Video, Sparkles, AlertTriangle, Heart, Activity } from "lucide-react";
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { generateWeeklyDigest } from "@/ai/flows/ai-weekly-digest";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";


function LiveFeed({ studentId }: { studentId: string }) {
    const { grades, attendance, exams } = useStudents();
    const studentGrades = grades.filter(g => g.studentId === studentId);
    const studentAttendance = attendance.filter(a => a.studentId === studentId);

    const feedItems = [
        ...studentGrades.flatMap(g => {
            const exam = exams.find(e => e.id === g.examId);
            return Object.entries(g.scores).map(([subject, score]) => ({
                id: `g-${g.examId}-${subject}`,
                type: 'grade',
                date: exam?.date || '',
                text: `Scored ${score}% in ${subject} (${exam?.name})`,
            }))
        }),
        ...studentAttendance.map(a => ({
            id: `a-${a.date}`,
            type: 'attendance',
            date: a.date,
            text: a.present ? `Marked Present` : `Marked Absent`,
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {feedItems.slice(0, 10).map(item => (
                 <div key={item.id} className="flex items-start gap-3">
                    <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.type === 'grade' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                        {item.type === 'grade' ? <GraduationCap className="h-4 w-4 text-white"/> : <Calendar className="h-4 w-4 text-white"/>}
                    </div>
                    <div>
                        <p className="text-sm">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                 </div>
            ))}
        </div>
    )
}

function WeeklyDigest({ studentId, studentName }: { studentId: string, studentName: string }) {
    const { grades, attendance, exams } = useStudents();
    const [digest, setDigest] = useState<{ kudos: string[], concerns: string[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateDigest = async () => {
        setIsLoading(true);
        const logEntries = [
             ...grades.filter(g => g.studentId === studentId).flatMap(g => {
                const exam = exams.find(e => e.id === g.examId);
                return Object.entries(g.scores).map(([subject, score]) => `GRADE: ${score}% in ${subject} on ${exam?.date}`)
            }),
            ...attendance.filter(a => a.studentId === studentId).map(att => `ATTENDANCE: ${att.present ? 'Present' : 'Absent'} on ${att.date}`)
        ].join('\n');

        const result = await generateWeeklyDigest({ studentName, logEntries });
        setDigest(result);
        setIsLoading(false);
    }
    
    if (!digest && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8">
                 <p className="text-muted-foreground mb-4">Click the button to generate an AI-powered summary of your child's week.</p>
                 <Button onClick={handleGenerateDigest}>
                    <Sparkles className="mr-2"/> Generate Weekly Digest
                </Button>
            </div>
        )
    }

    if(isLoading) {
        return (
             <div className="flex flex-col items-center justify-center text-center p-8">
                 <Loader2 className="animate-spin text-muted-foreground mb-4"/>
                 <p className="text-muted-foreground">AI is analyzing the week's activities...</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
             <div>
                <h4 className="font-semibold text-lg flex items-center gap-2 text-green-600"><Heart/> Kudos</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    {digest?.kudos.map((k, i) => <li key={i}>{k}</li>)}
                    {digest?.kudos.length === 0 && <li>No specific highlights this week.</li>}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-lg flex items-center gap-2 text-amber-600"><AlertTriangle/> Areas for Attention</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    {digest?.concerns.map((c, i) => <li key={i}>{c}</li>)}
                     {digest?.concerns.length === 0 && <li>No concerns to report this week. Great job!</li>}
                </ul>
            </div>
        </div>
    )
}


export function ParentDashboard({ studentId }: { studentId: string }) {
    const { getStudentById, exams, isLoading: studentsLoading } = useStudents();
    const student = getStudentById(studentId);
        
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
            
            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview"><Activity className="mr-2"/>Live Feed</TabsTrigger>
                    <TabsTrigger value="digest"><Sparkles className="mr-2"/>AI Weekly Digest</TabsTrigger>
                    <TabsTrigger value="finances"><DollarSign className="mr-2"/>Finances</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                     <Card>
                        <CardHeader><CardTitle>Real-Time Student Feed</CardTitle><CardDescription>A live log of your child's recent school activities.</CardDescription></CardHeader>
                        <CardContent>
                           <LiveFeed studentId={studentId} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="digest">
                     <Card>
                        <CardHeader><CardTitle>AI-Powered Weekly Summary</CardTitle><CardDescription>A summary of the past week's highlights and areas for attention.</CardDescription></CardHeader>
                        <CardContent>
                           {student && <WeeklyDigest studentId={studentId} studentName={student.name} />}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="finances">
                    <Card>
                        <CardHeader><CardTitle>Financial Overview</CardTitle><CardDescription>A summary of invoices and pending dues.</CardDescription></CardHeader>
                        <CardContent>
                            <p>This is where financial details would go. This section can be built out further.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
