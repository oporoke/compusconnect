
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFinance } from '@/hooks/use-finance';
import { useStaff } from '@/hooks/use-staff';
import jsPDF from 'jspdf';
import { FileDown, Rocket, ShieldAlert } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function PayrollPage() {
    const { payrollRecords, runPayrollForMonth } = useFinance();
    const { staff } = useStaff();
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

    const handleRunPayroll = () => {
        runPayrollForMonth(month);
    }
    
    const handleDownloadPayslip = (recordId: string) => {
        const record = payrollRecords.find(pr => pr.id === recordId);
        const staffMember = staff.find(s => s.id === record?.staffId);
        if (!record || !staffMember) return;

        const doc = new jsPDF();
        doc.text(`Payslip for ${staffMember.name}`, 14, 16);
        doc.text(`Month: ${record.month}`, 14, 24);
        
        const data = [
            ['Description', 'Amount'],
            ['Gross Salary', `$${record.grossSalary.toFixed(2)}`],
            ['Deductions (Tax, Insurance)', `-$${record.deductions.toFixed(2)}`],
            ['Net Salary', `$${record.netSalary.toFixed(2)}`],
        ];
        
        (doc as any).autoTable({
            startY: 30,
            head: [data[0]],
            body: data.slice(1),
            theme: 'striped',
            styles: { fontSize: 12 },
            foot: [['Total', `$${record.netSalary.toFixed(2)}`]],
            footStyles: { fontStyle: 'bold' }
        });
        
        doc.save(`payslip_${staffMember.name}_${record.month}.pdf`);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Payroll Processing</h1>
                <p className="text-muted-foreground">Run monthly payroll and view historical records.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Run Payroll</CardTitle>
                    <CardDescription>Select a month and run the payroll process for all staff members.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border rounded-md"/>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline"><ShieldAlert className="mr-2"/>Review Payroll</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Mock Payroll Anomaly Detection</AlertDialogTitle>
                          <AlertDialogDescription>
                            One anomaly found for the upcoming payroll run:
                            <ul className="list-disc pl-5 mt-2">
                                <li><b>Warning:</b> Samuel Jones's net pay is 15% higher than last month's average due to lower tax deductions. Please verify.</li>
                            </ul>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Acknowledge</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
                 <CardFooter>
                    <Button onClick={handleRunPayroll}><Rocket className="mr-2"/>Run for {month}</Button>
                 </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payroll History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Month</TableHead><TableHead>Staff Member</TableHead><TableHead>Gross Salary</TableHead><TableHead>Deductions</TableHead><TableHead>Net Salary</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {payrollRecords.map(record => {
                                const staffMember = staff.find(s => s.id === record.staffId);
                                return (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.month}</TableCell>
                                        <TableCell>{staffMember?.name || 'N/A'}</TableCell>
                                        <TableCell>${record.grossSalary.toLocaleString()}</TableCell>
                                        <TableCell>${record.deductions.toLocaleString()}</TableCell>
                                        <TableCell>${record.netSalary.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleDownloadPayslip(record.id)}><FileDown className="mr-2"/>Payslip</Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
