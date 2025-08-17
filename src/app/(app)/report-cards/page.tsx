import { ReportCardGenerator } from "@/components/report-cards/report-card-generator";

export default function ReportCardsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Report Card Generator</h1>
                <p className="text-muted-foreground">
                    Generate personalized report cards for students with AI-powered summaries.
                </p>
            </div>
            <ReportCardGenerator />
        </div>
    );
}
