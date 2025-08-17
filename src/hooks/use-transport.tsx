
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Vehicle, Route, Driver } from '@prisma/client';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

interface TransportContextType {
  vehicles: Vehicle[];
  routes: Route[];
  drivers: Driver[];
  addRoute: (route: Omit<Route, 'id'>) => void;
  removeRoute: (routeId: string) => void;
  getVehicleById: (vehicleId: string) => Vehicle | undefined;
  getVehicleByRoute: (routeId: string) => Vehicle | undefined;
  getDriverById: (driverId: string) => Driver | undefined;
  updateVehicleLocation: (vehicleId: string, location: { lat: number; lng: number }) => void;
  isLoading: boolean;
}

const TransportContext = createContext<TransportContextType | undefined>(undefined);

export const TransportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuth();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    try {
        const [vehiclesRes, routesRes, driversRes] = await Promise.all([
            fetch('/api/transport/vehicles', { signal }),
            fetch('/api/transport/routes', { signal }),
            fetch('/api/transport/drivers', { signal }),
        ]);

        if (!vehiclesRes.ok || !routesRes.ok || !driversRes.ok) {
            throw new Error('Failed to fetch transport data');
        }

        setVehicles(await vehiclesRes.json());
        setRoutes(await routesRes.json());
        setDrivers(await driversRes.json());
        
    } catch (error) {
       if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Failed to load transport data:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not load transport data.' });
          setVehicles([]);
          setRoutes([]);
          setDrivers([]);
       }
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (authState === 'authenticated') {
      const controller = new AbortController();
      fetchData(controller.signal);
      return () => controller.abort();
    } else {
        setVehicles([]);
        setRoutes([]);
        setDrivers([]);
        setIsLoading(false);
    }
  }, [fetchData, authState]);


  const addRoute = useCallback((routeData: Omit<Route, 'id'>) => {
    toast({ title: 'Mock Action', description: 'Adding routes is not implemented in this demo.' });
  }, [toast]);
  
  const removeRoute = useCallback((routeId: string) => {
    toast({ title: 'Mock Action', description: 'Removing routes is not implemented in this demo.' });
  }, [toast]);
  
  const updateVehicleLocation = useCallback((vehicleId: string, location: { lat: number; lng: number }) => {
    setVehicles(prev => {
        const newVehicles = prev.map(v => v.id === vehicleId ? { ...v, lat: location.lat, lng: location.lng } : v);
        return newVehicles;
    })
  }, []);

  const getVehicleByRoute = useCallback((routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return vehicles.find(v => v.id === route?.vehicleId);
  }, [routes, vehicles]);
  
  const getVehicleById = useCallback((vehicleId: string) => {
      return vehicles.find(v => v.id === vehicleId);
  }, [vehicles]);
  
  const getDriverById = useCallback((driverId: string) => {
      return drivers.find(d => d.id === driverId);
  }, [drivers]);

  return (
    <TransportContext.Provider value={{ vehicles, routes, drivers, addRoute, removeRoute, getVehicleById, getVehicleByRoute, getDriverById, updateVehicleLocation, isLoading }}>
      {children}
    </TransportContext.Provider>
  );
};

export const useTransport = () => {
  const context = useContext(TransportContext);
  if (context === undefined) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
};
