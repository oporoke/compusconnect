
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

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [fsRes, invRes, payRes, prRes, expRes] = await Promise.all([
                fetch('/api/finance/feestructures'),
                fetch('/api/finance/invoices'),
                fetch('/api/finance/payments'),
                fetch('/api/finance/payroll'),
                fetch('/api/finance/expenses'),
            ]);
            
            if(!fsRes.ok || !invRes.ok || !payRes.ok || !prRes.ok || !expRes.ok) {
                console.error("Failed to fetch one or more finance resources.");
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load complete finance data.' });
                setFeeStructures([]);
                setInvoices([]);
                setPayments([]);
                setPayrollRecords([]);
                setExpenses([]);
                setIsLoading(false);
                return;
            }
            
            setFeeStructures(await fsRes.json());
            setInvoices(await invRes.json());
            setPayments(await payRes.json());
            setPayrollRecords(await prRes.json());
            setExpenses(await expRes.json());

        } catch(e) {
            console.error("Failed to load finance data", e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load finance data.' });
            setFeeStructures([]);
            setInvoices([]);
            setPayments([]);
            setPayrollRecords([]);
            setExpenses([]);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [toast]);

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
