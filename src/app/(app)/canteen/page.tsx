

"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCanteen } from '@/hooks/use-canteen';
import { useStudents } from '@/hooks/use-students';
import { DollarSign, CreditCard, ShoppingCart, Utensils, Trash2, PlusCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CanteenMenuItem } from '@/lib/data';

function AddFundsDialog() {
    const { addFunds } = useCanteen();
    const { students } = useStudents();
    const [open, setOpen] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addFunds(studentId, Number(amount));
        setStudentId('');
        setAmount('');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><CreditCard /> Add Funds</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Add Funds to Student Account</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select value={studentId} onValueChange={setStudentId} required><SelectTrigger><SelectValue placeholder="Select Student..." /></SelectTrigger><SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
                    <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required min="1" step="0.01" />
                    <DialogFooter><Button type="submit">Add Funds</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function RecordPurchaseDialog() {
    const { recordPurchase, menu } = useCanteen();
    const { students } = useStudents();
    const [open, setOpen] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [selectedItems, setSelectedItems] = useState<{ name: string; price: number; }[]>([]);
    
    const allItems = menu.flatMap(day => day.items).filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
    const total = selectedItems.reduce((acc, current) => acc + current.price, 0);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        recordPurchase(studentId, selectedItems);
        setStudentId('');
        setSelectedItems([]);
        setOpen(false);
    }
    
    const handleItemToggle = (item: CanteenMenuItem, checked: boolean) => {
        if (checked) {
            setSelectedItems([...selectedItems, item]);
        } else {
            setSelectedItems(selectedItems.filter(i => i.name !== item.name));
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline"><ShoppingCart /> Record Purchase</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Record Canteen Purchase</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select value={studentId} onValueChange={setStudentId} required><SelectTrigger><SelectValue placeholder="Select Student..." /></SelectTrigger><SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
                    <div className="space-y-2">
                        <Label>Select Items</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                            {allItems.map(item => (
                                <div key={item.name} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                                    <input type="checkbox" id={item.name} checked={selectedItems.some(i => i.name === item.name)} onChange={e => handleItemToggle(item, e.target.checked)} disabled={item.stock <= 0} />
                                    <Label htmlFor={item.name} className={`flex-1 ${item.stock <= 0 ? 'text-muted-foreground line-through' : ''}`}>{item.name}</Label>
                                    <span className="text-sm font-mono">${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-lg font-bold text-right">Total: ${total.toFixed(2)}</div>
                    <DialogFooter><Button type="submit" disabled={!studentId || selectedItems.length === 0}>Complete Purchase</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function MenuManager() {
    const { menu, updateMenu } = useCanteen();
    const [editableMenu, setEditableMenu] = useState(JSON.parse(JSON.stringify(menu)));

    const handleItemChange = (day: string, itemIndex: number, field: keyof CanteenMenuItem, value: string) => {
        const newMenu = [...editableMenu];
        const dayMenu = newMenu.find(d => d.day === day);
        if (dayMenu) {
            dayMenu.items[itemIndex][field] = typeof dayMenu.items[itemIndex][field] === 'number' ? Number(value) : value;
            setEditableMenu(newMenu);
        }
    };
    
    const addItem = (day: string) => {
         const newMenu = [...editableMenu];
        const dayMenu = newMenu.find(d => d.day === day);
        if (dayMenu) {
            dayMenu.items.push({ name: '', price: 0, stock: 0 });
            setEditableMenu(newMenu);
        }
    }
    
    const removeItem = (day: string, itemIndex: number) => {
         const newMenu = [...editableMenu];
        const dayMenu = newMenu.find(d => d.day === day);
        if (dayMenu) {
            dayMenu.items.splice(itemIndex, 1);
            setEditableMenu(newMenu);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Menu & Stock Management</CardTitle>
                <CardDescription>Set food items, prices, and available stock for each day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {editableMenu.map((dayMenu: any) => (
                    <div key={dayMenu.id}>
                        <h4 className="font-bold mb-2">{dayMenu.day}</h4>
                        <div className="space-y-2">
                        {dayMenu.items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(dayMenu.day, index, 'name', e.target.value)} />
                                <Input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(dayMenu.day, index, 'price', e.target.value)} className="w-24"/>
                                <Input type="number" placeholder="Stock" value={item.stock} onChange={(e) => handleItemChange(dayMenu.day, index, 'stock', e.target.value)} className="w-24"/>
                                <Button variant="ghost" size="icon" onClick={() => removeItem(dayMenu.day, index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                        ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => addItem(dayMenu.day)}><PlusCircle className="mr-2"/> Add Item</Button>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button onClick={() => updateMenu(editableMenu)} className="w-full"><Save className="mr-2"/> Save Menu</Button>
            </CardFooter>
        </Card>
    )
}

export default function CanteenPage() {
    const { accounts, transactions, isLoading } = useCanteen();
    const { students } = useStudents();
    
    const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'N/A';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Canteen Management</h1>
                <p className="text-muted-foreground">Manage student accounts, transactions, and menus.</p>
            </div>
            
            <div className="flex justify-end gap-2">
                <RecordPurchaseDialog />
                <AddFundsDialog />
            </div>

            <Tabs defaultValue="accounts">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="accounts"><DollarSign className="mr-2"/>Accounts</TabsTrigger>
                    <TabsTrigger value="transactions"><ShoppingCart className="mr-2"/>Transactions</TabsTrigger>
                    <TabsTrigger value="menu"><Utensils className="mr-2"/>Menu & Stock</TabsTrigger>
                </TabsList>
                <TabsContent value="accounts">
                    <Card>
                        <CardHeader><CardTitle>Student Account Balances</CardTitle></CardHeader>
                        <CardContent><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader><TableBody>{accounts.map(acc => <TableRow key={acc.studentId}><TableCell>{getStudentName(acc.studentId)}</TableCell><TableCell className="text-right font-mono">${acc.balance.toFixed(2)}</TableCell></TableRow>)}</TableBody></Table></CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="transactions">
                    <Card>
                        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
                        <CardContent><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Student</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader><TableBody>{transactions.slice().reverse().map(tx => <TableRow key={tx.id}><TableCell>{tx.date}</TableCell><TableCell>{getStudentName(tx.studentId)}</TableCell><TableCell className="capitalize">{tx.type}</TableCell><TableCell>{tx.description}</TableCell><TableCell className={`text-right font-mono ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>{tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}</TableCell></TableRow>)}</TableBody></Table></CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="menu">
                   <MenuManager />
                </TabsContent>
            </Tabs>
        </div>
    );
}

    