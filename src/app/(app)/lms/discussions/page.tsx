
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useLMS } from '@/hooks/use-lms';
import { useAuth } from '@/hooks/use-auth';

export default function DiscussionForumPage() {
    const { threads, postReply, isLoading } = useLMS();
    const { user } = useAuth();
    const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
    const [newReply, setNewReply] = useState("");

    useEffect(() => {
        if (!currentThreadId && threads.length > 0) {
            setCurrentThreadId(threads[0].id);
        }
    }, [threads, currentThreadId]);
    
    const currentThread = threads.find(t => t.id === currentThreadId);

    const handlePostReply = () => {
        if (!newReply.trim() || !currentThreadId || !user) return;
        postReply(currentThreadId, newReply, user.name);
        setNewReply("");
    }
    
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) { return `${names[0][0]}${names[1][0]}`; }
        return name.substring(0, 2);
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">LMS Discussion Forum</h1>
        <p className="text-muted-foreground">Ask questions and collaborate with peers and teachers.</p>
      </div>
      <div className="grid grid-cols-[300px_1fr] gap-6 h-[calc(100vh-200px)]">
          <Card>
            <CardHeader><CardTitle>Threads</CardTitle></CardHeader>
            <CardContent>
                {threads.map(thread => (
                    <button key={thread.id} onClick={() => setCurrentThreadId(thread.id)} className="block w-full text-left p-2 rounded-md hover:bg-muted">
                        <p className="font-semibold">{thread.title}</p>
                        <p className="text-sm text-muted-foreground">by {thread.authorName}</p>
                    </button>
                ))}
            </CardContent>
          </Card>
           <Card className="flex flex-col">
           {currentThread ? (
            <>
                <CardHeader>
                    <CardTitle>{currentThread.title}</CardTitle>
                    <CardDescription>Posted by {currentThread.authorName}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 overflow-y-auto">
                    {currentThread.replies.map((reply, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <Avatar><AvatarFallback>{getInitials(reply.authorName)}</AvatarFallback></Avatar>
                            <div>
                                <p className="font-semibold">{reply.authorName}</p>
                                <p className="p-3 bg-muted rounded-lg">{reply.content}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="border-t pt-4">
                    <div className="flex gap-2 w-full">
                        <Textarea placeholder="Type your reply..." value={newReply} onChange={e => setNewReply(e.target.value)} />
                        <Button onClick={handlePostReply}><Send /></Button>
                    </div>
                </CardFooter>
            </>
            ) : (
                 <CardContent className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Select a thread to view the discussion.</p>
                 </CardContent>
            )}
          </Card>
      </div>
    </div>
  );
}
