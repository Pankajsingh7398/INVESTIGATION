'use client';

import React from 'react';
import { EntityType, CasePriority, CaseStatus, EvidenceProcessingStatus } from '@/types/forensics';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'blue' | 'beige' | 'dark' | 'emerald' | 'rose' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider uppercase font-semibold rounded',
    md: 'text-xs px-2.5 py-1 font-medium rounded-md'
  };

  const variantStyles = {
    default: 'bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]',
    blue: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
    beige: 'bg-[#F5F2EB] text-[#574C3A] border border-[#E5DFD5]',
    dark: 'bg-[#0F172A] text-white border border-[#1E293B]',
    emerald: 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]',
    rose: 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]',
    slate: 'bg-[#F8F9FA] text-[#64748B] border border-[#E2E8F0]'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const EntityBadge: React.FC<{ type: EntityType; label?: string; className?: string }> = ({
  type,
  label,
  className = ''
}) => {
  const mapping: Record<EntityType, { variant: BadgeProps['variant']; icon: string }> = {
    PERSON: { variant: 'blue', icon: '👤' },
    ORGANIZATION: { variant: 'beige', icon: '🏢' },
    LOCATION: { variant: 'emerald', icon: '📍' },
    EVENT: { variant: 'dark', icon: '⚡' },
    OTHER: { variant: 'default', icon: '📁' }
  };

  const config = mapping[type] || mapping.OTHER;

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      <span>{config.icon}</span>
      <span>{label || type}</span>
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: EvidenceProcessingStatus | CaseStatus; className?: string }> = ({
  status,
  className = ''
}) => {
  switch (status) {
    case 'COMPLETED':
    case 'ACTIVE':
      return (
        <Badge variant="emerald" size="sm" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#047857] shrink-0"></span>
          {status}
        </Badge>
      );
    case 'PROCESSING':
    case 'TEXT_EXTRACTED':
    case 'ENTITIES_EXTRACTED':
    case 'RELATIONSHIPS_GENERATED':
      return (
        <Badge variant="blue" size="sm" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] animate-pulse shrink-0"></span>
          {status.replace('_', ' ')}
        </Badge>
      );
    case 'UPLOADED':
    case 'UNDER_REVIEW':
      return (
        <Badge variant="beige" size="sm" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#8A785D] shrink-0"></span>
          {status}
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge variant="rose" size="sm" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
          FAILED
        </Badge>
      );
    default:
      return (
        <Badge variant="slate" size="sm" className={className}>
          {status}
        </Badge>
      );
  }
};
