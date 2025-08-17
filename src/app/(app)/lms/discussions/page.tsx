
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";

const initialThreads = [
    {
        id: 1,
        title: "Question about Algebra Homework",
        author: "Alice Johnson",
        replies: [
            { author: "Mr. Samuel Jones", text: "Great question, Alice! Remember to use the distributive property on page 45." },
            { author: "Bob Williams", text: "I was stuck on that too, thanks for asking." },
        ]
    },
    {
        id: 2,
        title: "Clarification on Science Fair deadline",
        author: "Ethan Davis",
        replies: []
    }
];

export default function DiscussionForumPage() {
    const [threads, setThreads] = useState(initialThreads);
    const [currentThread, setCurrentThread] = useState(threads[0]);
    const [newReply, setNewReply] = useState("");

    const handlePostReply = () => {
        if (!newReply.trim()) return;
        const reply = { author: "Student User", text: newReply }; // Mocked user
        const updatedThread = { ...currentThread, replies: [...currentThread.replies, reply] };
        setCurrentThread(updatedThread);
        setThreads(threads.map(t => t.id === currentThread.id ? updatedThread : t));
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
                    <button key={thread.id} onClick={() => setCurrentThread(thread)} className="block w-full text-left p-2 rounded-md hover:bg-muted">
                        <p className="font-semibold">{thread.title}</p>
                        <p className="text-sm text-muted-foreground">by {thread.author}</p>
                    </button>
                ))}
            </CardContent>
          </Card>
           <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{currentThread.title}</CardTitle>
                <CardDescription>Posted by {currentThread.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 overflow-y-auto">
                {currentThread.replies.map((reply, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <Avatar><AvatarFallback>{getInitials(reply.author)}</AvatarFallback></Avatar>
                        <div>
                            <p className="font-semibold">{reply.author}</p>
                            <p className="p-3 bg-muted rounded-lg">{reply.text}</p>
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
          </Card>
      </div>
    </div>
  );
}
