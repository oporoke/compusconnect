
"use client";

import { useState } from 'react';
import { useLibrary } from '@/hooks/use-library';
import { useStudents } from '@/hooks/use-students';
import { useAuth } from '@/hooks/use-auth';
import { ROLES } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, BookPlus, BookMinus, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Book } from '@/lib/data';

function AddBookDialog() {
    const [open, setOpen] = useState(false);
    const { addBook } = useLibrary();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [subject, setSubject] = useState('');
    const [isbn, setIsbn] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addBook({ title, author, subject, isbn, quantity: parseInt(quantity) });
        setOpen(false);
        // Reset form
        setTitle(''); setAuthor(''); setSubject(''); setIsbn(''); setQuantity('');
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" /> Add New Book
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Book to Catalog</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="title">Title</Label>
                           <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="author">Author</Label>
                           <Input id="author" value={author} onChange={e => setAuthor(e.target.value)} required />
                        </div>
                    </div>
                     <div className="space-y-2">
                       <Label htmlFor="subject">Subject</Label>
                       <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} required />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="isbn">ISBN</Label>
                           <Input id="isbn" value={isbn} onChange={e => setIsbn(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="quantity">Quantity</Label>
                           <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Book</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function BorrowReturnDialog() {
    const { user } = useAuth();
    const { students } = useStudents();
    const { books, borrowBook, returnBook, getStudentTransactions, getBookById } = useLibrary();
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState<'borrow' | 'return'>('borrow');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedBook, setSelectedBook] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState('');
    const studentTransactions = getStudentTransactions(selectedStudent);

    const handleAction = () => {
        if (action === 'borrow') {
            borrowBook(selectedBook, selectedStudent);
        } else {
            returnBook(selectedTransaction);
        }
        setOpen(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {user && [ROLES.ADMIN, ROLES.TEACHER].includes(user.role) && (
                     <Button variant="outline">Borrow / Return Book</Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Borrow or Return a Book</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Select value={action} onValueChange={(v) => setAction(v as 'borrow' | 'return')}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="borrow">Borrow a Book</SelectItem>
                            <SelectItem value="return">Return a Book</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                        <SelectTrigger><SelectValue placeholder="Select a student..." /></SelectTrigger>
                        <SelectContent>
                            {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    {action === 'borrow' ? (
                        <Select value={selectedBook} onValueChange={setSelectedBook}>
                            <SelectTrigger><SelectValue placeholder="Select a book to borrow..." /></SelectTrigger>
                            <SelectContent>
                                {books.filter(b => b.available > 0).map(b => <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    ) : (
                         <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
                            <SelectTrigger><SelectValue placeholder="Select a book to return..." /></SelectTrigger>
                            <SelectContent>
                                {studentTransactions.map(t => {
                                    const book = getBookById(t.bookId);
                                    return <SelectItem key={t.id} value={t.id}>{book?.title || 'Unknown Book'}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleAction} disabled={!selectedStudent || (action === 'borrow' ? !selectedBook : !selectedTransaction)}>
                        {action === 'borrow' ? <BookPlus className="mr-2" /> : <BookMinus className="mr-2" />}
                        {action === 'borrow' ? 'Borrow Book' : 'Return Book'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function LibraryPage() {
    const { user } = useAuth();
    const { books, isLoading } = useLibrary();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Library Catalog</h1>
                    <p className="text-muted-foreground">Browse, search, and manage library resources.</p>
                </div>
                <div className="flex gap-2">
                    <BorrowReturnDialog />
                    {user && [ROLES.ADMIN, ROLES.TEACHER].includes(user.role) && (
                        <AddBookDialog />
                    )}
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Book Collection</CardTitle>
                    <CardDescription>Search for books by title, author, or subject.</CardDescription>
                    <div className="relative pt-2">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search catalog..." 
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="w-full h-64" />
                    ) : (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead className="text-center">Availability</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBooks.map(book => (
                                        <TableRow key={book.id}>
                                            <TableCell className="font-medium">{book.title}</TableCell>
                                            <TableCell>{book.author}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{book.subject}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={book.available > 0 ? 'secondary' : 'destructive'}>
                                                    {book.available} / {book.quantity}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
