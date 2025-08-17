
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from 'lucide-react';
import { useInventory } from '@/hooks/use-inventory'; // This hook will need to be created
import { useStaff } from '@/hooks/use-staff';
import type { Asset } from '@/lib/data';

function AddAssetDialog() {
    const { addAsset } = useInventory();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState<Asset['type']>('Device');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addAsset({ name, type });
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><PlusCircle/> Add Asset</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Add New Asset</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Asset Name (e.g. Dell Latitude 5420)" value={name} onChange={e => setName(e.target.value)} required />
                    <Select value={type} onValueChange={(v) => setType(v as Asset['type'])}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Device">Device</SelectItem>
                            <SelectItem value="Furniture">Furniture</SelectItem>
                            <SelectItem value="Book">Book</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                        </SelectContent>
                    </Select>
                    <DialogFooter><Button type="submit">Add Asset</Button></DialogFooter>
                </form>
            </DialogContent>
    )
}

export default function InventoryPage() {
    const { assets, assignAsset, isLoading } = useInventory();
    const { staff } = useStaff();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAssets = assets.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusVariant = (status: Asset['status']) => {
        switch(status) {
            case 'In Use': return 'destructive';
            case 'Maintenance': return 'secondary';
            default: return 'default';
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-headline font-bold">Asset &amp; Inventory</h1>
                    <p className="text-muted-foreground">Track and manage all school assets.</p>
                </div>
                 <AddAssetDialog />
            </div>
            
            <Card>
                <CardHeader>
                     <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search assets..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Assigned To</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredAssets.map(asset => (
                                <TableRow key={asset.id}>
                                    <TableCell className="font-medium">{asset.name}</TableCell>
                                    <TableCell>{asset.type}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge></TableCell>
                                    <TableCell>{asset.assignedTo ? (staff.find(s => s.id === asset.assignedTo)?.name || asset.assignedTo) : 'N/A'}</TableCell>
                                    <TableCell>
                                        <Select onValueChange={(staffId) => assignAsset(asset.id, staffId)} value={asset.assignedTo || ''}>
                                            <SelectTrigger className="w-40 h-8"><SelectValue placeholder="Assign..."/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null">Unassign</SelectItem>
                                                {staff.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
