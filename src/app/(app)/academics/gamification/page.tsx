
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Star, BookOpen, Brain, Trophy } from 'lucide-react';
import { useStudents } from '@/hooks/use-students';
import { useLMS } from '@/hooks/use-lms';

const badgeIcons: Record<string, React.ElementType> = {
    "Star": Star,
    "BookOpen": BookOpen,
    "Brain": Brain,
    "Trophy": Trophy,
    "Award": Award,
}

export default function GamificationPage() {
    const { students } = useStudents();
    const { badges } = useLMS();
    const leaderboard = students.slice(0, 5).map((s, i) => ({ ...s, rank: i + 1, points: 1500 - i * 120 }));
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Gamification & Achievements</h1>
        <p className="text-muted-foreground">Track your progress, earn badges, and see the leaderboards.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy /> Leaderboard</CardTitle>
                <CardDescription>Top 5 performing students this week.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboard.map(student => (
                            <TableRow key={student.id}>
                                <TableCell className="font-bold text-lg">{student.rank}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell className="text-right font-mono">{student.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award /> My Badges</CardTitle>
                <CardDescription>Achievements you have unlocked.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {badges.map(badge => {
                    const Icon = badgeIcons[badge.icon] || Award;
                    return (
                        <div key={badge.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                            <Icon className={`h-10 w-10 text-yellow-500`} />
                            <div>
                                <p className="font-semibold">{badge.name}</p>
                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
