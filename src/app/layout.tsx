
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { StudentProvider } from '@/hooks/use-students';
import { LMSProvider } from '@/hooks/use-lms';
import { AdmissionsProvider } from '@/hooks/use-admissions';
import { StaffProvider } from '@/hooks/use-staff';
import { LibraryProvider } from '@/hooks/use-library';
import { TransportProvider } from '@/hooks/use-transport';
import { HostelProvider } from '@/hooks/use-hostel';
import { FinanceProvider } from '@/hooks/use-finance';

export const metadata: Metadata = {
  title: 'CampusConnect Lite',
  description: 'A modern school management system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
            <StudentProvider>
                <LMSProvider>
                  <AdmissionsProvider>
                    <StaffProvider>
                        <LibraryProvider>
                          <TransportProvider>
                            <HostelProvider>
                                <FinanceProvider>
                                    {children}
                                </FinanceProvider>
                            </HostelProvider>
                          </TransportProvider>
                        </LibraryProvider>
                    </StaffProvider>
                  </AdmissionsProvider>
                </LMSProvider>
            </StudentProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
