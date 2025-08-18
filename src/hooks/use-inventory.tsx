
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Asset } from '@/lib/data';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

interface InventoryContextType {
  assets: Asset[];
  isLoading: boolean;
  addAsset: (asset: Omit<Asset, 'id' | 'status' | 'assignedToId' | 'purchaseDate'>) => void;
  assignAsset: (assetId: string, assignedTo: string | null) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuth();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    if (authState !== 'authenticated') return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/inventory/assets', { signal });
       if (!response.ok) {
        throw new Error('Failed to fetch inventory data from API.');
      }
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Failed to parse inventory data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load inventory data.' });
        setAssets([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, authState]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);


  const addAsset = useCallback((assetData: Omit<Asset, 'id' | 'status' | 'assignedToId' | 'purchaseDate'>) => {
    // This would be a POST request in a real app
    toast({ title: 'Mock Action', description: 'Adding assets is not implemented in this demo.' });
  }, [toast]);

  const assignAsset = useCallback((assetId: string, assignedToId: string | null) => {
    // This would be a PUT/PATCH request in a real app
    toast({ title: 'Mock Action', description: 'Assigning assets is not implemented in this demo.' });
  }, [toast]);

  return (
    <InventoryContext.Provider value={{ assets, isLoading, addAsset, assignAsset }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
