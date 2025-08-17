
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Check, Printer, FileText, User } from 'lucide-react';
import { useAdmissions } from '@/hooks/use-admissions';

export default function SelfAdmissionPage() {
    const { toast } = useToast();
    const { addApplication, admissionRequirements, fetchAdmissionRequirements } = useAdmissions();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
    });
    const [checkedReqs, setCheckedReqs] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchAdmissionRequirements();
    }, [fetchAdmissionRequirements]);

    const allReqsChecked = admissionRequirements.every(req => checkedReqs[req.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    }
    
    const handleCheckboxChange = (id: string, checked: boolean) => {
        setCheckedReqs(prev => ({...prev, [id]: checked}));
    }

    const handleSubmit = () => {
        // In a real app, this would use the logged-in student's details
        const mockStudent = { name: "New Applicant", age: 15, previousSchool: "Previous School", grade: "9"};
        addApplication({ ...mockStudent, ...formData });
        
        toast({
            title: "Self-Admission Form Submitted",
            description: "Your information has been saved. Please print the form and bring it on admission day.",
        });
        setStep(2);
    }
    
    const handlePrint = () => {
        window.print();
    }

    if (step === 2) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
                 <Card className="max-w-2xl w-full">
                    <CardHeader className="text-center">
                        <Check className="mx-auto h-12 w-12 text-green-500"/>
                        <CardTitle>Submission Successful</CardTitle>
                        <CardDescription>Your admission details have been captured. Please print this form and present it on admission day along with the required documents.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <h3 className="font-bold">Applicant Details:</h3>
                        <p><strong>Parent/Guardian:</strong> {formData.parentName}</p>
                        <p><strong>Contact Email:</strong> {formData.parentEmail}</p>
                        <h3 className="font-bold mt-4">Document Checklist:</h3>
                        <ul className="list-disc list-inside">
                            {admissionRequirements.map(req => <li key={req.id}>Confirmed: {req.requirement}</li>)}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handlePrint} className="w-full">
                            <Printer className="mr-2"/> Print Admission Form
                        </Button>
                    </CardFooter>
                 </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Online Self-Admission</h1>
                <p className="text-muted-foreground">Complete your details from home to speed up the admission process.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User/> Guardian Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="parentName">Parent/Guardian Full Name</Label>
                            <Input id="parentName" value={formData.parentName} onChange={handleInputChange} />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                            <Input id="parentEmail" type="email" value={formData.parentEmail} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
                            <Input id="parentPhone" value={formData.parentPhone} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="address">Home Address</Label>
                            <Input id="address" value={formData.address} onChange={handleInputChange} />
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText/> Admission Requirements Checklist</CardTitle>
                        <CardDescription>Please confirm you have all the required documents ready for verification on admission day.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {admissionRequirements.map(req => (
                            <div key={req.id} className="flex items-center space-x-2">
                                <Checkbox id={req.id} onCheckedChange={(checked) => handleCheckboxChange(req.id, !!checked)}/>
                                <Label htmlFor={req.id}>{req.requirement}</Label>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Final Submission</CardTitle>
                    <CardDescription>Once you submit, you will be able to print your completed form.</CardDescription>
                </CardHeader>
                 <CardFooter>
                    <Button onClick={handleSubmit} disabled={!allReqsChecked}>
                        Submit Admission Form
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
