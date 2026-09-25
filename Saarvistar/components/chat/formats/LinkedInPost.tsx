'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { LinkedInPostContent } from '@/lib/types';

interface LinkedInPostProps {
  content: LinkedInPostContent;
  isEditing: boolean;
  onSave?: (updatedContent: LinkedInPostContent) => void;
}

export function LinkedInPost({ content, isEditing, onSave }: LinkedInPostProps) {
  const [authorName, setAuthorName] = useState(content.authorName || 'NTRO');
  const [bodyParagraphs, setBodyParagraphs] = useState<string[]>(content.bodyParagraphs || []);
  const [highlightQuote, setHighlightQuote] = useState(content.highlightQuote || '');
  const [keyPoints, setKeyPoints] = useState<string[]>(content.keyPoints || []);
  const [concludingThought, setConcludingThought] = useState(content.concludingThought || '');
  const [engagementQuestion, setEngagementQuestion] = useState(content.engagementQuestion || '');
  const [hashtags, setHashtags] = useState<string[]>(content.hashtags || []);

  const handleParagraphChange = (index: number, val: string) => {
    const next = [...bodyParagraphs];
    next[index] = val;
    setBodyParagraphs(next);
    onSave?.({
      ...content,
      authorName,
      bodyParagraphs: next,
      highlightQuote,
      keyPoints,
      concludingThought,
      engagementQuestion,
      hashtags,
    });
  };

  const handleKeyPointChange = (index: number, val: string) => {
    const next = [...keyPoints];
    next[index] = val;
    setKeyPoints(next);
    onSave?.({
      ...content,
      authorName,
      bodyParagraphs,
      highlightQuote,
      keyPoints: next,
      concludingThought,
      engagementQuestion,
      hashtags,
    });
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Sub-header */}
      <div className="flex items-center justify-between pb-space-xs">
        <span className="font-label-sm text-label-sm text-muted">
          Platform: <span className="text-on-surface font-medium">LinkedIn Executive Post</span>
        </span>
      </div>

      {/* Authentic LinkedIn Post Preview Card */}
      <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col gap-4 shadow-sm">
        {/* Author Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-surface-container-high/20">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-on-primary" />
          </div>
          <div className="flex flex-col">
            {isEditing ? (
              <input
                type="text"
                value={authorName}
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  onSave?.({
                    ...content,
                    authorName: e.target.value,
                    bodyParagraphs,
                    highlightQuote,
                    keyPoints,
                    concludingThought,
                    engagementQuestion,
                    hashtags,
                  });
                }}
                className="px-2 py-0.5 rounded bg-surface-container font-label-md text-on-surface font-semibold"
              />
            ) : (
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                {authorName}
              </span>
            )}
            <span className="font-label-sm text-label-sm text-muted">Enterprise Resilience Pulse</span>
          </div>
        </div>

        {/* Post Content */}
        <div className="flex flex-col gap-3 font-body-md text-body-md leading-relaxed text-on-surface/90">
          {bodyParagraphs.map((para, idx) => (
            <div key={idx}>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={para}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  className="w-full bg-surface-container p-2 rounded border border-surface-container-high text-on-surface font-body-md"
                />
              ) : (
                <p className={idx === 0 ? 'font-medium text-on-surface text-[15px]' : ''}>
                  {para}
                </p>
              )}
            </div>
          ))}

          {/* Highlight Quote */}
          {highlightQuote && (
            <div className="my-1">
              {isEditing ? (
                <textarea
                  rows={2}
                  value={highlightQuote}
                  onChange={(e) => {
                    setHighlightQuote(e.target.value);
                    onSave?.({
                      ...content,
                      authorName,
                      bodyParagraphs,
                      highlightQuote: e.target.value,
                      keyPoints,
                      concludingThought,
                      engagementQuestion,
                      hashtags,
                    });
                  }}
                  className="w-full bg-surface-container p-2 rounded border border-primary text-primary font-medium"
                />
              ) : (
                <p className="pl-3 border-l-2 border-primary font-medium text-primary">
                  {highlightQuote}
                </p>
              )}
            </div>
          )}

          {/* Key Points */}
          <ul className="space-y-1.5 pl-2">
            {keyPoints.map((point, kIdx) => (
              <li key={kIdx} className="flex items-start gap-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleKeyPointChange(kIdx, e.target.value)}
                    className="w-full bg-surface-container p-1.5 rounded border border-surface-container-high"
                  />
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: point.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong>$1</strong>'
                      ),
                    }}
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Concluding thought */}
          {concludingThought && (
            <div className="pt-2">
              {isEditing ? (
                <textarea
                  rows={2}
                  value={concludingThought}
                  onChange={(e) => {
                    setConcludingThought(e.target.value);
                    onSave?.({
                      ...content,
                      authorName,
                      bodyParagraphs,
                      highlightQuote,
                      keyPoints,
                      concludingThought: e.target.value,
                      engagementQuestion,
                      hashtags,
                    });
                  }}
                  className="w-full bg-surface-container p-2 rounded border border-surface-container-high text-on-surface font-medium"
                />
              ) : (
                <p className="font-medium text-on-surface">{concludingThought}</p>
              )}
            </div>
          )}

          {/* Engagement Question */}
          {engagementQuestion && (
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={engagementQuestion}
                  onChange={(e) => {
                    setEngagementQuestion(e.target.value);
                    onSave?.({
                      ...content,
                      authorName,
                      bodyParagraphs,
                      highlightQuote,
                      keyPoints,
                      concludingThought,
                      engagementQuestion: e.target.value,
                      hashtags,
                    });
                  }}
                  className="w-full bg-surface-container p-2 rounded border border-primary text-primary font-semibold"
                />
              ) : (
                <p className="text-primary font-semibold">{engagementQuestion}</p>
              )}
            </div>
          )}

          {/* Hashtags */}
          <div className="pt-2 text-[13px] text-tertiary font-mono space-x-1.5">
            {hashtags.map((tag, tIdx) => (
              <span key={tIdx}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
