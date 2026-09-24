'use client';

import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { EvidenceProcessingStatus } from '@/types/forensics';

interface StepperProps {
  status: EvidenceProcessingStatus;
  progressPercent?: number;
}

const STEPS: Array<{ key: EvidenceProcessingStatus; label: string }> = [
  { key: 'UPLOADED', label: 'Uploaded' },
  { key: 'PROCESSING', label: 'Hashing & Enclave' },
  { key: 'TEXT_EXTRACTED', label: 'OCR / Speech' },
  { key: 'ENTITIES_EXTRACTED', label: 'NER Extraction' },
  { key: 'RELATIONSHIPS_GENERATED', label: 'Graph Triples' },
  { key: 'COMPLETED', label: 'Verified' }
];

export const ProcessingPipelineStepper: React.FC<StepperProps> = ({ status, progressPercent = 0 }) => {
  const currentIdx = STEPS.findIndex((s) => s.key === status);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="w-full py-2 text-[#0F172A]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono uppercase text-[#1D4ED8] font-bold tracking-wider">
          AI Forensic Pipeline: {status.replace('_', ' ')}
        </span>
        <span className="text-[11px] font-mono text-[#64748B]">
          {progressPercent}% Completed
        </span>
      </div>

      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(progressPercent, 10)}%` }}
        />
      </div>

      <div className="grid grid-cols-6 gap-1 text-center">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeIdx || status === 'COMPLETED';
          const isCurrent = idx === activeIdx && status !== 'COMPLETED';

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isDone
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1D4ED8] animate-pulse'
                    : 'bg-[#F1F5F9] border-[#CBD5E1] text-[#94A3B8]'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`text-[9px] font-semibold mt-1 truncate max-w-full ${
                  isDone
                    ? 'text-emerald-700'
                    : isCurrent
                    ? 'text-[#1D4ED8]'
                    : 'text-[#94A3B8]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
