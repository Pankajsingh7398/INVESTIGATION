'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glowBorder = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl border ${
        glowBorder ? 'border-blue-400 shadow-md shadow-blue-100' : 'border-[#E2E8F0] shadow-xs'
      } text-[#0F172A] transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 pb-3 border-b border-[#F1F5F9] ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-base font-semibold text-[#0F172A] flex items-center gap-2 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`text-xs text-[#64748B] mt-1 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-4 pt-3 border-t border-[#F1F5F9] bg-[#F8F9FA] rounded-b-xl ${className}`} {...props}>
    {children}
  </div>
);
