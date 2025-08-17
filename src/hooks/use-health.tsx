

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { HealthRecord, ClinicVisit, healthRecords as initialHealthRecords, clinicVisits as initialClinicVisits } from '@/lib/data';
import { useToast } from './use-toast';

interface HealthContextType {
  healthRecords: HealthRecord[];
  clinicVisits: ClinicVisit[];
  isLoading: boolean;
  getRecordByStudentId: (studentId: string) => HealthRecord | undefined;
  getVisitsByStudentId: (studentId: string) => ClinicVisit[];
  updateRecord: (record: HealthRecord) => void;
  addClinicVisit: (visit: Omit<ClinicVisit, 'id'>) => void;
  sendVaccinationReminders: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [clinicVisits, setClinicVisits] = useState<ClinicVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedRecords = localStorage.getItem('campus-connect-health-records');
      const storedVisits = localStorage.getItem('campus-connect-clinic-visits');
      
      setHealthRecords(storedRecords ? JSON.parse(storedRecords) : initialHealthRecords);
      setClinicVisits(storedVisits ? JSON.parse(storedVisits) : initialClinicVisits);
    } catch (error) {
      console.error("Failed to parse health data from localStorage", error);
      setHealthRecords(initialHealthRecords);
      setClinicVisits(initialClinicVisits);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistData = (key: string, data: any) => {
    localStorage.setItem(`campus-connect-${key}`, JSON.stringify(data));
  };

  const getRecordByStudentId = useCallback((studentId: string) => {
    return healthRecords.find(rec => rec.studentId === studentId);
  }, [healthRecords]);

  const getVisitsByStudentId = useCallback((studentId: string) => {
    return clinicVisits.filter(visit => visit.studentId === studentId);
  }, [clinicVisits]);

  const updateRecord = useCallback((recordData: HealthRecord) => {
    setHealthRecords(prev => {
        const recordExists = prev.some(r => r.studentId === recordData.studentId);
        let updatedRecords;
        if (recordExists) {
            updatedRecords = prev.map(r => r.studentId === recordData.studentId ? recordData : r);
        } else {
            updatedRecords = [...prev, recordData];
        }
        persistData('health-records', updatedRecords);
        toast({ title: 'Health Record Updated' });
        return updatedRecords;
    });
  }, [toast]);
  
  const addClinicVisit = useCallback((visitData: Omit<ClinicVisit, 'id'>) => {
    setClinicVisits(prev => {
        const newVisit: ClinicVisit = { ...visitData, id: `VISIT-${Date.now()}` };
        const updatedVisits = [...prev, newVisit];
        persistData('clinic-visits', updatedVisits);
        toast({ title: 'Clinic Visit Logged' });
        return updatedVisits;
    });
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

    