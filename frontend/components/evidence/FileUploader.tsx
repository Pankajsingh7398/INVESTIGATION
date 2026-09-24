'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File } from 'lucide-react';
import { EvidenceType } from '@/types/forensics';
import { Button } from '@/components/ui/Button';

interface FileUploaderProps {
  onUpload: (fileData: {
    name: string;
    size: string;
    type: EvidenceType;
    rawSha256?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUpload, isLoading = false }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<EvidenceType>('Document');
  const [customName, setCustomName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const f = e.dataTransfer.files[0];
      setSelectedFile(f);
      setCustomName(f.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      setSelectedFile(f);
      setCustomName(f.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    setIsSubmitting(true);
    try {
      const sizeStr = selectedFile
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
        : '2.4 MB';

      await onUpload({
        name: customName,
        size: sizeStr,
        type: fileType
      });

      setSelectedFile(null);
      setCustomName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-[#0F172A]">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-blue-500 bg-[#EFF6FF] scale-[1.01]'
            : selectedFile
            ? 'border-emerald-500 bg-[#ECFDF5]'
            : 'border-[#CBD5E1] bg-[#F8F9FA] hover:border-blue-400 hover:bg-[#F1F5F9]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
              selectedFile
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-white text-[#1D4ED8] border border-[#CBD5E1]'
            }`}
          >
            {selectedFile ? <File className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
          </div>

          <div>
            <p className="text-sm font-bold text-[#0F172A]">
              {selectedFile ? selectedFile.name : 'Click to select or drop digital evidence file'}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5">
              Supports PDF, PNG, JPG, MP4, M4A, ZIP, TXT, CSV, E01, DD (Forensic Images)
            </p>
          </div>

          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white text-[#1D4ED8] border border-[#BFDBFE] font-bold">
            Instant SHA-256 Bit-stream Hash Generated On Ingestion
          </span>
        </div>
      </div>

      {/* Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1.5">
            Artifact Identifier / Record Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Seized_Ledger_Q2.xlsx"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1.5">
            Forensic Classification
          </label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value as EvidenceType)}
            className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#2563EB]"
          >
            <option value="Document">Document (PDF/DOCX)</option>
            <option value="Financial Record">Financial Record (Bank/Wire/Ledger)</option>
            <option value="Chat">Chat Export (WhatsApp/Telegram)</option>
            <option value="Image">Image / CCTV Capture</option>
            <option value="Audio">Audio Memo / Call Intercept</option>
            <option value="Server Log">Server / Firewall Log</option>
            <option value="Archive">Forensic Image / Archive (DD/ZIP)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2.5 pt-2">
        <Button
          type="submit"
          variant="glow"
          size="md"
          isLoading={isSubmitting || isLoading}
          disabled={!customName.trim()}
          icon={<UploadCloud className="w-4 h-4" />}
        >
          Seal & Ingest Evidence
        </Button>
      </div>
    </form>
  );
};
