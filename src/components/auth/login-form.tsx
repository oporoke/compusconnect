"use client";

import { useAuth } from '@/hooks/use-auth';
import { ROLES, Role } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { LogIn } from 'lucide-react';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES.STUDENT);

  const handleLogin = () => {
    login(selectedRole);
  };

  return (
    <Card className="shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline">Sign In</CardTitle>
        <CardDescription>Select your role to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role">Select Role</Label>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ROLES).map((role) => (
                <SelectItem key={role} value={role} className="capitalize">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <LogIn className="mr-2 h-4 w-4" />
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </CardFooter>
    </Card>
  );
}
