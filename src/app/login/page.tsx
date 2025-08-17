
"use client";

import { LoginForm } from '@/components/auth/login-form';
import { MfaForm } from '@/components/auth/mfa-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { School } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const { user, isLoading, authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authState === 'authenticated') {
      router.push('/dashboard');
    }
  }, [user, isLoading, router, authState]);
  
  if (isLoading || authState === 'authenticated') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="p-3 bg-primary rounded-full mb-4">
            <School className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-foreground">CampusConnect Lite</h1>
           <p className="text-muted-foreground mt-2">
            {authState === 'mfa_required' 
              ? "Enter the code from your authenticator app." 
              : "Welcome! Please sign in to your account."
            }
          </p>
        </div>
        {authState === 'mfa_required' ? <MfaForm /> : <LoginForm />}
      </div>
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CampusConnect Lite. All Rights Reserved.
      </footer>
    </main>
  );
}
