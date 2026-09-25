'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  toastMessage?: string;
  variant?: 'ghost' | 'surface' | 'primary' | 'icon-only';
  className?: string;
  ariaLabel?: string;
}

export function CopyButton({
  textToCopy,
  label,
  toastMessage = 'Content copied to clipboard',
  variant = 'surface',
  className = '',
  ariaLabel = 'Copy to clipboard',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const showToast = useAppStore((state) => state.showToast);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast(toastMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (variant === 'icon-only') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={`text-muted hover:text-on-surface transition-colors p-1 rounded-md hover:bg-surface-container ${className}`}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-primary animate-in zoom-in-50 duration-200" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  if (variant === 'ghost') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-1 px-space-sm py-1 rounded-lg text-muted hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors border border-surface-container-high/30 active:scale-95 ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-medium">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>{label || 'Copy'}</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'primary') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-sm text-label-sm font-medium transition-colors shadow-sm active:scale-95 duration-200 ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>{label || 'Copy Full Text'}</span>
          </>
        )}
      </button>
    );
  }

  // Default surface button
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 px-space-sm py-1 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm transition-colors copy-content-btn active:scale-95 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary font-medium">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label || 'Copy'}</span>
        </>
      )}
    </button>
  );
}
