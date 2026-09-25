'use client';

import React, { useState, useRef } from 'react';
import {
  PlusCircle,
  SlidersHorizontal,
  ArrowUp,
  Sparkles,
  Paperclip,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { OutputFormatType } from '@/lib/types';
import type { N8nTransformResponse } from '@/app/api/transform/route';

interface PromptDockProps {
  chatId?: string;
}

const contextualHints: Record<string, string> = {
  'exec-summary': 'Ask Sarvistar to refine executive summary, adjust tone, or expand strategic points...',
  'advisory': 'Ask Sarvistar to strengthen security advisory protocols, add remediation steps...',
  'linkedin': 'Ask Sarvistar to tune hook, alter call-to-action, or adjust character count...',
  'twitter': 'Ask Sarvistar to re-order tweets, increase virality, or rephrase punchlines...',
};

const contextualQuickChips: Record<string, string[]> = {
  'exec-summary': [
    'Condense into 3 key takeaways',
    'Emphasize ROI on containment',
    'Make tone more urgent',
  ],
  'advisory': [
    'Add technical CVE references',
    'Include zero-trust timeline',
    'Clarify customer impact scope',
  ],
  'linkedin': [
    'Sharpen the opening hook',
    'Add viral engagement question',
    'Keep under 900 characters',
  ],
  'twitter': [
    'Expand to 7 tweets',
    'Add quantitative data callouts',
    'Make tone more provocative',
  ],
};

export function PromptDock({ chatId }: PromptDockProps) {
  const {
    sessions,
    sidebarOpen,
    showToast,
    setIsGenerating,
    isGenerating,
    updateFormatContent,
  } = useAppStore();

  const [inputVal, setInputVal] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const session = chatId ? sessions.find((s) => s.id === chatId) : null;
  const activeFormatId = session?.activeFormatId || 'twitter';

  const placeholderText =
    contextualHints[activeFormatId] ||
    'Ask Sarvistar to transform, synthesize, or adapt content...';

  const quickChips = contextualQuickChips[activeFormatId] || [
    'Synthesize key insights',
    'Shorten output length',
    'Make tone more executive',
  ];

  const handleSendRefinement = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isGenerating) return;

    setInputVal('');
    showToast(`Refining: "${query.slice(0, 28)}\u2026"`);

    if (chatId) {
      setIsGenerating(true, activeFormatId);
      try {
        // Use the active session's source document name as context
        const sourceDocName = session?.sourceDocument?.name || 'Source Document';

        const res = await fetch('/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source_text: sourceDocName,
            user_prompt: query,
            output_types: [activeFormatId],
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error((errData as { error?: string }).error || `HTTP ${res.status}`);
        }

        const data: N8nTransformResponse = await res.json();

        // Map the response key that matches this format and update store
        const keyMap: Record<string, keyof N8nTransformResponse> = {
          'exec-summary': 'exec_summary',
          'linkedin': 'linkedin_post',
          'advisory': 'public_advisory',
          'twitter': 'twitter_thread',
        };
        const n8nKey = keyMap[activeFormatId];
        const value = n8nKey ? data[n8nKey] : undefined;
        if (value && typeof value === 'string') {
          updateFormatContent(chatId, activeFormatId as OutputFormatType, {
            type: 'custom',
            title: session?.formats[activeFormatId]?.name || activeFormatId,
            rawText: value,
          });
        }

        showToast('Refinement applied');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[PromptDock] /api/transform error:', message);
        showToast(`Refinement failed: ${message.slice(0, 60)}`);
      } finally {
        setIsGenerating(false, null);
      }
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(`Attached context: ${file.name}`);
    }
  };

  return (
    <aside
      aria-label="Prompt and refinement dock"
      className={`fixed bottom-0 right-0 p-space-md bg-gradient-to-t from-surface-dim via-surface-dim/95 to-transparent z-40 pointer-events-none transition-all duration-300 ${
        sidebarOpen ? 'left-0 md:left-64' : 'left-0'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileAttach}
        className="hidden"
      />

      <div className="max-w-4xl mx-auto flex flex-col gap-2 pointer-events-auto">
        {/* Contextual Quick Prompts Row */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-muted font-label-sm text-label-sm shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Quick prompts:</span>
          </span>
          {quickChips.map((chipText, cIdx) => (
            <button
              key={cIdx}
              type="button"
              onClick={() => handleSendRefinement(chipText)}
              className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-label-sm font-label-sm border border-surface-container-high/40 transition-colors whitespace-nowrap active:scale-95 shadow-sm"
            >
              {chipText}
            </button>
          ))}
        </div>

        {/* Input Pill Container */}
        <div className="relative flex items-center rounded-2xl bg-surface shadow-2xl p-2 transition-all focus-within:bg-surface-bright border border-surface-container-high/40">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file or context"
            aria-label="Attach file or context"
            className="p-2 text-muted hover:text-on-surface rounded-xl hover:bg-surface-container transition-colors shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-muted hover:text-primary transition-colors" />
          </button>

          <input
            id="refineInput"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendRefinement();
              }
            }}
            placeholder={placeholderText}
            className="w-full bg-transparent px-space-sm font-body-md text-body-md text-on-surface placeholder:text-muted focus:outline-none"
          />

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              title="Voice or refinement options"
              aria-label="Refinement options"
              className="p-2 text-muted hover:text-on-surface rounded-xl hover:bg-surface-container transition-colors hidden sm:block"
            >
              <SlidersHorizontal className="w-4 h-4 text-muted" />
            </button>

            <button
              id="submitRefineBtn"
              type="button"
              onClick={() => handleSendRefinement()}
              disabled={!inputVal.trim() && !isGenerating}
              title="Send refinement"
              aria-label="Send refinement"
              className={`flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition-transform active:scale-95 shadow-sm ${
                !inputVal.trim() ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
