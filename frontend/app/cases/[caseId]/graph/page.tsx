'use client';

import React from 'react';
import { useForensics } from '@/lib/store/ForensicsContext';
import { EntityGraphView } from '@/components/graph/EntityGraphView';
import { EvidenceDetailsModal } from '@/components/evidence/EvidenceDetailsModal';

export default function GraphPage() {
  const {
    activeCase,
    entitiesList,
    graphData,
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
              Relational Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Entity & Relationship Graph
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            {entitiesList.length} indexed forensic entities linked across {graphData.edges.length} multi-hop evidentiary relationships
          </p>
        </div>
      </div>

      {/* Graph View Canvas */}
      <EntityGraphView
        nodes={entitiesList}
        edges={graphData.edges}
        allEvidence={evidenceList}
        onSelectEvidence={(ev) => setSelectedEvidence(ev)}
      />

      {/* Evidence Details Modal if clicked from inspector */}
      <EvidenceDetailsModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}
