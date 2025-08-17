
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Sparkles, Loader2, BookOpen, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLessonPlan } from '@/ai/flows/ai-lesson-planner';
import { differentiateContent } from '@/ai/flows/ai-differentiator';
import { Skeleton } from '@/components/ui/skeleton';

export default function LessonPlannerPage() {
  const { toast } = useToast();
  // State for Lesson Planner
  const [isPlaning, setIsPlaning] = useState(false);
  const [topic, setTopic] = useState("Photosynthesis");
  const [gradeLevel, setGradeLevel] = useState("10");
  const [duration, setDuration] = useState("1 Week (5 Lessons)");
  const [lessonPlan, setLessonPlan] = useState("");

  // State for Differentiator
  const [isDifferentiating, setIsDifferentiating] = useState(false);
  const [originalText, setOriginalText] = useState("The process of photosynthesis converts light energy into chemical energy, resulting in the production of glucose and oxygen.");
  const [targetLevel, setTargetLevel] = useState<"standard" | "simplified" | "advanced">("simplified");
  const [differentiatedText, setDifferentiatedText] = useState("");


  const handleGeneratePlan = async () => {
    setIsPlaning(true);
    setLessonPlan("");
    try {
      const response = await generateLessonPlan({ topic, gradeLevel, duration });
      setLessonPlan(response.lessonPlan);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Lesson Plan Generation Failed" });
    } finally {
      setIsPlaning(false);
    }
  };
  
  const handleDifferentiate = async () => {
    setIsDifferentiating(true);
    setDifferentiatedText("");
     try {
      const response = await differentiateContent({ originalText, targetLevel });
      setDifferentiatedText(response.differentiatedText);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Content Differentiation Failed" });
    } finally {
      setIsDifferentiating(false);
    }
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Teacher's AI Co-Pilot</h1>
        <p className="text-muted-foreground">Your smart assistant for lesson planning and content creation.</p>
      </div>

      <Tabs defaultValue="planner">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="planner"><BookOpen className="mr-2"/>Lesson Planner</TabsTrigger>
            <TabsTrigger value="differentiator"><Wand2 className="mr-2"/>Content Differentiator</TabsTrigger>
        </TabsList>
        <TabsContent value="planner">
            <Card>
                <CardHeader>
                    <CardTitle>AI Lesson Plan Generator</CardTitle>
                    <CardDescription>Describe your lesson, and the AI will create a structured plan for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1"><Label>Topic</Label><Input value={topic} onChange={e => setTopic(e.target.value)} /></div>
                        <div className="space-y-1"><Label>Grade Level</Label><Input value={gradeLevel} onChange={e => setGradeLevel(e.target.value)} /></div>
                        <div className="space-y-1"><Label>Duration</Label><Input value={duration} onChange={e => setDuration(e.target.value)} /></div>
                    </div>
                </CardContent>
                <CardFooter>
                     <Button onClick={handleGeneratePlan} disabled={isPlaning} className="w-full">
                        {isPlaning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Plan
                    </Button>
                </CardFooter>
            </Card>
             {isPlaning && <Skeleton className="h-64 w-full mt-4"/>}
             {lessonPlan && (
                <Card className="mt-4">
                    <CardHeader><CardTitle>Generated Lesson Plan</CardTitle></CardHeader>
                    <CardContent className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: lessonPlan.replace(/\n/g, '<br />') }} />
                </Card>
             )}
        </TabsContent>
         <TabsContent value="differentiator">
            <Card>
                <CardHeader>
                    <CardTitle>AI Content Differentiator</CardTitle>
                    <CardDescription>Adapt any text to different student reading levels instantly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label>Original Text</Label>
                        <Textarea value={originalText} onChange={e => setOriginalText(e.target.value)} rows={5}/>
                    </div>
                     <div className="space-y-1">
                        <Label>Target Level</Label>
                        <Select value={targetLevel} onValueChange={(v) => setTargetLevel(v as any)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="simplified">Simplified</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                 <CardFooter>
                     <Button onClick={handleDifferentiate} disabled={isDifferentiating} className="w-full">
                        {isDifferentiating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Adapt Content
                    </Button>
                </CardFooter>
            </Card>
             {isDifferentiating && <Skeleton className="h-32 w-full mt-4"/>}
             {differentiatedText && (
                 <Card className="mt-4">
                    <CardHeader><CardTitle>Adapted Content</CardTitle></CardHeader>
                    <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                        <p>{differentiatedText}</p>
                    </CardContent>
                </Card>
             )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
