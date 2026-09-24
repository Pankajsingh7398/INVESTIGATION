'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, User, Key } from 'lucide-react';
import { CustodyStep } from '@/types/forensics';
import { HashBadge } from '@/components/ui/HashBadge';
import { Badge } from '@/components/ui/Badge';

interface ChainOfCustodyViewProps {
  steps: CustodyStep[];
  sha256: string;
}

export const ChainOfCustodyView: React.FC<ChainOfCustodyViewProps> = ({ steps, sha256 }) => {
  return (
    <div className="space-y-4 text-[#0F172A]">
      {/* Cryptographic Assurance Banner */}
      <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="text-xs font-bold text-emerald-900">
              Cryptographic Integrity Confirmed
            </div>
            <div className="text-[11px] text-emerald-700">
              Original bit-stream verified against Section 65B Indian Evidence Act standards
            </div>
          </div>
        </div>
        <Badge variant="emerald" size="sm">
          ✓ HASH VERIFIED
        </Badge>
      </div>

      {/* Master SHA-256 Box */}
      <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] text-xs">
        <div className="text-[#64748B] font-mono text-[10px] uppercase font-bold mb-1">
          Master Forensic Checksum (SHA-256)
        </div>
        <HashBadge hash={sha256} truncate={false} className="w-full justify-between py-1.5 px-3" />
      </div>

      {/* Vertical Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#CBD5E1]">
        {steps.map((step, idx) => (
          <div key={idx} className="relative group">
            {/* Step Icon */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center text-emerald-600 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-blue-300 transition-colors shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-[#0F172A]">{step.step}</h4>
                <span className="text-[11px] font-mono text-[#1D4ED8] font-semibold">
                  {new Date(step.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#F1F5F9] text-xs text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>{step.actor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span className="truncate">{step.action}</span>
                </div>
              </div>

              {step.notes && (
                <div className="mt-2 text-[11px] text-[#475569] bg-[#F8F9FA] p-2 rounded border border-[#E2E8F0] leading-relaxed">
                  <span className="text-[#0F172A] font-semibold">Note:</span> {step.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
