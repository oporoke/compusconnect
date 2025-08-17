
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, PlusCircle, Tag } from "lucide-react";
import { useLMS } from "@/hooks/use-lms";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@/lib/auth";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Assignment } from "@/lib/data";

function CreateAssignmentDialog() {
    const [open, setOpen] = useState(false);
    const { addAssignment } = useLMS();
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [skills, setSkills] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
        addAssignment({ title, subject, dueDate, skills: skillList });
        setTitle('');
        setSubject('');
        setDueDate('');
        setSkills('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Assignment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Assignment</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new assignment and tag it with relevant skills.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject" className="text-right">Subject</Label>
                            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                            <Input id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="skills" className="text-right">Skills Tag</Label>
                            <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} className="col-span-3" placeholder="e.g., Critical Thinking, Data Analysis" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


export default function AssignmentsPage() {
    const { user } = useAuth();
    const { assignments, submitAssignment, isLoading } = useLMS();

    const getStatusVariant = (status: Assignment['status']) => {
        switch (status) {
            case 'Pending': return 'destructive';
            case 'Submitted': return 'secondary';
            case 'Graded': return 'default';
            default: return 'outline';
        }
    };

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-3xl font-headline font-bold">Assignments</h1>
                    <p className="text-muted-foreground">Track and submit your assignments.</p>
                </div>
                {user && [ROLES.ADMIN, ROLES.TEACHER].includes(user.role) && (
                    <CreateAssignmentDialog />
                )}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Assignments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-4">
                                <FileText className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-semibold">{assignment.title}</p>
                                    <p className="text-sm text-muted-foreground">{assignment.subject} - Due: {assignment.dueDate}</p>
                                    {assignment.skills && assignment.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {assignment.skills.map(skill => <Badge key={skill} variant="outline"><Tag className="mr-1"/>{skill}</Badge>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                <Badge variant={getStatusVariant(assignment.status)}>{assignment.status}</Badge>
                                {user?.role === ROLES.STUDENT && assignment.status === 'Pending' && (
                                    <Button size="sm" onClick={() => submitAssignment(assignment.id)}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Submit
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
