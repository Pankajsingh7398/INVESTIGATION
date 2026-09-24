'use client';

import React from 'react';
import { useForensics } from '@/lib/store/ForensicsContext';
import { AssistantConsole } from '@/components/assistant/AssistantConsole';
import { EvidenceDetailsModal } from '@/components/evidence/EvidenceDetailsModal';

export default function AssistantPage() {
  const {
    activeCase,
    evidenceList,
    selectedEvidence,
    setSelectedEvidence,
    queryAssistant
  } = useForensics();

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[#1D4ED8] font-bold text-xs">
              {activeCase?.case_id}
            </span>
            <span className="text-[#94A3B8]">/</span>
            <span className="text-xs text-[#64748B] font-semibold uppercase">
              AI Forensic Co-Pilot
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
            <span>AI Investigation Assistant</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8]">
              EVIDENCE-GROUNDED
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Traceable AI intelligence powered by RAG over {evidenceList.length} bit-stream verified artifacts
          </p>
        </div>
      </div>

      {/* Main Assistant Console */}
      <AssistantConsole
        allEvidence={evidenceList}
        onInspectEvidence={(ev) => setSelectedEvidence(ev)}
        onQuery={queryAssistant}
      />

      {/* Detail Modal if an evidence citation is clicked */}
      <EvidenceDetailsModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}
