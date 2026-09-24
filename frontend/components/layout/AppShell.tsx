'use client';

import React from 'react';
import { ForensicsProvider } from '@/lib/store/ForensicsContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ForensicsProvider>
      <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#0F172A] forensics-grid">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8F9FA]/60">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ForensicsProvider>
  );
};
