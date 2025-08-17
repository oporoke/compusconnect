
"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { CalendarCheck } from 'lucide-react';
import { useStudents } from '@/hooks/use-students';
import { Skeleton } from '@/components/ui/skeleton';

export default function AttendancePage() {
    const { students, logAttendance, isLoading } = useStudents();
    const [selectedClass, setSelectedClass] = useState('10-A');
    const { toast } = useToast();
    
    const studentsInClass = useMemo(() => students.filter(s => `${s.grade}-${s.section}` === selectedClass), [students, selectedClass]);
    
    const [attendanceStatus, setAttendanceStatus] = useState<Record<string, boolean>>(() => {
        const status: Record<string, boolean> = {};
        studentsInClass.forEach(s => {
            status[s.id] = true; // Default all to present
        });
        return status;
    });

    // Update attendance status when class changes
    useState(() => {
        const newStatus: Record<string, boolean> = {};
        studentsInClass.forEach(s => {
            newStatus[s.id] = true;
        });
        setAttendanceStatus(newStatus);
    });

    const handleCheckboxChange = (studentId: string, checked: boolean) => {
        setAttendanceStatus(prev => ({ ...prev, [studentId]: checked }));
    };

    const handleSubmit = () => {
        const studentStatuses = Object.entries(attendanceStatus).map(([studentId, present]) => ({
            studentId,
            present
        }));
        
        logAttendance(selectedClass, studentStatuses);

        toast({
            title: "Attendance Submitted",
            description: `Attendance for class ${selectedClass} has been recorded.`,
        });
    }
    
    if (isLoading) {
        return <Skeleton className="h-96 w-full" />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Attendance Logging</h1>
                <p className="text-muted-foreground">Mark daily attendance for students.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Mark Attendance</CardTitle>
                    <CardDescription>Select a class and mark students as present.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="class-select">Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger id="class-select" className="w-[180px]">
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10-A">Grade 10 - Section A</SelectItem>
                                <SelectItem value="10-B">Grade 10 - Section B</SelectItem>
                                <SelectItem value="11-A">Grade 11 - Section A</SelectItem>
                                <SelectItem value="11-B">Grade 11 - Section B</SelectItem>
                                <SelectItem value="12-A">Grade 12 - Section A</SelectItem>
                                <SelectItem value="12-C">Grade 12 - Section C</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="text-right w-[100px]">Present</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsInClass.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="text-right">
                                            <Checkbox 
                                                id={`att-${student.id}`} 
                                                checked={attendanceStatus[student.id] ?? true}
                                                onCheckedChange={(checked) => handleCheckboxChange(student.id, !!checked)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     <div className="flex justify-end">
                        <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            Submit Attendance
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

