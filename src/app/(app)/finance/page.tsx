
"use client";

import { useFinance } from '@/hooks/use-finance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, DollarSign, FileText, Settings, Users, TrendingUp, TrendingDown, FileDown } from "lucide-react";
import { useStudents } from '@/hooks/use-students';
import { useStaff } from '@/hooks/use-staff';
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function FinancePage() {
    const { invoices, payments, payrollRecords, isLoading } = useFinance();
    const { students } = useStudents();
    const { staff } = useStaff();

    const totalIncome = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalExpenses = payrollRecords.reduce((acc, pr) => acc + pr.netSalary, 0);
    const totalDues = invoices.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + i.total, 0);
    const paidInvoices = invoices.filter(i => i.status === 'Paid').length;
    
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Financial Summary Report", 14, 16);
        
        const summaryData = [
            ["Metric", "Value"],
            ["Total Income", `$${totalIncome.toLocaleString()}`],
            ["Total Expenses (Payroll)", `$${totalExpenses.toLocaleString()}`],
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
                inv.id,
                students.find(s => s.id === inv.studentId)?.name || 'N/A',
                `$${inv.total.toLocaleString()}`,
                inv.status
            ]),
        });

        doc.save("financial_report.pdf");
    };

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
                <Button onClick={exportToPDF}><FileDown className="mr-2" /> Export Summary</Button>
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
                         <p className="text-xs text-muted-foreground">{payrollRecords.length} payroll records</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
                        <DollarSign className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalDues.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{invoices.length - paidInvoices} unpaid invoices</p>
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

            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>A list of the most recently created invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.slice(-5).reverse().map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-mono">{invoice.id.split('-')[1]}</TableCell>
                                    <TableCell>{students.find(s => s.id === invoice.studentId)?.name || 'N/A'}</TableCell>
                                    <TableCell>${invoice.total.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={invoice.status === 'Paid' ? 'default' : (invoice.status === 'Unpaid' ? 'secondary' : 'destructive')}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/finance/invoices`}>
                                                View Details
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {invoices.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">No invoices generated yet.</TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
