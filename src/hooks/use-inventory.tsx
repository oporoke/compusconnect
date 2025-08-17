
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { assets as initialAssets, Asset } from '@/lib/data';
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

  useEffect(() => {
    try {
      const storedAssets = localStorage.getItem('campus-connect-inventory-assets');
      setAssets(storedAssets ? JSON.parse(storedAssets) : initialAssets);
    } catch (error) {
      console.error("Failed to parse inventory data from localStorage", error);
      setAssets(initialAssets);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistData = (data: any) => {
    localStorage.setItem('campus-connect-inventory-assets', JSON.stringify(data));
  };

  const addAsset = useCallback((assetData: Omit<Asset, 'id' | 'status' | 'assignedTo' | 'purchaseDate'>) => {
    setAssets(prev => {
        const newAsset: Asset = { 
            ...assetData, 
            id: `ASSET-${Date.now()}`,
            status: 'Available',
            assignedTo: null,
            purchaseDate: new Date().toISOString().split('T')[0]
        };
        const updatedAssets = [...prev, newAsset];
        persistData(updatedAssets);
        toast({ title: 'Asset Added', description: `${assetData.name} has been added to inventory.` });
        return updatedAssets;
    });
  }, [toast]);
  
  const assignAsset = useCallback((assetId: string, assignedTo: string | null) => {
    setAssets(prev => {
        const updatedAssets = prev.map(a => {
            if (a.id === assetId) {
                return { ...a, assignedTo: assignedTo === 'null' ? null : assignedTo, status: assignedTo === 'null' ? 'Available' : 'In Use' };
            }
            return a;
        });
        persistData(updatedAssets);
        toast({ title: 'Asset Assigned', description: 'The asset assignment has been updated.' });
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
