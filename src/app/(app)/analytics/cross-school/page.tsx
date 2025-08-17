
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";

const enrollmentData = [
    { school: "Innovate Int'l", "2022": 400, "2023": 450, "2024": 510 },
    { school: "Global Prep", "2022": 350, "2023": 380, "2024": 420 },
];

const performanceData = [
    { subject: "Math", "Innovate Int'l": 82, "Global Prep": 78 },
    { subject: "Science", "Innovate Int'l": 85, "Global Prep": 81 },
    { subject: "English", "Innovate Int'l": 79, "Global Prep": 84 },
];

export default function CrossSchoolAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Cross-School Analytics</h1>
        <p className="text-muted-foreground">Benchmark performance and key metrics across schools in your group. (Mock Data)</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends by School</CardTitle>
            <CardDescription>A year-over-year comparison of student enrollment figures.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
                <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="school" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="2022" fill="hsl(var(--chart-2))" />
                    <Bar dataKey="2023" fill="hsl(var(--chart-3))" />
                    <Bar dataKey="2024" fill="hsl(var(--chart-1))" />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Grade by Subject</CardTitle>
            <CardDescription>A comparison of academic performance in key subjects.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
                <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="Innovate Int'l" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="Global Prep" fill="hsl(var(--chart-2))" />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
