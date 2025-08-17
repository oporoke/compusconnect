
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share2, History, CheckCircle, Clock } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const mockDocuments = [
  { id: 'DOC001', name: "Alice Johnson - Final Report Card 2024", type: "Report Card", date: "2024-06-15", status: "Signed", signedBy: "Dr. Evelyn Reed" },
  { id: 'DOC002', name: "Bob Williams - Mid-Term Report Card 2024", type: "Report Card", date: "2024-03-20", status: "Pending Signature", signedBy: null },
  { id: 'DOC003', name: "School Leaving Certificate - C. Brown", type: "Certificate", date: "2023-05-30", status: "Signed", signedBy: "Dr. Evelyn Reed" },
  { id: 'DOC004', name: "Disciplinary Warning - Ethan Davis", type: "Discipline Record", date: "2024-04-10", status: "N/A", signedBy: null },
];

export default function DocumentVaultPage() {
    const { toast } = useToast();

    const handleSendForSignature = (docName: string) => {
        toast({
            title: "Sent for Signature",
            description: `${docName} has been sent for e-signature. (This is a mock action)`,
        });
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Document Vault</h1>
        <p className="text-muted-foreground">Securely manage and share academic records. (Mock Interface)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <CardDescription>A list of all student-related academic and administrative documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDocuments.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell><Badge variant="secondary">{doc.type}</Badge></TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>
                      {doc.status === 'Signed' ? (
                        <Badge variant="default"><CheckCircle className="mr-2"/>{doc.status}</Badge>
                      ) : doc.status === 'Pending Signature' ? (
                        <Badge variant="outline"><Clock className="mr-2"/>{doc.status}</Badge>
                      ) : (
                         <Badge variant="secondary">{doc.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                        {doc.status === 'Pending Signature' && <Button variant="outline" size="sm" onClick={() => handleSendForSignature(doc.name)}><Share2 className="mr-2"/>Send for Signature</Button>}
                        <Button variant="ghost" size="icon"><Download/></Button>
                        <Button variant="ghost" size="icon"><History/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    