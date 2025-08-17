
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FilePen } from 'lucide-react';
import { useStudents } from '@/hooks/use-students';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

function CreateExamDialog() {
    const [open, setOpen] = useState(false);
    const { addExam } = useStudents();
    const { toast } = useToast();

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [subjects, setSubjects] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const subjectList = subjects.split(',').map(s => s.trim()).filter(s => s);
        if (subjectList.length === 0) {
            toast({
                variant: 'destructive',
                title: "No Subjects",
                description: "Please enter at least one subject.",
            });
            return;
        }

        addExam({ name, date, subjects: subjectList });
        
        toast({
            title: "Exam Created",
            description: `The "${name}" examination has been scheduled.`,
        });

        setName('');
        setDate('');
        setSubjects('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Exam
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Examination</DialogTitle>
                        <DialogDescription>
                            Fill in the details to schedule a new exam.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required placeholder="e.g., Mid-Term Exam" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Date</Label>
                            <Input id="date" value={date} onChange={(e) => setDate(e.target.value)} type="date" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subjects" className="text-right">Subjects</Label>
                            <Input id="subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} className="col-span-3" required placeholder="e.g., Math, Science, Art" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Exam</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function ExamsPage() {
    const { exams, isLoading } = useStudents();
    
    if (isLoading) {
        return <Skeleton className="h-96 w-full" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Examinations</h1>
                    <p className="text-muted-foreground">Manage school-wide examinations.</p>
                </div>
                <CreateExamDialog />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Scheduled Exams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {exams.length > 0 ? exams.map((exam) => (
                        <div key={exam.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-4">
                                <FilePen className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-semibold">{exam.name}</p>
                                    <p className="text-sm text-muted-foreground">Date: {new Date(exam.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-end max-w-xs">
                                {exam.subjects.map(subject => (
                                    <Badge key={subject} variant="secondary">{subject}</Badge>
                                ))}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-muted-foreground">No exams have been scheduled yet.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
