
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Asset } from '@prisma/client';
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
  }, [toast]);

  useEffect(() => {
    if (authState === 'authenticated') {
      const controller = new AbortController();
      fetchData(controller.signal);
      return () => controller.abort();
    } else {
        setAssets([]);
        setIsLoading(false);
    }
  }, [fetchData, authState]);


  const addAsset = useCallback((assetData: Omit<Asset, 'id' | 'status' | 'assignedToId' | 'purchaseDate'>) => {
    // This would be a POST request in a real app
    setAssets(prev => {
        const newAsset: Asset = {
            ...assetData,
            id: `ASSET-${Date.now()}`,
            status: 'Available',
            assignedToId: null,
            purchaseDate: new Date()
        };
        const updatedAssets = [...prev, newAsset];
        toast({ title: 'Asset Added (Mock)', description: `${assetData.name} has been added to inventory.` });
        return updatedAssets;
    });
  }, [toast]);

  const assignAsset = useCallback((assetId: string, assignedToId: string | null) => {
    // This would be a PUT/PATCH request in a real app
    setAssets(prev => {
        const updatedAssets = prev.map(a => {
            if (a.id === assetId) {
                return { ...a, assignedToId: assignedToId === 'null' ? null : assignedToId, status: assignedToId === 'null' ? 'Available' : 'In Use' as const };
            }
            return a;
        });
        toast({ title: 'Asset Assigned (Mock)', description: 'The asset assignment has been updated.' });
        return updatedAssets;
    });
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
