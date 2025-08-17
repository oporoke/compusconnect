
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Event as SchoolEvent, Announcement } from '@prisma/client';
import { useToast } from './use-toast';
import { Message, Conversation } from '@/lib/data';

interface CommunicationContextType {
  conversations: Record<string, Conversation>;
  events: SchoolEvent[];
  announcements: Announcement[];
  isLoading: boolean;
  sendMessage: (sender: string, receiver: string, content: string) => void;
  addEvent: (event: Omit<SchoolEvent, 'id'>) => void;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const CommunicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
      try {
        const [eventRes, announcementRes, messagesRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/announcements'),
          fetch('/api/messages'),
        ]);

        if(!eventRes.ok || !announcementRes.ok || !messagesRes.ok) {
            console.error("Failed to fetch one or more communication resources.");
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load communication data.' });
            setEvents([]);
            setAnnouncements([]);
            setConversations({});
            setIsLoading(false);
            return;
        }

        setEvents(await eventRes.json());
        setAnnouncements(await announcementRes.json());
        setConversations(await messagesRes.json()); 
      } catch (error) {
        console.error("Failed to parse communication data from API", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load communication data.' });
        setEvents([]);
        setAnnouncements([]);
        setConversations({});
      } finally {
        setIsLoading(false);
      }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sendMessage = useCallback(async (sender: string, receiver: string, content: string) => {
    // Optimistic UI update
    const tempMessage: Message = {
        sender,
        content,
        timestamp: new Date().toISOString()
    };
    setConversations(prev => {
        const conversationId = [sender, receiver].sort().join('-');
        const oldConversation = prev[conversationId] || [];
        const newConversation = [...oldConversation, tempMessage];
        return { ...prev, [conversationId]: newConversation };
    });

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({sender, receiver, content})
        });
        if (!response.ok) {
            
            fetchData();
        }
    } catch(error) {
        console.error("Failed to send message", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not send message.'});
        
        fetchData();
    }
  }, [toast, fetchData]);

  const addEvent = useCallback((eventData: Omit<SchoolEvent, 'id'>) => {
    toast({ title: "Mock Action", description: `Event creation is not implemented.` });
  }, [toast]);


  return (
    <CommunicationContext.Provider value={{ conversations, events, announcements, isLoading, sendMessage, addEvent }}>
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
};
