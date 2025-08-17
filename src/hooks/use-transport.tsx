
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { vehicles as initialVehicles, routes as initialRoutes, Vehicle, Route } from '@/lib/data';
import { useToast } from './use-toast';

interface TransportContextType {
  vehicles: Vehicle[];
  routes: Route[];
  addRoute: (route: Omit<Route, 'id'>) => void;
  getVehicleByRoute: (routeId: string) => Vehicle | undefined;
  isLoading: boolean;
}

const TransportContext = createContext<TransportContextType | undefined>(undefined);

export const TransportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedVehicles = localStorage.getItem('campus-connect-vehicles');
      const storedRoutes = localStorage.getItem('campus-connect-routes');
      
      setVehicles(storedVehicles ? JSON.parse(storedVehicles) : initialVehicles);
      setRoutes(storedRoutes ? JSON.parse(storedRoutes) : initialRoutes);
    } catch (error) {
      console.error("Failed to parse transport data from localStorage", error);
      setVehicles(initialVehicles);
      setRoutes(initialRoutes);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistRoutes = (data: Route[]) => {
    localStorage.setItem('campus-connect-routes', JSON.stringify(data));
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

  const getVehicleByRoute = useCallback((routeId: string) => {
    return vehicles.find(v => v.routeId === routeId);
  }, [vehicles]);

  return (
    <TransportContext.Provider value={{ vehicles, routes, addRoute, getVehicleByRoute, isLoading }}>
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
