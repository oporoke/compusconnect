
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CanteenAccount, CanteenTransaction, CanteenMenu, canteenAccounts, canteenTransactions, canteenMenu } from '@/lib/data';
import { useToast } from './use-toast';

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedAccounts = localStorage.getItem('campus-connect-canteen-accounts');
      const storedTransactions = localStorage.getItem('campus-connect-canteen-transactions');
      const storedMenu = localStorage.getItem('campus-connect-canteen-menu');
      
      setAccounts(storedAccounts ? JSON.parse(storedAccounts) : canteenAccounts);
      setTransactions(storedTransactions ? JSON.parse(storedTransactions) : canteenTransactions);
      setMenu(storedMenu ? JSON.parse(storedMenu) : canteenMenu);
    } catch (error) {
      console.error("Failed to parse canteen data from localStorage", error);
      setAccounts(canteenAccounts);
      setTransactions(canteenTransactions);
      setMenu(canteenMenu);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistData = (key: string, data: any) => {
    localStorage.setItem(`campus-connect-canteen-${key}`, JSON.stringify(data));
  };

  const getAccountByStudentId = useCallback((studentId: string) => {
    return accounts.find(acc => acc.studentId === studentId);
  }, [accounts]);

  const addTransaction = useCallback((studentId: string, type: 'credit' | 'debit', amount: number, description: string) => {
    setTransactions(prev => {
        const newTransaction: CanteenTransaction = {
            id: `CT-${Date.now()}`,
            studentId,
            type,
            amount,
            description,
            date: new Date().toISOString().split('T')[0],
        };
        const updatedTransactions = [...prev, newTransaction];
        persistData('transactions', updatedTransactions);
        return updatedTransactions;
    });
  }, []);

  const addFunds = useCallback((studentId: string, amount: number) => {
    setAccounts(prev => {
        const accountExists = prev.some(acc => acc.studentId === studentId);
        let updatedAccounts;
        if (accountExists) {
            updatedAccounts = prev.map(acc => acc.studentId === studentId ? { ...acc, balance: acc.balance + amount } : acc);
        } else {
            updatedAccounts = [...prev, { studentId, balance: amount }];
        }
        persistData('accounts', updatedAccounts);
        addTransaction(studentId, 'credit', amount, 'Added funds');
        toast({ title: 'Funds Added', description: `$${amount.toFixed(2)} added to the account.` });
        return updatedAccounts;
    });
  }, [toast, addTransaction]);

  const recordPurchase = useCallback((studentId: string, items: { name: string; price: number; }[]) => {
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
    const description = items.map(item => item.name).join(', ');

    setAccounts(prev => {
        const account = prev.find(acc => acc.studentId === studentId);
        if (!account || account.balance < totalAmount) {
            toast({ variant: 'destructive', title: 'Insufficient Funds', description: 'The student does not have enough balance for this purchase.' });
            return prev;
        }

        // Check stock levels
        let canFulfill = true;
        const updatedMenu = JSON.parse(JSON.stringify(menu));
        items.forEach(purchasedItem => {
            let itemFound = false;
            for (const dayMenu of updatedMenu) {
                const menuItem = dayMenu.items.find((i:any) => i.name === purchasedItem.name);
                if (menuItem) {
                    if (menuItem.stock > 0) {
                        menuItem.stock -= 1;
                        itemFound = true;
                    } else {
                        canFulfill = false;
                        toast({ variant: 'destructive', title: 'Out of Stock', description: `${purchasedItem.name} is no longer available.` });
                    }
                    break;
                }
            }
             if (!itemFound) {
                canFulfill = false;
                 toast({ variant: 'destructive', title: 'Item not found', description: `${purchasedItem.name} could not be found in the menu.` });
            }
        });

        if (!canFulfill) {
            return prev; // Revert if any item is out of stock
        }

        // If all items are in stock, proceed with purchase
        const updatedAccounts = prev.map(acc => acc.studentId === studentId ? { ...acc, balance: acc.balance - totalAmount } : acc);
        persistData('accounts', updatedAccounts);
        setMenu(updatedMenu);
        persistData('menu', updatedMenu);

        addTransaction(studentId, 'debit', totalAmount, description);
        toast({ title: 'Purchase Recorded', description: `A charge of $${totalAmount.toFixed(2)} was made.` });
        return updatedAccounts;
    });
  }, [menu, toast, addTransaction]);


  const updateMenu = useCallback((updatedMenu: CanteenMenu[]) => {
    setMenu(updatedMenu);
    persistData('menu', updatedMenu);
    toast({ title: 'Menu Updated', description: 'The canteen menu has been saved.' });
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
