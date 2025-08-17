
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

  // This hook will now fetch from an API route
  useEffect(() => {
    const fetchFinanceData = async () => {
        setIsLoading(true);
        // const [invoicesRes, paymentsRes] = await Promise.all([
        //     fetch('/api/invoices'),
        //     fetch('/api/payments'),
        // ]);
        // const invoicesData = await invoicesRes.json();
        // const paymentsData = await paymentsRes.json();
        // setInvoices(invoicesData);
        // setPayments(paymentsData);
        // ... etc for other finance data
        setFeeStructures(initialFeeStructures);
        setInvoices(initialInvoices);
        setPayments(initialPayments);
        setPayrollRecords(initialPayrollRecords);
        setExpenses(initialExpenses);
        setIsLoading(false);
    }
    fetchFinanceData();
  }, []);

  const getPaymentsByInvoice = useCallback((invoiceId: string) => {
      return payments.filter(p => p.invoiceId === invoiceId);
  }, [payments]);

  const addFeeStructure = useCallback(async (structureData: Omit<FeeStructure, 'id'>) => {
    // API call to POST /api/feestructures
  }, []);

  const removeFeeStructure = useCallback((id: string) => {
    // API call to DELETE /api/feestructures/:id
  }, []);

  const generateInvoicesForGrade = useCallback((grade: string, feeStructureIds: string[]) => {
    // API call to POST /api/invoices/generate
  }, []);

  const addPayment = useCallback((paymentData: Omit<Payment, 'id'>) => {
    // API call to POST /api/payments
  }, [getPaymentsByInvoice, toast]);

  const runPayrollForMonth = useCallback((month: string) => {
    // API call to POST /api/payroll/run
  }, []);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id'>) => {
    // API call to POST /api/expenses
  }, []);

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
