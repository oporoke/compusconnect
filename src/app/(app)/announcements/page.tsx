
"use client";
import { useCommunication } from "@/hooks/use-communication";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function AnnouncementsPage() {
    const { announcements } = useCommunication();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">School Announcements</h1>
                <p className="text-muted-foreground">Stay updated with the latest news and events.</p>
            </div>
            <div className="space-y-4">
                {announcements.map((announcement) => (
                     <Card key={announcement.id}>
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Megaphone className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>{announcement.title}</CardTitle>
                                <CardDescription>Posted on: {new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground/80">{announcement.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
