
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ROLES, Role } from "@/lib/auth";

// In a real app, this would come from a database and be managed by a hook.
// For this mock, we'll just define it statically.
const features = [
    'View Dashboard', 'Manage Admissions', 'Manage Staff', 'Manage Students', 'Manage Exams', 'Manage Gradebook',
    'Manage Finances', 'Manage Library', 'Manage Transport', 'Manage Hostels', 'Send Announcements'
];

const permissions: Record<Role, string[]> = {
    'super-admin': features,
    'admin': features.filter(f => f !== 'Manage Permissions'),
    'teacher': ['View Dashboard', 'Manage Students', 'Manage Exams', 'Manage Gradebook'],
    'student': ['View Dashboard'],
    'parent': ['View Dashboard']
};


export default function PermissionsPage() {
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-headline font-bold">Role-Based Permissions</h1>
                <p className="text-muted-foreground">Manage feature access for different user roles. (Mock Implementation)</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Permission Matrix</CardTitle>
                    <CardDescription>
                        Select which roles have access to each feature. Changes here are for demonstration and won't be persisted.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Feature</TableHead>
                                    {Object.keys(ROLES).map(roleKey => (
                                        <TableHead key={roleKey} className="text-center capitalize">
                                            {ROLES[roleKey as keyof typeof ROLES].replace('-', ' ')}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {features.map(feature => (
                                    <TableRow key={feature}>
                                        <TableCell className="font-medium">{feature}</TableCell>
                                        {Object.values(ROLES).map(role => (
                                            <TableCell key={role} className="text-center">
                                                <Checkbox checked={permissions[role]?.includes(feature)} />
                                            </TableCell>
                                        ))}
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
