
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { FeeStructure, Invoice, Payment, PayrollRecord, Expense } from '@prisma/client';

import { useToast } from './use-toast';
import { useStudents } from './use-students';
import { useStaff } from './use-staff';

interface FinanceContextType {
  feeStructures: FeeStructure[];
  invoices: Invoice[];
  payments: Payment[];
  payrollRecords: PayrollRecord[];
  expenses: Expense[];
  isLoading: boolean;
  addFeeStructure: (structure: Omit<FeeStructure, 'id'>) => void;
  removeFeeStructure: (id: string) => void;
  generateInvoicesForGrade: (grade: string, feeStructureIds: string[]) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  runPayrollForMonth: (month: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  getInvoicesByStudent: (studentId: string) => Invoice[];
  getPaymentsByInvoice: (invoiceId: string) => Payment[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { students } = useStudents();
  const { staff } = useStaff();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        // This is a placeholder for fetching from a real API in the future
        // For now, we'll keep using the local mock data
        const { feeStructures: fs, invoices: inv, payments: p, payrollRecords: pr, expenses: exp } = await import('@/lib/data');
        const storedFeeStructures = localStorage.getItem('campus-connect-feeStructures');
        const storedInvoices = localStorage.getItem('campus-connect-invoices');
        const storedPayments = localStorage.getItem('campus-connect-payments');
        const storedPayrollRecords = localStorage.getItem('campus-connect-payrollRecords');
        const storedExpenses = localStorage.getItem('campus-connect-expenses');

        setFeeStructures(storedFeeStructures ? JSON.parse(storedFeeStructures) : fs);
        setInvoices(storedInvoices ? JSON.parse(storedInvoices) : inv);
        setPayments(storedPayments ? JSON.parse(storedPayments) : p);
        setPayrollRecords(storedPayrollRecords ? JSON.parse(storedPayrollRecords) : pr);
        setExpenses(storedExpenses ? JSON.parse(storedExpenses) : exp);
    } catch(e) {
        console.error("Failed to load finance data", e);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const persistData = (key: string, data: any) => {
    localStorage.setItem(`campus-connect-${key}`, JSON.stringify(data));
  };

  const getPaymentsByInvoice = useCallback((invoiceId: string) => {
      return payments.filter(p => p.invoiceId === invoiceId);
  }, [payments]);

  const addFeeStructure = useCallback((structureData: Omit<FeeStructure, 'id'>) => {
    setFeeStructures(prev => {
        const newStructure = { ...structureData, id: `FS${Date.now()}` };
        const updatedStructures = [...prev, newStructure];
        persistData('feeStructures', updatedStructures);
        toast({ title: 'Fee Structure Added', description: `"${structureData.name}" has been created.` });
        return updatedStructures;
    });
  }, [toast]);

  const removeFeeStructure = useCallback((id: string) => {
    setFeeStructures(prev => {
        const updatedStructures = prev.filter(fs => fs.id !== id);
        persistData('feeStructures', updatedStructures);
        toast({ title: 'Fee Structure Removed' });
        return updatedStructures;
    });
  }, [toast]);

  const generateInvoicesForGrade = useCallback((grade: string, feeStructureIds: string[]) => {
    const studentsInGrade = students.filter(s => s.grade === grade);
    const structuresToApply = feeStructures.filter(fs => feeStructureIds.includes(fs.id));

    if (studentsInGrade.length === 0 || structuresToApply.length === 0) {
        toast({ variant: 'destructive', title: 'Cannot Generate Invoices', description: 'No students in the selected grade or no fee structures chosen.' });
        return;
    }
    
    const newInvoices: Invoice[] = studentsInGrade.map(student => {
        const items: any[] = structuresToApply.map(fs => ({
            description: fs.name,
            amount: fs.amount
        }));
        const total = items.reduce((acc, item) => acc + item.amount, 0);

        return {
            id: `INV-${student.id}-${Date.now()}`,
            studentId: student.id,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
            items,
            total,
            status: 'Unpaid'
        };
    });

    setInvoices(prev => {
        const updated = [...prev, ...newInvoices];
        persistData('invoices', updated);
        return updated;
    });

    toast({ title: 'Invoices Generated', description: `${newInvoices.length} invoices were created for Grade ${grade}.` });
  }, [students, feeStructures, toast]);

  const addPayment = useCallback((paymentData: Omit<Payment, 'id'>) => {
    setPayments(prev => {
        const newPayment: any = { ...paymentData, id: `PAY-${Date.now()}` };
        const updatedPayments = [...prev, newPayment];
        persistData('payments', updatedPayments);
        
        // Update invoice status
        setInvoices(currentInvoices => {
            const updatedInvoices = currentInvoices.map(inv => {
                if (inv.id === paymentData.invoiceId) {
                    const paymentsForInvoice = getPaymentsByInvoice(inv.id);
                    const totalPaid = paymentsForInvoice.reduce((acc, p) => acc + p.amount, 0) + newPayment.amount;
                    if (totalPaid >= inv.total) {
                        return { ...inv, status: 'Paid' };
                    }
                }
                return inv;
            });
             persistData('invoices', updatedInvoices);
             return updatedInvoices;
        });

        toast({ title: 'Payment Recorded', description: `Payment of $${paymentData.amount} has been successfully recorded.` });
        return updatedPayments;
    });
  }, [toast, getPaymentsByInvoice]);

  const runPayrollForMonth = useCallback((month: string) => {
    if (payrollRecords.some(pr => pr.month === month)) {
        toast({ variant: 'destructive', title: "Payroll Already Run", description: `Payroll for ${month} has already been processed.` });
        return;
    }
    const newPayrollRecords: any[] = staff.map(s => {
        const deductions = (s.salary * (s.taxDeduction / 100)) + s.insuranceDeduction;
        return {
            id: `PR-${s.id}-${month}`,
            staffId: s.id,
            month,
            grossSalary: s.salary,
            deductions,
            netSalary: s.salary - deductions,
            date: new Date().toISOString().split('T')[0]
        };
    });

    setPayrollRecords(prev => {
        const updated = [...prev, ...newPayrollRecords];
        persistData('payrollRecords', updated);
        return updated;
    });

    toast({ title: 'Payroll Run Successfully', description: `Payroll has been processed for ${newPayrollRecords.length} staff members for ${month}.` });
  }, [staff, payrollRecords, toast]);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id'>) => {
    setExpenses(prev => {
        const newExpense: any = { ...expenseData, id: `EXP-${Date.now()}` };
        const updated = [...prev, newExpense];
        persistData('expenses', updated);
        toast({ title: 'Expense Logged', description: `Expense for ${expenseData.description} has been added.` });
        return updated;
    });
  }, [toast]);


  const getInvoicesByStudent = useCallback((studentId: string) => {
      return invoices.filter(inv => inv.studentId === studentId);
  }, [invoices]);

  return (
    <FinanceContext.Provider value={{ feeStructures, invoices, payments, payrollRecords, expenses, isLoading, addFeeStructure, removeFeeStructure, generateInvoicesForGrade, addPayment, runPayrollForMonth, addExpense, getInvoicesByStudent, getPaymentsByInvoice }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

    