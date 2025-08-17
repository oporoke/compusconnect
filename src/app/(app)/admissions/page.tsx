
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, UserPlus, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAdmissions } from '@/hooks/use-admissions';
import type { Admission } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdmissionsPage() {
    const { applications, addApplication, updateApplicationStatus, isLoading } = useAdmissions();
    const { toast } = useToast();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [previousSchool, setPreviousSchool] = useState('');
    const [grade, setGrade] = useState('');
    const [parentName, setParentName] = useState('');
    const [parentEmail, setParentEmail] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        addApplication({
            name,
            age: parseInt(age, 10),
            previousSchool,
            grade,
            parentName,
            parentEmail,
        });

        toast({
            title: "Application Submitted",
            description: "Your application has been received and is under review.",
        });

        // Reset form
        setName('');
        setAge('');
        setPreviousSchool('');
        setGrade('');
        setParentName('');
        setParentEmail('');
    };

    const handleStatusChange = (id: string, status: Admission['status']) => {
        updateApplicationStatus(id, status);
        toast({
            title: "Status Updated",
            description: `Application status has been changed to ${status}.`
        });
    };

    const getStatusIcon = (status: Admission['status']) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'Rejected': return <XCircle className="h-5 w-5 text-red-500" />;
            case 'Pending':
            default: return <Clock className="h-5 w-5 text-yellow-500" />;
        }
    };
     const getStatusVariant = (status: Admission['status']) => {
        switch (status) {
            case 'Approved': return 'default';
            case 'Rejected': return 'destructive';
            case 'Pending':
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Admissions & Enrollment</h1>
                <p className="text-muted-foreground">Manage student applications and enrollment process.</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Student Application</CardTitle>
                            <CardDescription>Fill out the form to apply for admission.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="age">Age</Label>
                                        <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="grade">Applying for Grade</Label>
                                        <Input id="grade" value={grade} onChange={e => setGrade(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="previous-school">Previous School</Label>
                                    <Input id="previous-school" value={previousSchool} onChange={e => setPreviousSchool(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parent-name">Parent/Guardian Name</Label>
                                    <Input id="parent-name" value={parentName} onChange={e => setParentName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parent-email">Parent/Guardian Email</Label>
                                    <Input id="parent-email" type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} required />
                                </div>
                                 <div className="space-y-2">
                                    <Label>Upload Documents</Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-muted-foreground">Birth Certificate, Previous Marksheets</p>
                                            </div>
                                            <input id="dropzone-file" type="file" className="hidden" multiple disabled />
                                        </label>
                                    </div> 
                                    <p className="text-xs text-muted-foreground">Note: Document upload is for demonstration purposes only.</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">
                                    <UserPlus className="mr-2" /> Submit Application
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Status</CardTitle>
                            <CardDescription>Review and update the status of submitted applications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-64 w-full" />
                            ) : (
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Candidate</TableHead>
                                            <TableHead>Grade</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {applications.map(app => (
                                            <TableRow key={app.id}>
                                                <TableCell className="font-medium">{app.name}</TableCell>
                                                <TableCell>{app.grade}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(app.status)}>
                                                        {getStatusIcon(app.status)}
                                                        <span className="ml-2">{app.status}</span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Select onValueChange={(value) => handleStatusChange(app.id, value as Admission['status'])} value={app.status}>
                                                        <SelectTrigger className="w-32 h-8">
                                                            <SelectValue placeholder="Update..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Pending">Pending</SelectItem>
                                                            <SelectItem value="Approved">Approve</SelectItem>
                                                            <SelectItem value="Rejected">Reject</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
