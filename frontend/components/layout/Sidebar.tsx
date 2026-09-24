'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  FileSpreadsheet,
  Clock,
  Share2,
  Sparkles,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useForensics } from '@/lib/store/ForensicsContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { activeCase, evidenceList, entitiesList, timelineEvents } = useForensics();
  const caseId = activeCase?.case_id || 'CASE-102';

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true
    },
    {
      name: 'Case Overview',
      href: `/cases/${caseId}`,
      icon: <FolderGit2 className="w-4 h-4" />,
      exact: true
    },
    {
      name: 'Evidence Vault',
      href: `/cases/${caseId}/evidence`,
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: evidenceList.length.toString()
    },
    {
      name: 'Chronological Timeline',
      href: `/cases/${caseId}/timeline`,
      icon: <Clock className="w-4 h-4" />,
      badge: timelineEvents.length.toString()
    },
    {
      name: 'Entity Graph',
      href: `/cases/${caseId}/graph`,
      icon: <Share2 className="w-4 h-4" />,
      badge: entitiesList.length.toString()
    },
    {
      name: 'AI Assistant',
      href: `/cases/${caseId}/assistant`,
      icon: <Sparkles className="w-4 h-4 text-[#1D4ED8]" />,
      highlight: true
    }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-[#E2E8F0] bg-white min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 text-[#0F172A] shadow-2xs">
      <div className="space-y-6">
        {/* Active Investigation Context Card */}
        <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
            <span>ACTIVE DOSSIER</span>
            <span className="text-[#1D4ED8] font-bold">{caseId}</span>
          </div>
          <h4 className="text-xs font-bold text-[#0F172A] mt-1 line-clamp-1">
            {activeCase?.title || 'Financial Fraud Investigation'}
          </h4>
          <div className="mt-2.5 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-mono">
            <span>{evidenceList.length} files</span>
            <span>{entitiesList.length} entities</span>
            <span className="text-[#047857] font-semibold">100% Hash</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
            Forensics Workspace
          </p>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] font-bold shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`${isActive ? 'text-[#1D4ED8]' : 'text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                      isActive
                        ? 'bg-[#DBEAFE] text-[#1D4ED8]'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Info badge */}
      <div className="pt-4 border-t border-[#E2E8F0] text-xs">
        <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] flex items-center gap-3">
          <Cpu className="w-4 h-4 text-[#1D4ED8] shrink-0" />
          <div className="text-[11px] leading-tight">
            <div className="text-[#0F172A] font-semibold">Khushboo AI Pipeline</div>
            <div className="text-[#047857] font-mono text-[10px] mt-0.5 font-medium">● OCR/NER/RAG Online</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
