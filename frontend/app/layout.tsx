import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'EvidenceGraph AI — Digital Evidence Intelligence Platform',
  description: 'AI-assisted digital forensics, entity-relationship intelligence, chronological reconstruction, and tamper-evident chain of custody. (SIH 2026 Problem Statement SIH26194)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="antialiased selection:bg-blue-100 selection:text-blue-900 bg-[#F8F9FA] text-[#0F172A]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
