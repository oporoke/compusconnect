
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, CalendarCheck, Megaphone, Users } from "lucide-react";
import { ROLES } from "@/lib/auth";
import { ParentDashboard } from "@/components/dashboard/parent-dashboard";

function AdminTeacherDashboard() {
     const stats = [
        { title: "Students", value: "350", icon: Users },
        { title: "Classes", value: "15", icon: BookCopy },
        { title: "Events", value: "3", icon: Megaphone },
        { title: "Attendance", value: "95%", icon: CalendarCheck },
    ]

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Announcements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <Megaphone className="h-5 w-5 mt-1 mr-3 text-primary" />
                                <div>
                                    <p className="font-semibold">Annual Sports Day</p>
                                    <p className="text-sm text-muted-foreground">Get ready for a day of fun and competition!</p>
                                </div>
                            </li>
                             <li className="flex items-start">
                                <Megaphone className="h-5 w-5 mt-1 mr-3 text-primary" />
                                <div>
                                    <p className="font-semibold">Parent-Teacher Meeting</p>
                                    <p className="text-sm text-muted-foreground">Discuss your child's progress with their teachers.</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <ul className="space-y-3">
                            <li className="flex items-start">
                                <CalendarCheck className="h-5 w-5 mt-1 mr-3 text-accent" />
                                <div>
                                    <p className="font-semibold">Science Fair</p>
                                    <p className="text-sm text-muted-foreground">November 5th, 2024</p>
                                </div>
                            </li>
                             <li className="flex items-start">
                                <CalendarCheck className="h-5 w-5 mt-1 mr-3 text-accent" />
                                <div>
                                    <p className="font-semibold">Mid-term Exams</p>
                                    <p className="text-sm text-muted-foreground">Starting from October 20th, 2024</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const { user } = useAuth();

    const isParentOrStudent = user?.role === ROLES.PARENT || user?.role === ROLES.STUDENT;
    // For this demo, both parent and student will see the same dashboard view focused on a single student.
    // In a real app, a parent might have a student selector if they have multiple children.
    const studentForDashboard = "S001"; // Hardcoded for simplicity

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-muted-foreground">
                    {isParentOrStudent
                        ? "Here is an overview of key academic and school-related information."
                        : "Here's a quick overview of your school's activities."
                    }
                </p>
            </div>

            {isParentOrStudent ? <ParentDashboard studentId={studentForDashboard} /> : <AdminTeacherDashboard />}
        </div>
    );
}
