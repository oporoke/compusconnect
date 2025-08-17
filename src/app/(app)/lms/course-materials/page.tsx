
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, File, Presentation, Video, PlusCircle } from "lucide-react";
import { useLMS } from "@/hooks/use-lms";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@/lib/auth";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CourseMaterial } from "@/lib/data";

function CreateMaterialDialog() {
    const [open, setOpen] = useState(false);
    const { addCourseMaterial } = useLMS();
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [type, setType] = useState('PDF');
    const [link, setLink] = useState('#');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addCourseMaterial({ title, subject, type, link });
        setTitle('');
        setSubject('');
        setType('PDF');
        setLink('#');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Material
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Course Material</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new course material.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject" className="text-right">Subject</Label>
                            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Type</Label>
                             <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PDF">PDF</SelectItem>
                                    <SelectItem value="Video">Video</SelectItem>
                                    <SelectItem value="Slides">Slides</SelectItem>
                                    <SelectItem value="Document">Document</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="link" className="text-right">Link</Label>
                            <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function CourseMaterialsPage() {
    const { user } = useAuth();
    const { courseMaterials, isLoading } = useLMS();

    const getIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <File className="h-6 w-6 text-primary" />;
            case 'Video': return <Video className="h-6 w-6 text-primary" />;
            case 'Slides': return <Presentation className="h-6 w-6 text-primary" />;
            default: return <File className="h-6 w-6 text-primary" />;
        }
    }

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Course Materials</h1>
                    <p className="text-muted-foreground">Find all your course resources here.</p>
                </div>
                 {user && [ROLES.ADMIN, ROLES.TEACHER].includes(user.role) && (
                    <CreateMaterialDialog />
                )}
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
