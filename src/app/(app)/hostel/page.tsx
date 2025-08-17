
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BedDouble, User, Hotel } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';
import { useHostel } from '@/hooks/use-hostel';
import { useStudents } from '@/hooks/use-students';
import type { Hostel, Room } from '@/lib/data';

function AssignRoomDialog() {
    const { hostels, assignStudentToRoom } = useHostel();
    const { students } = useStudents();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [selectedHostelId, setSelectedHostelId] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    
    const availableRooms = hostels.find(h => h.id === selectedHostelId)?.rooms.filter(r => r.occupants.length < r.capacity) || [];

    const handleAssign = () => {
        assignStudentToRoom(selectedHostelId, selectedRoomId, selectedStudentId);
        toast({ title: "Room Assigned", description: "The student has been assigned to the room." });
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Assign Room</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Student to Hostel Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Select value={selectedHostelId} onValueChange={setSelectedHostelId}>
                        <SelectTrigger><SelectValue placeholder="Select a hostel..." /></SelectTrigger>
                        <SelectContent>
                            {hostels.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={selectedRoomId} onValueChange={setSelectedRoomId} disabled={!selectedHostelId}>
                        <SelectTrigger><SelectValue placeholder="Select an available room..." /></SelectTrigger>
                        <SelectContent>
                            {availableRooms.map(r => <SelectItem key={r.id} value={r.id}>Room {r.number}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={!selectedRoomId}>
                        <SelectTrigger><SelectValue placeholder="Select a student..." /></SelectTrigger>
                        <SelectContent>
                            {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button onClick={handleAssign} disabled={!selectedStudentId}>Assign</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function HostelPage() {
    const { hostels, isLoading, getStudentById } = useHostel();

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Hostel Management</h1>
                    <p className="text-muted-foreground">Manage room allocations and resident information.</p>
                </div>
                <AssignRoomDialog />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-96 w-full" />
                        <Skeleton className="h-96 w-full" />
                    </>
                ) : (
                    hostels.map(hostel => (
                        <Card key={hostel.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Hotel /> {hostel.name}
                                </CardTitle>
                                <CardDescription>
                                    Overview of room occupancy in {hostel.name}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Room No.</TableHead>
                                                <TableHead>Occupants</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {hostel.rooms.map(room => (
                                                <TableRow key={room.id}>
                                                    <TableCell className="font-medium">{room.number}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            {room.occupants.map(studentId => {
                                                                const student = getStudentById(studentId);
                                                                return <span key={studentId}>{student?.name || 'Unknown Student'}</span>
                                                            })}
                                                            {room.occupants.length === 0 && <span className="text-muted-foreground">Empty</span>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={room.occupants.length < room.capacity ? 'secondary' : 'default'}>
                                                            {room.occupants.length} / {room.capacity}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
