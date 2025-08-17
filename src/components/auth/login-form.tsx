
"use client";

import { useAuth } from '@/hooks/use-auth';
import { ROLES, Role } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { LogIn, KeyRound, User, Mail } from 'lucide-react';
import { Input } from '../ui/input';

export function LoginForm({ onToggleView }: { onToggleView: () => void }) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES.ADMIN);

  const handleLogin = () => {
    // Name and password are not used in this simplified session auth,
    // but kept for UI demo. The backend will look up the user by email and role.
    login({ name: 'User', email, role: selectedRole });
  };

  return (
    <Card className="shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline">Login</CardTitle>
        <CardDescription>Enter your details to access your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="email" 
                    type="email"
                    placeholder="e.g. e.reed@school.com"
                    className="pl-10"
                     value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
        </div>
         <div className="space-y-2">
          <Label htmlFor="role">Select Role</Label>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
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
                    required
                />
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <Button onClick={handleLogin} disabled={isLoading || !email} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <LogIn className="mr-2 h-4 w-4" />
          {isLoading ? 'Logging In...' : 'Log In'}
        </Button>
        <Button variant="link" size="sm" onClick={onToggleView}>
            Don't have an account? Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
}
