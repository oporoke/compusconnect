
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { books as initialBooks, libraryTransactions as initialTransactions, Book, LibraryTransaction, Student } from '@/lib/data';
import { useToast } from './use-toast';
import { differenceInDays } from 'date-fns';

interface LibraryContextType {
  books: Book[];
  transactions: LibraryTransaction[];
  addBook: (book: Omit<Book, 'id' | 'available'>) => void;
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

  useEffect(() => {
    try {
      const storedBooks = localStorage.getItem('campus-connect-books');
      const storedTransactions = localStorage.getItem('campus-connect-transactions');
      
      setBooks(storedBooks ? JSON.parse(storedBooks) : initialBooks);
      setTransactions(storedTransactions ? JSON.parse(storedTransactions) : initialTransactions);
    } catch (error) {
      console.error("Failed to parse library data from localStorage", error);
      setBooks(initialBooks);
      setTransactions(initialTransactions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistBooks = (data: Book[]) => {
    localStorage.setItem('campus-connect-books', JSON.stringify(data));
  };
  
  const persistTransactions = (data: LibraryTransaction[]) => {
    localStorage.setItem('campus-connect-transactions', JSON.stringify(data));
  };

  const addBook = useCallback((bookData: Omit<Book, 'id' | 'available'>) => {
    setBooks(prev => {
      const newBook: Book = {
        ...bookData,
        id: `B${(prev.length + 1).toString().padStart(3, '0')}`,
        available: bookData.quantity,
      };
      const newBooks = [...prev, newBook];
      persistBooks(newBooks);
      toast({ title: "Book Added", description: `"${bookData.title}" has been added to the catalog.` });
      return newBooks;
    });
  }, [toast]);

  const updateBook = useCallback((updatedBook: Book) => {
    setBooks(prev => {
        const newBooks = prev.map(b => b.id === updatedBook.id ? updatedBook : b);
        persistBooks(newBooks);
        return newBooks;
    })
  }, []);

  const borrowBook = useCallback((bookId: string, studentId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.available <= 0) {
        toast({ variant: 'destructive', title: "Unavailable", description: "This book is currently not available." });
        return;
    }

    setBooks(prev => {
        const newBooks = prev.map(b => b.id === bookId ? { ...b, available: b.available - 1 } : b);
        persistBooks(newBooks);
        return newBooks;
    });

    setTransactions(prev => {
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 14); // 2-week borrowing period

        const newTransaction: LibraryTransaction = {
            id: `L${(prev.length + 1).toString().padStart(3, '0')}`,
            studentId,
            bookId,
            type: 'borrow',
            date: today.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
        };
        const newTransactions = [...prev, newTransaction];
        persistTransactions(newTransactions);
        toast({ title: "Book Borrowed", description: `"${book.title}" has been checked out.` });
        return newTransactions;
    });
  }, [books, toast]);

  const returnBook = useCallback((transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    // Update book availability
    setBooks(prev => {
        const newBooks = prev.map(b => b.id === transaction.bookId ? { ...b, available: b.available + 1 } : b);
        persistBooks(newBooks);
        return newBooks;
    });
    
    // Late fee logic
    let lateFee = 0;
    if (transaction.dueDate) {
        const overdueDays = differenceInDays(new Date(), new Date(transaction.dueDate));
        if (overdueDays > 0) {
            lateFee = overdueDays * 0.50; // $0.50 per day
        }
    }

    // Remove transaction from active borrows
    setTransactions(prev => {
        const newTransactions = prev.filter(t => t.id !== transactionId);
        persistTransactions(newTransactions);
        const book = books.find(b => b.id === transaction.bookId);
        
        let toastDescription = `"${book?.title}" has been returned.`;
        if (lateFee > 0) {
            toastDescription += ` A late fee of $${lateFee.toFixed(2)} has been applied.`;
        }
        
        toast({ title: "Book Returned", description: toastDescription });
        return newTransactions;
    });

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
