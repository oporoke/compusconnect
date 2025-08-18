
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from './use-toast';
import { Message, Conversation, Event as SchoolEvent, Announcement } from '@/lib/data';
import { useAuth } from './use-auth';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuth();

  const fetchData = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const [eventRes, announcementRes, messagesRes] = await Promise.all([
        fetch('/api/events', { signal }),
        fetch('/api/announcements', { signal }),
        fetch('/api/messages', { signal })
      ]);

      if (!eventRes.ok || !announcementRes.ok || !messagesRes.ok) {
        throw new Error("Failed to fetch one or more communication resources.");
      }

      const eventsData = await eventRes.json();
      const announcementsData = await announcementRes.json();
      const conversationsData = await messagesRes.json();

      setEvents(eventsData);
      setAnnouncements(announcementsData);
      setConversations(conversationsData);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Failed to load communication data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load communication data.' });
        setEvents([]);
        setAnnouncements([]);
        setConversations({});
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (authState === 'authenticated') {
      const abortController = new AbortController();
      fetchData(abortController.signal);
      return () => {
        abortController.abort();
      };
    } else {
        setEvents([]);
        setAnnouncements([]);
        setConversations({});
        setIsLoading(false);
    }
  }, [fetchData, authState]);

  const sendMessage = useCallback(async (sender: string, receiver: string, content: string) => {
    const conversationId = [sender, receiver].sort().join('-');
    const optimisticMessage: Message = { sender, content, timestamp: new Date().toISOString() };

    setConversations(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), optimisticMessage]
    }));

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, receiver, content })
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      // Optionally refetch to confirm, or trust the optimistic update
      // await fetchData(new AbortController().signal);
    } catch (error) {
      console.error("Failed to send message", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not send message.' });
      // Revert optimistic update
      setConversations(prev => {
          const newConvo = {...prev};
          const currentConvo = newConvo[conversationId];
          if(currentConvo) {
            newConvo[conversationId] = currentConvo.filter(m => m.timestamp !== optimisticMessage.timestamp);
          }
          return newConvo;
      });
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
