'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Megaphone,
  Share2,
  Hash,
  Plus,
  X,
  Sparkles,
  FileCode,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { OutputFormatType } from '@/lib/types';

interface FormatTabsProps {
  chatId: string;
}

const tabIcons: Record<string, React.ReactNode> = {
  'exec-summary': <BookOpen className="w-[18px] h-[18px]" />,
  'advisory': <Megaphone className="w-[18px] h-[18px]" />,
  'linkedin': <Share2 className="w-[18px] h-[18px]" />,
  'twitter': <Hash className="w-[18px] h-[18px]" />,
};

const prebuiltOptions = [
  { id: 'exec-summary', name: 'Executive Summary', icon: BookOpen },
  { id: 'advisory', name: 'Public Advisory', icon: Megaphone },
  { id: 'linkedin', name: 'LinkedIn Post', icon: Share2 },
  { id: 'twitter', name: 'Twitter/X Thread', icon: Hash },
];

export function FormatTabs({ chatId }: FormatTabsProps) {
  const {
    sessions,
    setActiveFormat,
    addFormatToChat,
    showToast,
    setIsGenerating,
  } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const session = sessions.find((s) => s.id === chatId);
  if (!session) return null;

  const currentFormatList = session.selectedFormats;
  const activeFormatId = session.activeFormatId || currentFormatList[0];
  const activeIndex = currentFormatList.indexOf(activeFormatId);
  const activeFormatObj = session.formats[activeFormatId];

  const handleSelectTab = (fId: OutputFormatType) => {
    setActiveFormat(fId);
  };

  const handleAddNewFormat = async (formatId: string, name: string, promptText?: string) => {
    addFormatToChat(chatId, formatId, name);
    setIsModalOpen(false);
    setCustomName('');
    setCustomPrompt('');
    showToast(`Added ${name} format`);

    // Trigger optimistic generation for this new format
    setIsGenerating(true, formatId);
    try {
      await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText || `Transform source document into ${name}`,
          formatId,
          formatName: name,
          sourceDocName: session.sourceDocument?.name,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false, null);
    }
  };

  return (
    <>
      <div className="py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        {/* Horizontal tabs pill list */}
        <div
          className="inline-flex p-1 bg-surface-container-low rounded-xl gap-1 overflow-x-auto max-w-full border border-surface-container-high/30 scrollbar-none"
          role="tablist"
        >
          {currentFormatList.map((fId) => {
            const formatInfo = session.formats[fId];
            const isSelected = activeFormatId === fId;
            const icon = tabIcons[fId] || <FileCode className="w-[18px] h-[18px]" />;
            const label = formatInfo?.name || fId;

            return (
              <button
                key={fId}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectTab(fId)}
                className={`tab-button flex items-center gap-2 px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-secondary-container text-on-secondary-container shadow-sm font-medium border border-primary/20'
                    : 'text-muted hover:text-on-surface hover:bg-surface/50'
                }`}
              >
                <span className={isSelected ? 'text-primary' : ''}>{icon}</span>
                <span>{label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary active-pip animate-pulse" />
                )}
              </button>
            );
          })}

          {/* Quick add tab trigger */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            title="Add another output format"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-label-md text-label-md text-muted hover:text-primary hover:bg-surface transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New format</span>
          </button>
        </div>

        {/* Format counter helper text */}
        <div className="flex items-center gap-2 text-muted font-label-sm text-label-sm shrink-0">
          <span>
            Format {activeIndex >= 0 ? activeIndex + 1 : 1} of{' '}
            {currentFormatList.length} • {activeFormatObj?.name || 'Output View'}
          </span>
        </div>
      </div>

      {/* New Format Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-surface p-space-lg shadow-2xl border border-surface-container-high/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-medium">
                  Add Output Format
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-space-md flex flex-col gap-4">
              <span className="font-label-sm text-label-sm text-muted uppercase tracking-wider">
                Select from templates
              </span>
              <div className="grid grid-cols-2 gap-2">
                {prebuiltOptions.map((opt) => {
                  const alreadyExists = currentFormatList.includes(opt.id);
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={alreadyExists}
                      onClick={() => handleAddNewFormat(opt.id, opt.name)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        alreadyExists
                          ? 'opacity-40 cursor-not-allowed border-surface-container-high bg-surface-container-lowest'
                          : 'border-surface-container-high/60 bg-surface-container hover:bg-surface-container-high hover:border-primary/50 text-on-surface'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md truncate">{opt.name}</span>
                        <span className="text-[11px] text-muted">
                          {alreadyExists ? 'Active' : 'Add tab'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom format definition */}
              <div className="pt-2 border-t border-surface-container-high/30 flex flex-col gap-2.5">
                <span className="font-label-sm text-label-sm text-muted uppercase tracking-wider">
                  Or define custom format
                </span>
                <input
                  type="text"
                  placeholder="Format name (e.g. Press Release, Memo)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-surface-container border border-surface-container-high text-on-surface text-body-md focus:outline-none focus:border-primary"
                />
                <textarea
                  rows={2}
                  placeholder="Specific tone or formatting directives (optional)..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-surface-container border border-surface-container-high text-on-surface text-body-md focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-space-sm border-t border-surface-container-high/30">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-muted hover:text-on-surface font-label-md text-label-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!customName.trim()}
                onClick={() => {
                  const id = 'custom-' + Date.now();
                  handleAddNewFormat(id, customName.trim(), customPrompt);
                }}
                className={`px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-md text-label-md transition-colors font-medium ${
                  !customName.trim() ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                Create Format
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
