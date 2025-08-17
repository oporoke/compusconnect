

"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { useHealth } from '@/hooks/use-health';
import { useStudents } from '@/hooks/use-students';
import { HeartPulse, PlusCircle, Pill, Syringe, Save, Trash2, Microscope, BellRing } from 'lucide-react';
import type { HealthRecord } from '@/lib/data';

function EditHealthRecordDialog({ record: initialRecord, studentId, studentName, onComplete }: { record: HealthRecord | undefined, studentId: string, studentName: string, onComplete: () => void }) {
    const { updateRecord } = useHealth();
    const [bloodGroup, setBloodGroup] = useState(initialRecord?.bloodGroup || '');
    const [allergies, setAllergies] = useState((initialRecord?.allergies || []).join(', '));
    const [vaccinations, setVaccinations] = useState(initialRecord?.vaccinations || []);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedRecord: HealthRecord = {
            studentId,
            bloodGroup,
            allergies: allergies.split(',').map(a => a.trim()).filter(Boolean),
            vaccinations
        };
        updateRecord(updatedRecord);
        onComplete();
    };

    const addVaccination = () => setVaccinations([...vaccinations, { name: '', date: '' }]);
    const removeVaccination = (index: number) => setVaccinations(vaccinations.filter((_, i) => i !== index));
    const handleVaccinationChange = (index: number, field: 'name' | 'date', value: string) => {
        const newVaccinations = [...vaccinations];
        newVaccinations[index][field] = value;
        setVaccinations(newVaccinations);
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Blood Group</Label><Input value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} /></div>
            </div>
             <div className="space-y-1"><Label>Allergies (comma-separated)</Label><Input value={allergies} onChange={e => setAllergies(e.target.value)} /></div>
             <div className="space-y-2">
                <Label>Vaccinations</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                {vaccinations.map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Input placeholder="Vaccine Name" value={v.name} onChange={e => handleVaccinationChange(i, 'name', e.target.value)} />
                        <Input type="date" value={v.date} onChange={e => handleVaccinationChange(i, 'date', e.target.value)} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeVaccination(i)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </div>
                ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addVaccination}><PlusCircle className="mr-2"/>Add Vaccination</Button>
            </div>
            <DialogFooter>
                <Button type="submit"><Save className="mr-2" /> Save Record</Button>
            </DialogFooter>
        </form>
    );
}

function LogVisitDialog({ studentId, onComplete }: { studentId: string, onComplete: () => void }) {
    const { addClinicVisit } = useHealth();
    const [reason, setReason] = useState('');
    const [treatment, setTreatment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addClinicVisit({ studentId, reason, treatment, date: new Date().toISOString().split('T')[0] });
        onComplete();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1"><Label>Reason for Visit</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} required /></div>
            <div className="space-y-1"><Label>Treatment / Notes</Label><Textarea value={treatment} onChange={e => setTreatment(e.target.value)} required /></div>
            <DialogFooter><Button type="submit">Log Visit</Button></DialogFooter>
        </form>
    );
}

export default function HealthCenterPage() {
    const { students } = useStudents();
    const { healthRecords, clinicVisits, getRecordByStudentId, getVisitsByStudentId, isLoading, sendVaccinationReminders } = useHealth();
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [recordDialogOpen, setRecordDialogOpen] = useState(false);
    const [visitDialogOpen, setVisitDialogOpen] = useState(false);

    const selectedStudent = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);
    const selectedRecord = useMemo(() => getRecordByStudentId(selectedStudentId), [getRecordByStudentId, selectedStudentId]);
    const selectedVisits = useMemo(() => getVisitsByStudentId(selectedStudentId), [getVisitsByStudentId, selectedStudentId]);

    return (
        <div className="space-y-6">
            <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
                 <DialogContent>
                    <DialogHeader><DialogTitle>Health Record for {selectedStudent?.name}</DialogTitle></DialogHeader>
                    {selectedStudent && <EditHealthRecordDialog record={selectedRecord} studentId={selectedStudentId} studentName={selectedStudent.name} onComplete={() => setRecordDialogOpen(false)} />}
                 </DialogContent>
            </Dialog>
             <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
                 <DialogContent>
                    <DialogHeader><DialogTitle>Log Clinic Visit for {selectedStudent?.name}</DialogTitle></DialogHeader>
                    {selectedStudent && <LogVisitDialog studentId={selectedStudentId} onComplete={() => setVisitDialogOpen(false)} />}
                 </DialogContent>
            </Dialog>

            <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-headline font-bold">Health Center</h1>
                    <p className="text-muted-foreground">Manage student medical records and clinic visits.</p>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" onClick={sendVaccinationReminders}><BellRing className="mr-2"/> Send Reminders</Button>
                    <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                        <SelectTrigger className="w-64"><SelectValue placeholder="Select a student..." /></SelectTrigger>
                        <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>

            {selectedStudentId ? (
                 <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2"><HeartPulse /> Medical Details</CardTitle>
                                <Button size="sm" variant="outline" onClick={() => setRecordDialogOpen(true)}>Edit Record</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                           <div className="grid grid-cols-2 gap-4">
                                <p><strong>Blood Group:</strong> <span className="font-mono">{selectedRecord?.bloodGroup || 'N/A'}</span></p>
                                <p><strong>Allergies:</strong> <span className="font-mono">{selectedRecord?.allergies?.join(', ') || 'None'}</span></p>
                           </div>
                           <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Syringe /> Vaccinations</h4>
                               <Table>
                                 <TableHeader><TableRow><TableHead>Vaccine</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                                 <TableBody>{selectedRecord?.vaccinations?.map((v, i) => <TableRow key={i}><TableCell>{v.name}</TableCell><TableCell>{v.date}</TableCell></TableRow>)}</TableBody>
                               </Table>
                           </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2"><Microscope /> Clinic Visits</CardTitle>
                                <Button size="sm" variant="outline" onClick={() => setVisitDialogOpen(true)}>Log New Visit</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                 <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Reason</TableHead><TableHead>Treatment</TableHead></TableRow></TableHeader>
                                 <TableBody>{selectedVisits.slice().reverse().map(visit => <TableRow key={visit.id}><TableCell>{visit.date}</TableCell><TableCell>{visit.reason}</TableCell><TableCell>{visit.treatment}</TableCell></TableRow>)}</TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                 </div>
            ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <HeartPulse className="h-16 w-16 mb-4" />
                    <p>Select a student to view their health records.</p>
                </Card>
            )}
        </div>
    );
}

    