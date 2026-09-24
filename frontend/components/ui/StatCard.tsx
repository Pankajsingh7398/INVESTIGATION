'use client';

import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'indigo' | 'blue';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'blue',
  onClick
}) => {
  return (
    <Card
      onClick={onClick}
      className={`p-5 relative overflow-hidden group transition-all duration-200 hover:border-blue-400 hover:shadow-md hover:shadow-blue-50 bg-white border-[#E2E8F0] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#64748B] tracking-wide uppercase">{title}</p>
          <h4 className="text-2xl font-extrabold text-[#0F172A] mt-1.5 tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] text-[#1D4ED8] shrink-0 shadow-xs group-hover:bg-[#1D4ED8] group-hover:text-white transition-all">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-emerald-600">
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-[#94A3B8]">vs baseline</span>
        </div>
      )}
    </Card>
  );
};
