
"use client";

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { ShieldCheck, MessageCircle, Smartphone } from 'lucide-react';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
        <Tabs defaultValue="authenticator" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="authenticator"><Smartphone className="mr-2"/>Authenticator</TabsTrigger>
                <TabsTrigger value="sms"><MessageCircle className="mr-2"/>SMS</TabsTrigger>
            </TabsList>
            <TabsContent value="authenticator" className="pt-4">
                <p className="text-center text-sm text-muted-foreground mb-4">Enter the code from your authenticator app (e.g., Google Authenticator).</p>
                <Input 
                    id="mfa-code-auth" 
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
            </TabsContent>
            <TabsContent value="sms" className="pt-4">
                 <p className="text-center text-sm text-muted-foreground mb-4">Enter the code sent to your registered mobile number ending in ****89.</p>
                <Input 
                    id="mfa-code-sms" 
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                     onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
            </TabsContent>
        </Tabs>
        <p className="text-xs text-center text-muted-foreground pt-2">Any 6-digit code will work for this demo.</p>
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
