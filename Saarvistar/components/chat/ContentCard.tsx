'use client';

import React, { useState } from 'react';
import { Edit2, Check, Share2, Sparkles, X, Link as LinkIcon } from 'lucide-react';
import { CopyButton } from '@/components/common/CopyButton';
import { useAppStore } from '@/lib/store';

interface ContentCardProps {
  title: string;
  copyText: string;
  isGenerating?: boolean;
  children: (props: { isEditing: boolean; toggleEditing: () => void }) => React.ReactNode;
}

export function ContentCard({
  title,
  copyText,
  isGenerating = false,
  children,
}: ContentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const showToast = useAppStore((state) => state.showToast);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Sarvistar - ${title}`,
          text: copyText.slice(0, 200) + '...',
          url: window.location.href,
        });
        return;
      } catch (e) {
        // User cancelled or share failed, fallback to modal
      }
    }
    setIsShareModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Direct share link copied to clipboard');
    setIsShareModalOpen(false);
  };

  return (
    <>
      <div className="relative bg-surface rounded-2xl p-space-lg sm:p-space-xl shadow-xl border border-surface-container-high/40 min-h-[480px] transition-all">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-space-sm border-b border-surface-container-high/30 mb-space-md">
          <div className="flex items-center gap-2">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">
              {title}
            </h2>
            {isGenerating && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-label-sm font-medium animate-pulse">
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>Synthesizing...</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Edit action */}
            <button
              type="button"
              onClick={() => {
                const nextState = !isEditing;
                setIsEditing(nextState);
                showToast(nextState ? 'Inline edit enabled' : 'Changes saved');
              }}
              className={`inline-flex items-center gap-1 px-space-sm py-1 rounded-lg font-label-sm text-label-sm transition-colors border ${
                isEditing
                  ? 'bg-primary text-on-primary border-primary font-medium'
                  : 'text-muted hover:text-on-surface hover:bg-surface-container border-surface-container-high/30'
              }`}
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </>
              )}
            </button>

            {/* Copy Action */}
            <CopyButton
              variant="surface"
              textToCopy={copyText}
              label={title.includes('Thread') ? 'Copy thread' : 'Copy'}
              toastMessage={`${title} copied to clipboard`}
            />

            {/* Share Action */}
            <button
              type="button"
              onClick={handleShare}
              title="Share this format"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-muted hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors border border-surface-container-high/30"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Optimistic Skeleton Shimmer Loader when generating */}
        {isGenerating ? (
          <div className="flex flex-col gap-4 py-space-md animate-pulse">
            <div className="h-6 bg-surface-container-high rounded-md w-3/4" />
            <div className="h-4 bg-surface-container rounded-md w-full" />
            <div className="h-4 bg-surface-container rounded-md w-5/6" />
            <div className="h-28 bg-surface-container-low border border-surface-container-high/40 rounded-xl mt-2" />
            <div className="h-4 bg-surface-container rounded-md w-2/3" />
            <div className="h-4 bg-surface-container rounded-md w-4/5" />
          </div>
        ) : (
          children({ isEditing, toggleEditing: () => setIsEditing(!isEditing) })
        )}
      </div>

      {/* Share Modal Fallback */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-surface p-space-md shadow-2xl border border-surface-container-high/50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/30">
              <span className="font-title-md text-title-md text-on-surface font-medium">
                Share Format
              </span>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-muted hover:text-on-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="py-3 text-body-md text-on-surface/80">
              Share encapsulated intelligence snapshot for <strong className="text-on-surface">{title}</strong>.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-md font-medium transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Copy Shareable Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
