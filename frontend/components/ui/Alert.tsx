'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className = ''
}) => {
  const configs = {
    info: {
      border: 'border-[#BFDBFE] bg-[#EFF6FF] text-[#1E3A8A]',
      icon: <Info className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
    },
    success: {
      border: 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
    },
    warning: {
      border: 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]',
      icon: <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
    },
    error: {
      border: 'border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]',
      icon: <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
    }
  };

  const current = configs[variant];

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${current.border} ${className}`}>
      {current.icon}
      <div className="flex-1">
        {title && <h5 className="font-bold mb-1 text-inherit">{title}</h5>}
        <div className="text-xs leading-relaxed text-inherit opacity-90">{children}</div>
      </div>
    </div>
  );
};
