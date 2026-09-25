'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Copy, Plus, Sparkles, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { FormatTabs } from '@/components/chat/FormatTabs';
import { OutputPanel } from '@/components/chat/OutputPanel';
import { PromptDock } from '@/components/chat/PromptDock';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params?.chatId as string;

  const { sessions, activeChatId, setActiveChat, showToast, addFormatToChat } = useAppStore();
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (chatId) {
      setActiveChat(chatId);
    }
  }, [chatId, setActiveChat]);

  const session = sessions.find((s) => s.id === chatId);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted">Chat session not found or loading...</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md"
        >
          Return Home
        </button>
      </div>
    );
  }

  const activeFormatInfo = session.formats[session.activeFormatId || session.selectedFormats[0]];

  const handleCopyCurrent = async () => {
    // Copy active format representation
    const content = activeFormatInfo?.content;
    const str = typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);
    await navigator.clipboard.writeText(str);
    setCopiedAll(true);
    showToast(`Current format copied to clipboard!`);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-space-md sm:px-space-lg pb-36">
      <div className="max-w-4xl mx-auto py-space-lg">
        {/* Output Screen Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg border-b border-surface-container-high/40">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-medium truncate">
                {session.title || 'Quarterly Narrative & Resilience Advisory'}
              </h1>
            </div>
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-muted flex-wrap">
              <FileText className="w-[15px] h-[15px] text-muted shrink-0" />
              <span className="truncate max-w-[280px]">
                {session.sourceDocument?.name || 'Q3_Strategic_Cyber_Resilience.pdf'}
              </span>
              <span>•</span>
              <span className="text-primary font-medium">Generated from source</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Top Copy Button */}
            <button
              type="button"
              onClick={handleCopyCurrent}
              id="copyFormatBtn"
              className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md border border-surface-container-high/40 active:scale-95 shadow-sm"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-muted" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Multi-Format Tabs */}
        <FormatTabs chatId={chatId} />

        {/* Content Card / Output Panel */}
        <OutputPanel chatId={chatId} />
      </div>

      {/* Floating Prompt Dock at bottom */}
      <PromptDock chatId={chatId} />
    </div>
  );
}
