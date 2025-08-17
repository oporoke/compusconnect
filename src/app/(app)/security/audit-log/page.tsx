
"use client";

import { useAuditLog } from '@/hooks/use-audit-log';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';

export default function AuditLogPage() {
    const { logs, isLoading } = useAuditLog();

    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-headline font-bold">Audit Log</h1>
                <p className="text-muted-foreground">Review of all critical actions performed within the system.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>System Activity</CardTitle>
                    <CardDescription>A chronological record of user actions and system events.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-96 w-full" />
                    ) : (
                         <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map(log => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                                                    <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="secondary">{log.user}</Badge></TableCell>
                                            <TableCell className="font-medium">{log.action}</TableCell>
                                            <TableCell><pre className="text-xs bg-muted p-2 rounded-md font-code">{JSON.stringify(log.details, null, 2)}</pre></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
