'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, CheckCircle2, Menu } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function TopHeader() {
  const router = useRouter();
  const { toast, sidebarOpen, toggleSidebar, setActiveChat, createSession } = useAppStore();

  const handleNewChat = () => {
    setActiveChat(null);
    router.push('/');
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-surface-dim/80 backdrop-blur-xl z-40 flex items-center justify-between px-space-lg border-b border-surface-container-high/30 transition-all duration-300 ${
        sidebarOpen ? 'left-0 md:left-64' : 'left-0'
      }`}
    >
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-space-md">
        {/* Toast notification capsule */}
        {toast.show && (
          <div
            id="toastNotification"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-highest text-primary font-label-sm text-label-sm shadow-md animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span id="toastMessage">{toast.message}</span>
          </div>
        )}

        {/* New chat action */}
        <button
          type="button"
          onClick={handleNewChat}
          className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary text-on-primary hover:bg-primary-fixed transition-colors font-label-md text-label-md shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New chat</span>
        </button>
      </div>
    </header>
  );
}
