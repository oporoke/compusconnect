
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eraser, ShieldQuestion } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function DataPrivacyPage() {
    const { toast } = useToast();

    const handleExport = () => {
        toast({
            title: "Data Export Requested",
            description: "Your data export is being prepared and will be sent to your registered email. (This is a mock action)",
        });
    }

    const handleErasure = () => {
        toast({
            title: "Account Erasure Initiated",
            description: "Your account and associated data will be erased after a 7-day grace period. (This is a mock action)",
        });
    }

  return (
    <div className="space-y-6">
       <div>
            <h1 className="text-3xl font-headline font-bold">Data & Privacy</h1>
            <p className="text-muted-foreground">Manage your personal data and privacy settings. (Mock Interface)</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Download /> Data Export</CardTitle>
                <CardDescription>Request a copy of all personal data associated with your account, in compliance with data portability rights.</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button onClick={handleExport} variant="outline">Request Data Export</Button>
            </CardFooter>
        </Card>

         <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><Eraser /> Account Erasure</CardTitle>
                <CardDescription>Permanently delete your account and all associated data. This action is irreversible.</CardDescription>
            </CardHeader>
            <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Request Account Erasure</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleErasure}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    </div>
  );
}
