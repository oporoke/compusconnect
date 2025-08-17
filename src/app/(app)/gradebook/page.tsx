import { GradebookTable } from "@/components/gradebook/gradebook-table";

export default function GradebookPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Gradebook</h1>
                <p className="text-muted-foreground">View and manage student grades.</p>
            </div>
            <GradebookTable />
        </div>
    );
}
