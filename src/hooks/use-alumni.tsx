
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AlumniProfile, Donation, alumniProfiles, donations } from '@/lib/data';
import { useToast } from './use-toast';

interface AlumniContextType {
  alumni: AlumniProfile[];
  donations: Donation[];
  isLoading: boolean;
  addAlumni: (profile: Omit<AlumniProfile, 'id'>) => void;
  updateAlumni: (profile: AlumniProfile) => void;
  addDonation: (donation: Omit<Donation, 'id'>) => void;
}

const AlumniContext = createContext<AlumniContextType | undefined>(undefined);

export const AlumniProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedAlumni = localStorage.getItem('campus-connect-alumni');
      const storedDonations = localStorage.getItem('campus-connect-donations');
      
      setAlumni(storedAlumni ? JSON.parse(storedAlumni) : alumniProfiles);
      setDonations(storedDonations ? JSON.parse(storedDonations) : donations);
    } catch (error) {
      console.error("Failed to parse alumni data from localStorage", error);
      setAlumni(alumniProfiles);
      setDonations(donations);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistData = (key: string, data: any) => {
    localStorage.setItem(`campus-connect-${key}`, JSON.stringify(data));
  };

  const addAlumni = useCallback((profileData: Omit<AlumniProfile, 'id'>) => {
    setAlumni(prev => {
        const newProfile: AlumniProfile = { ...profileData, id: `ALUMNI-${Date.now()}` };
        const updatedAlumni = [...prev, newProfile];
        persistData('alumni', updatedAlumni);
        toast({ title: 'Alumni Added', description: `${profileData.name} has been added to the database.` });
        return updatedAlumni;
    });
  }, [toast]);
  
  const updateAlumni = useCallback((profileData: AlumniProfile) => {
    setAlumni(prev => {
        const updatedAlumni = prev.map(p => p.id === profileData.id ? profileData : p);
        persistData('alumni', updatedAlumni);
        toast({ title: 'Alumni Profile Updated', description: `${profileData.name}'s profile has been updated.` });
        return updatedAlumni;
    });
  }, [toast]);

  const addDonation = useCallback((donationData: Omit<Donation, 'id'>) => {
    setDonations(prev => {
        const newDonation: Donation = { ...donationData, id: `DON-${Date.now()}` };
        const updatedDonations = [...prev, newDonation];
        persistData('donations', updatedDonations);
        toast({ title: 'Donation Recorded', description: `A donation of $${donationData.amount} has been recorded.` });
        return updatedDonations;
    });
  }, [toast]);


  return (
    <AlumniContext.Provider value={{ alumni, donations, isLoading, addAlumni, updateAlumni, addDonation }}>
      {children}
    </AlumniContext.Provider>
  );
};

export const useAlumni = () => {
  const context = useContext(AlumniContext);
  if (context === undefined) {
    throw new Error('useAlumni must be used within an AlumniProvider');
  }
  return context;
};
