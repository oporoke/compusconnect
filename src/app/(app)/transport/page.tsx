
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
import { Bus, MapPin, User, PlusCircle, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';
import { useTransport } from '@/hooks/use-transport';
import type { Route, Vehicle, Driver } from '@/lib/data';
import React from 'react';

function AddRouteDialog() {
    const [open, setOpen] = useState(false);
    const { addRoute, drivers, vehicles } = useTransport();
    const [name, setName] = useState('');
    const [stops, setStops] = useState('');
    const [vehicleId, setVehicleId] = useState('');
    const [driverId, setDriverId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addRoute({ name, stops: stops.split(',').map(s => s.trim()), vehicleId, driverId });
        setOpen(false);
        setName(''); setStops(''); setVehicleId(''); setDriverId('');
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
                        <Select value={vehicleId} onValueChange={setVehicleId} required>
                            <SelectTrigger><SelectValue placeholder="Select a vehicle..." /></SelectTrigger>
                            <SelectContent>
                                {vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.model} ({v.id})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="driver">Assign Driver</Label>
                        <Select value={driverId} onValueChange={setDriverId} required>
                            <SelectTrigger><SelectValue placeholder="Select a driver..." /></SelectTrigger>
                            <SelectContent>
                                {drivers.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
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

function LiveTrackingMap() {
    const { routes, getVehicleById, updateVehicleLocation } = useTransport();
    const [locations, setLocations] = useState<Record<string, { top: string, left: string}>>({});

    React.useEffect(() => {
        // Initial random placement
        const initialLocs: Record<string, { top: string, left: string}> = {};
        routes.forEach(route => {
            initialLocs[route.vehicleId] = {
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
            };
        });
        setLocations(initialLocs);

        const interval = setInterval(() => {
            const newLocs: Record<string, { top: string, left: string}> = {};
            routes.forEach(route => {
                const newTop = Math.random() * 80 + 10;
                const newLeft = Math.random() * 80 + 10;
                newLocs[route.vehicleId] = {
                    top: `${newTop}%`,
                    left: `${newLeft}%`,
                };
                updateVehicleLocation(route.vehicleId, { lat: newTop, lng: newLeft });
            });
            setLocations(newLocs);
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, [routes, updateVehicleLocation]);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Live GPS Tracking</CardTitle>
                <CardDescription>Simulated real-time tracking of bus locations.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="relative h-96 bg-muted rounded-md overflow-hidden">
                   <img src="https://placehold.co/600x400.png" alt="Map" className="w-full h-full object-cover" data-ai-hint="map" />
                   {routes.map(route => {
                       const vehicle = getVehicleById(route.vehicleId);
                       if (!vehicle || !locations[vehicle.id]) return null;
                       return (
                           <div key={vehicle.id} className="absolute transition-all duration-1000 ease-linear" style={{ top: locations[vehicle.id].top, left: locations[vehicle.id].left }}>
                               <div className="relative group">
                                   <Bus className="h-8 w-8 text-primary" />
                                   <div className="absolute bottom-full mb-2 w-max bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       {vehicle.model} ({route.name})
                                   </div>
                               </div>
                           </div>
                       )
                   })}
               </div>
            </CardContent>
        </Card>
    );
}

export default function TransportPage() {
    const { routes, vehicles, drivers, isLoading, getVehicleById, getDriverById, removeRoute } = useTransport();

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
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {routes.map(route => {
                                            const vehicle = getVehicleById(route.id);
                                            const driver = getDriverById(route.driverId);
                                            return (
                                                <TableRow key={route.id}>
                                                    <TableCell className="font-medium">{route.name}</TableCell>
                                                    <TableCell>{getVehicleById(route.vehicleId)?.model || 'N/A'}</TableCell>
                                                    <TableCell>{driver?.name || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{route.stops.length} stops</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" onClick={() => removeRoute(route.id)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
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
                <LiveTrackingMap />
            </div>
        </div>
    )
}
