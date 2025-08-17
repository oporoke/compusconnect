import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, FileText, Video } from "lucide-react";
import Link from "next/link";

export default function LMSPage() {
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
        </div>
    );
}
