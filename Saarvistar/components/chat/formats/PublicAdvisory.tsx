'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { PublicAdvisoryContent } from '@/lib/types';

interface PublicAdvisoryProps {
  content: PublicAdvisoryContent;
  isEditing: boolean;
  onSave?: (updatedContent: PublicAdvisoryContent) => void;
}

export function PublicAdvisory({ content, isEditing, onSave }: PublicAdvisoryProps) {
  const [subtitle, setSubtitle] = useState(content.subtitle || 'Threat Advisory & Guidance');
  const [noticeCallout, setNoticeCallout] = useState(
    content.noticeCallout || 'Advisory Notice: Edge Ingress & Token Expiration Mandate'
  );
  const [overview, setOverview] = useState(content.overview || '');
  const [technicalScope, setTechnicalScope] = useState(content.technicalScope);

  const handleScopeChange = (field: keyof typeof technicalScope, value: string) => {
    const next = { ...technicalScope, [field]: value };
    setTechnicalScope(next);
    onSave?.({ ...content, subtitle, noticeCallout, overview, technicalScope: next });
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Sub-header */}
      <div className="flex items-center justify-between pb-space-xs">
        <span className="font-label-sm text-label-sm text-muted">
          Type:{' '}
          {isEditing ? (
            <input
              type="text"
              value={subtitle}
              onChange={(e) => {
                setSubtitle(e.target.value);
                onSave?.({ ...content, subtitle: e.target.value, noticeCallout, overview, technicalScope });
              }}
              className="px-2 py-0.5 rounded bg-surface-container border border-surface-container-high text-on-surface text-label-sm"
            />
          ) : (
            <span className="text-on-surface font-medium">{subtitle}</span>
          )}
        </span>
      </div>

      {/* Key Advisory Notice Callout Box */}
      <div className="p-space-md rounded-xl bg-secondary-container/30 border border-primary-container/40 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary font-title-md text-title-md font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {isEditing ? (
            <input
              type="text"
              value={noticeCallout}
              onChange={(e) => {
                setNoticeCallout(e.target.value);
                onSave?.({ ...content, subtitle, noticeCallout: e.target.value, overview, technicalScope });
              }}
              className="w-full bg-surface-container p-1 rounded text-primary text-title-md font-medium"
            />
          ) : (
            <span>{noticeCallout}</span>
          )}
        </div>
      </div>

      {/* Incident Impact Summary */}
      <div className="flex flex-col gap-4 text-on-surface/90 leading-relaxed font-body-md text-body-md">
        <div className="flex flex-col gap-2">
          <h3 className="font-title-md text-title-md font-medium text-on-surface">
            Overview & Incident Scope
          </h3>
          {isEditing ? (
            <textarea
              rows={4}
              value={overview}
              onChange={(e) => {
                setOverview(e.target.value);
                onSave?.({ ...content, subtitle, noticeCallout, overview: e.target.value, technicalScope });
              }}
              className="w-full bg-surface-container p-3 rounded-lg border border-surface-container-high text-on-surface font-body-md"
            />
          ) : (
            <p className="text-on-surface/90 leading-relaxed">{overview}</p>
          )}
        </div>

        {/* Technical Scope & Key Findings Box */}
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-high/30 flex flex-col gap-2.5">
          <h4 className="font-title-md text-title-md font-medium text-primary flex items-center gap-2">
            <ShieldCheck className="w-[18px] h-[18px]" />
            <span>Technical Scope & Key Findings</span>
          </h4>
          <ul className="space-y-2 text-on-surface/90 pt-1">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <div className="flex-1">
                <strong>Adversary Technique:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={technicalScope.technique}
                    onChange={(e) => handleScopeChange('technique', e.target.value)}
                    className="w-full bg-surface-container p-1 rounded mt-1 border border-surface-container-high"
                  />
                ) : (
                  <span>{technicalScope.technique}</span>
                )}
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <div className="flex-1">
                <strong>Blast Radius:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={technicalScope.blastRadius}
                    onChange={(e) => handleScopeChange('blastRadius', e.target.value)}
                    className="w-full bg-surface-container p-1 rounded mt-1 border border-surface-container-high"
                  />
                ) : (
                  <span>{technicalScope.blastRadius}</span>
                )}
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <div className="flex-1">
                <strong>Containment:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={technicalScope.containment}
                    onChange={(e) => handleScopeChange('containment', e.target.value)}
                    className="w-full bg-surface-container p-1 rounded mt-1 border border-surface-container-high"
                  />
                ) : (
                  <span>{technicalScope.containment}</span>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
