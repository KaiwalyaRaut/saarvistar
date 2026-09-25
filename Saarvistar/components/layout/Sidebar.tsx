'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, SlidersHorizontal, User, PanelLeftClose, Trash2 } from 'lucide-react';
import { SarvistarMark } from '@/components/common/SarvistarMark';
import { WorkspacePreferencesModal } from '@/components/common/WorkspacePreferencesModal';
import { useAppStore } from '@/lib/store';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    sessions,
    activeChatId,
    setActiveChat,
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    createSession,
    deleteSession,
  } = useAppStore();

  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const handleNewChat = () => {
    setActiveChat(null);
    router.push('/');
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSelectSession = (id: string) => {
    setActiveChat(id);
    router.push(`/chat/${id}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSession(id);
    if (activeChatId === id) {
      router.push('/');
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col justify-between py-space-md px-space-md border-r border-surface-container-high/30 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-space-lg overflow-y-auto">
          {/* Header brand + toggle */}
          <div className="flex items-center justify-between px-space-xs">
            <Link
              href="/"
              onClick={() => setActiveChat(null)}
              className="flex items-center gap-space-sm group"
            >
              <SarvistarMark className="h-6 w-6 text-primary group-hover:rotate-45 transition-transform" />
              <span className="font-headline-sm text-headline-sm font-medium tracking-tight text-on-surface">
                Sarvistar
              </span>
            </Link>
            <button
              type="button"
              onClick={toggleSidebar}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-on-surface hover:bg-surface-container transition-colors"
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-space-xs">
            <button
              type="button"
              onClick={handleNewChat}
              className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface text-left group"
            >
              <Plus className="w-[18px] h-[18px] text-primary group-hover:scale-110 transition-transform" />
              <span className="font-label-md text-label-md">New chat</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCustomizeOpen(true)}
              className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer select-none text-left"
            >
              <SlidersHorizontal className="w-[18px] h-[18px] text-on-surface-variant" />
              <span className="font-label-md text-label-md">Customize</span>
            </button>
          </div>

          {/* Chats and tasks nav */}
          <div className="flex flex-col gap-space-xs">
            <div className="px-space-xs py-space-xs font-label-sm text-label-sm uppercase tracking-wider text-muted">
              Chats and tasks
            </div>
            <nav className="flex flex-col gap-space-xs">
              {sessions.map((session) => {
                const isActive =
                  activeChatId === session.id || pathname === `/chat/${session.id}`;
                return (
                  <div
                    key={session.id}
                    className={`group flex items-center rounded-lg transition-colors font-body-md text-body-md ${
                      isActive
                        ? 'bg-surface-container text-on-surface font-medium border-l-2 border-primary'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectSession(session.id)}
                      className="flex-1 truncate text-left px-space-sm py-space-sm min-w-0"
                    >
                      <span className="truncate">{session.title}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      title="Delete chat"
                      aria-label="Delete chat"
                      className="shrink-0 opacity-0 group-hover:opacity-100 mr-1.5 w-6 h-6 flex items-center justify-center rounded text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User profile dock */}
        <div className="pt-space-md border-t border-surface-container-high/30">
          <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <User className="w-[18px] h-[18px] text-on-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface leading-none truncate">
                  Pranav
                </span>
                <span className="font-label-sm text-label-sm text-muted truncate">Pro Plan</span>
              </div>
            </div>
            <span className="px-space-xs py-0.5 rounded text-[11px] font-medium bg-surface-container-high text-primary shrink-0">
              Active
            </span>
          </div>
        </div>
      </aside>

      {/* Workspace Preferences Modal */}
      <WorkspacePreferencesModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
      />
    </>
  );
}
