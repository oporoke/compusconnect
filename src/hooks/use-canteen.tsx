
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import type { CanteenAccount, CanteenTransaction, CanteenMenuItem } from '@/lib/data';


// Define the CanteenMenu type as it is no longer imported
export interface CanteenMenu {
    id: string;
    day: string;
    items: CanteenMenuItem[];
}

interface CanteenContextType {
  accounts: CanteenAccount[];
  transactions: CanteenTransaction[];
  menu: CanteenMenu[];
  isLoading: boolean;
  getAccountByStudentId: (studentId: string) => CanteenAccount | undefined;
  addFunds: (studentId: string, amount: number) => void;
  recordPurchase: (studentId: string, items: { name: string; price: number; }[]) => void;
  updateMenu: (updatedMenu: CanteenMenu[]) => void;
}

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

export const CanteenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<CanteenAccount[]>([]);
  const [transactions, setTransactions] = useState<CanteenTransaction[]>([]);
  const [menu, setMenu] = useState<CanteenMenu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuth();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    if (authState !== 'authenticated') return;
    setIsLoading(true);
    try {
        const [accRes, transRes, menuRes] = await Promise.all([
            fetch('/api/canteen/accounts', { signal }),
            fetch('/api/canteen/transactions', { signal }),
            fetch('/api/canteen/menu', { signal }),
        ]);

        if (!accRes.ok || !transRes.ok || !menuRes.ok) {
            throw new Error('Failed to fetch canteen data');
        }

        setAccounts(await accRes.json());
        setTransactions(await transRes.json());
        setMenu(await menuRes.json());
        
    } catch (error) {
       if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Failed to load canteen data:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not load canteen data.' });
          setAccounts([]);
          setTransactions([]);
          setMenu([]);
       }
    } finally {
        setIsLoading(false);
    }
  }, [toast, authState]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);


  const getAccountByStudentId = useCallback((studentId: string) => {
    return accounts.find(acc => acc.studentId === studentId);
  }, [accounts]);

  const addFunds = useCallback((studentId: string, amount: number) => {
    toast({ title: 'Mock Action', description: 'This feature is not fully implemented in the demo.' });
  }, [toast]);
  
  const recordPurchase = useCallback((studentId: string, items: { name: string; price: number; }[]) => {
      toast({ title: 'Mock Action', description: 'This feature is not fully implemented in the demo.' });
  }, [toast]);


  const updateMenu = useCallback((updatedMenu: CanteenMenu[]) => {
    toast({ title: 'Menu Updated (Mock)', description: 'The canteen menu has been saved.' });
  }, [toast]);

  return (
    <CanteenContext.Provider value={{ accounts, transactions, menu, isLoading, getAccountByStudentId, addFunds, recordPurchase, updateMenu }}>
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (context === undefined) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
};
