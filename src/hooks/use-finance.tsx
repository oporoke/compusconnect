
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
    feeStructures as initialFeeStructures, 
    invoices as initialInvoices, 
    payments as initialPayments, 
    payrollRecords as initialPayrollRecords,
    expenses as initialExpenses,
    FeeStructure, Invoice, Payment, PayrollRecord, InvoiceItem, Expense
} from '@/lib/data';
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

  useEffect(() => {
    try {
      const storedFeeStructures = localStorage.getItem('campus-connect-feeStructures');
      const storedInvoices = localStorage.getItem('campus-connect-invoices');
      const storedPayments = localStorage.getItem('campus-connect-payments');
      const storedPayroll = localStorage.getItem('campus-connect-payroll');
      const storedExpenses = localStorage.getItem('campus-connect-expenses');
      
      setFeeStructures(storedFeeStructures ? JSON.parse(storedFeeStructures) : initialFeeStructures);
      setInvoices(storedInvoices ? JSON.parse(storedInvoices) : initialInvoices);
      setPayments(storedPayments ? JSON.parse(storedPayments) : initialPayments);
      setPayrollRecords(storedPayroll ? JSON.parse(storedPayroll) : initialPayrollRecords);
      setExpenses(storedExpenses ? JSON.parse(storedExpenses) : initialExpenses);
    } catch (error) {
      console.error("Failed to parse finance data from localStorage", error);
      // Initialize with default data if parsing fails
      setFeeStructures(initialFeeStructures);
      setInvoices(initialInvoices);
      setPayments(initialPayments);
      setPayrollRecords(initialPayrollRecords);
      setExpenses(initialExpenses);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistData = (key: string, data: any) => {
    localStorage.setItem(`campus-connect-${key}`, JSON.stringify(data));
  };

  const getPaymentsByInvoice = useCallback((invoiceId: string) => {
      return payments.filter(p => p.invoiceId === invoiceId);
  }, [payments]);

  const addFeeStructure = useCallback((structureData: Omit<FeeStructure, 'id'>) => {
    setFeeStructures(prev => {
      const newStructure: FeeStructure = { ...structureData, id: `FS${Date.now()}` };
      const updatedStructures = [...prev, newStructure];
      persistData('feeStructures', updatedStructures);
      toast({ title: "Fee Structure Added", description: `"${structureData.name}" has been created.` });
      return updatedStructures;
    });
  }, [toast]);

  const removeFeeStructure = useCallback((id: string) => {
    setFeeStructures(prev => {
        const updated = prev.filter(fs => fs.id !== id);
        persistData('feeStructures', updated);
        toast({title: "Fee Structure Removed"});
        return updated;
    });
  }, [toast]);

  const generateInvoicesForGrade = useCallback((grade: string, feeStructureIds: string[]) => {
    const studentsInGrade = students.filter(s => s.grade === grade);
    const structuresToApply = feeStructures.filter(fs => feeStructureIds.includes(fs.id));
    
    if(studentsInGrade.length === 0 || structuresToApply.length === 0) {
        toast({ variant: 'destructive', title: "Cannot Generate", description: "No students or fee structures selected." });
        return;
    }

    const newInvoices: Invoice[] = [];
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 30);

    studentsInGrade.forEach(student => {
        const items: InvoiceItem[] = structuresToApply.map(s => ({
            description: s.name,
            amount: s.amount
        }));
        
        const total = items.reduce((acc, item) => acc + item.amount, 0);

        const newInvoice: Invoice = {
            id: `INV-${student.id}-${Date.now()}`,
            studentId: student.id,
            date: today.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            items,
            total,
            status: 'Unpaid'
        };
        newInvoices.push(newInvoice);
    });
    
    setInvoices(prev => {
        const updated = [...prev, ...newInvoices];
        persistData('invoices', updated);
        toast({ title: "Invoices Generated", description: `${newInvoices.length} invoices were created for Grade ${grade}.` });
        return updated;
    });
    
  }, [students, feeStructures, toast]);

  const addPayment = useCallback((paymentData: Omit<Payment, 'id'>) => {
    setPayments(prev => {
        const newPayment: Payment = { ...paymentData, id: `PAY-${Date.now()}`};
        const updated = [...prev, newPayment];
        persistData('payments', updated);
        return updated;
    });

    setInvoices(prev => {
        const invoice = prev.find(inv => inv.id === paymentData.invoiceId);
        if (!invoice) return prev;

        const paymentsForInvoice = [ ...getPaymentsByInvoice(paymentData.invoiceId), paymentData ];
        const totalPaid = paymentsForInvoice.reduce((acc, p) => acc + p.amount, 0);
        
        const updatedStatus = totalPaid >= invoice.total ? 'Paid' : 'Unpaid';

        const updated = prev.map(inv => inv.id === paymentData.invoiceId ? { ...inv, status: updatedStatus } : inv);
        persistData('invoices', updated);
        toast({ title: "Payment Recorded", description: "The payment has been successfully recorded and the invoice status updated." });
        return updated;
    });
  }, [toast, getPaymentsByInvoice]);

  const runPayrollForMonth = useCallback((month: string) => {
    const newPayrollRecords: PayrollRecord[] = staff.map(staffMember => {
        const grossSalary = staffMember.salary;
        const taxDeduction = grossSalary * ((staffMember.deductions?.tax || 0) / 100);
        const insuranceDeduction = staffMember.deductions?.insurance || 0;
        const totalDeductions = taxDeduction + insuranceDeduction;
        const netSalary = grossSalary - totalDeductions;
        
        return {
            id: `PR-${staffMember.id}-${month}`,
            staffId: staffMember.id,
            month,
            grossSalary,
            deductions: totalDeductions,
            netSalary,
            date: new Date().toISOString().split('T')[0]
        };
    });

    setPayrollRecords(prev => {
        const otherMonths = prev.filter(pr => pr.month !== month);
        const updated = [...otherMonths, ...newPayrollRecords];
        persistData('payroll', updated);
        toast({ title: "Payroll Processed", description: `Payroll for ${month} has been run for ${staff.length} staff members.` });
        return updated;
    });
  }, [staff, toast]);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id'>) => {
    setExpenses(prev => {
        const newExpense: Expense = { ...expenseData, id: `EXP-${Date.now()}` };
        const updated = [...prev, newExpense];
        persistData('expenses', updated);
        toast({ title: "Expense Logged" });
        return updated;
    })
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
