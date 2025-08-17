
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { FeeStructure, Invoice, Payment, PayrollRecord, Expense } from '@prisma/client';
import { useToast } from './use-toast';

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
  addPayment: (payment: Omit<Payment, 'id' | 'invoiceId'> & { invoiceId: string }) => void;
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

  const fetchData = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const [fsRes, invRes, payRes, prRes, expRes] = await Promise.all([
        fetch('/api/finance/feestructures', { signal }),
        fetch('/api/finance/invoices', { signal }),
        fetch('/api/finance/payments', { signal }),
        fetch('/api/finance/payroll', { signal }),
        fetch('/api/finance/expenses', { signal }),
      ]);

      if (!fsRes.ok || !invRes.ok || !payRes.ok || !prRes.ok || !expRes.ok) {
        throw new Error('Failed to fetch one or more finance resources.');
      }

      const fsData = await fsRes.json();
      const invData = await invRes.json();
      const payData = await payRes.json();
      const prData = await prRes.json();
      const expData = await expRes.json();

      setFeeStructures(fsData);
      setInvoices(invData);
      setPayments(payData);
      setPayrollRecords(prData);
      setExpenses(expData);

    } catch (error) {
       if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Failed to load finance data:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not load finance data.' });
          setFeeStructures([]);
          setInvoices([]);
          setPayments([]);
          setPayrollRecords([]);
          setExpenses([]);
       }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController.signal);
    return () => {
        abortController.abort();
    };
  }, [fetchData]);

  const addFeeStructure = useCallback((structureData: Omit<FeeStructure, 'id'>) => {
    toast({ title: 'Mock Action', description: `Fee structure creation is not implemented.` });
  }, [toast]);

  const removeFeeStructure = useCallback((id: string) => {
    toast({ title: 'Mock Action', description: `Fee structure removal is not implemented.` });
  }, [toast]);

  const generateInvoicesForGrade = useCallback((grade: string, feeStructureIds: string[]) => {
    toast({ title: 'Mock Action', description: `Invoice generation is not implemented.` });
  }, [toast]);

  const addPayment = useCallback((paymentData: Omit<Payment, 'id'>) => {
    toast({ title: 'Mock Action', description: `Payment recording is not implemented.` });
  }, [toast]);

  const runPayrollForMonth = useCallback((month: string) => {
     toast({ title: 'Mock Action', description: `Payroll processing is not implemented.` });
  }, [toast]);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id'>) => {
     toast({ title: 'Mock Action', description: `Expense logging is not implemented.` });
  }, [toast]);

  const getInvoicesByStudent = useCallback((studentId: string) => {
    return invoices.filter(inv => inv.studentId === studentId);
  }, [invoices]);

  const getPaymentsByInvoice = useCallback((invoiceId: string) => {
    return payments.filter(p => p.invoiceId === invoiceId);
  }, [payments]);

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
