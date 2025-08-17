
"use client";
import React, { useMemo } from 'react';
import { useStudents } from '@/hooks/use-students';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, AlertTriangle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function PredictiveAnalyticsPage() {
  const { students, grades, exams, getAttendanceByStudentId } = useStudents();

  const atRiskStudents = useMemo(() => {
    return students.map(student => {
      const studentGrades = grades.filter(g => g.studentId === student.id);
      const studentAttendance = getAttendanceByStudentId(student.id);

      const attendancePercentage = studentAttendance.length > 0 ? (studentAttendance.filter(a => a.present).length / studentAttendance.length) * 100 : 100;
      
      const gradeAverages = studentGrades.map(g => {
        const scores = Object.values(g.scores);
        return scores.reduce((a,b) => a+b, 0) / scores.length;
      });

      const overallAverage = gradeAverages.length > 0 ? gradeAverages.reduce((a,b) => a+b, 0) / gradeAverages.length : 0;

      let riskFactor = 0;
      let riskReason = [];
      if (overallAverage < 60) {
        riskFactor++;
        riskReason.push("Low Average Score");
      }
      if (attendancePercentage < 80) {
        riskFactor++;
        riskReason.push("Poor Attendance");
      }
      if(student.discipline?.length ?? 0 > 1) {
        riskFactor++;
        riskReason.push("Discipline Issues");
      }

      return { ...student, riskFactor, riskReason: riskReason.join(', '), overallAverage };
    }).filter(s => s.riskFactor > 0).sort((a,b) => b.riskFactor - a.riskFactor);
  }, [students, grades, getAttendanceByStudentId]);
  
  const forecastData = [
      { term: "Term 1", performance: 85 },
      { term: "Term 2", performance: 82 },
      { term: "Term 3", performance: 78 },
      { term: "Term 4 (Forecast)", performance: 75, isForecast: true },
      { term: "Term 5 (Forecast)", performance: 72, isForecast: true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Predictive Analytics</h1>
        <p className="text-muted-foreground">Identify at-risk students and forecast future performance. (Mock Interface)</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>At-Risk Students</CardTitle>
            <CardDescription>Students identified with potential academic or behavioral issues.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atRiskStudents.slice(0, 5).map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <Badge variant={student.riskFactor > 1 ? "destructive" : "secondary"}>
                           <AlertTriangle className="mr-2" /> {student.riskFactor > 1 ? "High" : "Medium"}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.riskReason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Performance Forecast for Alice Johnson</CardTitle>
            <CardDescription>Projected academic performance based on current trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px] w-full">
                <LineChart data={forecastData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="term" />
                    <YAxis domain={[50, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="performance" stroke="hsl(var(--primary))" />
                    <Line type="monotone" dataKey="performance" stroke="hsl(var(--primary))" strokeDasharray="5 5" data={(data) => data.filter((item) => item.isForecast)} />
                </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    