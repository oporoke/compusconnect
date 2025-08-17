
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AlumniProfile, Donation, Campaign, Pledge, alumniProfiles, donations, campaigns, pledges } from '@/lib/data';
import { useToast } from './use-toast';

interface AlumniContextType {
  alumni: AlumniProfile[];
  donations: Donation[];
  campaigns: Campaign[];
  pledges: Pledge[];
  isLoading: boolean;
  addAlumni: (profile: Omit<AlumniProfile, 'id'>) => void;
  updateAlumni: (profile: AlumniProfile) => void;
  addDonation: (donation: Omit<Donation, 'id'>) => void;
  getAlumniNameById: (id: string) => string;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'raised' | 'startDate' | 'endDate'>) => void;
  addPledge: (pledge: Omit<Pledge, 'id' | 'status' | 'date'>) => void;
}

const AlumniContext = createContext<AlumniContextType | undefined>(undefined);

export const AlumniProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedAlumni = localStorage.getItem('campus-connect-alumni');
      const storedDonations = localStorage.getItem('campus-connect-donations');
      const storedCampaigns = localStorage.getItem('campus-connect-campaigns');
      const storedPledges = localStorage.getItem('campus-connect-pledges');
      
      setAlumni(storedAlumni ? JSON.parse(storedAlumni) : alumniProfiles);
      setDonations(storedDonations ? JSON.parse(storedDonations) : donations);
      setCampaigns(storedCampaigns ? JSON.parse(storedCampaigns) : campaigns);
      setPledges(storedPledges ? JSON.parse(storedPledges) : pledges);
    } catch (error) {
      console.error("Failed to parse alumni data from localStorage", error);
      setAlumni(alumniProfiles);
      setDonations(donations);
      setCampaigns(campaigns);
      setPledges(pledges);
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

  const getAlumniNameById = useCallback((id: string) => {
    return alumni.find(a => a.id === id)?.name || 'N/A';
  }, [alumni]);

  const addCampaign = useCallback((campaignData: Omit<Campaign, 'id' | 'raised' | 'startDate' | 'endDate'>) => {
    setCampaigns(prev => {
        const newCampaign: Campaign = { 
            ...campaignData, 
            id: `CAMP-${Date.now()}`,
            raised: 0,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0], // 6 month duration
        };
        const updated = [...prev, newCampaign];
        persistData('campaigns', updated);
        toast({ title: 'Campaign Created' });
        return updated;
    });
  }, [toast]);

  const addPledge = useCallback((pledgeData: Omit<Pledge, 'id' | 'status' | 'date'>) => {
    setPledges(prev => {
        const newPledge: Pledge = {
            ...pledgeData,
            id: `PLG-${Date.now()}`,
            status: 'Pledged',
            date: new Date().toISOString().split('T')[0]
        };
        const updated = [...prev, newPledge];
        persistData('pledges', updated);
        toast({ title: 'Pledge Recorded' });
        return updated;
    });
  }, [toast]);

  return (
    <AlumniContext.Provider value={{ alumni, donations, campaigns, pledges, isLoading, addAlumni, updateAlumni, addDonation, getAlumniNameById, addCampaign, addPledge }}>
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
