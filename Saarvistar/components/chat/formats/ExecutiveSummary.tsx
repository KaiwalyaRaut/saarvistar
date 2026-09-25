'use client';

import React, { useState } from 'react';
import { Zap, Plus, Trash2 } from 'lucide-react';
import { ExecutiveSummaryContent } from '@/lib/types';

interface ExecutiveSummaryProps {
  content: ExecutiveSummaryContent;
  isEditing: boolean;
  onSave?: (updatedContent: ExecutiveSummaryContent) => void;
}

export function ExecutiveSummary({ content, isEditing, onSave }: ExecutiveSummaryProps) {
  const [tone, setTone] = useState(content.tone || 'High Authority, Decisive');
  const [highlights, setHighlights] = useState<string[]>(content.highlights || []);
  const [sections, setSections] = useState(content.sections || []);

  const handleHighlightChange = (index: number, val: string) => {
    const next = [...highlights];
    next[index] = val;
    setHighlights(next);
    onSave?.({ ...content, tone, highlights: next, sections });
  };

  const handleSectionBodyChange = (index: number, val: string) => {
    const next = [...sections];
    next[index] = { ...next[index], body: val };
    setSections(next);
    onSave?.({ ...content, tone, highlights, sections: next });
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Sub-header with Tone */}
      <div className="flex items-center justify-between pb-space-xs">
        <span className="font-label-sm text-label-sm text-muted">
          Tone:{' '}
          {isEditing ? (
            <input
              type="text"
              value={tone}
              onChange={(e) => {
                setTone(e.target.value);
                onSave?.({ ...content, tone: e.target.value, highlights, sections });
              }}
              className="px-2 py-0.5 rounded bg-surface-container border border-surface-container-high text-on-surface text-label-sm"
            />
          ) : (
            <span className="text-on-surface font-medium">{tone}</span>
          )}
        </span>
      </div>

      {/* Strategic Highlights Callout */}
      <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-high/30 flex flex-col gap-space-xs">
        <div className="flex items-center gap-2 text-primary font-title-md text-title-md font-medium">
          <Zap className="w-[18px] h-[18px]" />
          <span>Strategic Highlights</span>
        </div>
        <ul className="space-y-2 text-on-surface font-body-md text-body-md pt-1">
          {highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {isEditing ? (
                <textarea
                  rows={2}
                  value={highlight}
                  onChange={(e) => handleHighlightChange(idx, e.target.value)}
                  className="w-full bg-surface-container p-2 rounded border border-surface-container-high text-on-surface font-body-md"
                />
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlight.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong>$1</strong>'
                    ),
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Narrative Sections */}
      <div className="flex flex-col gap-4 pt-space-xs">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="flex flex-col gap-2.5">
            <h3 className="font-title-md text-title-md font-medium text-on-surface">
              {section.heading}
            </h3>
            {isEditing ? (
              <textarea
                rows={5}
                value={section.body}
                onChange={(e) => handleSectionBodyChange(sIdx, e.target.value)}
                className="w-full bg-surface-container p-3 rounded-lg border border-surface-container-high text-on-surface/90 font-body-md leading-relaxed"
              />
            ) : (
              section.body.split('\n\n').map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className="font-body-md text-body-md text-on-surface/90 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
