
"use client";

import { useFinance } from '@/hooks/use-finance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, DollarSign, FileText, Settings, Users, TrendingUp, TrendingDown, FileDown, PlusCircle, Hammer, Lightbulb, ShoppingCart, Receipt, AlertTriangle } from "lucide-react";
import { useStudents } from '@/hooks/use-students';
import { useStaff } from '@/hooks/use-staff';
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Expense } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

function LogExpenseDialog() {
    const { addExpense } = useFinance();
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<Expense['category']>('Other');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addExpense({ description, amount: Number(amount), category, date });
        setOpen(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle/> Log Expense</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Log New Expense</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                        <SelectTrigger><SelectValue placeholder="Select category..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Maintenance"><Hammer className="mr-2"/>Maintenance</SelectItem>
                            <SelectItem value="Utilities"><Lightbulb className="mr-2"/>Utilities</SelectItem>
                            <SelectItem value="Supplies"><ShoppingCart className="mr-2"/>Supplies</SelectItem>
                            <SelectItem value="Other"><Receipt className="mr-2"/>Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input placeholder="Expense Description" value={description} onChange={e => setDescription(e.target.value)} required />
                    <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    <DialogFooter><Button type="submit">Log Expense</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function FinancePage() {
    const { invoices, payments, payrollRecords, expenses, isLoading } = useFinance();
    const { students } = useStudents();
    
    const totalIncome = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalPayrollExpenses = payrollRecords.reduce((acc, pr) => acc + pr.netSalary, 0);
    const totalOtherExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const totalExpenses = totalPayrollExpenses + totalOtherExpenses;
    
    const unpaidInvoices = invoices.filter(i => i.status === 'Unpaid' || i.status === 'Overdue');
    const totalDues = unpaidInvoices.reduce((acc, i) => acc + i.total - getPaymentsByInvoice(i.id).reduce((pAcc, p) => pAcc + p.amount, 0), 0);
    
    const multiYearData = useMemo(() => {
        return [
            { year: '2022', income: 450000, expenses: 380000 },
            { year: '2023', income: 520000, expenses: 450000 },
            { year: '2024', income: totalIncome, expenses: totalExpenses },
        ];
    }, [totalIncome, totalExpenses]);

    function getPaymentsByInvoice(invoiceId: string) {
        return payments.filter(p => p.invoiceId === invoiceId);
    }

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Financial Summary Report", 14, 16);
        
        const summaryData = [
            ["Metric", "Value"],
            ["Total Income", `$${totalIncome.toLocaleString()}`],
            ["Total Expenses (Payroll + Other)", `$${totalExpenses.toLocaleString()}`],
            ["Total Pending Dues", `$${totalDues.toLocaleString()}`],
            ["Account Balance", `$${(totalIncome - totalExpenses).toLocaleString()}`],
        ];

        (doc as any).autoTable({
            startY: 22,
            head: [summaryData[0]],
            body: summaryData.slice(1),
        });
        
        doc.text("Recent Invoices", 14, (doc as any).autoTable.previous.finalY + 10);
        (doc as any).autoTable({
            startY: (doc as any).autoTable.previous.finalY + 12,
            head: [['Invoice ID', 'Student', 'Amount', 'Status']],
            body: invoices.slice(0, 10).map(inv => [
                inv.id.split('-')[1],
                students.find(s => s.id === inv.studentId)?.name || 'N/A',
                `$${inv.total.toLocaleString()}`,
                inv.status
            ]),
        });

        doc.save("financial_report.pdf");
    };

    const exportToExcel = () => {
        const summary_ws_data = [
            ["Metric", "Value"],
            ["Total Income", totalIncome],
            ["Total Expenses", totalExpenses],
            ["Pending Dues", totalDues],
            ["Account Balance", totalIncome - totalExpenses],
        ];
        const invoices_ws_data = invoices.map(inv => ({
            "Invoice ID": inv.id,
            "Student Name": students.find(s => s.id === inv.studentId)?.name || 'N/A',
            "Amount": inv.total,
            "Status": inv.status,
            "Date": inv.date,
            "Due Date": inv.dueDate,
        }));
        const expenses_ws_data = expenses.map(exp => ({
            "Date": exp.date,
            "Category": exp.category,
            "Description": exp.description,
            "Amount": exp.amount
        }));

        const wb = XLSX.utils.book_new();
        const summary_ws = XLSX.utils.aoa_to_sheet(summary_ws_data);
        const invoices_ws = XLSX.utils.json_to_sheet(invoices_ws_data);
        const expenses_ws = XLSX.utils.json_to_sheet(expenses_ws_data);

        XLSX.utils.book_append_sheet(wb, summary_ws, "Financial Summary");
        XLSX.utils.book_append_sheet(wb, invoices_ws, "All Invoices");
        XLSX.utils.book_append_sheet(wb, expenses_ws, "All Expenses");

        XLSX.writeFile(wb, "financial_report.xlsx");
    }

    const financeFeatures = [
        { title: 'Invoices', href: '/finance/invoices', icon: FileText, description: "Generate and track student fee invoices." },
        { title: 'Payroll', href: '/finance/payroll', icon: Users, description: "Process staff salaries and view history." },
        { title: 'Fee Structures', href: '/finance/settings', icon: Settings, description: "Configure all school fee types." },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Financial Dashboard</h1>
                    <p className="text-muted-foreground">An overview of the school's financial health.</p>
                </div>
                <div className="flex gap-2">
                    <LogExpenseDialog />
                    <Button onClick={exportToPDF} variant="outline"><FileDown className="mr-2" /> PDF Report</Button>
                    <Button onClick={exportToExcel} variant="outline"><FileDown className="mr-2" /> Excel Report</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">from {payments.length} payments</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
                         <p className="text-xs text-muted-foreground">{payrollRecords.length} payroll, {expenses.length} other</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
                        <DollarSign className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalDues.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{unpaidInvoices.length} unpaid invoices</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(totalIncome - totalExpenses).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Income minus Expenses</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Multi-Year Financial Overview</CardTitle>
                        <CardDescription>Mock comparison of income vs. expenses over the last few years.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[250px] w-full">
                            <LineChart data={multiYearData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-2))" name="Income" />
                                <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" name="Expenses"/>
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader>
                        <CardTitle>Fee Default Risk (Mock)</CardTitle>
                        <CardDescription>Simulated predictive analytics on fee payment likelihood.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Risk</TableHead></TableRow></TableHeader>
                            <TableBody>
                                <TableRow><TableCell>Charlie Brown</TableCell><TableCell><Badge variant="destructive"><AlertTriangle className="mr-1"/>High</Badge></TableCell></TableRow>
                                <TableRow><TableCell>Diana Miller</TableCell><TableCell><Badge variant="secondary"><AlertTriangle className="mr-1"/>Medium</Badge></TableCell></TableRow>
                                <TableRow><TableCell>George Rodriguez</TableCell><TableCell><Badge variant="secondary"><AlertTriangle className="mr-1"/>Medium</Badge></TableCell></TableRow>
                                <TableRow><TableCell>Bob Williams</TableCell><TableCell><Badge variant="default">Low</Badge></TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {financeFeatures.map(feature => (
                     <Link href={feature.href} key={feature.title}>
                        <Card className="hover:shadow-lg transition-shadow h-full">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                   <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

        </div>
    );
}
