
"use client";
import React, { useState } from 'react';
import { useStudents } from '@/hooks/use-students';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const competencies = [
  { id: 'comm', name: 'Communication' },
  { id: 'crit', name: 'Critical Thinking' },
  { id: 'collab', name: 'Collaboration' },
  { id: 'creat', name: 'Creativity' },
];

const ratingLevels = [
  { value: 0, label: 'Not Assessed' },
  { value: 1, label: 'Beginning' },
  { value: 2, label: 'Developing' },
  { value: 3, label: 'Accomplished' },
  { value: 4, label: 'Exemplary' },
];

export default function CBCAssessmentPage() {
  const { students } = useStudents();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [assessments, setAssessments] = useState<Record<string, Record<string, number>>>({});

  const studentsInClass = students.filter(s => `${s.grade}-${s.section}` === selectedClass);

  const handleRatingChange = (studentId: string, competencyId: string, value: string) => {
    setAssessments(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [competencyId]: Number(value),
      },
    }));
  };

  const handleSave = () => {
    toast({
      title: "Assessments Saved",
      description: "Competency-based assessments have been saved. (This is a mock action)",
    });
    console.log("Saved Assessments:", assessments);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">CBC / Competency-Based Assessment</h1>
        <p className="text-muted-foreground">Assess students based on core competencies. (Mock Interface)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Form</CardTitle>
          <CardDescription>Select a class and rate each student on the defined competencies.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a class..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10-A">Grade 10 - Section A</SelectItem>
                <SelectItem value="10-B">Grade 10 - Section B</SelectItem>
                <SelectItem value="11-A">Grade 11 - Section A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  {competencies.map(c => <TableHead key={c.id} className="text-center">{c.name}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsInClass.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    {competencies.map(c => (
                      <TableCell key={c.id}>
                        <Select
                          value={String(assessments[student.id]?.[c.id] || 0)}
                          onValueChange={value => handleRatingChange(student.id, c.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ratingLevels.map(level => (
                              <SelectItem key={level.value} value={String(level.value)}>{level.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave}><Save className="mr-2"/>Save Assessments</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    