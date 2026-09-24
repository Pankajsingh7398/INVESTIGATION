'use client';

import React from 'react';
import { useForensics } from '@/lib/store/ForensicsContext';
import { TimelineView } from '@/components/timeline/TimelineView';
import { EvidenceDetailsModal } from '@/components/evidence/EvidenceDetailsModal';

export default function TimelinePage() {
  const {
    activeCase,
    timelineEvents,
    evidenceList,
    selectedEvidence,
    setSelectedEvidence
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
              Chronological Reconstruction
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Forensic Investigation Timeline
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            {timelineEvents.length} sequential evidentiary events cross-referenced with bank remittances, CCTV feeds, and CDR towers
          </p>
        </div>
      </div>

      {/* Main Timeline Component */}
      <TimelineView
        events={timelineEvents}
        allEvidence={evidenceList}
        onSelectEvidence={(ev) => setSelectedEvidence(ev)}
      />

      {/* Detail Modal if clicked */}
      <EvidenceDetailsModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}
