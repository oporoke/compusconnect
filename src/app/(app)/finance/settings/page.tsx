
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { useFinance } from '@/hooks/use-finance';
import type { FeeStructure } from '@/lib/data';

function AddFeeStructureDialog() {
    const { addFeeStructure } = useFinance();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [grades, setGrades] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addFeeStructure({
            name,
            amount: Number(amount),
            grades: grades.split(',').map(g => g.trim())
        });
        setName(''); setAmount(''); setGrades('');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/>Add Fee Structure</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>New Fee Structure</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Structure Name (e.g. Tuition Fee)" value={name} onChange={e => setName(e.target.value)} required />
                    <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
                    <Input placeholder="Applicable Grades (e.g. 9,10 or all)" value={grades} onChange={e => setGrades(e.target.value)} required />
                    <DialogFooter>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function FinanceSettingsPage() {
    const { feeStructures, removeFeeStructure, isLoading } = useFinance();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-3xl font-headline font-bold">Finance Settings</h1>
                    <p className="text-muted-foreground">Manage school-wide fee structures.</p>
                </div>
                <AddFeeStructureDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fee Structures</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Amount</TableHead><TableHead>Applicable Grades</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {feeStructures.map(fs => (
                                <TableRow key={fs.id}>
                                    <TableCell>{fs.name}</TableCell>
                                    <TableCell>${fs.amount.toLocaleString()}</TableCell>
                                    <TableCell>{fs.grades.join(', ')}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => removeFeeStructure(fs.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
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
