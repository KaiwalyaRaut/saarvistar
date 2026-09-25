'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ContentCard } from './ContentCard';
import { ExecutiveSummary } from './formats/ExecutiveSummary';
import { PublicAdvisory } from './formats/PublicAdvisory';
import { LinkedInPost } from './formats/LinkedInPost';
import { TwitterThread } from './formats/TwitterThread';
import {
  FormatContent,
  ExecutiveSummaryContent,
  PublicAdvisoryContent,
  LinkedInPostContent,
  TwitterThreadContent,
} from '@/lib/types';

interface OutputPanelProps {
  chatId: string;
}

export function OutputPanel({ chatId }: OutputPanelProps) {
  const { sessions, updateFormatContent, isGenerating, generatingFormatId } = useAppStore();

  const session = sessions.find((s) => s.id === chatId);
  if (!session) return null;

  const activeFormatId = session.activeFormatId || session.selectedFormats[0];
  const activeFormatInfo = session.formats[activeFormatId];
  if (!activeFormatInfo) return null;

  const content = activeFormatInfo.content;
  const isCurrentlyGenerating = isGenerating && generatingFormatId === activeFormatId;

  // Derive plain text for Copy button
  const getPlainCopyText = (data: FormatContent): string => {
    if (!data) return '';
    if (data.type === 'exec-summary') {
      const exec = data as ExecutiveSummaryContent;
      return `${exec.title}\nTone: ${exec.tone}\n\nStrategic Highlights:\n${exec.highlights
        .map((h) => `• ${h}`)
        .join('\n')}\n\n${exec.sections
        .map((s) => `${s.heading}\n${s.body}`)
        .join('\n\n')}`;
    }
    if (data.type === 'advisory') {
      const adv = data as PublicAdvisoryContent;
      return `${adv.title}\n${adv.subtitle}\n\n${adv.noticeCallout}\n\nOverview:\n${adv.overview}\n\nTechnical Scope:\n• Adversary Technique: ${adv.technicalScope.technique}\n• Blast Radius: ${adv.technicalScope.blastRadius}\n• Containment: ${adv.technicalScope.containment}`;
    }
    if (data.type === 'linkedin') {
      const li = data as LinkedInPostContent;
      return `${li.bodyParagraphs.join('\n\n')}\n\n${li.highlightQuote}\n\n${li.keyPoints.join(
        '\n'
      )}\n\n${li.concludingThought}\n\n${li.engagementQuestion}\n\n${li.hashtags.join(' ')}`;
    }
    if (data.type === 'twitter') {
      const tw = data as TwitterThreadContent;
      return tw.tweets
        .map((t) => `${t.index}/${t.total} • ${t.label}\n${t.text}`)
        .join('\n\n---\n\n');
    }
    if (data.type === 'custom') {
      return (data as any).rawText || '';
    }
    return '';
  };

  const copyText = getPlainCopyText(content);

  return (
    <ContentCard
      title={activeFormatInfo.name}
      copyText={copyText}
      isGenerating={isCurrentlyGenerating}
    >
      {({ isEditing }) => {
        if (content.type === 'exec-summary') {
          return (
            <ExecutiveSummary
              content={content as ExecutiveSummaryContent}
              isEditing={isEditing}
              onSave={(updated) => updateFormatContent(chatId, activeFormatId, updated)}
            />
          );
        }

        if (content.type === 'advisory') {
          return (
            <PublicAdvisory
              content={content as PublicAdvisoryContent}
              isEditing={isEditing}
              onSave={(updated) => updateFormatContent(chatId, activeFormatId, updated)}
            />
          );
        }

        if (content.type === 'linkedin') {
          return (
            <LinkedInPost
              content={content as LinkedInPostContent}
              isEditing={isEditing}
              onSave={(updated) => updateFormatContent(chatId, activeFormatId, updated)}
            />
          );
        }

        if (content.type === 'twitter') {
          return (
            <TwitterThread
              content={content as TwitterThreadContent}
              isEditing={isEditing}
              onSave={(updated) => updateFormatContent(chatId, activeFormatId, updated)}
            />
          );
        }

        // Custom format fallback
        return (
          <div className="flex flex-col gap-4 font-body-md text-on-surface/90">
            <h3 className="font-title-md text-on-surface font-medium">
              {(content as any).title || activeFormatInfo.name}
            </h3>
            <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-high/30 leading-relaxed whitespace-pre-line">
              {(content as any).rawText}
            </div>
          </div>
        );
      }}
    </ContentCard>
  );
}
