
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Book, LibraryTransaction } from '@prisma/client';
import { useToast } from './use-toast';
import { differenceInDays } from 'date-fns';
import { useAuth } from './use-auth';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuth();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    if (authState !== 'authenticated') return;
    setIsLoading(true);
    try {
      const [booksRes, transRes] = await Promise.all([
        fetch('/api/library/books', { signal }),
        fetch('/api/library/transactions', { signal }),
      ]);
      if (!booksRes.ok || !transRes.ok) {
        throw new Error('Failed to fetch library data');
      }
      setBooks(await booksRes.json());
      setTransactions(await transRes.json());
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') {
        console.error("Failed to load library data", e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load library data.' });
        setBooks([]);
        setTransactions([]);
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
  
  const addBook = useCallback(async (bookData: Omit<Book, 'id' | 'available' | 'rfid'>) => {
    toast({ title: 'Mock Action', description: 'Adding books is not implemented in this demo.' });
  }, [toast]);

  const updateBook = useCallback(async (updatedBook: Book) => {
    toast({ title: 'Mock Action', description: 'Updating books is not implemented in this demo.' });
  }, []);

  const borrowBook = useCallback(async (bookId: string, studentId: string) => {
    toast({ title: 'Mock Action', description: 'Borrowing books is not implemented in this demo.' });
  }, [toast]);

  const returnBook = useCallback(async (transactionId: string) => {
    toast({ title: 'Mock Action', description: 'Returning books is not implemented in this demo.' });
  }, [toast]);
  
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
