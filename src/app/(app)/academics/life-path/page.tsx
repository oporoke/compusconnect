"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Sparkles, Loader2, Target, School, Briefcase, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCareerPathways, setAcademicGoals } from '@/ai/flows/ai-life-path-assistant';
import { Skeleton } from '@/components/ui/skeleton';

const mockInterests = ["Technology", "Healthcare", "Creative Arts", "Business & Finance"];
const mockCareers: Record<string, string[]> = {
    "Technology": ["Software Engineer", "Data Scientist", "Cybersecurity Analyst"],
    "Healthcare": ["Doctor (MD)", "Nurse Practitioner", "Biomedical Researcher"],
    "Creative Arts": ["Graphic Designer", "Film Director", "Architect"],
    "Business & Finance": ["Investment Banker", "Marketing Manager", "Accountant"]
};

export default function LifePathSimulatorPage() {
    const { toast } = useToast();
    const [selectedInterest, setSelectedInterest] = useState('');
    const [selectedCareer, setSelectedCareer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pathway, setPathway] = useState<any>(null);
    const [goals, setGoals] = useState<any>(null);

    const handleGeneratePath = async () => {
        if (!selectedCareer) {
            toast({ variant: "destructive", title: "Please select a career." });
            return;
        }
        setIsLoading(true);
        setPathway(null);
        setGoals(null);
        try {
            // Mock student data for the AI flow
            const studentData = {
                currentGrade: "10",
                currentScores: { Math: 85, Science: 92, English: 78, History: 88 }
            };
            const [pathwayResult, goalsResult] = await Promise.all([
                generateCareerPathways({ studentInterests: [selectedInterest], targetCareer: selectedCareer }),
                setAcademicGoals({ currentScores: JSON.stringify(studentData.currentScores), targetCareer: selectedCareer })
            ]);
            setPathway(pathwayResult.pathway);
            setGoals(goalsResult.goals);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Pathway Generation Failed" });
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderTimeline = () => (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-border before:-translate-x-px">
            {pathway?.milestones.map((milestone: any, index: number) => (
                 <div key={index} className="relative flex items-start">
                    <div className="flex-shrink-0">
                         <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center ring-8 ring-background">
                            {milestone.stage === 'High School' && <School className="text-primary-foreground" />}
                            {milestone.stage === 'University' && <Briefcase className="text-primary-foreground" />}
                            {milestone.stage === 'Career' && <Flag className="text-primary-foreground" />}
                        </div>
                    </div>
                    <div className="ml-4">
                        <h4 className="font-bold">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Life Path Simulator & Career Co-Pilot</h1>
                <p className="text-muted-foreground">Explore future careers and get an AI-powered roadmap to achieve your goals.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Career Explorer</CardTitle>
                        <CardDescription>Select your interests to discover potential career paths.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <label>Your Interest Area</label>
                            <Select value={selectedInterest} onValueChange={setSelectedInterest}>
                                <SelectTrigger><SelectValue placeholder="Select an interest..." /></SelectTrigger>
                                <SelectContent>{mockInterests.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-1">
                            <label>Target Career</label>
                            <Select value={selectedCareer} onValueChange={setSelectedCareer} disabled={!selectedInterest}>
                                <SelectTrigger><SelectValue placeholder="Select a career..." /></SelectTrigger>
                                <SelectContent>{(mockCareers[selectedInterest] || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleGeneratePath} disabled={isLoading || !selectedCareer} className="w-full">
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                            Generate My Path
                        </Button>
                    </CardFooter>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Your Personalized Roadmap</CardTitle>
                        <CardDescription>An AI-generated timeline from your current grade to your future career.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        {isLoading && <Skeleton className="h-64 w-full" />}
                        {!isLoading && pathway && (
                           <div className="grid grid-cols-2 gap-6">
                               {renderTimeline()}
                               <Card className="bg-muted/50">
                                   <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2"><Target/> AI Academic Advisor</CardTitle>
                                   </CardHeader>
                                   <CardContent className="space-y-2">
                                       {goals?.recommendations.map((rec: any, index: number) => (
                                           <div key={index} className="text-sm p-2 bg-background rounded-md">
                                                <p className="font-semibold">{rec.area}</p>
                                                <p className="text-muted-foreground">{rec.recommendation}</p>
                                           </div>
                                       ))}
                                   </CardContent>
                               </Card>
                           </div>
                        )}
                         {!isLoading && !pathway && (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                                <Bot className="h-12 w-12 mb-4" />
                                <p>Your personalized career path will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
