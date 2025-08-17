
"use client";
import { ReportCardGenerator } from "@/components/report-cards/report-card-generator";
import { jsPDF } from "jspdf";

const handleDownload = (reportContent: string, studentName: string) => {
    const doc = new jsPDF();
    
    // Add a border
    doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);
    
    // Add title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Student Report Card", doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Add student name
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(`Student: ${studentName}`, 15, 35);
    
    // Add report content
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(reportContent, 180);
    doc.text(splitContent, 15, 50);

    doc.save(`${studentName}_report_card.pdf`);
};

export default function ReportCardsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Report Card Generator</h1>
                <p className="text-muted-foreground">
                    Generate personalized report cards for students with AI-powered summaries.
                </p>
            </div>
            <ReportCardGenerator onDownload={handleDownload} />
        </div>
    );
}
