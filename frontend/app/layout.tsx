import type { Metadata } from 'next';
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EvidenceGraph AI — Digital Evidence Intelligence Platform',
  description: 'AI-assisted digital forensics, entity-relationship intelligence, chronological reconstruction, and tamper-evident chain of custody. (SIH 2026 Problem Statement SIH26194)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}>
      <body className="min-h-full flex flex-col bg-[#F8F9FA] text-[#0F172A] selection:bg-blue-100 selection:text-blue-900">
        <ClerkProvider>
          <div className="absolute top-3 right-4 z-50 flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
          <AppShell>{children}</AppShell>
        </ClerkProvider>
      </body>
    </html>
  );
}