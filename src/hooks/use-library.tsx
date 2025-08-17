
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Book, LibraryTransaction } from '@prisma/client';
import { useToast } from './use-toast';
import { differenceInDays } from 'date-fns';

interface LibraryContextType {
  books: Book[];
  transactions: LibraryTransaction[];
  addBook: (book: Omit<Book, 'id' | 'available' | 'rfid'>) => void;
  updateBook: (book: Book) => void;
  borrowBook: (bookId: string, studentId: string) => void;
  returnBook: (transactionId: string) => void;
  getStudentTransactions: (studentId: string) => LibraryTransaction[];
  getBookById: (bookId: string) => Book | undefined;
  isLoading: boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [transactions, setTransactions] = useState<LibraryTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        const { books, libraryTransactions } = await import('@/lib/data');
        const storedBooks = localStorage.getItem('campus-connect-books');
        const storedTransactions = localStorage.getItem('campus-connect-libraryTransactions');
        
        setBooks(storedBooks ? JSON.parse(storedBooks) : books);
        setTransactions(storedTransactions ? JSON.parse(storedTransactions) : libraryTransactions);
    } catch(e) {
        console.error("Failed to load library data", e);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const persistBooks = (data: Book[]) => localStorage.setItem('campus-connect-books', JSON.stringify(data));
  const persistTransactions = (data: LibraryTransaction[]) => localStorage.setItem('campus-connect-libraryTransactions', JSON.stringify(data));

  const addBook = useCallback(async (bookData: Omit<Book, 'id' | 'available' | 'rfid'>) => {
    setBooks(prev => {
        const newBook = { ...bookData, id: `B${Date.now()}`, available: bookData.quantity, rfid: `RFID${Date.now()}` };
        const updated = [...prev, newBook];
        persistBooks(updated);
        toast({ title: 'Book Added', description: `"${bookData.title}" has been added to the catalog.` });
        return updated;
    });
  }, [toast]);

  const updateBook = useCallback(async (updatedBook: Book) => {
    setBooks(prev => {
        const updated = prev.map(b => b.id === updatedBook.id ? updatedBook : b);
        persistBooks(updated);
        return updated;
    });
  }, []);

  const borrowBook = useCallback(async (bookId: string, studentId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.available < 1) {
        toast({ variant: 'destructive', title: 'Book Unavailable', description: 'This book is currently not available for borrowing.' });
        return;
    }

    const newTransaction: any = {
        id: `L${Date.now()}`,
        studentId,
        bookId,
        type: 'borrow',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0]
    };
    
    setTransactions(prev => {
        const updated = [...prev, newTransaction];
        persistTransactions(updated);
        return updated;
    });

    setBooks(prev => {
        const updated = prev.map(b => b.id === bookId ? { ...b, available: b.available - 1 } : b);
        persistBooks(updated);
        return updated;
    });

    toast({ title: 'Book Borrowed', description: `"${book.title}" has been issued to the student.` });

  }, [books, toast]);

  const returnBook = useCallback(async (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    // Mark original transaction as returned by changing its type.
    // In a real DB, you might have a `returnedDate` field.
    const newTransaction: any = { ...transaction, type: 'return' };
    setTransactions(prev => {
        const updated = prev.map(t => t.id === transactionId ? newTransaction : t);
        persistTransactions(updated);
        return updated;
    });

    setBooks(prev => {
        const updated = prev.map(b => b.id === transaction.bookId ? { ...b, available: Math.min(b.quantity, b.available + 1) } : b);
        persistBooks(updated);
        return updated;
    });
    
    const book = books.find(b => b.id === transaction.bookId);
    const overdueDays = transaction.dueDate ? differenceInDays(new Date(), new Date(transaction.dueDate)) : 0;
    
    if (overdueDays > 0) {
        toast({ variant: 'destructive', title: 'Book Returned Late', description: `"${book?.title}" is overdue by ${overdueDays} days. A late fee may be applied.` });
    } else {
        toast({ title: 'Book Returned', description: `"${book?.title}" has been successfully returned.` });
    }

  }, [transactions, books, toast]);
  
  const getStudentTransactions = useCallback((studentId: string) => {
    return transactions.filter(t => t.studentId === studentId && t.type === 'borrow');
  }, [transactions]);
  
  const getBookById = useCallback((bookId: string) => {
    return books.find(b => b.id === bookId);
  }, [books]);

  return (
    <LibraryContext.Provider value={{ books, transactions, addBook, updateBook, borrowBook, returnBook, getStudentTransactions, getBookById, isLoading }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

    