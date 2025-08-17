
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { useStudents } from '@/hooks/use-students';

export function CreateStudentDialog() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const { addStudent } = useStudents();
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [section, setSection] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newStudent = { name, grade, section };
        addStudent(newStudent);
        
        toast({
            title: "Student Created",
            description: `The profile for ${name} has been successfully created.`,
        });
        
        // Reset form and close dialog
        setName('');
        setGrade('');
        setSection('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Student
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Student Profile</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new student. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="grade" className="text-right">
                                Grade
                            </Label>
                            <Input id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} type="text" placeholder="e.g. 10" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="section" className="text-right">
                                Section
                            </Label>
                            <Input id="section" value={section} onChange={(e) => setSection(e.target.value)} type="text" placeholder="e.g. A" className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
