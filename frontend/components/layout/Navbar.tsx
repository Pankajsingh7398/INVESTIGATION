'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Zap,
  CheckCircle,
  FolderLock,
  ChevronDown,
  Plus,
  Binary
} from 'lucide-react';
import { useForensics } from '@/lib/store/ForensicsContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { activeCase, cases, setActiveCaseId, loadDemoInvestigation, createNewCase } = useForensics();
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  // New Case form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  const handleLoadDemo = async () => {
    setIsLoadingDemo(true);
    try {
      await loadDemoInvestigation();
    } finally {
      setIsLoadingDemo(false);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createNewCase({
      title: newTitle,
      description: newDesc,
      priority: newPriority
    });
    setNewTitle('');
    setNewDesc('');
    setIsNewCaseOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md shadow-xs">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#2563EB] flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Binary className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors">
                    EvidenceGraph <span className="text-[#1D4ED8]">AI</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8]">
                    SIH26194
                  </span>
                </div>
                <p className="text-[10px] text-[#64748B] font-mono tracking-wider">
                  TEAM STARK · DIGITAL FORENSICS
                </p>
              </div>
            </Link>

            {/* Case Selector Dropdown button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsCaseModalOpen(true)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] hover:border-[#1D4ED8] text-xs text-[#0F172A] transition-all cursor-pointer shadow-2xs"
              >
                <FolderLock className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span className="font-mono text-[#1D4ED8] font-bold">{activeCase?.case_id || 'SELECT CASE'}</span>
                <span className="max-w-[140px] truncate text-[#475569]">{activeCase?.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Standalone Demo Loader Button */}
            <Button
              variant="glow"
              size="sm"
              isLoading={isLoadingDemo}
              onClick={handleLoadDemo}
              icon={<Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
              className="text-xs"
            >
              Load Demo Investigation (Case #102)
            </Button>

            {/* Quick Case Create */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsNewCaseOpen(true)}
              icon={<Plus className="w-3.5 h-3.5 text-[#64748B]" />}
              className="hidden sm:inline-flex text-xs"
            >
              New Case
            </Button>

            {/* Integrity Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] text-[#047857] font-mono font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-[#047857]" />
              <span>CHAIN OF CUSTODY VERIFIED</span>
            </div>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                AV
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-[#0F172A] leading-none">Insp. Alok</div>
                <div className="text-[10px] text-[#64748B] font-mono mt-0.5">ED-CYBER-8841</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Switch Case Modal */}
      <Modal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        title="Select Investigation Case"
        description="Switch workspace to another active forensic investigation"
        maxWidth="lg"
      >
        <div className="space-y-2.5">
          {cases.map((c) => (
            <div
              key={c.case_id}
              onClick={() => {
                setActiveCaseId(c.case_id);
                setIsCaseModalOpen(false);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                activeCase?.case_id === c.case_id
                  ? 'border-[#2563EB] bg-[#EFF6FF] shadow-xs'
                  : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8F9FA]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1D4ED8]">{c.case_id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-medium border border-[#E2E8F0]">
                    {c.priority}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#64748B]">{c.evidence_count} evidence</span>
              </div>
              <h4 className="text-sm font-bold text-[#0F172A] mt-1">{c.title}</h4>
              <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
            </div>
          ))}

          <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsCaseModalOpen(false);
                setIsNewCaseOpen(true);
              }}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Create New Investigation
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsCaseModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Case Modal */}
      <Modal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        title="Initialize New Investigation Case"
        description="Register a new digital evidence dossier in the tamper-evident ledger"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCase} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              Case Title / Operational Codename *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operation Deep Blue — Offshore Remittance Audit"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              Priority Classification
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPriority(p)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    newPriority === p
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                      : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              Case Summary & Investigation Scope
            </label>
            <textarea
              rows={3}
              placeholder="Describe suspected violation, entities under surveillance, and seizure circumstances..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsNewCaseOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Register Investigation
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
