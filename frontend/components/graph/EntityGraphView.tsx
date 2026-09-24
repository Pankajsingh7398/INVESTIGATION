'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Filter
} from 'lucide-react';
import { Entity, GraphEdge, EntityType, Evidence } from '@/types/forensics';
import { Card } from '@/components/ui/Card';
import { NodeInspectorSheet } from './NodeInspectorSheet';

interface EntityGraphViewProps {
  nodes: Entity[];
  edges: GraphEdge[];
  allEvidence: Evidence[];
  onSelectEvidence: (evidence: Evidence) => void;
}

export const EntityGraphView: React.FC<EntityGraphViewProps> = ({
  nodes,
  edges,
  allEvidence,
  onSelectEvidence
}) => {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypes, setActiveTypes] = useState<Record<EntityType, boolean>>({
    PERSON: true,
    ORGANIZATION: true,
    LOCATION: true,
    EVENT: true,
    OTHER: true
  });

  // Pan and Zoom transform state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Compute node coordinates in a cluster layout
  const nodeCoords = useMemo(() => {
    const coords: Record<string, { x: number; y: number }> = {};
    const width = 1100;
    const height = 750;
    const center = { x: width / 2, y: height / 2 };

    const byType: Record<EntityType, Entity[]> = {
      PERSON: [],
      ORGANIZATION: [],
      LOCATION: [],
      EVENT: [],
      OTHER: []
    };
    nodes.forEach((n) => byType[n.type]?.push(n));

    // Helper to store coords under both node id and node label
    const storeCoords = (n: Entity, pos: { x: number; y: number }) => {
      if (n.id) coords[n.id] = pos;
      if (n.label) coords[n.label] = pos;
    };

    // Persons in inner circle
    const personRadius = 200;
    byType.PERSON.forEach((p, idx) => {
      const angle = (idx / (byType.PERSON.length || 1)) * 2 * Math.PI;
      const pos = {
        x: center.x + personRadius * Math.cos(angle),
        y: center.y + personRadius * Math.sin(angle)
      };
      storeCoords(p, pos);
    });

    // Organizations in upper arc
    const orgRadius = 340;
    byType.ORGANIZATION.forEach((org, idx) => {
      const angle = -Math.PI / 4 + (idx / (byType.ORGANIZATION.length || 1)) * Math.PI;
      const pos = {
        x: center.x + orgRadius * Math.cos(angle),
        y: center.y + orgRadius * Math.sin(angle) * 0.9
      };
      storeCoords(org, pos);
    });

    // Locations in lower-right arc
    const locRadius = 380;
    byType.LOCATION.forEach((loc, idx) => {
      const angle = Math.PI / 3 + (idx / (byType.LOCATION.length || 1)) * (Math.PI / 1.5);
      const pos = {
        x: center.x + locRadius * Math.cos(angle) * 1.1,
        y: center.y + locRadius * Math.sin(angle) * 0.8
      };
      storeCoords(loc, pos);
    });

    // Events along upper-left
    const eventRadius = 320;
    byType.EVENT.forEach((evt, idx) => {
      const angle = Math.PI + (idx / (byType.EVENT.length || 1)) * (Math.PI / 2);
      const pos = {
        x: center.x + eventRadius * Math.cos(angle) * 1.1,
        y: center.y + eventRadius * Math.sin(angle)
      };
      storeCoords(evt, pos);
    });

    // Other/Accounts near center / lower cluster
    byType.OTHER.forEach((oth, idx) => {
      const pos = {
        x: center.x + (idx % 2 === 0 ? -120 : 120),
        y: center.y + (idx < 2 ? 80 : 160)
      };
      storeCoords(oth, pos);
    });

    return coords;
  }, [nodes]);

  const visibleNodes = useMemo(() => {
    return nodes.filter((n) => activeTypes[n.type]);
  }, [nodes, activeTypes]);

  const visibleEdges = useMemo(() => {
    const visibleIds = new Set<string>();
    visibleNodes.forEach((n) => {
      if (n.id) visibleIds.add(n.id);
      if (n.label) visibleIds.add(n.label);
    });
    return edges.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target));
  }, [edges, visibleNodes]);

  // Color mappings for light theme
  const typeColors: Record<EntityType, { stroke: string; fill: string; text: string; labelColor: string }> = {
    PERSON: { stroke: '#2563EB', fill: '#EFF6FF', text: '👤', labelColor: '#1E3A8A' },
    ORGANIZATION: { stroke: '#D97706', fill: '#F5F2EB', text: '🏢', labelColor: '#78350F' },
    LOCATION: { stroke: '#059669', fill: '#ECFDF5', text: '📍', labelColor: '#064E3B' },
    EVENT: { stroke: '#7C3AED', fill: '#F5F3FF', text: '⚡', labelColor: '#4C1D95' },
    OTHER: { stroke: '#475569', fill: '#F1F5F9', text: '📁', labelColor: '#0F172A' }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-4 relative text-[#0F172A]">
      {/* Top Filter & Search Controls */}
      <Card className="p-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Find entity in graph..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Entity Type Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {(Object.keys(activeTypes) as EntityType[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTypes((prev) => ({ ...prev, [t]: !prev[t] }))}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTypes[t]
                  ? 'bg-white text-[#0F172A] border border-[#CBD5E1] shadow-xs'
                  : 'bg-[#F8F9FA] text-[#94A3B8] border border-transparent opacity-60'
              }`}
            >
              <span>{typeColors[t].text}</span>
              <span className="capitalize">{t.toLowerCase()}</span>
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E2E8F0] shadow-2xs">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 2.5))}
            className="p-1.5 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
            className="p-1.5 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
            title="Reset Canvas View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>

      {/* SVG Graph Canvas */}
      <div
        className="w-full h-[680px] bg-white rounded-2xl border border-[#E2E8F0] relative overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-sm"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 1100 750"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="18"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="8"
              markerHeight="6"
              refX="18"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#1D4ED8" />
            </marker>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Render Edges */}
            {visibleEdges.map((edge, idx) => {
              const src = nodeCoords[edge.source];
              const tgt = nodeCoords[edge.target];
              if (!src || !tgt) return null;

              const isEdgeHighlighted =
                selectedEntity &&
                (edge.source === selectedEntity.id ||
                 edge.source === selectedEntity.label ||
                 edge.target === selectedEntity.id ||
                 edge.target === selectedEntity.label);

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isEdgeHighlighted ? '#1D4ED8' : '#CBD5E1'}
                    strokeWidth={isEdgeHighlighted ? 2.5 : 1.2}
                    strokeDasharray={edge.confidence < 0.9 ? '4 3' : 'none'}
                    markerEnd={isEdgeHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    className="transition-all"
                  />
                  {/* Midpoint Label */}
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 - 4}
                    fill={isEdgeHighlighted ? '#1D4ED8' : '#64748B'}
                    fontWeight={isEdgeHighlighted ? 'bold' : 'normal'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {edge.relationship} ({Math.round(edge.confidence * 100)}%)
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {visibleNodes.map((node) => {
              const pos = nodeCoords[node.id];
              if (!pos) return null;

              const isSelected = selectedEntity?.id === node.id;
              const matchesSearch =
                searchQuery &&
                node.label.toLowerCase().includes(searchQuery.toLowerCase());
              const config = typeColors[node.type];

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEntity(node);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Glow circle if selected or matched */}
                  {(isSelected || matchesSearch) && (
                    <circle
                      r="28"
                      fill="none"
                      stroke="#1D4ED8"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '6s' }}
                    />
                  )}

                  {/* Main Node Bubble */}
                  <circle
                    r="20"
                    fill={config.fill}
                    stroke={isSelected ? '#1D4ED8' : config.stroke}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-transform group-hover:scale-110 drop-shadow-xs"
                  />

                  {/* Type Icon Emoji */}
                  <text
                    textAnchor="middle"
                    dy=".35em"
                    fontSize="13"
                    className="pointer-events-none select-none"
                  >
                    {config.text}
                  </text>

                  {/* Node Label Below */}
                  <text
                    y="32"
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="11"
                    fontWeight="700"
                    className="pointer-events-none select-none"
                  >
                    {node.label}
                  </text>

                  {/* Risk Badge on Node */}
                  {(node.metadata?.risk_score || 0) > 80 && (
                    <circle
                      cx="14"
                      cy="-14"
                      r="5"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Canvas Overlay Legend */}
        <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-[#E2E8F0] text-[11px] font-mono space-y-1.5 pointer-events-none text-[#0F172A] shadow-xs">
          <div className="font-bold text-[#64748B] uppercase text-[10px] tracking-wider mb-1">
            Graph Topology
          </div>
          <div className="flex items-center gap-3 font-semibold">
            <span className="flex items-center gap-1 text-[#1D4ED8]">● Person</span>
            <span className="flex items-center gap-1 text-[#92400E]">● Organization</span>
            <span className="flex items-center gap-1 text-[#047857]">● Location</span>
            <span className="flex items-center gap-1 text-[#7C3AED]">● Event</span>
            <span className="flex items-center gap-1 text-[#475569]">● Asset / Device</span>
          </div>
        </div>
      </div>

      {/* Node Inspector Sheet Drawer */}
      <NodeInspectorSheet
        entity={selectedEntity}
        edges={edges}
        allEntities={nodes}
        allEvidence={allEvidence}
        onClose={() => setSelectedEntity(null)}
        onSelectEntity={(ent) => setSelectedEntity(ent)}
        onSelectEvidence={onSelectEvidence}
      />
    </div>
  );
};
