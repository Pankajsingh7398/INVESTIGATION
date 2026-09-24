'use client';

import React from 'react';
import { X, ArrowUpRight, ArrowDownLeft, FileCheck2, ExternalLink } from 'lucide-react';
import { Entity, GraphEdge, Evidence } from '@/types/forensics';
import { EntityBadge } from '@/components/ui/Badge';

interface NodeInspectorProps {
  entity: Entity | null;
  edges: GraphEdge[];
  allEntities: Entity[];
  allEvidence: Evidence[];
  onClose: () => void;
  onSelectEntity: (entity: Entity) => void;
  onSelectEvidence: (evidence: Evidence) => void;
}

export const NodeInspectorSheet: React.FC<NodeInspectorProps> = ({
  entity,
  edges,
  allEntities,
  allEvidence,
  onClose,
  onSelectEntity,
  onSelectEvidence
}) => {
  if (!entity) return null;

  const outgoing = edges.filter((e) => e.source === entity.id);
  const incoming = edges.filter((e) => e.target === entity.id);

  const relevantEvidenceIds = Array.from(
    new Set([
      ...outgoing.flatMap((e) => e.evidence_refs || []),
      ...incoming.flatMap((e) => e.evidence_refs || [])
    ])
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col transform transition-transform duration-300 overflow-hidden text-[#0F172A]">
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex items-start justify-between bg-[#F8F9FA]">
        <div>
          <EntityBadge type={entity.type} label={entity.type} />
          <h3 className="text-lg font-bold text-[#0F172A] mt-2">{entity.label}</h3>
          <span className="font-mono text-[11px] text-[#1D4ED8] font-semibold">{entity.id}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Risk Score & Mentions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">
              Forensic Risk Score
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-lg font-mono">
              <span
                className={`${
                  (entity.metadata?.risk_score || 0) > 75
                    ? 'text-rose-600'
                    : (entity.metadata?.risk_score || 0) > 40
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {entity.metadata?.risk_score || 'N/A'}/100
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">
              Cross-Dossier Mentions
            </span>
            <div className="text-lg font-bold text-[#0F172A] mt-1 font-mono">
              {entity.metadata?.mentions || 1} hits
            </div>
          </div>
        </div>

        {/* Details / Role */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Entity Intelligence
          </h4>
          {entity.metadata?.role && (
            <div className="text-xs text-[#0F172A] font-medium bg-[#F8F9FA] p-2.5 rounded-lg border border-[#E2E8F0]">
              <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Official Role</span>
              {entity.metadata.role}
            </div>
          )}
          {entity.metadata?.address && (
            <div className="text-xs text-[#334155] bg-[#F8F9FA] p-2.5 rounded-lg border border-[#E2E8F0]">
              <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Jurisdiction / Address</span>
              {entity.metadata.address}
            </div>
          )}
          {entity.metadata?.description && (
            <div className="text-xs text-[#475569] bg-[#F8F9FA] p-2.5 rounded-lg border border-[#E2E8F0] leading-relaxed">
              <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Investigator Notes</span>
              {entity.metadata.description}
            </div>
          )}
        </div>

        {/* Direct Connections / Relationships */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center justify-between">
            <span>Direct Relationships</span>
            <span className="font-mono text-[#1D4ED8]">{outgoing.length + incoming.length}</span>
          </h4>

          <div className="space-y-2">
            {outgoing.map((edge, i) => {
              const targetNode = allEntities.find((n) => n.id === edge.target);
              return (
                <div
                  key={`out-${i}`}
                  onClick={() => targetNode && onSelectEntity(targetNode)}
                  className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] hover:border-blue-400 hover:bg-[#EFF6FF] cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-[#1D4ED8] flex items-center gap-1 font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {edge.relationship.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                      {Math.round(edge.confidence * 100)}% conf
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] mt-1 group-hover:text-[#1D4ED8]">
                    → {targetNode?.label || edge.target}
                  </div>
                </div>
              );
            })}

            {incoming.map((edge, i) => {
              const sourceNode = allEntities.find((n) => n.id === edge.source);
              return (
                <div
                  key={`in-${i}`}
                  onClick={() => sourceNode && onSelectEntity(sourceNode)}
                  className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] hover:border-amber-400 hover:bg-[#FFFBEB] cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-[#D97706] flex items-center gap-1 font-bold">
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      {edge.relationship.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                      {Math.round(edge.confidence * 100)}% conf
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] mt-1 group-hover:text-[#D97706]">
                    ← {sourceNode?.label || edge.source}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Linked Supporting Evidence */}
        {relevantEvidenceIds.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Associated Seized Evidence
            </h4>
            <div className="space-y-1.5">
              {relevantEvidenceIds.map((evId) => {
                const matched = allEvidence.find((e) => e.evidence_id === evId);
                return (
                  <button
                    key={evId}
                    onClick={() => matched && onSelectEvidence(matched)}
                    className="w-full text-left p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] hover:border-[#1D4ED8] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-3.5 h-3.5 text-[#1D4ED8]" />
                      <span className="font-mono text-xs font-bold text-[#1D4ED8]">
                        [{evId}]
                      </span>
                      <span className="text-xs text-[#0F172A] truncate max-w-[150px] font-medium">
                        {matched?.file_name || 'Evidence record'}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1D4ED8] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
