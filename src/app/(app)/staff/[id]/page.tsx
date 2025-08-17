
"use client";

import { useStaff } from "@/hooks/use-staff";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Building, Calendar, DollarSign, Mail, Phone } from "lucide-react";
import React from 'react';

export default function StaffProfilePage({ params }: { params: { id: string } }) {
    const { getStaffById, isLoading } = useStaff();
    
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

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[1][0]}`;
        }
        return name.substring(0, 2);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={`https://placehold.co/120x120.png`} alt={staffMember.name} data-ai-hint="profile picture" />
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
                        <p className="text-xs text-muted-foreground">Note: Payroll processing features are under development.</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Leave Management</CardTitle>
                         <Calendar className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                     <CardContent className="space-y-2 text-sm">
                       <p><strong>Available Leaves:</strong> 12</p>
                       <p><strong>Leaves Taken:</strong> 3</p>
                       <p className="text-xs text-muted-foreground">Note: Leave request system is under development.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
