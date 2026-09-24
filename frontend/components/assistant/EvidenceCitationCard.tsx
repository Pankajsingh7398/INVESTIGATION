'use client';

import React from 'react';
import { FileCheck2, ExternalLink, ShieldCheck, Quote } from 'lucide-react';
import { SupportingEvidenceRef, Evidence } from '@/types/forensics';
import { Card } from '@/components/ui/Card';

interface EvidenceCitationCardProps {
  citation: SupportingEvidenceRef;
  matchedEvidence?: Evidence;
  onInspect: (evidence: Evidence) => void;
}

export const EvidenceCitationCard: React.FC<EvidenceCitationCardProps> = ({
  citation,
  matchedEvidence,
  onInspect
}) => {
  return (
    <Card
      onClick={() => matchedEvidence && onInspect(matchedEvidence)}
      className="p-4 bg-white border border-[#E2E8F0] hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group text-[#0F172A]"
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-[#1D4ED8] shrink-0" />
          <span className="font-mono text-xs font-bold text-[#1D4ED8]">
            [{citation.evidence_id}]
          </span>
          <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors truncate max-w-[200px]">
            {citation.file_name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] font-bold">
            {Math.round(citation.relevance_score * 100)}% MATCH
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#1D4ED8] group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-[#334155] bg-[#F8F9FA] p-2.5 rounded-lg border border-[#E2E8F0] font-mono leading-relaxed">
        <Quote className="w-3.5 h-3.5 text-[#1D4ED8]/60 shrink-0 mt-0.5" />
        <span className="italic line-clamp-3">{citation.snippet}</span>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#059669]" />
          SHA-256: {citation.sha256_prefix}...
        </span>
        <span className="text-[#1D4ED8] font-semibold group-hover:underline">Click to view original record</span>
      </div>
    </Card>
  );
};
