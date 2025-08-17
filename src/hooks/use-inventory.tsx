
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Asset } from '@prisma/client';
import { useToast } from './use-toast';

interface InventoryContextType {
  assets: Asset[];
  isLoading: boolean;
  addAsset: (asset: Omit<Asset, 'id' | 'status' | 'assignedTo' | 'purchaseDate'>) => void;
  assignAsset: (assetId: string, assignedTo: string | null) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);


  const addAsset = useCallback((assetData: Omit<Asset, 'id' | 'status' | 'assignedTo' | 'purchaseDate'>) => {
    // This would be a POST request in a real app
    setAssets(prev => {
        const newAsset: Asset = {
            ...assetData,
            id: `ASSET-${Date.now()}`,
            status: 'Available',
            assignedTo: null,
            purchaseDate: new Date()
        };
        const updatedAssets = [...prev, newAsset];
        toast({ title: 'Asset Added (Mock)', description: `${assetData.name} has been added to inventory.` });
        return updatedAssets;
    });
  }, [toast]);

  const assignAsset = useCallback((assetId: string, assignedTo: string | null) => {
    // This would be a PUT/PATCH request in a real app
    setAssets(prev => {
        const updatedAssets = prev.map(a => {
            if (a.id === assetId) {
                return { ...a, assignedTo: assignedTo === 'null' ? null : assignedTo, status: assignedTo === 'null' ? 'Available' : 'In Use' };
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
