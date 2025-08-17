
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eventRes, announcementRes, messagesRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/announcements'),
          fetch('/api/messages'),
        ]);
        if(!eventRes.ok || !announcementRes.ok || !messagesRes.ok) throw new Error("Failed to fetch communication data");

        setEvents(await eventRes.json());
        setAnnouncements(await announcementRes.json());
        setConversations(await messagesRes.json()); 
      } catch (error) {
        console.error("Failed to parse communication data from API", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load communication data.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const sendMessage = useCallback(async (sender: string, receiver: string, content: string) => {
    const newMessage: Message = {
        sender,
        content,
        timestamp: new Date().toISOString()
    };
    
    // Optimistic UI update
    setConversations(prev => {
        const conversationId = [sender, receiver].sort().join('-');
        const oldConversation = prev[conversationId] || [];
        const newConversation = [...oldConversation, newMessage];
        return { ...prev, [conversationId]: newConversation };
    });

    try {
        // Post to the (mock) API
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMessage)
        });
    } catch(error) {
        console.error("Failed to send message", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not send message.'});
        // Here you could implement logic to revert the optimistic update
    }
  }, [toast]);

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
