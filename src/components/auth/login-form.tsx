
"use client";

import { useAuth } from '@/hooks/use-auth';
import { ROLES, Role } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { LogIn, KeyRound } from 'lucide-react';
import { Input } from '../ui/input';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES.STUDENT);

  const handleLogin = () => {
    // Password is not used in this simplified session auth, but kept for UI demo
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
                  {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
         <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                 <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="password" 
                    type="password"
                    placeholder="Enter any password"
                    className="pl-10"
                />
            </div>
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
