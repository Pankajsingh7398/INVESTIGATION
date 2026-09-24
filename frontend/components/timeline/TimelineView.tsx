'use client';

import React, { useState } from 'react';
import { Clock, Calendar, MapPin, FileCheck2, Search } from 'lucide-react';
import { TimelineEvent, Evidence } from '@/types/forensics';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface TimelineViewProps {
  events: TimelineEvent[];
  allEvidence: Evidence[];
  onSelectEvidence: (evidence: Evidence) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  events,
  allEvidence,
  onSelectEvidence
}) => {
  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredEvents = events.filter((evt) => {
    const matchSearch =
      evt.event.toLowerCase().includes(search.toLowerCase()) ||
      (evt.description && evt.description.toLowerCase().includes(search.toLowerCase())) ||
      evt.entities.some((e) => e.toLowerCase().includes(search.toLowerCase())) ||
      evt.evidence.some((ev) => ev.toLowerCase().includes(search.toLowerCase()));

    const matchSeverity =
      selectedSeverity === 'ALL' || evt.severity === selectedSeverity;

    return matchSearch && matchSeverity;
  });

  const getSeverityBadge = (sev?: TimelineEvent['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return <Badge variant="rose" size="sm">CRITICAL</Badge>;
      case 'HIGH':
        return <Badge variant="beige" size="sm">HIGH</Badge>;
      case 'MEDIUM':
        return <Badge variant="blue" size="sm">MEDIUM</Badge>;
      default:
        return <Badge variant="slate" size="sm">INFO</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search timeline by event, involved entity (e.g. Rahul, Amit), or evidence code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSeverity === sev
                    ? 'bg-[#1D4ED8] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Vertical Timeline Sequence */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#BFDBFE] before:via-[#3B82F6] before:to-[#1D4ED8]">
        {filteredEvents.map((evt, idx) => (
          <div key={evt.id || idx} className="relative group">
            {/* Timeline Marker Dot */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center transition-all shadow-xs ${
                evt.severity === 'CRITICAL'
                  ? 'border-rose-600 text-rose-600'
                  : evt.severity === 'HIGH'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-[#1D4ED8] text-[#1D4ED8]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
            </div>

            {/* Event Card */}
            <Card className="p-5 hover:border-blue-400 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-[#1D4ED8] text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{evt.date}</span>
                    {evt.time && <span className="text-[#64748B] font-normal">· {evt.time}</span>}
                  </div>
                  {getSeverityBadge(evt.severity)}
                </div>

                {evt.location && (
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>{evt.location}</span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-[#0F172A]">{evt.event}</h3>
                {evt.description && (
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    {evt.description}
                  </p>
                )}
              </div>

              {/* Entities and Evidence References */}
              <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Entities */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[#94A3B8] font-semibold text-[11px] mr-1">Involved:</span>
                  {evt.entities.map((entity, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#F8F9FA] border border-[#E2E8F0] text-[#334155] text-[11px] font-medium"
                    >
                      {entity}
                    </span>
                  ))}
                </div>

                {/* Clickable Supporting Evidence Citations */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[#94A3B8] font-semibold text-[11px] mr-1">Evidence:</span>
                  {evt.evidence.map((evCode) => {
                    const matched = allEvidence.find((e) => e.evidence_id === evCode);
                    return (
                      <button
                        key={evCode}
                        onClick={() => {
                          if (matched) onSelectEvidence(matched);
                        }}
                        title={matched ? `Inspect ${matched.file_name}` : `View ${evCode}`}
                        className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <FileCheck2 className="w-3 h-3" />
                        <span>[{evCode}]</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
