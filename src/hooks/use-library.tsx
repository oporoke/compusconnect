
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { books as initialBooks, libraryTransactions as initialTransactions, Book, LibraryTransaction } from '@/lib/data';
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

  // This hook will now fetch from an API route
  useEffect(() => {
    const fetchLibraryData = async () => {
        setIsLoading(true);
        // ... API calls to fetch books, transactions
        setBooks(initialBooks);
        setTransactions(initialTransactions);
        setIsLoading(false);
    }
    fetchLibraryData();
  }, []);

  const addBook = useCallback(async (bookData: Omit<Book, 'id' | 'available' | 'rfid'>) => {
    // API call to POST /api/books
  }, []);

  const updateBook = useCallback(async (updatedBook: Book) => {
    // API call to PUT /api/books/:id
  }, []);

  const borrowBook = useCallback(async (bookId: string, studentId: string) => {
    // API call to POST /api/transactions/borrow
  }, []);

  const returnBook = useCallback(async (transactionId: string) => {
    // API call to POST /api/transactions/return
  }, []);
  
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
