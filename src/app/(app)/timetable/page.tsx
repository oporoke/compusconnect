
"use client";
import { TimetableGenerator } from "@/components/timetable/timetable-generator";

export default function TimetablePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">AI Timetable Assistant</h1>
                <p className="text-muted-foreground">Generate and visualize conflict-free timetables with the power of AI.</p>
            </div>
            <TimetableGenerator />
        </div>
    );
}
