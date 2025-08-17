
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, FileText, Video, Link as LinkIcon, RefreshCw, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function LMSPage() {
    const { toast } = useToast();
    const lmsFeatures = [
        {
            title: "Course Materials",
            description: "View and download lecture notes, presentations, and other resources for your courses.",
            icon: BookOpenCheck,
            href: "/lms/course-materials"
        },
        {
            title: "Assignments",
            description: "Submit your assignments, track due dates, and view your grades for completed work.",
            icon: FileText,
            href: "/lms/assignments"
        },
        {
            title: "Online Classes",
            description: "Join live online classes, access recordings of past sessions, and interact with your instructors.",
            icon: Video,
            href: "/lms/online-classes"
        }
    ];

    const handleConnect = (platform: string) => {
        toast({
            title: `Connecting to ${platform}...`,
            description: "You will be redirected to authorize the connection. (This is a mock action)",
        });
    };

    const handleSync = (platform: string) => {
        toast({
            title: `Syncing with ${platform}...`,
            description: "Grades and assignments are being synced. (This is a mock action)",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Learning Management System</h1>
                <p className="text-muted-foreground">Access course materials, assignments, and online classes.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lmsFeatures.map((feature) => (
                    <Link href={feature.href} key={feature.title}>
                        <Card className="hover:shadow-lg transition-shadow h-full">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                   <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>LMS Integrations</CardTitle>
                    <CardDescription>Connect CampusConnect Lite with your favorite external learning platforms.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                           <img src="https://placehold.co/40x40.png" alt="Google Classroom" data-ai-hint="google classroom logo" className="h-10 w-10"/>
                           <div>
                                <p className="font-semibold">Google Classroom</p>
                                <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Connected</p>
                           </div>
                        </div>
                        <Button variant="outline" onClick={() => handleSync('Google Classroom')}><RefreshCw className="mr-2" /> Sync Now</Button>
                    </div>
                     <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                           <img src="https://placehold.co/40x40.png" alt="Microsoft Teams" data-ai-hint="microsoft teams logo" className="h-10 w-10"/>
                           <div>
                                <p className="font-semibold">Microsoft Teams</p>
                                <p className="text-sm text-muted-foreground">Not Connected</p>
                           </div>
                        </div>
                        <Button onClick={() => handleConnect('Microsoft Teams')}><LinkIcon className="mr-2" /> Connect</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    