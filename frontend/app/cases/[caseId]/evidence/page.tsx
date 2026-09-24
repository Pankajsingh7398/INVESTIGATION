'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  UploadCloud,
  Search,
  Filter,
  ShieldCheck,
  Eye,
  FileText
} from 'lucide-react';
import { useForensics } from '@/lib/store/ForensicsContext';
import { Evidence, EvidenceType } from '@/types/forensics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { HashBadge } from '@/components/ui/HashBadge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { FileUploader } from '@/components/evidence/FileUploader';
import { EvidenceDetailsModal } from '@/components/evidence/EvidenceDetailsModal';

export default function EvidenceManagementPage() {
  const {
    activeCase,
    evidenceList,
    selectedEvidence,
    setSelectedEvidence,
    uploadNewEvidence,
    currentUser
  } = useForensics();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const evidenceTypes = [
    'ALL',
    'Document',
    'Financial Record',
    'Chat',
    'Image',
    'Audio',
    'Server Log',
    'Archive'
  ];

  const filteredEvidence = evidenceList.filter((ev) => {
    const matchesSearch =
      ev.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.evidence_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.sha256.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.extracted_text && ev.extracted_text.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'ALL' || ev.file_type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleUploadComplete = async (fileData: {
    name: string;
    size: string;
    type: EvidenceType;
    rawSha256?: string;
  }) => {
    const created = await uploadNewEvidence(fileData);
    setIsUploadModalOpen(false);
    setSelectedEvidence(created);
  };

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
              Digital Forensics Vault
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Evidence Ingestion & Chain of Custody
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            {evidenceList.length} authenticated digital artifacts with cryptographic SHA-256 seal
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.permissions.canUploadEvidence ? (
            <Button
              variant="glow"
              size="md"
              onClick={() => setIsUploadModalOpen(true)}
              icon={<UploadCloud className="w-4 h-4" />}
            >
              Ingest Digital Evidence
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-xs font-mono text-[#92400E]">
              <ShieldCheck className="w-4 h-4 text-[#B45309]" />
              <span>JUDICIAL OVERSIGHT · READ-ONLY AUDIT MODE</span>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by file name, Evidence ID (EV-XX), SHA-256 hash, or OCR content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {evidenceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === type
                    ? 'bg-[#1D4ED8] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Evidence Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Seized Evidence Ledger</CardTitle>
            <CardDescription>
              Showing {filteredEvidence.length} of {evidenceList.length} records
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#047857] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Tamper-Evident Enclave: Active</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evidence ID</TableHead>
                <TableHead>Artifact Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>SHA-256 Hash</TableHead>
                <TableHead>AI Status</TableHead>
                <TableHead className="text-right">Inspection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvidence.map((ev) => (
                <TableRow
                  key={ev.evidence_id}
                  onClick={() => setSelectedEvidence(ev)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-mono text-xs font-bold text-[#1D4ED8]">
                    {ev.evidence_id}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[#0F172A] text-xs">{ev.file_name}</div>
                    <div className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                      Source: {ev.source_device || 'Workstation Ingest'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#F5F2EB] text-[#574C3A] border border-[#E5DFD5] font-medium">
                      {ev.file_type}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[#64748B]">
                    {ev.file_size}
                  </TableCell>
                  <TableCell>
                    <HashBadge hash={ev.sha256} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ev.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvidence(ev);
                      }}
                    >
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Evidence Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Ingest & Hash New Digital Evidence"
        description="Calculate master SHA-256 hash and submit file to the Khushboo AI extraction pipeline"
        maxWidth="lg"
      >
        <FileUploader onUpload={handleUploadComplete} />
      </Modal>

      {/* Evidence Details Modal / Drawer */}
      <EvidenceDetailsModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}
