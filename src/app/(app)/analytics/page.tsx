
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, GraduationCap, Users, UserCheck, TrendingUp, Bot, Columns } from "lucide-react";
import Link from "next/link";

export default function AnalyticsHubPage() {
    const reportTypes = [
        {
            title: "Student Performance",
            description: "Analyze student grades, attendance, and behavioral trends.",
            icon: GraduationCap,
            href: "/analytics/student"
        },
        {
            title: "Staff Evaluation",
            description: "Review staff attendance, performance metrics, and comparisons.",
            icon: Users,
            href: "/analytics/staff"
        },
        {
            title: "Admissions Analytics",
            description: "Track application funnels, acceptance rates, and yearly trends.",
            icon: UserCheck,
            href: "/analytics/admissions"
        },
        {
            title: "Predictive Analytics",
            description: "Forecast student performance and identify at-risk individuals.",
            icon: TrendingUp,
            href: "/analytics/predictive"
        },
        {
            title: "AI Query",
            description: "Use natural language to generate custom reports and insights.",
            icon: Bot,
            href: "/analytics/ai-query"
        },
        {
            title: "Cross-School Benchmarks",
            description: "Compare key metrics across different schools in your group.",
            icon: Columns,
            href: "/analytics/cross-school"
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Analytics & Reporting Hub</h1>
                <p className="text-muted-foreground">Select a category to view detailed reports and insights.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTypes.map((feature) => (
                    <Link href={feature.href} key={feature.title}>
                        <Card className="hover:shadow-lg transition-shadow h-full">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                   <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
