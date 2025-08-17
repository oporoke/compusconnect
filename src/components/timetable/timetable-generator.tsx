
"use client";

import { useState } from 'react';
import { generateTimetable, TimetableInput } from '@/ai/flows/ai-timetable-assistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { defaultCourseSchedules, defaultInstructorAvailability } from '@/lib/data';
import { Bot, Sparkles, BookCopy, AlertTriangle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type ScheduleEntry = {
    course: string;
    instructor: string;
    room: string;
    isConflict?: boolean;
    conflictReason?: string;
};

export function TimetableGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [courseSchedules, setCourseSchedules] = useState(defaultCourseSchedules);
    const [instructorAvailability, setInstructorAvailability] = useState(defaultInstructorAvailability);
    const [generatedTimetable, setGeneratedTimetable] = useState<Record<string, Record<string, ScheduleEntry>> | null>(null);
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedTimetable(null);
        try {
            const input: TimetableInput = {
                courseSchedules,
                instructorAvailability,
            };
            const result = await generateTimetable(input);
            
            // This is a mock parsing step. A real implementation would get structured JSON.
            const parsedTimetable: Record<string, Record<string, ScheduleEntry>> = {};
            const lines = result.timetable.split('\n').filter(line => line.trim() !== '');
            let currentDay = '';

            lines.forEach(line => {
                if (line.endsWith(':')) {
                    currentDay = line.slice(0, -1);
                    parsedTimetable[currentDay] = {};
                } else if (currentDay) {
                    const match = line.match(/(\d{1,2}:\d{2}\s[AP]M)\s-\s.*:\s(.*)\s\((.*)\)\s-\sRoom\s(.*)/);
                    if (match) {
                        const [, time, course, instructor, room] = match;
                         parsedTimetable[currentDay][time] = { course, instructor, room };
                    }
                }
            });
            
            // Add a mock conflict for demonstration
            if (parsedTimetable["Monday"] && parsedTimetable["Monday"]["10:00 AM"]) {
                 parsedTimetable["Monday"]["10:00 AM"].isConflict = true;
                 parsedTimetable["Monday"]["10:00 AM"].conflictReason = "Instructor 'Dr. Smith' is double-booked. Suggest moving to 3:00 PM.";
            }

            setGeneratedTimetable(parsedTimetable);
            toast({
                title: "Timetable Generated!",
                description: "The AI has successfully created a timetable.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: "Generation Failed",
                description: "Something went wrong while generating the timetable.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Timetable Inputs</CardTitle>
                    <CardDescription>Provide course details and instructor availability constraints.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="course-schedules">Course Schedules</Label>
                        <Textarea
                            id="course-schedules"
                            value={courseSchedules}
                            onChange={(e) => setCourseSchedules(e.target.value)}
                            rows={8}
                            placeholder="e.g., Math 101: 3 hours, Mon/Wed/Fri"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instructor-availability">Instructor Availability</Label>
                        <Textarea
                            id="instructor-availability"
                            value={instructorAvailability}
                            onChange={(e) => setInstructorAvailability(e.target.value)}
                            rows={8}
                            placeholder="e.g., Dr. Smith: Mon-Fri 9am-5pm"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        {isLoading ? (
                            <><Bot className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                        ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Generate Timetable</>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Generated Timetable</CardTitle>
                    <CardDescription>Visually generated conflict-free schedule. Conflicts are highlighted in red.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-96 w-full"/>
                    ) : (
                        generatedTimetable ? (
                            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] border">
                                <div className="border-r border-b"></div>
                                {days.map(day => <div key={day} className="font-bold text-center p-2 border-b">{day}</div>)}
                                {timeSlots.map(time => (
                                    <React.Fragment key={time}>
                                        <div className="font-bold p-2 border-r">{time}</div>
                                        {days.map(day => {
                                            const entry = generatedTimetable[day]?.[time];
                                            return (
                                                <div key={`${day}-${time}`} className={`p-2 border-l border-t ${entry?.isConflict ? 'bg-destructive/20' : ''}`}>
                                                    {entry && (
                                                         <Popover>
                                                            <PopoverTrigger asChild>
                                                                <div className={`p-2 rounded-md h-full cursor-pointer ${entry.isConflict ? 'bg-destructive/80 text-destructive-foreground' : 'bg-primary/10'}`}>
                                                                    <p className="font-semibold text-xs">{entry.course}</p>
                                                                    <p className="text-xs text-muted-foreground">{entry.instructor}</p>
                                                                    <p className="text-xs text-muted-foreground">Room: {entry.room}</p>
                                                                </div>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-80">
                                                                {entry.isConflict ? (
                                                                    <div className="space-y-2">
                                                                        <h4 className="font-medium leading-none flex items-center gap-2"><AlertTriangle className="text-destructive"/>Conflict Detected</h4>
                                                                        <p className="text-sm text-muted-foreground">{entry.conflictReason}</p>
                                                                    </div>
                                                                ) : <p>No conflicts detected for this slot.</p>}
                                                            </PopoverContent>
                                                        </Popover>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                                <BookCopy className="h-12 w-12 mb-4" />
                                <p>Your generated timetable will appear here.</p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
