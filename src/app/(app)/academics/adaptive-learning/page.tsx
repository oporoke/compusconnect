
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BrainCircuit, ChevronRight, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const initialQuestion = {
  id: 1,
  text: "What is 2 + 2?",
  options: ["3", "4", "5"],
  answer: "4",
  difficulty: 1
};

const questionBank = [
    { id: 2, text: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris"], answer: "Paris", difficulty: 1 },
    { id: 3, text: "Solve for x: 3x - 5 = 10", options: ["3", "5", "7"], answer: "5", difficulty: 2 },
    { id: 4, text: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria"], answer: "Mitochondria", difficulty: 2 },
    { id: 5, text: "What is the integral of 2x dx?", options: ["x^2 + C", "2x^2 + C", "x + C"], answer: "x^2 + C", difficulty: 3 },
    { id: 6, text: "Who wrote 'Hamlet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen"], answer: "William Shakespeare", difficulty: 3 },
];

export default function AdaptiveLearningPage() {
    const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{correct: boolean, message: string} | null>(null);
    const [progress, setProgress] = useState(0);

    const handleNextQuestion = () => {
        const isCorrect = selectedOption === currentQuestion.answer;
        setFeedback({correct: isCorrect, message: isCorrect ? 'Correct!' : `The correct answer was ${currentQuestion.answer}`});
        setProgress(p => p + 10);

        setTimeout(() => {
            setFeedback(null);
            setSelectedOption(null);
            const nextDifficulty = isCorrect ? Math.min(3, currentQuestion.difficulty + 1) : Math.max(1, currentQuestion.difficulty - 1);
            const nextQuestion = questionBank.find(q => q.difficulty === nextDifficulty && q.id !== currentQuestion.id) || questionBank[Math.floor(Math.random()*questionBank.length)];
            setCurrentQuestion(nextQuestion);
        }, 2000);
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">AI Adaptive Learning</h1>
        <p className="text-muted-foreground">A mock quiz that adapts to your performance.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BrainCircuit /> Adaptive Quiz</CardTitle>
          <CardDescription>Question difficulty will change based on your answers.</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-lg font-semibold">{currentQuestion.text}</p>
            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} disabled={!!feedback}>
                {currentQuestion.options.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option}>{option}</Label>
                    </div>
                ))}
            </RadioGroup>
            {feedback && (
                <div className={`flex items-center gap-2 p-3 rounded-md ${feedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback.correct ? <Check /> : <X />}
                    <p>{feedback.message}</p>
                </div>
            )}
        </CardContent>
        <CardFooter>
            <Button onClick={handleNextQuestion} disabled={!selectedOption || !!feedback} className="w-full">
                Submit Answer <ChevronRight className="ml-2"/>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
