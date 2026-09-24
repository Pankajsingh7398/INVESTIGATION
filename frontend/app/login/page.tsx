'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Binary,
  Lock,
  ArrowRight,
  ShieldCheck,
  Scale,
  Cpu,
  UserCheck,
  CheckCircle2,
  FileText,
  BadgeAlert,
  Fingerprint
} from 'lucide-react';
import { useForensics } from '@/lib/store/ForensicsContext';
import { PRESET_USERS } from '@/lib/mock/auth';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, login } = useForensics();
  const [selectedRole, setSelectedRole] = useState<'investigator' | 'analyst' | 'auditor'>('investigator');
  const [emailInput, setEmailInput] = useState(PRESET_USERS.investigator.email);
  const [pinInput, setPinInput] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preset' | 'credentials'>('preset');

  const handlePresetSelect = (roleKey: 'investigator' | 'analyst' | 'auditor') => {
    setSelectedRole(roleKey);
    setEmailInput(PRESET_USERS[roleKey].email);
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      if (activeTab === 'preset') {
        switchRole(selectedRole);
      } else {
        login(emailInput);
      }
      // Small simulated auth latency for slick feel
      await new Promise((resolve) => setTimeout(resolve, 350));
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const activeProfile = PRESET_USERS[selectedRole];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] flex flex-col justify-between forensics-grid">
      {/* Top Header */}
      <header className="border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#2563EB] flex items-center justify-center shadow-xs">
            <Binary className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#0F172A]">
                EvidenceGraph <span className="text-[#1D4ED8]">AI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8]">
                SIH26194
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] font-mono">
              DIGITAL EVIDENCE INTELLIGENCE & TIMELINE INVESTIGATION PLATFORM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] bg-[#F1F5F9] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
          <ShieldCheck className="w-4 h-4 text-[#047857]" />
          <span>FIPS 140-2 / ISO 27037 COMPLIANT</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Context & Statutory Notice */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-medium text-[#1D4ED8]">
                <Fingerprint className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span>Forensic Authorization Portal</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Secure Chain of Custody Access
              </h1>
              <p className="text-sm text-[#475569] leading-relaxed">
                Role-gated intelligence platform designed for Cyber Forensic Investigation Wings,
                Central Forensic Science Laboratories, and Judicial Evidence Tribunals.
              </p>
            </div>

            {/* Statutory Compliance Callout */}
            <div className="p-4 rounded-xl bg-[#F5F2EB]/80 border border-[#E2DDCB] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#412D15]">
                <Scale className="w-4 h-4 text-[#412D15]" />
                <span>STATUTORY COMPLIANCE NOTICE</span>
              </div>
              <p className="text-[11px] text-[#412D15]/90 leading-relaxed font-sans">
                All evidence ingested, hashed (SHA-256), and analyzed within EvidenceGraph AI strictly satisfies
                admissibility requirements under <strong>Section 65B of the Indian Evidence Act</strong> and <strong>Section 63 of Bharatiya Sakshya Adhiniyam 2023</strong>.
              </p>
              <div className="pt-2 border-t border-[#E2DDCB] flex items-center justify-between text-[10px] text-[#412D15]/80 font-mono">
                <span>Tamper-Proof Audit Trail</span>
                <span className="font-bold">Active ●</span>
              </div>
            </div>

            {/* Quick Demo Info for Hackathon Judges */}
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                <Cpu className="w-4 h-4 text-[#1D4ED8]" />
                <span>SIH 2026 Evaluation Presets</span>
              </div>
              <p className="text-xs text-[#64748B]">
                Judges may test role-based access restrictions (investigation writes, AI analysis, or judicial audit-only mode) with 1 click.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Role Selector & Login Card */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-sm space-y-6">
              {/* Tab Selector */}
              <div className="flex rounded-lg bg-[#F1F5F9] p-1 border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setActiveTab('preset')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    activeTab === 'preset'
                      ? 'bg-white text-[#1D4ED8] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  1-Click Role Presets (Demo)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('credentials')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    activeTab === 'credentials'
                      ? 'bg-white text-[#1D4ED8] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Govt SSO & Security PIN
                </button>
              </div>

              {activeTab === 'preset' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#334155] uppercase tracking-wider">
                      Select Authorization Role
                    </span>
                    <span className="text-[11px] text-[#1D4ED8] font-mono">1-Click Fast Auth</span>
                  </div>

                  {/* 3 Preset Role Cards */}
                  <div className="space-y-2.5">
                    {/* Role 1: Lead Investigator */}
                    <div
                      onClick={() => handlePresetSelect('investigator')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedRole === 'investigator'
                          ? 'border-[#1D4ED8] bg-[#EFF6FF] shadow-xs ring-1 ring-[#1D4ED8]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            AV
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#0F172A]">
                                Insp. Alok Vishwakarma
                              </span>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#1D4ED8]">
                                LEAD INVESTIGATOR
                              </span>
                            </div>
                            <p className="text-xs text-[#64748B] mt-0.5">
                              Enforcement Directorate · Cyber Crime Division
                            </p>
                          </div>
                        </div>
                        {selectedRole === 'investigator' && (
                          <CheckCircle2 className="w-5 h-5 text-[#1D4ED8] shrink-0" />
                        )}
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-[#BFDBFE]/60 flex items-center justify-between text-[11px] font-mono text-[#1D4ED8]">
                        <span>Badge: ED-CYBER-8841</span>
                        <span>Full Dossier & Ingestion Write</span>
                      </div>
                    </div>

                    {/* Role 2: Forensic Analyst */}
                    <div
                      onClick={() => handlePresetSelect('analyst')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedRole === 'analyst'
                          ? 'border-[#1D4ED8] bg-[#EFF6FF] shadow-xs ring-1 ring-[#1D4ED8]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            KR
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#0F172A]">
                                Khushboo Rawat
                              </span>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-[#0F172A]">
                                FORENSIC ANALYST
                              </span>
                            </div>
                            <p className="text-xs text-[#64748B] mt-0.5">
                              Central Forensic Science Laboratory (CFSL)
                            </p>
                          </div>
                        </div>
                        {selectedRole === 'analyst' && (
                          <CheckCircle2 className="w-5 h-5 text-[#1D4ED8] shrink-0" />
                        )}
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                        <span>Badge: CFSL-NER-304</span>
                        <span>Extraction Pipeline & Evidence Ingest</span>
                      </div>
                    </div>

                    {/* Role 3: Judicial Auditor */}
                    <div
                      onClick={() => handlePresetSelect('auditor')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedRole === 'auditor'
                          ? 'border-[#1D4ED8] bg-[#EFF6FF] shadow-xs ring-1 ring-[#1D4ED8]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#412D15] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            SN
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#0F172A]">
                                Hon. S. Narayanan
                              </span>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-[#412D15]">
                                JUDICIAL AUDITOR
                              </span>
                            </div>
                            <p className="text-xs text-[#64748B] mt-0.5">
                              Special Judicial Oversight Tribunal (Sec 65B)
                            </p>
                          </div>
                        </div>
                        {selectedRole === 'auditor' && (
                          <CheckCircle2 className="w-5 h-5 text-[#1D4ED8] shrink-0" />
                        )}
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-mono text-[#412D15]">
                        <span>Badge: JUD-DEL-2026</span>
                        <span className="font-semibold text-amber-800">Read-Only Audit & Certificate Verification</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Credentials Form */
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                      Authorized Department Email / NIC Handle
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. investigator@ed.gov.in"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                    />
                    <p className="text-[11px] text-[#64748B] mt-1 font-mono">
                      Tip: Use alok.vishwakarma@ed.gov.in or judicial.audit@delhicourts.gov.in
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                      FIPS Hardware Security Key / Security PIN
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        placeholder="Enter secure OTP / token PIN"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                      <Lock className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-3" />
                    </div>
                  </div>
                </form>
              )}

              {/* Clearance Summary Details */}
              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Active Clearance:</span>
                  <span className="font-bold text-[#0F172A]">{activeProfile.name}</span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Permissions:</span>
                  <div className="flex gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${activeProfile.permissions.canCreateCase ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                      {activeProfile.permissions.canCreateCase ? 'Create Dossier' : 'No Dossier Create'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${activeProfile.permissions.canUploadEvidence ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FEF2F2] text-[#B91C1C]'}`}>
                      {activeProfile.permissions.canUploadEvidence ? 'Upload Evidence' : 'Read-Only Mode'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="glow"
                size="lg"
                isLoading={isLoading}
                onClick={() => handleSignIn()}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-blue-500/20"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Authenticate & Access Investigation Workspace
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#64748B] font-mono">
                <Lock className="w-3.5 h-3.5 text-[#047857]" />
                <span>256-BIT ENCRYPTION · SESSION AUDITED BY NATIONAL INFORMATICS CENTRE</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white px-6 py-4 text-center text-xs text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0F172A]">Smart India Hackathon 2026</span>
          <span>· Problem Statement SIH26194</span>
        </div>
        <div className="font-mono text-[11px] text-[#475569]">
          TEAM STARK · Alok Vishwakarma (Frontend / Lead) · Khushboo Rawat (AI/ML) · Pankaj (Backend) · Yagyesh (Design)
        </div>
      </footer>
    </div>
  );
}
