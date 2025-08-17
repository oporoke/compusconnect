
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
import { PlusCircle, DatabaseZap } from 'lucide-react';
import { useStudents } from '@/hooks/use-students';
import { faker } from '@faker-js/faker';

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

    const handleVerify = () => {
        toast({
            title: "Verifying with National Database... (Mock)",
            description: "Fetching student details from the national education database.",
        });
        setTimeout(() => {
            setName(faker.person.fullName());
            setGrade(faker.helpers.arrayElement(['9', '10', '11', '12']));
            setSection(faker.helpers.arrayElement(['A', 'B', 'C']));
            toast({
                title: "Verification Complete",
                description: "Student details have been auto-filled.",
            });
        }, 1500);
    }

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
                            Fill in the details below or verify with the national database.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Button type="button" variant="outline" className="w-full" onClick={handleVerify}>
                            <DatabaseZap className="mr-2"/> Verify with National Database (Mock)
                        </Button>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or Enter Manually</span></div>
                        </div>
                    </div>
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
