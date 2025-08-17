
"use client";

import { useStaff } from "@/hooks/use-staff";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Calendar, DollarSign, Mail, Phone, MinusCircle, PlusCircle, Pencil, ClipboardEdit } from "lucide-react";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Staff } from "@/lib/data";

function EditPerformanceDialog({ staffMember, onSave }: { staffMember: Staff, onSave: (notes: string) => void }) {
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState(staffMember.performanceNotes || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(notes);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Performance Notes</DialogTitle>
                    <DialogDescription>Update performance review notes for {staffMember.name}.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} />
                    <DialogFooter>
                        <Button type="submit">Save Notes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function StaffProfilePage({ params }: { params: { id: string } }) {
    const { getStaffById, updateStaff, isLoading } = useStaff();
    const { toast } = useToast();
    
    const staffMember = getStaffById(params.id);

    if (isLoading) {
        return (
             <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <div className="grid md:grid-cols-2 gap-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        )
    }

    if (!staffMember) {
        notFound();
    }
    
    const handleLeaveChange = (amount: number) => {
        if (!staffMember) return;
        let { leavesTaken, leavesAvailable } = staffMember;
        
        if (amount > 0 && leavesTaken >= leavesAvailable) {
            toast({ variant: 'destructive', title: "No Leaves Left", description: "Cannot take more leaves than available." });
            return;
        }
        if (amount < 0 && leavesTaken <= 0) {
             toast({ variant: 'destructive', title: "Invalid Action", description: "Leaves taken cannot be negative." });
            return;
        }

        leavesTaken += amount;
        
        updateStaff({ ...staffMember, leavesTaken });

        toast({
            title: "Leave Balance Updated",
            description: `${staffMember.name}'s leave balance has been adjusted.`
        })
    }

    const handlePerformanceSave = (notes: string) => {
        if (!staffMember) return;
        updateStaff({ ...staffMember, performanceNotes: notes });
        toast({
            title: "Performance Notes Saved",
            description: `Notes for ${staffMember.name} have been updated.`
        });
    }

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[1][0]}`;
        }
        return name.substring(0, 2);
    };

    const leavePercentage = staffMember.leavesAvailable > 0 ? Math.round(((staffMember.leavesAvailable - staffMember.leavesTaken) / staffMember.leavesAvailable) * 100) : 0;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={`https://placehold.co/120x120.png`} alt={staffMember.name} data-ai-hint="profile picture"/>
                        <AvatarFallback>{getInitials(staffMember.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl font-headline">{staffMember.name}</CardTitle>
                        <CardDescription className="text-lg">
                           {staffMember.role} | {staffMember.department} Department
                        </CardDescription>
                         <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-2">
                               <Mail className="h-4 w-4" /> {staffMember.email}
                            </div>
                            <div className="flex items-center gap-2">
                               <Phone className="h-4 w-4" /> {staffMember.phone}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                         <CardTitle className="text-lg">Employment Details</CardTitle>
                         <Briefcase className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <p><strong>Staff ID:</strong> {staffMember.id}</p>
                        <p><strong>Role:</strong> {staffMember.role}</p>
                        <p><strong>Department:</strong> {staffMember.department}</p>
                        <p><strong>Joining Date:</strong> {new Date(staffMember.joiningDate).toLocaleDateString()}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Payroll Information</CardTitle>
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Salary:</strong> ${staffMember.salary.toLocaleString()}</p>
                        <Button variant="outline" size="sm" className="w-full mt-2">Generate Payslip</Button>
                        <p className="text-xs text-muted-foreground text-center">Note: Payroll processing is a demo feature.</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Leave Management</CardTitle>
                         <Calendar className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                     <CardContent className="space-y-2 text-sm">
                       <div className="flex justify-between items-center">
                           <span>Leaves Taken: <strong>{staffMember.leavesTaken} / {staffMember.leavesAvailable}</strong></span>
                           <div className="flex items-center gap-1">
                               <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleLeaveChange(1)}><PlusCircle /></Button>
                               <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleLeaveChange(-1)}><MinusCircle /></Button>
                           </div>
                       </div>
                       <Progress value={leavePercentage} />
                       <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{staffMember.leavesAvailable - staffMember.leavesTaken} days remaining</span>
                            <Button variant="link" className="h-auto p-0 text-xs">Request Leave</Button>
                       </div>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Performance Review</CardTitle>
                         <div className="flex items-center gap-2">
                            <EditPerformanceDialog staffMember={staffMember} onSave={handlePerformanceSave} />
                            <ClipboardEdit className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground italic">
                            {staffMember.performanceNotes || "No performance notes available. Click the pencil to add notes."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
