

"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAlumni } from '@/hooks/use-alumni';
import { useStudents } from '@/hooks/use-students';
import { UserSquare, Search, PlusCircle, Pencil, Gift, TrendingUp, Handshake, ShieldQuestion, Linkedin } from 'lucide-react';
import type { AlumniProfile, Campaign, Pledge } from '@/lib/data';
import { Progress } from '@/components/ui/progress';

function AddAlumniDialog({ alumniToEdit, onComplete }: { alumniToEdit?: AlumniProfile, onComplete: () => void }) {
    const { addAlumni, updateAlumni } = useAlumni();
    const [name, setName] = useState(alumniToEdit?.name || '');
    const [graduationYear, setGraduationYear] = useState(alumniToEdit?.graduationYear.toString() || '');
    const [email, setEmail] = useState(alumniToEdit?.email || '');
    const [phone, setPhone] = useState(alumniToEdit?.phone || '');
    const [occupation, setOccupation] = useState(alumniToEdit?.occupation || '');
    const [company, setCompany] = useState(alumniToEdit?.company || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const profileData = { name, graduationYear: Number(graduationYear), email, phone, occupation, company };
        if (alumniToEdit) {
            updateAlumni({ ...profileData, id: alumniToEdit.id });
        } else {
            addAlumni(profileData);
        }
        onComplete();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
                <div className="space-y-1"><Label>Graduation Year</Label><Input type="number" value={graduationYear} onChange={e => setGraduationYear(e.target.value)} required /></div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div className="space-y-1"><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} required /></div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Occupation</Label><Input value={occupation} onChange={e => setOccupation(e.target.value)} /></div>
                <div className="space-y-1"><Label>Company</Label><Input value={company} onChange={e => setCompany(e.target.value)} /></div>
            </div>
            <DialogFooter>
                <Button type="submit">{alumniToEdit ? 'Save Changes' : 'Add Alumni'}</Button>
            </DialogFooter>
        </form>
    );
}


function AddDonationDialog() {
    const { alumni, addDonation } = useAlumni();
    const [open, setOpen] = useState(false);
    const [alumniId, setAlumniId] = useState('');
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addDonation({ alumniId, amount: Number(amount), purpose, date: new Date().toISOString().split('T')[0] });
        setOpen(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Gift/> Record Donation</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Record New Donation</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <Select value={alumniId} onValueChange={setAlumniId} required><SelectTrigger><SelectValue placeholder="Select Alumni..." /></SelectTrigger><SelectContent>{alumni.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent></Select>
                    <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
                    <Input placeholder="Purpose (e.g. Scholarship Fund)" value={purpose} onChange={e => setPurpose(e.target.value)} required />
                    <DialogFooter><Button type="submit">Record</Button></DialogFooter>
                </form>
            </DialogContent>
    )
}

function CreateCampaignDialog() {
    const { addCampaign } = useAlumni();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [goal, setGoal] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addCampaign({ title, goal: Number(goal) });
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline"><TrendingUp className="mr-2"/>New Campaign</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Create Fundraising Campaign</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Campaign Title" value={title} onChange={e => setTitle(e.target.value)} required />
                    <Input type="number" placeholder="Goal Amount" value={goal} onChange={e => setGoal(e.target.value)} required />
                    <DialogFooter><Button type="submit">Create Campaign</Button></DialogFooter>
                </form>
            </DialogContent>
        );
}

function AddPledgeDialog() {
    const { alumni, campaigns, addPledge } = useAlumni();
    const [open, setOpen] = useState(false);
    const [campaignId, setCampaignId] = useState('');
    const [alumniId, setAlumniId] = useState('');
    const [amount, setAmount] = useState('');

     const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addPledge({ campaignId, alumniId, amount: Number(amount) });
        setOpen(false);
    }

    return (
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Handshake className="mr-2"/>Add Pledge</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Add a New Pledge</DialogTitle></DialogHeader>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <Select value={campaignId} onValueChange={setCampaignId} required><SelectTrigger><SelectValue placeholder="Select Campaign..." /></SelectTrigger><SelectContent>{campaigns.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent></Select>
                    <Select value={alumniId} onValueChange={setAlumniId} required><SelectTrigger><SelectValue placeholder="Select Alumni..." /></SelectTrigger><SelectContent>{alumni.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent></Select>
                    <Input type="number" placeholder="Pledge Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
                    <DialogFooter><Button type="submit">Log Pledge</Button></DialogFooter>
                 </form>
            </DialogContent>
        </Dialog>
    );
}

function AddMentorshipDialog() {
    const { alumni, addMentorship } = useAlumni();
    const { students } = useStudents();
    const [open, setOpen] = useState(false);
    const [mentorId, setMentorId] = useState('');
    const [menteeId, setMenteeId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMentorship({ mentorId, menteeId });
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><PlusCircle className="mr-2"/>New Mentorship</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Create New Mentorship</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select value={mentorId} onValueChange={setMentorId} required><SelectTrigger><SelectValue placeholder="Select Mentor (Alumni)..." /></SelectTrigger><SelectContent>{alumni.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent></Select>
                    <Select value={menteeId} onValueChange={setMenteeId} required><SelectTrigger><SelectValue placeholder="Select Mentee (Student)..." /></SelectTrigger><SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
                    <DialogFooter><Button type="submit">Create</Button></DialogFooter>
                </form>
            </DialogContent>
        );
}


export default function AlumniPage() {
    const { alumni, donations, campaigns, pledges, mentorships, getAlumniNameById, isLoading } = useAlumni();
    const { students } = useStudents();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingAlumni, setEditingAlumni] = useState<AlumniProfile | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);

    const filteredAlumni = alumni.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const getStudentNameById = (id: string) => students.find(s => s.id === id)?.name || 'N/A';

    return (
        <div className="space-y-6">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                 <DialogContent>
                    <DialogHeader><DialogTitle>{editingAlumni ? 'Edit Alumni Profile' : 'Add New Alumni'}</DialogTitle></DialogHeader>
                    <AddAlumniDialog alumniToEdit={editingAlumni} onComplete={() => setDialogOpen(false)} />
                 </DialogContent>
            </Dialog>
            
            <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-headline font-bold">Alumni Management</h1>
                    <p className="text-muted-foreground">Manage the alumni database, networking, and donations.</p>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setEditingAlumni(undefined); setDialogOpen(true); }}><PlusCircle /> Add Alumni</Button>
                </div>
            </div>

            <Tabs defaultValue="directory">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="directory"><UserSquare className="mr-2"/>Directory</TabsTrigger>
                    <TabsTrigger value="donations"><Gift className="mr-2"/>Donations</TabsTrigger>
                    <TabsTrigger value="campaigns"><TrendingUp className="mr-2"/>Campaigns</TabsTrigger>
                    <TabsTrigger value="pledges"><Handshake className="mr-2"/>Pledges</TabsTrigger>
                    <TabsTrigger value="mentorships"><ShieldQuestion className="mr-2"/>Mentorships</TabsTrigger>
                </TabsList>
                <TabsContent value="directory">
                    <Card>
                        <CardHeader>
                             <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search by name, occupation, company..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Grad. Year</TableHead><TableHead>Occupation</TableHead><TableHead>Company</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {filteredAlumni.map(profile => (
                                        <TableRow key={profile.id}>
                                            <TableCell className="font-medium">{profile.name}</TableCell>
                                            <TableCell>{profile.graduationYear}</TableCell>
                                            <TableCell>{profile.occupation}</TableCell>
                                            <TableCell>{profile.company}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button asChild variant="ghost" size="icon"><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a></Button>
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingAlumni(profile); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="donations">
                    <Card>
                        <CardHeader className="flex-row justify-between items-center"><CardTitle>Donations History</CardTitle><AddDonationDialog/></CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Alumni</TableHead><TableHead>Purpose</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {donations.slice().reverse().map(donation => (
                                        <TableRow key={donation.id}>
                                            <TableCell>{donation.date}</TableCell>
                                            <TableCell>{getAlumniNameById(donation.alumniId)}</TableCell>
                                            <TableCell>{donation.purpose}</TableCell>
                                            <TableCell className="text-right font-mono">${donation.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="campaigns">
                     <Card>
                        <CardHeader className="flex-row justify-between items-center"><CardTitle>Fundraising Campaigns</CardTitle><CreateCampaignDialog/></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            {campaigns.map(campaign => (
                                <Card key={campaign.id}>
                                    <CardHeader><CardTitle>{campaign.title}</CardTitle></CardHeader>
                                    <CardContent className="space-y-2">
                                        <Progress value={(campaign.raised / campaign.goal) * 100}/>
                                        <div className="flex justify-between text-sm">
                                            <span>${campaign.raised.toLocaleString()} raised</span>
                                            <span className="text-muted-foreground">Goal: ${campaign.goal.toLocaleString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="pledges">
                     <Card>
                        <CardHeader className="flex-row justify-between items-center"><CardTitle>Pledges</CardTitle><AddPledgeDialog/></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Alumni</TableHead><TableHead>Campaign</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {pledges.map(pledge => (
                                        <TableRow key={pledge.id}>
                                            <TableCell>{getAlumniNameById(pledge.alumniId)}</TableCell>
                                            <TableCell>{campaigns.find(c=>c.id === pledge.campaignId)?.title || 'N/A'}</TableCell>
                                            <TableCell>${pledge.amount.toLocaleString()}</TableCell>
                                            <TableCell><Badge>{pledge.status}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="mentorships">
                     <Card>
                        <CardHeader className="flex-row justify-between items-center"><CardTitle>Mentorship Program</CardTitle><AddMentorshipDialog /></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Mentor (Alumni)</TableHead><TableHead>Mentee (Student)</TableHead><TableHead>Start Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {mentorships.map(m => (
                                        <TableRow key={m.id}>
                                            <TableCell>{getAlumniNameById(m.mentorId)}</TableCell>
                                            <TableCell>{getStudentNameById(m.menteeId)}</TableCell>
                                            <TableCell>{m.startDate}</TableCell>
                                            <TableCell><Badge variant={m.status === 'Active' ? 'default' : 'secondary'}>{m.status}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

