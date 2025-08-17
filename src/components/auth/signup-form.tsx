
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

export function SignupForm({ onToggleView }: { onToggleView: () => void }) {
  const { login, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES.STUDENT);

  const handleSignup = () => {
    // This flow initiates the MFA step which then creates the account and logs in.
    login({ name, email, role: selectedRole });
  };

  return (
    <Card className="shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline">Create Account</CardTitle>
        <CardDescription>Select your role to create your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="name" 
                    type="text"
                    placeholder="e.g. Jane Doe"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="email" 
                    type="email"
                    placeholder="e.g. jane.doe@example.com"
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
                    required
                />
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <Button onClick={handleSignup} disabled={isLoading || !name || !email} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <LogIn className="mr-2 h-4 w-4" />
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
        <Button variant="link" size="sm" onClick={onToggleView}>
            Already have an account? Log In
        </Button>
      </CardFooter>
    </Card>
  );
}
