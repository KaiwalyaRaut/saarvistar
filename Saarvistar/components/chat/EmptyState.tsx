'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  SlidersHorizontal,
  ChevronUp,
  ArrowUp,
  FileText,
  Lock,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { SarvistarMark } from '@/components/common/SarvistarMark';
import { useAppStore } from '@/lib/store';
import { OutputFormatType } from '@/lib/types';
import type { N8nTransformResponse } from '@/app/api/transform/route';

// Map n8n response keys → our internal OutputFormatType ids
const N8N_KEY_TO_FORMAT: Record<keyof N8nTransformResponse, OutputFormatType> = {
  exec_summary: 'exec-summary',
  linkedin_post: 'linkedin',
  public_advisory: 'advisory',
  twitter_thread: 'twitter',
};

const availableFormats: { id: OutputFormatType; name: string; icon: string }[] = [
  { id: 'exec-summary', name: 'Executive Summary', icon: 'summarize' },
  { id: 'advisory', name: 'Public Advisory', icon: 'campaign' },
  { id: 'linkedin', name: 'LinkedIn Post', icon: 'share' },
  { id: 'twitter', name: 'Twitter/X Thread', icon: 'tag' },
];

export function EmptyState() {
  const router = useRouter();
  const { createSession, setActiveChat, updateFormatContent, showToast } = useAppStore();

  const [prompt, setPrompt] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<OutputFormatType[]>([
    'exec-summary',
    'linkedin',
  ]);
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; rawFile?: File } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFormat = (formatId: OutputFormatType) => {
    setSelectedFormats((prev) =>
      prev.includes(formatId)
        ? prev.length > 1
          ? prev.filter((f) => f !== formatId)
          : prev
        : [...prev, formatId]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        rawFile: file,
      });
      setIsUploadMenuOpen(false);
      showToast(`Attached ${file.name}`);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() && !attachedFile) {
      showToast('Please enter text or attach a document');
      return;
    }
    if (isLoading) return;

    setSubmitError(null);
    setIsLoading(true);

    const title = prompt.trim()
      ? prompt.slice(0, 36) + (prompt.length > 36 ? '...' : '')
      : attachedFile?.name.replace(/\.[^/.]+$/, '') || 'Intelligence Synthesis';

    // Create the session first so we can navigate immediately
    const newId = createSession(title, {
      name: attachedFile?.name || 'Source_Document.pdf',
    });
    setActiveChat(newId);

    try {
      const sourceText = prompt.trim() ||
        (attachedFile ? `[Attached file: ${attachedFile.name}]` : '');

      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_text: sourceText,
          user_prompt: prompt.trim() || undefined,
          output_types: selectedFormats,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error((errData as { error?: string }).error || `HTTP ${res.status}`);
      }

      const data: N8nTransformResponse = await res.json();

      // Map n8n response keys into the session's format content as raw text
      (Object.keys(N8N_KEY_TO_FORMAT) as (keyof N8nTransformResponse)[]).forEach((n8nKey) => {
        const value = data[n8nKey];
        if (value && typeof value === 'string') {
          const formatId = N8N_KEY_TO_FORMAT[n8nKey];
          updateFormatContent(newId, formatId, {
            type: 'custom',
            title: formatId,
            rawText: value,
          });
        }
      });

      showToast('Transformation complete!');
      router.push(`/chat/${newId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[EmptyState] /api/transform error:', message);
      setSubmitError(message);
      showToast('Transformation failed — see error below');
    } finally {
      setIsLoading(false);
    }
  };

  // Label text for formats button
  const formatLabels = selectedFormats
    .map((f) => {
      const found = availableFormats.find((item) => item.id === f);
      return found ? found.name.replace('Executive', 'Exec').replace(' Thread', '') : f;
    })
    .join(', ');

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between px-space-md md:px-space-lg pb-space-lg select-none">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Ambient subtle background warm glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center -z-10">
        <div className="w-[620px] h-[360px] rounded-full bg-primary/5 blur-[120px] -translate-y-12" />
      </div>

      {/* Top spacer / Meta status bar */}
      <div className="w-full max-w-3xl flex items-center justify-between pt-space-md opacity-90">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-muted text-label-sm font-label-sm shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Automated Transformation Engine</span>
          <span className="text-surface-container-highest">•</span>
          <span className="text-on-surface-variant font-medium">Enterprise Pipeline</span>
        </div>
      </div>

      {/* Central Hero & Input Workstation */}
      <div className="w-full max-w-3xl flex flex-col items-center my-auto py-space-xl">
        {/* Greeting Header with Stylized Terracotta Flower Motif */}
        <div className="flex items-center gap-3.5 mb-space-lg select-none">
          <div className="relative flex items-center justify-center text-primary">
            <SarvistarMark className="w-9 h-9 md:w-10 md:h-10 text-primary" />
          </div>
          <h1 className="text-[36px] md:text-[40px] leading-tight text-on-surface font-normal tracking-[-0.015em] font-serif">
            Afternoon, Pranav
          </h1>
        </div>

        {/* Main Input Composer Shell */}
        <div className="relative w-full bg-surface rounded-[20px] shadow-xl transition-all duration-300 focus-within:shadow-2xl focus-within:bg-surface-container-high/90 border border-surface-container-high/40">
          {/* Dropup Popovers Container */}
          <div className="relative w-full">
            {/* Popover 1: Upload PDF Dropup */}
            {isUploadMenuOpen && (
              <div className="absolute bottom-full left-4 mb-3 w-80 bg-surface-container-high rounded-xl p-3 shadow-2xl z-30 transition-all border border-surface-container-highest animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 bg-surface-container px-2 py-1.5 rounded-lg">
                  <span className="font-label-sm text-label-sm text-muted uppercase tracking-wider">
                    Source Document
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-medium">PDF</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors">
                      Upload PDF
                    </span>
                    <span className="font-label-sm text-label-sm text-muted truncate">
                      Accepts PDF, DOCX, TXT
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Popover 2: Multi-select Output Formats Dropup */}
            {isFormatMenuOpen && (
              <div className="absolute bottom-full left-16 md:left-24 mb-3 w-72 bg-surface-container-high rounded-xl p-3 shadow-2xl z-30 transition-all border border-surface-container-highest animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 bg-surface-container px-2.5 py-1.5 rounded-lg">
                  <span className="font-label-sm text-label-sm text-muted uppercase tracking-wider">
                    Active Targets
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-medium">
                    {selectedFormats.length} selected
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {availableFormats.map((item) => {
                    const isChecked = selectedFormats.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-surface cursor-pointer select-none transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-muted text-[13px] font-mono">#</span>
                          <span className="font-body-md text-body-md text-on-surface">
                            {item.name}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleFormat(item.id)}
                          className="w-4 h-4 rounded bg-surface-container accent-primary cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Attached file chip */}
          {attachedFile && (
            <div className="mx-space-md mt-space-sm px-3 py-1.5 rounded-lg bg-surface-container inline-flex items-center gap-2 text-label-sm text-on-surface border border-surface-container-high">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-medium truncate max-w-xs">{attachedFile.name}</span>
              <span className="text-muted text-xs">({attachedFile.size})</span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="text-muted hover:text-on-surface ml-1"
                aria-label="Remove attached file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Textarea Input Area */}
          <div className="px-space-md pt-space-md pb-space-sm">
            <textarea
              id="prompt-textarea"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Please enter text or choose a suggestion above..."
              className="w-full bg-transparent border-none resize-none outline-none font-body-lg text-body-lg text-on-surface placeholder:text-muted focus:ring-0 leading-relaxed max-h-56"
            />
          </div>

          {/* Bottom Interactive Control Bar */}
          <div className="flex items-center justify-between px-space-md pb-space-md pt-space-xs">
            {/* Left Controls: Plus Menu & Format Pills */}
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              {/* Upload Trigger Button (+) */}
              <button
                id="btn-upload-toggle"
                type="button"
                onClick={() => {
                  setIsUploadMenuOpen(!isUploadMenuOpen);
                  setIsFormatMenuOpen(false);
                }}
                title="Add documents or files"
                aria-label="Add documents or files"
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-highest text-primary flex items-center justify-center transition-transform active:scale-95 shadow-sm"
              >
                <Plus className="w-[19px] h-[19px]" />
              </button>

              {/* Output Types Dropdown Trigger Button */}
              <button
                id="btn-format-toggle"
                type="button"
                onClick={() => {
                  setIsFormatMenuOpen(!isFormatMenuOpen);
                  setIsUploadMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface transition-colors shadow-sm font-label-md text-label-md"
              >
                <SlidersHorizontal className="w-4 h-4 text-muted" />
                <span className="font-medium truncate max-w-[200px] md:max-w-[240px]">
                  Formats: {formatLabels}
                </span>
                <ChevronUp className="w-4 h-4 text-muted" />
              </button>

              {/* Dynamic Active Badges */}
              <div className="hidden md:flex items-center gap-1.5">
                {selectedFormats.map((fId) => {
                  const label =
                    fId === 'exec-summary'
                      ? 'Summary'
                      : fId === 'advisory'
                      ? 'Advisory'
                      : fId === 'linkedin'
                      ? 'LinkedIn'
                      : fId === 'twitter'
                      ? 'Twitter/X'
                      : fId;
                  return (
                    <span
                      key={fId}
                      className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm font-medium"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Right Controls: Dispatch Button */}
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <button
                id="btn-submit"
                type="button"
                onClick={() => handleSubmit()}
                disabled={isLoading || (!prompt.trim() && !attachedFile)}
                title={isLoading ? 'Transforming…' : 'Transform Content'}
                aria-label={isLoading ? 'Transforming content' : 'Transform Content'}
                className={`w-9 h-9 rounded-full bg-primary-container text-on-primary hover:bg-primary transition-all flex items-center justify-center shadow-md active:scale-95 group ${
                  isLoading || (!prompt.trim() && !attachedFile)
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer hover:scale-105'
                }`}
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Inline error banner */}
        {submitError && (
          <div
            role="alert"
            className="mt-3 flex items-start gap-2 px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-error text-body-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="font-medium">Transformation failed: </span>
              {submitError}
            </div>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              aria-label="Dismiss error"
              className="text-error/60 hover:text-error transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Calm Footer Metadata */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between text-muted text-label-sm font-label-sm pt-space-md border-t border-surface-container-highest/20 gap-2">
        <div className="flex items-center gap-space-sm">
          <Lock className="w-4 h-4 text-primary" />
          <span>Confidential enterprise pipeline • End-to-end encapsulated</span>
        </div>
      </div>
    </div>
  );
}
