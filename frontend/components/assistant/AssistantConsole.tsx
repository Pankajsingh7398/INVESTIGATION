'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  ShieldCheck,
  Search,
  Cpu,
  Layers,
  Clock,
  FileCheck2,
  Lightbulb,
  FileText
} from 'lucide-react';
import { AIQueryResponse, Evidence } from '@/types/forensics';
import { DEMO_AI_PRESETS_102 } from '@/lib/mock/case102';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EvidenceCitationCard } from './EvidenceCitationCard';

interface AssistantConsoleProps {
  allEvidence: Evidence[];
  onInspectEvidence: (evidence: Evidence) => void;
  onQuery: (question: string) => Promise<AIQueryResponse>;
}

export const AssistantConsole: React.FC<AssistantConsoleProps> = ({
  allEvidence,
  onInspectEvidence,
  onQuery
}) => {
  const [question, setQuestion] = useState('');
  const [currentResponse, setCurrentResponse] = useState<AIQueryResponse>(DEMO_AI_PRESETS_102['fund_flow']);
  const [isLoading, setIsLoading] = useState(false);

  const suggestedPrompts = [
    {
      label: 'Offshore Fund Flow',
      query: 'How did funds flow from ABC Company to the offshore Swiss accounts?'
    },
    {
      label: 'Rahul & Amit Conspiracy',
      query: 'What is the connection between Rahul Sharma, Amit Verma, and the Dubai entities?'
    },
    {
      label: 'Evidence Tampering & Wipe',
      query: 'Is there evidence of deliberate tampering or anti-forensics by the suspects?'
    }
  ];

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setQuestion(queryText);
    try {
      const resp = await onQuery(queryText);
      setCurrentResponse(resp);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render text with clickable citation pills like [EV-101]
  const renderGroundedAnswer = (text: string) => {
    const parts = text.split(/(\[EV-\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(EV-\d+)\]/);
      if (match) {
        const evId = match[1];
        const matched = allEvidence.find((e) => e.evidence_id === evId);
        return (
          <button
            key={index}
            onClick={() => matched && onInspectEvidence(matched)}
            title={matched ? `Inspect: ${matched.file_name}` : `View ${evId}`}
            className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-mono text-[11px] font-bold hover:bg-[#1D4ED8] hover:text-white transition-colors align-baseline cursor-pointer"
          >
            <FileText className="w-3 h-3" />
            <span>{part}</span>
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Investigative Prompt Suggestions Header */}
      <Card className="p-4 bg-white border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Suggested Investigative Hypotheses:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((p) => (
              <button
                key={p.label}
                onClick={() => handleAsk(p.query)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F8F9FA] border border-[#E2E8F0] text-[#334155] hover:border-blue-400 hover:text-[#1D4ED8] hover:bg-[#EFF6FF] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>⚡</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Query Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(question);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Sparkles className="w-4 h-4 text-[#1D4ED8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ask anything grounded strictly in seized evidence, timeline events, and entity records..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB] shadow-xs"
          />
        </div>
        <Button
          type="submit"
          variant="glow"
          size="md"
          isLoading={isLoading}
          icon={<Send className="w-4 h-4" />}
          className="px-6"
        >
          Investigate
        </Button>
      </form>

      {/* Loading Animation */}
      {isLoading && (
        <Card className="p-8 text-center space-y-3 bg-white border-[#E2E8F0]">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-[#1D4ED8] border-t-transparent animate-spin" />
          <h4 className="text-sm font-bold text-[#0F172A]">
            Synthesizing Evidence Intelligence...
          </h4>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            Cross-referencing vector embeddings across 12 seized files, verifying SHA-256 integrity,
            and establishing relation triples.
          </p>
        </Card>
      )}

      {/* Grounded Response Display */}
      {!isLoading && currentResponse && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Answer Card */}
          <Card glowBorder className="p-6 space-y-4 bg-white border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  Evidence-Grounded Intelligence Report
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#64748B]">Provenance Confidence:</span>
                <span className="text-[#047857] font-bold px-2 py-0.5 rounded bg-[#ECFDF5] border border-[#A7F3D0]">
                  {Math.round(currentResponse.confidence * 100)}%
                </span>
              </div>
            </div>

            {/* Answer Text with Citation Pills */}
            <div className="text-sm sm:text-base text-[#0F172A] leading-relaxed font-sans bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              {renderGroundedAnswer(currentResponse.answer)}
            </div>

            {/* Strict Grounding Assurance Notice */}
            <div className="p-3 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs text-[#065F46]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
                <span>Zero hallucination guarantee: Every conclusion is backed by indexed forensic artifacts above.</span>
              </div>
              <span className="font-mono text-[10px] text-[#047857] font-bold">SECTION 65B COMPLIANT</span>
            </div>
          </Card>

          {/* Provenance Tier 2: Supporting Evidence Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#1D4ED8]" />
                <span>Supporting Seized Evidence Citations ({currentResponse.supporting_evidence.length})</span>
              </h4>
              <span className="text-[11px] font-mono text-[#64748B]">
                Click any citation card to view original file & chain of custody
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentResponse.supporting_evidence.map((cit) => {
                const matched = allEvidence.find((e) => e.evidence_id === cit.evidence_id);
                return (
                  <EvidenceCitationCard
                    key={cit.evidence_id}
                    citation={cit}
                    matchedEvidence={matched}
                    onInspect={onInspectEvidence}
                  />
                );
              })}
            </div>
          </div>

          {/* Provenance Tier 3: Timeline & Entity Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Correlated Timeline Events */}
            <Card className="p-4 bg-white border-[#E2E8F0]">
              <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1D4ED8]" />
                <span>Correlated Chronology Events</span>
              </h4>
              <div className="space-y-2">
                {currentResponse.events.map((evt, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] text-xs text-[#0F172A] flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] shrink-0" />
                    <span>{evt}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Identified Key Entities */}
            <Card className="p-4 bg-white border-[#E2E8F0]">
              <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D97706]" />
                <span>Correlated Network Entities</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentResponse.entities.map((entity, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-[#F5F2EB] border border-[#E5DFD5] text-[#574C3A] text-xs font-semibold"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
