
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { HealthRecord, ClinicVisit } from '@/lib/data';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

interface HealthContextType {
  healthRecords: HealthRecord[];
  clinicVisits: ClinicVisit[];
  isLoading: boolean;
  getRecordByStudentId: (studentId: string) => HealthRecord | undefined;
  getVisitsByStudentId: (studentId: string) => ClinicVisit[];
  updateRecord: (record: HealthRecord) => void;
  addClinicVisit: (visit: Omit<ClinicVisit, 'id' | 'healthRecordId'>) => void;
  sendVaccinationReminders: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [clinicVisits, setClinicVisits] = useState<ClinicVisit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuth();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const [recordsRes, visitsRes] = await Promise.all([
        fetch('/api/health/records', { signal }),
        fetch('/api/health/visits', { signal }),
      ]);
      if (!recordsRes.ok || !visitsRes.ok) {
        throw new Error("Failed to fetch health data");
      }
      setHealthRecords(await recordsRes.json());
      setClinicVisits(await visitsRes.json());
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Failed to load health data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load health data.' });
        setHealthRecords([]);
        setClinicVisits([]);
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
        setHealthRecords([]);
        setClinicVisits([]);
        setIsLoading(false);
    }
  }, [fetchData, authState]);


  const getRecordByStudentId = useCallback((studentId: string) => {
    return healthRecords.find(rec => rec.studentId === studentId);
  }, [healthRecords]);

  const getVisitsByStudentId = useCallback((studentId: string) => {
    const record = getRecordByStudentId(studentId);
    if (!record) return [];
    return clinicVisits.filter(visit => visit.healthRecordId === record.id);
  }, [clinicVisits, getRecordByStudentId]);

  const updateRecord = useCallback((recordData: HealthRecord) => {
    toast({ title: 'Mock Action', description: 'Health record updates are not implemented in this demo.' });
  }, [toast]);
  
  const addClinicVisit = useCallback((visitData: Omit<ClinicVisit, 'id'| 'healthRecordId'>) => {
    toast({ title: 'Mock Action', description: 'Logging clinic visits is not implemented in this demo.' });
  }, [toast]);

  const sendVaccinationReminders = useCallback(() => {
    // This is a mock function. In a real app, this would check vaccination dates
    // against a schedule and send notifications for overdue or upcoming shots.
    toast({
        title: "Vaccination Reminders Sent (Mock)",
        description: "Simulated reminders sent for upcoming vaccinations."
    });
  }, [toast]);

  return (
    <HealthContext.Provider value={{ healthRecords, clinicVisits, isLoading, getRecordByStudentId, getVisitsByStudentId, updateRecord, addClinicVisit, sendVaccinationReminders }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
