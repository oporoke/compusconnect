
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { AlumniProfile, Donation, Campaign, Pledge, Mentorship } from '@prisma/client';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

interface AlumniContextType {
  alumni: AlumniProfile[];
  donations: Donation[];
  campaigns: Campaign[];
  pledges: Pledge[];
  mentorships: Mentorship[];
  isLoading: boolean;
  addAlumni: (profile: Omit<AlumniProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAlumni: (profile: AlumniProfile) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt' | 'campaignId'> & { campaignId: string | null }) => void;
  getAlumniNameById: (id: string) => string;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'raised' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'>) => void;
  addPledge: (pledge: Omit<Pledge, 'id' | 'status' | 'date'>) => void;
  addMentorship: (mentorship: Omit<Mentorship, 'id' | 'startDate' | 'status'>) => void;
}

const AlumniContext = createContext<AlumniContextType | undefined>(undefined);

export const AlumniProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuth();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    if (authState !== 'authenticated') return;
    setIsLoading(true);
    try {
        const [alumniRes, donationsRes, campaignsRes, pledgesRes, mentorshipsRes] = await Promise.all([
            fetch('/api/alumni/profiles', { signal }),
            fetch('/api/alumni/donations', { signal }),
            fetch('/api/alumni/campaigns', { signal }),
            fetch('/api/alumni/pledges', { signal }),
            fetch('/api/alumni/mentorships', { signal }),
        ]);

        if (!alumniRes.ok || !donationsRes.ok || !campaignsRes.ok || !pledgesRes.ok || !mentorshipsRes.ok) {
            throw new Error('Failed to fetch alumni data');
        }

        setAlumni(await alumniRes.json());
        setDonations(await donationsRes.json());
        setCampaigns(await campaignsRes.json());
        setPledges(await pledgesRes.json());
        setMentorships(await mentorshipsRes.json());
        
    } catch (error) {
       if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Failed to load alumni data:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not load alumni data.' });
          setAlumni([]);
          setDonations([]);
          setCampaigns([]);
          setPledges([]);
          setMentorships([]);
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


  const addAlumni = useCallback((profileData: Omit<AlumniProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    toast({ title: "Mock Action", description: "This action is not implemented in the demo."});
  }, [toast]);
  
  const updateAlumni = useCallback((profileData: AlumniProfile) => {
    toast({ title: "Mock Action", description: "This action is not implemented in the demo."});
  }, [toast]);

  const addDonation = useCallback((donationData: Omit<Donation, 'id' | 'createdAt' | 'updatedAt' | 'campaignId'> & { campaignId: string | null }) => {
    toast({ title: "Mock Action", description: "This action is not implemented in the demo."});
  }, [toast]);

  const getAlumniNameById = useCallback((id: string) => {
    return alumni.find(a => a.id === id)?.name || 'N/A';
  }, [alumni]);

  const addCampaign = useCallback((campaignData: Omit<Campaign, 'id' | 'raised' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'>) => {
    toast({ title: "Mock Action", description: "This action is not implemented in the demo."});
  }, [toast]);

  const addPledge = useCallback((pledgeData: Omit<Pledge, 'id' | 'status' | 'date'>) => {
    toast({ title: "Mock Action", description: "This action is not implemented in the demo."});
  }, [toast]);

  const addMentorship = useCallback((mentorshipData: Omit<Mentorship, 'id' | 'startDate' | 'status'>) => {
    toast({ title: "Mock Action", description: "This action is not implemented in the demo."});
  }, [toast]);

  return (
    <AlumniContext.Provider value={{ alumni, donations, campaigns, pledges, mentorships, isLoading, addAlumni, updateAlumni, addDonation, getAlumniNameById, addCampaign, addPledge, addMentorship }}>
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
