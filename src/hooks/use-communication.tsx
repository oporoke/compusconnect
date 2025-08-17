
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
    messages as initialMessages,
    events as initialEvents,
    announcements as initialAnnouncements,
    Message,
    Event as SchoolEvent,
    Conversation,
    Announcement,
} from '@/lib/data';
import { useToast } from './use-toast';

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
    try {
      const storedConversations = localStorage.getItem('campus-connect-conversations');
      const storedEvents = localStorage.getItem('campus-connect-events');
      const storedAnnouncements = localStorage.getItem('campus-connect-announcements');
      
      setConversations(storedConversations ? JSON.parse(storedConversations) : initialMessages);
      setEvents(storedEvents ? JSON.parse(storedEvents) : initialEvents);
      setAnnouncements(storedAnnouncements ? JSON.parse(storedAnnouncements) : initialAnnouncements);
    } catch (error) {
      console.error("Failed to parse communication data from localStorage", error);
      setConversations(initialMessages);
      setEvents(initialEvents);
      setAnnouncements(initialAnnouncements);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistData = (key: string, data: any) => {
    localStorage.setItem(`campus-connect-${key}`, JSON.stringify(data));
  };
  
  const sendMessage = useCallback((sender: string, receiver: string, content: string) => {
    const newMessage: Message = {
        sender,
        content,
        timestamp: new Date().toISOString()
    };
    
    setConversations(prev => {
        const conversationId = [sender, receiver].sort().join('-');
        const oldConversation = prev[conversationId] || [];
        const newConversation = [...oldConversation, newMessage];
        const updatedConversations = { ...prev, [conversationId]: newConversation };
        persistData('conversations', updatedConversations);
        return updatedConversations;
    });

  }, []);

  const addEvent = useCallback((eventData: Omit<SchoolEvent, 'id'>) => {
    setEvents(prev => {
        const newEvent: SchoolEvent = { ...eventData, id: `E${Date.now()}`};
        const updatedEvents = [...prev, newEvent];
        persistData('events', updatedEvents);
        toast({ title: "Event Created", description: `The event "${eventData.title}" has been added to the calendar.` });
        return updatedEvents;
    })
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
