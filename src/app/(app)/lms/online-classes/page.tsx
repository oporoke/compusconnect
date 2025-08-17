
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, ArrowRight, PlusCircle } from "lucide-react";
import { useLMS } from "@/hooks/use-lms";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@/lib/auth";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function CreateClassDialog() {
    const [open, setOpen] = useState(false);
    const { addOnlineClass } = useLMS();
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [time, setTime] = useState('');
    const [link, setLink] = useState('#');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addOnlineClass({ topic, subject, time, link });
        setTopic('');
        setSubject('');
        setTime('');
        setLink('#');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Schedule Class
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Schedule New Online Class</DialogTitle>
                        <DialogDescription>
                            Fill in the details to add a new class to the schedule.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="topic" className="text-right">Topic</Label>
                            <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject" className="text-right">Subject</Label>
                            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="time" className="text-right">Time</Label>
                            <Input id="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. Mon, 10:00 AM" className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="link" className="text-right">Join Link</Label>
                            <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Schedule</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


export default function OnlineClassesPage() {
    const { user } = useAuth();
    const { onlineClasses, isLoading } = useLMS();
    
    if (isLoading) {
        return <Skeleton className="h-96 w-full" />
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Online Classes</h1>
                    <p className="text-muted-foreground">Join your live classes here.</p>
                </div>
                 {user && [ROLES.ADMIN, ROLES.TEACHER].includes(user.role) && (
                    <CreateClassDialog />
                )}
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Upcoming Classes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {onlineClasses.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-4">
                                <Video className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-semibold">{session.topic}</p>
                                    <p className="text-sm text-muted-foreground">{session.subject} - {session.time}</p>
                                </div>
                            </div>
                            <Button asChild size="sm">
                                <a href={session.link} target="_blank" rel="noopener noreferrer">
                                    Join Class
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
