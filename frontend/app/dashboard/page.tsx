'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  FileCheck2,
  Share2,
  Lock,
  Zap,
  ArrowRight,
  UploadCloud,
  Clock,
  Sparkles,
  Search,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useForensics } from '@/lib/store/ForensicsContext';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { HashBadge } from '@/components/ui/HashBadge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';

export default function DashboardPage() {
  const router = useRouter();
  const {
    activeCase,
    cases,
    evidenceList,
    entitiesList,
    timelineEvents,
    loadDemoInvestigation,
    setSelectedEvidence,
    currentUser
  } = useForensics();

  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleDemoClick = async () => {
    setIsLoadingDemo(true);
    try {
      await loadDemoInvestigation();
      router.push('/cases/CASE-102');
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Top Banner / SIH Hackathon Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#EFF6FF] via-white to-[#F5F2EB] border border-[#BFDBFE] relative overflow-hidden shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="blue" size="sm">
                SIH 2026 · PS ID: SIH26194
              </Badge>
              <Badge variant="beige" size="sm">
                Digital Evidence Intelligence
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Welcome, {currentUser.name.split(' ').slice(-1)[0]}
            </h1>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl leading-relaxed">
              {currentUser.role === 'JUDICIAL_AUDITOR'
                ? 'Judicial read-only audit mode — review evidence integrity and chain of custody compliance.'
                : currentUser.role === 'FORENSIC_ANALYST'
                ? 'Forensic analysis workspace — evidence extraction, NER pipeline, and hash verification.'
                : 'Automated ingestion, entity-relationship intelligence, chronological timeline synthesis, and tamper-evident cryptographic chain of custody.'}
            </p>
          </div>

          {/* Standalone Demo Action Card */}
          <div className="shrink-0 flex items-center gap-3">
            <Button
              variant="glow"
              size="lg"
              isLoading={isLoadingDemo}
              onClick={handleDemoClick}
              icon={<Zap className="w-5 h-5 text-amber-300 fill-amber-300" />}
              className="w-full sm:w-auto"
            >
              Load Demo Investigation (Case #102)
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Investigations"
          value={cases.length}
          subtitle="Assigned to Cyber Unit"
          icon={<ShieldAlert className="w-5 h-5 text-[#1D4ED8]" />}
          trend={{ value: '+2 new', positive: true }}
          onClick={() => router.push(`/cases/${activeCase?.case_id || 'CASE-102'}`)}
        />
        <StatCard
          title="Evidence Records"
          value={evidenceList.length}
          subtitle="Bit-stream verified"
          icon={<FileCheck2 className="w-5 h-5 text-[#1D4ED8]" />}
          trend={{ value: '100% processed', positive: true }}
          onClick={() => router.push(`/cases/${activeCase?.case_id || 'CASE-102'}/evidence`)}
        />
        <StatCard
          title="Extracted Entities"
          value={entitiesList.length}
          subtitle="Persons, Orgs, Locations"
          icon={<Share2 className="w-5 h-5 text-[#1D4ED8]" />}
          trend={{ value: '42 relations mapped', positive: true }}
          onClick={() => router.push(`/cases/${activeCase?.case_id || 'CASE-102'}/graph`)}
        />
        <StatCard
          title="Hash Integrity"
          value="100%"
          subtitle="SHA-256 chain confirmed"
          icon={<Lock className="w-5 h-5 text-[#1D4ED8]" />}
          trend={{ value: '0 tampering flags', positive: true }}
        />
      </div>

      {/* Hero Active Case Quick Summary */}
      {activeCase && (
        <Card glowBorder className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[#1D4ED8] font-bold text-sm tracking-wider">
                  {activeCase.case_id}
                </span>
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700">
                  {activeCase.priority} PRIORITY
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">
                  Lead: {activeCase.investigator}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">{activeCase.title}</h2>
              <p className="text-xs text-[#475569] max-w-3xl leading-relaxed">
                {activeCase.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(activeCase.tags || []).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F5F2EB] text-[#574C3A] border border-[#E5DFD5]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick action buttons for active case */}
            <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
              <Link href={`/cases/${activeCase.case_id}/evidence`}>
                <Button variant="outline" size="sm" icon={<UploadCloud className="w-4 h-4" />} className="w-full justify-start text-xs">
                  Evidence Vault ({evidenceList.length})
                </Button>
              </Link>
              <Link href={`/cases/${activeCase.case_id}/graph`}>
                <Button variant="secondary" size="sm" icon={<Share2 className="w-4 h-4 text-[#1D4ED8]" />} className="w-full justify-start text-xs">
                  Entity Graph ({entitiesList.length})
                </Button>
              </Link>
              <Link href={`/cases/${activeCase.case_id}/assistant`}>
                <Button variant="glow" size="sm" icon={<Sparkles className="w-4 h-4" />} className="w-full justify-start text-xs">
                  AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Two Column Layout: Recent Evidence Stream & Case List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Evidence Stream (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Seized Evidence</CardTitle>
                <CardDescription>Live incoming records with cryptographic checksums</CardDescription>
              </div>
              <Link href={`/cases/${activeCase?.case_id || 'CASE-102'}/evidence`}>
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All ({evidenceList.length})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evidence ID</TableHead>
                    <TableHead>File / Record</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>SHA-256 Hash</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evidenceList.slice(0, 5).map((ev) => (
                    <TableRow key={ev.evidence_id}>
                      <TableCell className="font-mono text-[#1D4ED8] text-xs font-bold">
                        {ev.evidence_id}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-[#0F172A] text-xs">{ev.file_name}</div>
                        <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
                          {ev.file_size} · {new Date(ev.uploaded_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#F5F2EB] text-[#574C3A] border border-[#E5DFD5]">
                          {ev.file_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <HashBadge hash={ev.sha256} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ev.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/cases/${activeCase?.case_id || 'CASE-102'}/evidence`}>
                          <button
                            onClick={() => setSelectedEvidence(ev)}
                            className="p-1 rounded text-[#64748B] hover:text-[#1D4ED8] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                            title="Inspect evidence details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Quick Timeline Stream (1 Column) */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Chronology Snapshot</CardTitle>
                <CardDescription>Reconstructed event sequences</CardDescription>
              </div>
              <Link href={`/cases/${activeCase?.case_id || 'CASE-102'}/timeline`}>
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Timeline
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {timelineEvents.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#1D4ED8] font-semibold">
                    <span>{evt.date}</span>
                    <span className="text-[#64748B] font-normal">{evt.time || ''}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A] mt-1">{evt.event}</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {evt.entities.slice(0, 2).map((ent) => (
                      <span
                        key={ent}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#334155]"
                      >
                        {ent}
                      </span>
                    ))}
                    {evt.evidence.map((ev) => (
                      <span
                        key={ev}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-bold"
                      >
                        [{ev}]
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
