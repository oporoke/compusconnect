
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
import { useStaff } from '@/hooks/use-staff';

export function CreateStaffDialog() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const { addStaff } = useStaff();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [salary, setSalary] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newStaff = { name, role, department, email, phone, joiningDate, salary: parseInt(salary, 10) };
        addStaff(newStaff);
        
        toast({
            title: "Staff Member Added",
            description: `The profile for ${name} has been successfully created.`,
        });
        
        // Reset form and close dialog
        setName('');
        setRole('');
        setDepartment('');
        setEmail('');
        setPhone('');
        setJoiningDate('');
        setSalary('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Staff Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Staff Profile</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new staff member.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="department" className="text-right">Department</Label>
                            <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="joiningDate" className="text-right">Joining Date</Label>
                            <Input id="joiningDate" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} type="date" className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="salary" className="text-right">Salary</Label>
                            <Input id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} type="number" className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit">Save Profile</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
