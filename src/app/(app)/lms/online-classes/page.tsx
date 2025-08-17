import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { onlineClasses } from "@/lib/data";
import { Video, ArrowRight } from "lucide-react";

export default function OnlineClassesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Online Classes</h1>
                <p className="text-muted-foreground">Join your live classes here.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Upcoming Classes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {onlineClasses.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-4">
                                <Video className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-semibold">{session.topic}</p>
                                    <p className="text-sm text-muted-foreground">{session.subject} - {session.time}</p>
                                </div>
                            </div>
                            <Button asChild size="sm">
                                <a href={session.link} target="_blank" rel="noopener noreferrer">
                                    Join Class
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
