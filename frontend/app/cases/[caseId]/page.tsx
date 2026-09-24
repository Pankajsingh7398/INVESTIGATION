'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FolderGit2,
  FileCheck2,
  Share2,
  Clock,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Building,
  Calendar,
  Tag,
  ArrowRight,
  UploadCloud
} from 'lucide-react';
import { useForensics } from '@/lib/store/ForensicsContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function CaseDetailPage() {
  const params = useParams();
  const { activeCase, evidenceList, entitiesList, timelineEvents, currentUser } = useForensics();

  if (!activeCase) {
    return (
      <div className="p-8 text-center text-[#64748B]">
        Loading case dossier...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Case Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] relative overflow-hidden shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[#1D4ED8] font-bold text-sm bg-[#EFF6FF] px-2.5 py-1 rounded border border-[#BFDBFE]">
                {activeCase.case_id}
              </span>
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700">
                {activeCase.priority} PRIORITY
              </span>
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857]">
                {activeCase.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {activeCase.title}
            </h1>

            <p className="text-sm text-[#475569] max-w-3xl leading-relaxed">
              {activeCase.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {activeCase.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-[#F5F2EB] text-[#574C3A] border border-[#E5DFD5] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            {currentUser.permissions.canUploadEvidence ? (
              <Link href={`/cases/${activeCase.case_id}/evidence`}>
                <Button variant="primary" size="md" icon={<UploadCloud className="w-4 h-4" />} className="w-full">
                  Upload New Evidence
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-xs font-mono text-[#92400E]">
                <ShieldCheck className="w-4 h-4 text-[#B45309]" />
                <span>READ-ONLY AUDIT</span>
              </div>
            )}
            <Link href={`/cases/${activeCase.case_id}/assistant`}>
              <Button variant="glow" size="md" icon={<Sparkles className="w-4 h-4" />} className="w-full">
                Launch AI Assistant
              </Button>
            </Link>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F1F5F9] text-xs">
          <div>
            <span className="text-[#94A3B8] uppercase tracking-wider block font-semibold text-[10px]">
              Lead Investigator
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-[#0F172A]">
              <UserCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>{activeCase.investigator}</span>
            </div>
            <span className="text-[11px] font-mono text-[#64748B] mt-0.5 block">
              Badge: {activeCase.badge_number}
            </span>
          </div>

          <div>
            <span className="text-[#94A3B8] uppercase tracking-wider block font-semibold text-[10px]">
              Jurisdiction / Unit
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-[#0F172A]">
              <Building className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>{activeCase.department}</span>
            </div>
          </div>

          <div>
            <span className="text-[#94A3B8] uppercase tracking-wider block font-semibold text-[10px]">
              Date Registered
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-[#0F172A] font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>{new Date(activeCase.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <span className="text-[#94A3B8] uppercase tracking-wider block font-semibold text-[10px]">
              Chain of Custody
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-[#047857] font-mono">
              <ShieldCheck className="w-4 h-4 text-[#047857]" />
              <span>100% Bit-Stream Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Investigation Modules Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href={`/cases/${activeCase.case_id}/evidence`}>
          <Card className="p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group h-full">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-[#EFF6FF] text-[#1D4ED8]">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-[#64748B]">
                {evidenceList.length} FILES
              </span>
            </div>
            <h3 className="font-bold text-[#0F172A] mt-3 group-hover:text-[#1D4ED8] transition-colors">
              Evidence Vault & Ingestion
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Drag-and-drop evidence files, trigger live OCR/NLP extraction, and review SHA-256 hashes.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#1D4ED8] gap-1">
              <span>Open Vault</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href={`/cases/${activeCase.case_id}/timeline`}>
          <Card className="p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group h-full">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-[#EFF6FF] text-[#1D4ED8]">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-[#64748B]">
                {timelineEvents.length} EVENTS
              </span>
            </div>
            <h3 className="font-bold text-[#0F172A] mt-3 group-hover:text-[#1D4ED8] transition-colors">
              Chronological Timeline
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Reconstructed sequential audit trail connecting wire transfers, meetings, and anti-forensics.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#1D4ED8] gap-1">
              <span>View Timeline</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href={`/cases/${activeCase.case_id}/graph`}>
          <Card className="p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group h-full">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-[#EFF6FF] text-[#1D4ED8]">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-[#64748B]">
                {entitiesList.length} NODES
              </span>
            </div>
            <h3 className="font-bold text-[#0F172A] mt-3 group-hover:text-[#1D4ED8] transition-colors">
              Entity & Relationship Graph
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Interactive network graph of shell corporations, suspects, bank accounts, and evidence citations.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#1D4ED8] gap-1">
              <span>Explore Graph</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href={`/cases/${activeCase.case_id}/assistant`}>
          <Card className="p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group h-full border-blue-200 bg-gradient-to-b from-white to-[#EFF6FF]/60">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-[#1D4ED8] text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-[#1D4ED8]">
                AI CO-PILOT
              </span>
            </div>
            <h3 className="font-bold text-[#0F172A] mt-3 group-hover:text-[#1D4ED8] transition-colors">
              AI Investigation Assistant
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Ask deep questions and get evidence-grounded responses with clickable forensic citations.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#1D4ED8] gap-1">
              <span>Consult Assistant</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
