
"use client";

import { useAuth } from "@/hooks/use-auth";
import { USERS } from "@/lib/auth";
import { useCommunication } from "@/hooks/use-communication";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
    const { user } = useAuth();
    const { conversations, sendMessage } = useCommunication();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const otherUsers = useMemo(() => USERS.filter(u => u.name !== user?.name), [user]);

    const currentConversation = useMemo(() => {
        if (!selectedUser || !user) return [];
        const conversationId = [user.name, selectedUser].sort().join('-');
        return conversations[conversationId] || [];
    }, [selectedUser, user, conversations]);

    const handleSendMessage = () => {
        if (!user || !selectedUser || !message.trim()) return;
        sendMessage(user.name, selectedUser, message);
        setMessage("");
    };

     const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[1][0]}`;
        }
        return name.substring(0, 2);
    };

    // Auto-select first user on load
    useEffect(() => {
        if(!selectedUser && otherUsers.length > 0) {
            setSelectedUser(otherUsers[0].name);
        }
    }, [otherUsers, selectedUser]);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Messages</h1>
                    <p className="text-muted-foreground">Communicate with other members of the school community.</p>
                </div>
            </div>

            <Card className="flex-1 grid grid-cols-[300px_1fr]">
                <div className="border-r">
                    <CardHeader>
                        <CardTitle>Contacts</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                        <ScrollArea className="h-[calc(100vh-250px)]">
                           {otherUsers.map(u => (
                               <button 
                                key={u.name} 
                                className={cn("w-full text-left flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted", selectedUser === u.name && "bg-muted text-primary")}
                                onClick={() => setSelectedUser(u.name)}
                               >
                                   <Avatar className="h-8 w-8">
                                       <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="profile picture" />
                                       <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                                   </Avatar>
                                   <div className="flex-1">
                                       <p className="font-semibold text-sm">{u.name}</p>
                                       <p className="text-xs text-muted-foreground capitalize">{u.role}</p>
                                   </div>
                               </button>
                           ))}
                        </ScrollArea>
                    </CardContent>
                </div>
                <div className="flex flex-col">
                    {selectedUser ? (
                        <>
                            <div className="p-4 border-b flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="profile picture" />
                                    <AvatarFallback>{getInitials(selectedUser)}</AvatarFallback>
                                </Avatar>
                                <h3 className="font-semibold">{selectedUser}</h3>
                            </div>
                            <ScrollArea className="flex-1 p-4 space-y-4">
                                {currentConversation.map((msg, index) => (
                                    <div key={index} className={cn("flex items-end gap-2", msg.sender === user?.name ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-xs p-3 rounded-lg",
                                            msg.sender === user?.name ? "bg-primary text-primary-foreground" : "bg-muted"
                                        )}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                            <CardFooter className="p-4 border-t">
                                <div className="relative w-full">
                                    <Input 
                                        placeholder="Type a message..." 
                                        className="pr-12"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <Button size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={handleSendMessage}>
                                        <Send className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </CardFooter>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <User className="h-12 w-12 mb-4"/>
                            <p>Select a contact to start messaging.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
