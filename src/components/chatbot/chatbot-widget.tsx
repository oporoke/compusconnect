
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

export function ChatbotWidget({ studentId }: { studentId: string }) {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hello! I'm your school assistant. How can I help you today? You can ask about grades, attendance, and more." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, question: input }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to get response from chatbot");
            }

            const { answer } = await response.json();
            const botMessage: Message = { sender: 'bot', text: answer };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({ variant: 'destructive', title: "Chatbot Error", description: errorMessage });
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="fixed bottom-4 right-4 w-96 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg"><Bot /> School Assistant</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72 w-full pr-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={cn(
                                "flex items-start gap-3",
                                message.sender === 'user' ? "justify-end" : ""
                            )}>
                                {message.sender === 'bot' && <Bot className="h-6 w-6 shrink-0" />}
                                <div className={cn(
                                    "p-3 rounded-lg max-w-xs",
                                    message.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                                )}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                {message.sender === 'user' && <User className="h-6 w-6 shrink-0" />}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                <Bot className="h-6 w-6 shrink-0" />
                                <div className="p-3 rounded-lg bg-muted flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin"/>
                                </div>
                            </div>
                         )}
                    </div>
                </ScrollArea>
                <div className="mt-4 flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about grades..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading}>
                        <Send />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
