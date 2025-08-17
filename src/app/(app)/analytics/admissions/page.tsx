

"use client";

import React, { useMemo } from 'react';
import { useAdmissions } from '@/hooks/use-admissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { subMonths, format } from 'date-fns';

const COLORS = ['hsl(var(--chart-2))', 'hsl(var(--chart-1))', 'hsl(var(--destructive))'];

export default function AdmissionsAnalyticsPage() {
    const { applications, isLoading } = useAdmissions();

    const applicationStatusData = useMemo(() => {
        const counts = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [applications]);

    const applicationTrendData = useMemo(() => {
        const now = new Date();
        const trends = Array.from({ length: 6 }).map((_, i) => {
            const date = subMonths(now, 5 - i);
            const month = format(date, 'MMM');
            const count = applications.filter(app => format(new Date(app.date), 'yyyy-MM') === format(date, 'yyyy-MM')).length;
            return { name: month, applications: count };
        });
        return trends;
    }, [applications]);

    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-headline font-bold">Admissions & Enrollment Analytics</h1>
                <p className="text-muted-foreground">Track application funnels and trends over time.</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Total Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold">{applications.length}</p>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Application Status Breakdown</CardTitle>
                    </CardHeader>
                     <CardContent className="flex justify-center">
                        <ChartContainer config={{}} className="h-[200px] w-full max-w-sm">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie data={applicationStatusData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                                     {applicationStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Application Trends</CardTitle>
                    <CardDescription>Applications received over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="h-[300px] w-full">
                        <LineChart data={applicationTrendData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="applications" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>

        </div>
    );
}

    