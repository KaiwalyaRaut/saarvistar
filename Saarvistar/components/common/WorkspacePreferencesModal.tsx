'use client';

import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Monitor,
  AlignLeft,
  X,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface WorkspacePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspacePreferencesModal({
  isOpen,
  onClose,
}: WorkspacePreferencesModalProps) {
  const {
    themeMode,
    setThemeMode,
    compactDensity,
    setCompactDensity,
    showToast,
  } = useAppStore();

  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'system'>(
    themeMode
  );
  const [selectedCompact, setSelectedCompact] = useState<boolean>(compactDensity);

  useEffect(() => {
    if (isOpen) {
      setSelectedTheme(themeMode);
      setSelectedCompact(compactDensity);
    }
  }, [isOpen, themeMode, compactDensity]);

  if (!isOpen) return null;

  const handleSave = () => {
    setThemeMode(selectedTheme);
    setCompactDensity(selectedCompact);
    showToast('Preferences saved');
    onClose();
  };

  return (
    <div
      id="customize-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="bg-surface-container-low border border-surface-container-highest/40 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative mx-4 animate-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 shadow-sm">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-headline-sm font-headline-sm font-medium text-on-surface">
                Workspace Preferences
              </h3>
              <p className="text-label-sm font-label-sm text-muted">
                Personalize your workspace themes and layout display
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-6">
          {/* Appearance Mode Section */}
          <section>
            <label className="block text-label-sm font-label-sm uppercase tracking-wider text-muted mb-3 font-medium">
              Appearance Mode
            </label>
            <div className="grid grid-cols-3 gap-3" id="theme-switcher">
              {/* Dark Theme */}
              <button
                type="button"
                id="btn-theme-dark"
                onClick={() => {
                  setSelectedTheme('dark');
                  // Live preview immediately
                  document.documentElement.classList.remove('light-mode');
                  document.documentElement.classList.add('dark');
                }}
                className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all duration-200 active:scale-95 text-center cursor-pointer ${
                  selectedTheme === 'dark'
                    ? 'ring-2 ring-primary border border-primary/40'
                    : 'border border-surface-container-high/40'
                }`}
              >
                <Moon
                  className={`w-[22px] h-[22px] ${
                    selectedTheme === 'dark' ? 'text-primary' : 'text-muted'
                  }`}
                />
                <span className="text-body-md font-body-md font-medium text-on-surface">
                  Dark Theme
                </span>
                <span className="text-[11px] text-muted leading-tight">
                  Deep charcoal &amp; terracotta
                </span>
              </button>

              {/* Light Theme */}
              <button
                type="button"
                id="btn-theme-light"
                onClick={() => {
                  setSelectedTheme('light');
                  // Live preview immediately
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light-mode');
                }}
                className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all duration-200 active:scale-95 text-center cursor-pointer ${
                  selectedTheme === 'light'
                    ? 'ring-2 ring-primary border border-primary/40'
                    : 'border border-surface-container-high/40'
                }`}
              >
                <Sun
                  className={`w-[22px] h-[22px] ${
                    selectedTheme === 'light' ? 'text-primary' : 'text-muted'
                  }`}
                />
                <span className="text-body-md font-body-md font-medium text-on-surface">
                  Light Theme
                </span>
                <span className="text-[11px] text-muted leading-tight">
                  Warm stone &amp; terracotta
                </span>
              </button>

              {/* System Sync */}
              <button
                type="button"
                id="btn-theme-system"
                onClick={() => {
                  setSelectedTheme('system');
                  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) {
                    document.documentElement.classList.remove('light-mode');
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light-mode');
                  }
                }}
                className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all duration-200 active:scale-95 text-center cursor-pointer ${
                  selectedTheme === 'system'
                    ? 'ring-2 ring-primary border border-primary/40'
                    : 'border border-surface-container-high/40'
                }`}
              >
                <Monitor
                  className={`w-[22px] h-[22px] ${
                    selectedTheme === 'system' ? 'text-primary' : 'text-muted'
                  }`}
                />
                <span className="text-body-md font-body-md font-medium text-on-surface">
                  System Sync
                </span>
                <span className="text-[11px] text-muted leading-tight">
                  Auto OS balance
                </span>
              </button>
            </div>
          </section>

          {/* Reading Density Section */}
          <section>
            <label className="block text-label-sm font-label-sm uppercase tracking-wider text-muted mb-3 font-medium">
              Reading Density
            </label>
            <div
              onClick={() => setSelectedCompact(!selectedCompact)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container border border-surface-container-high/30 cursor-pointer hover:bg-surface-container-high transition-colors select-none"
            >
              <div className="flex items-center gap-2.5">
                <AlignLeft className="w-5 h-5 text-muted shrink-0" />
                <div>
                  <div className="text-body-md font-body-md text-on-surface font-medium">
                    Compact Output View
                  </div>
                  <div className="text-[11px] text-muted">
                    Compress whitepaper &amp; summary margins
                  </div>
                </div>
              </div>

              <div
                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  selectedCompact
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high border border-surface-container-highest'
                }`}
              >
                {selectedCompact && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-surface-container-highest/20">
          <button
            type="button"
            onClick={() => {
              // Revert to active theme in store if cancelled
              if (themeMode === 'light') {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light-mode');
              } else if (themeMode === 'dark') {
                document.documentElement.classList.remove('light-mode');
                document.documentElement.classList.add('dark');
              }
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-label-md transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed text-label-md font-label-md font-medium transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
