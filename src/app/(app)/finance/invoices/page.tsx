
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PlusCircle, FileText, CheckCircle, XCircle, Clock, BellRing, CreditCard } from "lucide-react";
import { useFinance } from '@/hooks/use-finance';
import { useStudents } from '@/hooks/use-students';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import type { Invoice, Payment } from '@/lib/data';
import { differenceInDays, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function PaymentGatewayDialog({ invoice }: { invoice: Invoice }) {
    const { addPayment } = useFinance();
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handlePayment = (method: string) => {
        addPayment({ invoiceId: invoice.id, amount: invoice.total, date: new Date().toISOString().split('T')[0], method });
        toast({
            title: `Payment Successful via ${method}`,
            description: `Invoice ${invoice.id.split('-')[1]} for $${invoice.total} has been paid.`
        });
        setOpen(false);
    }
    
    return (
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm" variant="default" disabled={invoice.status === 'Paid'}><CreditCard className="mr-2"/>Pay Online</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Pay Invoice #{invoice.id.split('-')[1]}</DialogTitle><DialogDescription>Total Amount: ${invoice.total.toFixed(2)}</DialogDescription></DialogHeader>
                <Tabs defaultValue="card">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="card">Card</TabsTrigger>
                        <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
                        <TabsTrigger value="bnpl">Fee Financing</TabsTrigger>
                    </TabsList>
                    <TabsContent value="card" className="space-y-4 pt-4">
                        <Input placeholder="Card Number" />
                        <div className="grid grid-cols-2 gap-4"><Input placeholder="MM/YY" /><Input placeholder="CVC" /></div>
                        <Button className="w-full" onClick={() => handlePayment('Card')}>Pay ${invoice.total.toFixed(2)}</Button>
                    </TabsContent>
                    <TabsContent value="mpesa" className="space-y-4 pt-4">
                        <Input placeholder="M-Pesa Phone Number (e.g. 254...)" />
                        <Button className="w-full" onClick={() => toast({title: "STK Push Sent", description:"Please check your phone to complete payment."})}>Initiate STK Push</Button>
                    </TabsContent>
                     <TabsContent value="bnpl" className="space-y-4 pt-4 text-center">
                        <p className="text-sm text-muted-foreground">Get flexible payment options with our financing partners.</p>
                        <Button variant="outline" className="w-full">Apply for Fee Financing</Button>
                         <p className="text-xs text-muted-foreground">This is a mock integration for demonstration.</p>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

function GenerateInvoicesDialog() {
    const { feeStructures, generateInvoicesForGrade } = useFinance();
    const [open, setOpen] = useState(false);
    const [grade, setGrade] = useState('');
    const [selectedFeeIds, setSelectedFeeIds] = useState<string[]>([]);
    
    const handleSubmit = () => {
        generateInvoicesForGrade(grade, selectedFeeIds);
        setOpen(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2"/>Generate Invoices</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Generate Batch Invoices</DialogTitle></DialogHeader>
                <div className="space-y-4">
                    <Select value={grade} onValueChange={setGrade}>
                        <SelectTrigger><SelectValue placeholder="Select a grade..."/></SelectTrigger>
                        <SelectContent>
                            {[...new Set(useStudents().students.map(s => s.grade))].map(g => <SelectItem key={g} value={g}>Grade {g}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <div className="space-y-2">
                        <Label>Select Fee Structures to Apply</Label>
                        {feeStructures.map(fs => (
                            <div key={fs.id} className="flex items-center gap-2">
                                <input type="checkbox" id={fs.id} checked={selectedFeeIds.includes(fs.id)} onChange={(e) => {
                                    if(e.target.checked) setSelectedFeeIds([...selectedFeeIds, fs.id]);
                                    else setSelectedFeeIds(selectedFeeIds.filter(id => id !== fs.id));
                                }} />
                                <Label htmlFor={fs.id}>{fs.name} (${fs.amount})</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!grade || selectedFeeIds.length === 0}>Generate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function RecordPaymentDialog({ invoice }: { invoice: Invoice }) {
    const { addPayment } = useFinance();
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(invoice.total);
    const [method, setMethod] = useState<'Card' | 'Cash' | 'Bank Transfer'>('Card');
    
    const handleSubmit = () => {
        addPayment({ invoiceId: invoice.id, amount: Number(amount), date: new Date().toISOString().split('T')[0], method });
        setOpen(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={invoice.status === 'Paid'}>Record Payment</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Record Payment for Invoice {invoice.id.split('-')[1]}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                    <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                    <Select value={method} onValueChange={v => setMethod(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Card">Card</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Save Payment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ViewInvoiceDialog({ invoice, payments }: { invoice: Invoice, payments: Payment[] }) {
    const { students } = useStudents();
    const student = students.find(s => s.id === invoice.studentId);
    
    const handlePrint = () => {
        const doc = new jsPDF();
        doc.text(`Invoice #${invoice.id.split('-')[1]}`, 20, 20);
        doc.text(`Student: ${student?.name}`, 20, 30);
        doc.text(`Date: ${invoice.date}`, 20, 40);
        doc.text(`Due Date: ${invoice.dueDate}`, 20, 50);

        (doc as any).autoTable({
            startY: 60,
            head: [['Description', 'Amount']],
            body: invoice.items.map(item => [item.description, `$${item.amount.toFixed(2)}`])
        });
        
        let finalY = (doc as any).autoTable.previous.finalY;
        doc.text(`Total: $${invoice.total.toFixed(2)}`, 150, finalY + 10);

        if(payments.length > 0) {
            doc.text(`Payments Made`, 20, finalY + 20);
            (doc as any).autoTable({
                startY: finalY + 25,
                head: [['Date', 'Amount', 'Method']],
                body: payments.map(p => [p.date, `$${p.amount.toFixed(2)}`, p.method])
            });
             finalY = (doc as any).autoTable.previous.finalY;
        }

        const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
        doc.text(`Amount Due: $${(invoice.total - totalPaid).toFixed(2)}`, 150, finalY + 10);
        doc.save(`invoice_${invoice.id}.pdf`);
    }

    return (
         <Dialog>
            <DialogTrigger asChild><Button size="sm">View</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Invoice Details</DialogTitle></DialogHeader>
                <div className="space-y-4">
                    <p>Student: <strong>{student?.name}</strong></p>
                    <Table>
                        <TableHeader><TableRow><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {invoice.items.map((item, i) => <TableRow key={i}><TableCell>{item.description}</TableCell><TableCell className="text-right">${item.amount.toFixed(2)}</TableCell></TableRow>)}
                            <TableRow><TableCell className="font-bold">Total</TableCell><TableCell className="text-right font-bold">${invoice.total.toFixed(2)}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                    {payments.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Payments</h4>
                             <Table>
                                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Method</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {payments.map(p => <TableRow key={p.id}><TableCell>{p.date}</TableCell><TableCell>{p.method}</TableCell><TableCell className="text-right">${p.amount.toFixed(2)}</TableCell></TableRow>)}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handlePrint}>Print/Download</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function InvoicesPage() {
    const { invoices, getPaymentsByInvoice, isLoading } = useFinance();
    const { students } = useStudents();
    const { toast } = useToast();

    const sendReminders = () => {
        const today = new Date();
        const overdueInvoices = invoices.filter(inv => inv.status === 'Unpaid' && differenceInDays(today, parseISO(inv.dueDate)) > 0);
        
        if (overdueInvoices.length === 0) {
            toast({ title: "No Overdue Invoices", description: "All pending invoices are within their due dates." });
            return;
        }

        overdueInvoices.forEach(inv => {
            const student = students.find(s => s.id === inv.studentId);
            toast({
                title: `Reminder Sent to ${student?.name || 'Unknown'}`,
                description: `Invoice for $${inv.total} is overdue.`
            });
        });
    }
    
    const getStatus = (invoice: Invoice) => {
        if (invoice.status === 'Paid') return <Badge variant="default">Paid</Badge>;
        if (differenceInDays(new Date(), parseISO(invoice.dueDate)) > 0) return <Badge variant="destructive">Overdue</Badge>;
        return <Badge variant="secondary">Unpaid</Badge>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-3xl font-headline font-bold">Invoices & Payments</h1>
                    <p className="text-muted-foreground">Manage all student fee invoices.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={sendReminders}>
                        <BellRing className="mr-2" /> Send Reminders
                    </Button>
                    <GenerateInvoicesDialog />
                </div>
            </div>
            <Card>
                <CardHeader><CardTitle>All Invoices</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Invoice ID</TableHead><TableHead>Student</TableHead><TableHead>Date</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {invoices.map(invoice => {
                                const student = students.find(s => s.id === invoice.studentId);
                                return (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-mono">{invoice.id.split('-')[1]}</TableCell>
                                    <TableCell>{student?.name || 'N/A'}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>${invoice.total.toLocaleString()}</TableCell>
                                    <TableCell>
                                        {getStatus(invoice)}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <PaymentGatewayDialog invoice={invoice}/>
                                        <ViewInvoiceDialog invoice={invoice} payments={getPaymentsByInvoice(invoice.id)} />
                                        <RecordPaymentDialog invoice={invoice} />
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
