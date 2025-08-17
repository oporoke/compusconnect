
"use client";

import { useStaff } from "@/hooks/use-staff";
import { CreateStaffDialog } from "@/components/staff/create-staff-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StaffPage() {
    const { staff, isLoading } = useStaff();

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Staff Management</h1>
                    <p className="text-muted-foreground">Manage and view staff information.</p>
                </div>
                <CreateStaffDialog />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Staff Members</CardTitle>
                    <CardDescription>A list of all staff currently employed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staff.map((staffMember) => (
                                <TableRow key={staffMember.id}>
                                    <TableCell>{staffMember.id}</TableCell>
                                    <TableCell className="font-medium">{staffMember.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{staffMember.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{staffMember.department}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/staff/${staffMember.id}`}>
                                                View Profile
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
