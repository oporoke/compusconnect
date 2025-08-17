import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { assignments } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload } from "lucide-react";

export default function AssignmentsPage() {

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Pending': return 'destructive';
            case 'Submitted': return 'secondary';
            case 'Graded': return 'default';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Assignments</h1>
                <p className="text-muted-foreground">Track and submit your assignments.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Assignments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-4">
                                <FileText className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-semibold">{assignment.title}</p>
                                    <p className="text-sm text-muted-foreground">{assignment.subject} - Due: {assignment.dueDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant={getStatusVariant(assignment.status)}>{assignment.status}</Badge>
                                {assignment.status === 'Pending' && (
                                    <Button size="sm">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Submit
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
