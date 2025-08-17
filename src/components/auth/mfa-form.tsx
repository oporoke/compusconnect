
"use client";

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Input } from '../ui/input';

export function MfaForm() {
  const { submitMfa, isLoading } = useAuth();
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    submitMfa(code);
  };

  return (
    <Card className="shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline">Two-Factor Authentication</CardTitle>
        <CardDescription>Enter the 6-digit code to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Input 
                id="mfa-code" 
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
            />
             <p className="text-xs text-center text-muted-foreground">Any 6-digit code will work for this demo.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading || code.length !== 6} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <ShieldCheck className="mr-2 h-4 w-4" />
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>
      </CardFooter>
    </Card>
  );
}
