
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { vehicles as initialVehicles, routes as initialRoutes, drivers as initialDrivers, Vehicle, Route, Driver } from '@/lib/data';
import { useToast } from './use-toast';

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedVehicles = localStorage.getItem('campus-connect-vehicles');
      const storedRoutes = localStorage.getItem('campus-connect-routes');
      const storedDrivers = localStorage.getItem('campus-connect-drivers');
      
      setVehicles(storedVehicles ? JSON.parse(storedVehicles) : initialVehicles);
      setRoutes(storedRoutes ? JSON.parse(storedRoutes) : initialRoutes);
      setDrivers(storedDrivers ? JSON.parse(storedDrivers) : initialDrivers);
    } catch (error) {
      console.error("Failed to parse transport data from localStorage", error);
      setVehicles(initialVehicles);
      setRoutes(initialRoutes);
      setDrivers(initialDrivers);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistRoutes = (data: Route[]) => {
    localStorage.setItem('campus-connect-routes', JSON.stringify(data));
  };
  
  const persistVehicles = (data: Vehicle[]) => {
    localStorage.setItem('campus-connect-vehicles', JSON.stringify(data));
  };

  const addRoute = useCallback((routeData: Omit<Route, 'id'>) => {
    setRoutes(prev => {
      const newRoute: Route = {
        ...routeData,
        id: `R${(prev.length + 1).toString().padStart(2, '0')}`,
      };
      const newRoutes = [...prev, newRoute];
      persistRoutes(newRoutes);
      toast({ title: "Route Added", description: `Route "${routeData.name}" has been created.` });
      return newRoutes;
    });
  }, [toast]);
  
  const removeRoute = useCallback((routeId: string) => {
    setRoutes(prev => {
        const newRoutes = prev.filter(r => r.id !== routeId);
        persistRoutes(newRoutes);
        toast({ title: "Route Removed", description: "The route has been successfully removed." });
        return newRoutes;
    });
  }, [toast]);

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

  const updateVehicleLocation = useCallback((vehicleId: string, location: { lat: number; lng: number }) => {
    setVehicles(prev => {
        const newVehicles = prev.map(v => v.id === vehicleId ? { ...v, location } : v);
        // Persisting every location update might be too frequent, so we can choose to throttle this if needed.
        // For this simulation, we'll persist it.
        persistVehicles(newVehicles);
        return newVehicles;
    })
  }, []);

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
