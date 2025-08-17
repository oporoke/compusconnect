
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle } from "lucide-react";
import { useCommunication } from "@/hooks/use-communication";
import { addMonths, format, startOfMonth, eachDayOfInterval, endOfMonth, isSameMonth, isToday, isSameDay } from "date-fns";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@/lib/auth";

function CreateEventDialog() {
    const { addEvent } = useCommunication();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addEvent({ title, date, description });
        setOpen(false);
        setTitle("");
        setDate("");
        setDescription("");
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Create Event
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Create New Event</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Event Date</Label>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Event</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function EventsPage() {
    const { events, isLoading } = useCommunication();
    const { user } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);

    const days = eachDayOfInterval({
        start: firstDayOfMonth,
        end: lastDayOfMonth,
    });

    const colStartClasses = ["", "col-start-2", "col-start-3", "col-start-4", "col-start-5", "col-start-6", "col-start-7"];
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Event Calendar</h1>
                    <p className="text-muted-foreground">Stay informed about upcoming school events.</p>
                </div>
                {user?.role === ROLES.ADMIN && <CreateEventDialog />}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>Prev</Button>
                        <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>Today</Button>
                        <Button variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 text-xs leading-6 text-center text-muted-foreground">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 mt-2 text-sm">
                        {days.map((day, dayIdx) => (
                            <div key={day.toString()} className={cn(dayIdx === 0 && colStartClasses[day.getDay()], "py-2 border border-transparent")}>
                                <button
                                    type="button"
                                    onClick={() => console.log(day)}
                                    className={cn(
                                        isToday(day) && "text-white bg-primary rounded-full font-semibold",
                                        !isToday(day) && isSameMonth(day, firstDayOfMonth) ? "text-foreground" : "text-muted-foreground",
                                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                                    )}
                                >
                                    <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                                </button>
                                <div className="w-full">
                                    {events.filter(event => isSameDay(new Date(event.date), day)).map(event => (
                                        <Badge key={event.id} className="w-full mt-1 truncate" variant="secondary">{event.title}</Badge>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
