'use client';

import React, { useState } from 'react';
import { ShieldCheck, Copy, Check } from 'lucide-react';

interface HashBadgeProps {
  hash: string;
  truncate?: boolean;
  verified?: boolean;
  className?: string;
}

export const HashBadge: React.FC<HashBadgeProps> = ({
  hash,
  truncate = true,
  verified = true,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const displayHash = truncate
    ? `${hash.slice(0, 8)}...${hash.slice(-8)}`
    : hash;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={handleCopy}
      title="Click to copy full SHA-256 hash"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-mono-hash text-[11px] cursor-pointer hover:border-[#1D4ED8] hover:bg-[#DBEAFE] transition-all select-none ${className}`}
    >
      {verified && <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />}
      <span className="font-semibold">{displayHash}</span>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-600 ml-0.5" />
      ) : (
        <Copy className="w-3 h-3 text-[#1D4ED8]/60 ml-0.5 hover:text-[#1D4ED8]" />
      )}
    </div>
  );
};
