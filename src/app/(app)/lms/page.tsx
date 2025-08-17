import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, FileText, Video } from "lucide-react";

export default function LMSPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Learning Management System</h1>
                <p className="text-muted-foreground">Access course materials, assignments, and online classes.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                           <BookOpenCheck className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Course Materials</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>View and download lecture notes, presentations, and other resources for your courses.</CardDescription>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                           <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Submit your assignments, track due dates, and view your grades for completed work.</CardDescription>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                           <Video className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Online Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Join live online classes, access recordings of past sessions, and interact with your instructors.</CardDescription>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
