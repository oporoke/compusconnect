"use client";

import { useState } from 'react';
import { generateTimetable, TimetableInput } from '@/ai/flows/ai-timetable-assistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { defaultCourseSchedules, defaultInstructorAvailability } from '@/lib/data';
import { Bot, Sparkles, BookCopy } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function TimetableGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [courseSchedules, setCourseSchedules] = useState(defaultCourseSchedules);
    const [instructorAvailability, setInstructorAvailability] = useState(defaultInstructorAvailability);
    const [generatedTimetable, setGeneratedTimetable] = useState('');
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedTimetable('');
        try {
            const input: TimetableInput = {
                courseSchedules,
                instructorAvailability,
            };
            const result = await generateTimetable(input);
            setGeneratedTimetable(result.timetable);
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
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Input Data</CardTitle>
                    <CardDescription>Provide course and instructor details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            <>
                                <Bot className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Timetable
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Generated Timetable</CardTitle>
                    <CardDescription>The AI-generated conflict-free schedule.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[80%]" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[90%]" />
                        </div>
                    ) : (
                        generatedTimetable ? (
                            <pre className="p-4 bg-muted rounded-md text-sm text-muted-foreground whitespace-pre-wrap font-code">
                                {generatedTimetable}
                            </pre>
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
