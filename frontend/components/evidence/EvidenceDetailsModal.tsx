'use client';

import React, { useState } from 'react';
import { Evidence } from '@/types/forensics';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge, EntityBadge } from '@/components/ui/Badge';
import { HashBadge } from '@/components/ui/HashBadge';
import { ChainOfCustodyView } from './ChainOfCustodyView';
import { ProcessingPipelineStepper } from './ProcessingPipelineStepper';
import {
  FileText,
  ShieldCheck,
  Cpu,
  Layers,
  HardDrive,
  MapPin
} from 'lucide-react';

interface DetailsModalProps {
  evidence: Evidence | null;
  onClose: () => void;
}

export const EvidenceDetailsModal: React.FC<DetailsModalProps> = ({ evidence, onClose }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'custody' | 'entities'>('text');

  if (!evidence) return null;

  return (
    <Modal
      isOpen={!!evidence}
      onClose={onClose}
      title={`${evidence.evidence_id} · ${evidence.file_name}`}
      description="Cryptographically secured digital artifact & extracted forensic intelligence"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-[#0F172A]">
        {/* Header Metadata Ribbon */}
        <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                {evidence.evidence_id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-white text-[#334155] border border-[#CBD5E1]">
                {evidence.file_type}
              </span>
              <span className="text-xs font-mono text-[#64748B]">{evidence.file_size}</span>
            </div>
            <StatusBadge status={evidence.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#64748B] pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <HardDrive className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
              <span className="truncate">Source: {evidence.source_device || 'Workstation Ingest'}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
              <span className="truncate">Seizure: {evidence.seizure_location || 'Digital Forensics Lab'}</span>
            </div>
          </div>

          {/* Master SHA-256 */}
          <div className="pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B] font-bold">
                Cryptographic SHA-256 Checksum
              </span>
              <span className="text-[10px] font-mono text-[#047857] font-bold">
                BIT-STREAM VERIFIED
              </span>
            </div>
            <HashBadge hash={evidence.sha256} truncate={false} className="w-full justify-between py-1 px-2.5" />
          </div>
        </div>

        {/* Live Pipeline Stepper */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
          <ProcessingPipelineStepper
            status={evidence.status}
            progressPercent={evidence.progress_percent || 100}
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-[#E2E8F0] gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('text')}
            className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 -mb-px cursor-pointer font-semibold ${
              activeTab === 'text'
                ? 'border-[#1D4ED8] text-[#1D4ED8]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Extracted Content & OCR</span>
          </button>

          <button
            onClick={() => setActiveTab('entities')}
            className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 -mb-px cursor-pointer font-semibold ${
              activeTab === 'entities'
                ? 'border-[#1D4ED8] text-[#1D4ED8]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Extracted Entities ({evidence.extracted_entities?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('custody')}
            className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 -mb-px cursor-pointer font-semibold ${
              activeTab === 'custody'
                ? 'border-[#1D4ED8] text-[#1D4ED8]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Chain of Custody ({evidence.chain_of_custody?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto shadow-inner">
              {evidence.extracted_text || 'Text extraction pending or unavailable for binary file.'}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
              <Cpu className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>Processed by Khushboo OCR & Tesseract forensic pipeline engine.</span>
            </div>
          </div>
        )}

        {activeTab === 'entities' && (
          <div className="space-y-4">
            <p className="text-xs text-[#64748B]">
              Named entities recognized within this document and ingested into the knowledge graph:
            </p>
            <div className="flex flex-wrap gap-2">
              {evidence.extracted_entities && evidence.extracted_entities.length > 0 ? (
                evidence.extracted_entities.map((entity, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-semibold flex items-center gap-2"
                  >
                    <span>⚡</span>
                    <span>{entity}</span>
                  </span>
                ))
              ) : (
                <div className="text-xs text-[#94A3B8] italic">
                  No named entities extracted yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'custody' && (
          <div>
            <ChainOfCustodyView
              steps={evidence.chain_of_custody || []}
              sha256={evidence.sha256}
            />
          </div>
        )}

        <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Inspection
          </Button>
        </div>
      </div>
    </Modal>
  );
};
