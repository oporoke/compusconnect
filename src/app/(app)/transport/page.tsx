
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, MapPin, User, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';
import { useTransport } from '@/hooks/use-transport';
import type { Route, Vehicle } from '@/lib/data';

function AddRouteDialog() {
    const [open, setOpen] = useState(false);
    const { addRoute, vehicles } = useTransport();
    const [name, setName] = useState('');
    const [stops, setStops] = useState('');
    const [vehicleId, setVehicleId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addRoute({ name, stops: stops.split(',').map(s => s.trim()), vehicleId });
        setOpen(false);
        setName(''); setStops(''); setVehicleId('');
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" /> Add Route
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Transport Route</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="space-y-2">
                       <Label htmlFor="name">Route Name</Label>
                       <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="stops">Stops (comma-separated)</Label>
                       <Input id="stops" value={stops} onChange={e => setStops(e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                       <Label htmlFor="vehicle">Assign Vehicle</Label>
                        <Select value={vehicleId} onValueChange={setVehicleId}>
                            <SelectTrigger><SelectValue placeholder="Select a vehicle..." /></SelectTrigger>
                            <SelectContent>
                                {vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.model} ({v.id})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Route</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function TransportPage() {
    const { routes, vehicles, isLoading, getVehicleByRoute } = useTransport();

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Transport Management</h1>
                    <p className="text-muted-foreground">Manage bus routes, vehicles, and driver assignments.</p>
                </div>
                <AddRouteDialog />
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Bus Routes</CardTitle>
                        <CardDescription>Overview of all active transport routes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="w-full h-64" />
                        ) : (
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Route Name</TableHead>
                                            <TableHead>Vehicle</TableHead>
                                            <TableHead>Driver</TableHead>
                                            <TableHead>Stops</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {routes.map(route => {
                                            const vehicle = getVehicleByRoute(route.id);
                                            return (
                                                <TableRow key={route.id}>
                                                    <TableCell className="font-medium">{route.name}</TableCell>
                                                    <TableCell>{vehicle?.model || 'N/A'}</TableCell>
                                                    <TableCell>{vehicle?.driverName || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{route.stops.length} stops</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Live GPS Tracking</CardTitle>
                        <CardDescription>Mock tracking of bus locations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="relative h-64 bg-muted rounded-md overflow-hidden">
                           <img src="https://placehold.co/600x400.png" alt="Map" className="w-full h-full object-cover" data-ai-hint="map" />
                           <div className="absolute top-1/4 left-1/3 animate-pulse">
                               <Bus className="h-8 w-8 text-primary" />
                               <div className="relative flex items-center justify-center">
                                  <div className="absolute h-4 w-4 bg-primary/50 rounded-full animate-ping"></div>
                                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                               </div>
                           </div>
                            <div className="absolute top-2/3 left-2/3 animate-pulse" style={{animationDelay: '1s'}}>
                               <Bus className="h-8 w-8 text-accent" />
                               <div className="relative flex items-center justify-center">
                                  <div className="absolute h-4 w-4 bg-accent/50 rounded-full animate-ping"></div>
                                  <div className="h-2 w-2 bg-accent rounded-full"></div>
                               </div>
                           </div>
                       </div>
                       <p className="text-xs text-center mt-2 text-muted-foreground">Note: GPS tracking is for demonstration purposes only.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
