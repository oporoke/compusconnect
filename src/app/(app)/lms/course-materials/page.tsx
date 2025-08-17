import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { courseMaterials } from "@/lib/data";
import { Download, File, Presentation, Video } from "lucide-react";

export default function CourseMaterialsPage() {

    const getIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <File className="h-6 w-6 text-primary" />;
            case 'Video': return <Video className="h-6 w-6 text-primary" />;
            case 'Slides': return <Presentation className="h-6 w-6 text-primary" />;
            default: return <File className="h-6 w-6 text-primary" />;
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Course Materials</h1>
                <p className="text-muted-foreground">Find all your course resources here.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courseMaterials.map((material) => (
                    <Card key={material.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    {getIcon(material.type)}
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{material.title}</CardTitle>
                                    <CardDescription>{material.subject}</CardDescription>
                                </div>
                            </div>
                             <Button asChild variant="ghost" size="icon">
                                <a href={material.link} download>
                                    <Download className="h-5 w-5" />
                                </a>
                            </Button>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
