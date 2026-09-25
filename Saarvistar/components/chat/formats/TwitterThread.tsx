'use client';

import React, { useState } from 'react';
import { MessageSquare, Repeat, Heart, Plus, Trash2 } from 'lucide-react';
import { TwitterThreadContent, TweetCardData } from '@/lib/types';
import { CopyButton } from '@/components/common/CopyButton';

interface TwitterThreadProps {
  content: TwitterThreadContent;
  isEditing: boolean;
  onSave?: (updatedContent: TwitterThreadContent) => void;
}

export function TwitterThread({ content, isEditing, onSave }: TwitterThreadProps) {
  const [tweets, setTweets] = useState<TweetCardData[]>(content.tweets || []);

  const handleTweetChange = (index: number, text: string) => {
    const next = [...tweets];
    next[index] = { ...next[index], text };
    setTweets(next);
    onSave?.({ ...content, tweets: next });
  };

  const handleLabelChange = (index: number, label: string) => {
    const next = [...tweets];
    next[index] = { ...next[index], label };
    setTweets(next);
    onSave?.({ ...content, tweets: next });
  };

  const handleAddTweet = () => {
    const newIdx = tweets.length + 1;
    const newTweet: TweetCardData = {
      id: `tweet-${Date.now()}`,
      index: newIdx,
      total: newIdx,
      label: 'Update',
      text: 'New thought in this thread...',
    };
    const next = [...tweets.map((t) => ({ ...t, total: newIdx })), newTweet];
    setTweets(next);
    onSave?.({ ...content, tweets: next });
  };

  const handleDeleteTweet = (idx: number) => {
    if (tweets.length <= 1) return;
    const filtered = tweets.filter((_, i) => i !== idx);
    const updated = filtered.map((t, i) => ({
      ...t,
      index: i + 1,
      total: filtered.length,
    }));
    setTweets(updated);
    onSave?.({ ...content, tweets: updated });
  };

  return (
    <div className="flex flex-col gap-space-md">
      {/* Sub-header */}
      <div className="flex items-center justify-between pb-space-xs">
        <span className="font-label-sm text-label-sm text-muted">
          Thread Length:{' '}
          <span className="text-on-surface font-medium">{tweets.length} connected posts</span>
        </span>
        {isEditing && (
          <button
            type="button"
            onClick={handleAddTweet}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-label-sm transition-colors border border-surface-container-high/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tweet</span>
          </button>
        )}
      </div>

      {/* Connected tweet cards list */}
      <div className="flex flex-col gap-3 relative before:absolute before:left-5 before:top-6 before:bottom-6 before:w-0.5 before:bg-surface-container-high/50">
        {tweets.map((tweet, idx) => {
          const isFirstOrLast = idx === 0 || idx === tweets.length - 1;

          return (
            <div
              key={tweet.id || idx}
              className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-high/30 flex flex-col gap-2 relative pl-12 transition-all hover:border-surface-container-high/60 group"
            >
              {/* Number avatar indicator on connector line */}
              <span
                className={`absolute left-2.5 top-4 w-6 h-6 rounded-full font-mono text-[11px] font-bold flex items-center justify-center transition-colors ${
                  isFirstOrLast
                    ? 'bg-secondary-container text-on-secondary-container border border-primary/40'
                    : 'bg-surface-container-high text-primary'
                }`}
              >
                {tweet.index}
              </span>

              {/* Tweet header with label & per-tweet copy button */}
              <div className="flex items-center justify-between text-[11px] text-muted font-mono">
                {isEditing ? (
                  <input
                    type="text"
                    value={tweet.label}
                    onChange={(e) => handleLabelChange(idx, e.target.value)}
                    className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-mono border border-surface-container-high"
                  />
                ) : (
                  <span
                    className={
                      isFirstOrLast ? 'text-primary font-medium' : 'text-muted'
                    }
                  >
                    {tweet.index}/{tweet.total} • {tweet.label}
                  </span>
                )}

                <div className="flex items-center gap-1">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTweet(idx)}
                      className="text-error hover:text-error/80 p-1 transition-colors"
                      title="Delete tweet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <CopyButton
                    variant="icon-only"
                    textToCopy={tweet.text}
                    ariaLabel={`Copy tweet ${tweet.index}`}
                    toastMessage={`Tweet ${tweet.index} copied!`}
                  />
                </div>
              </div>

              {/* Tweet Body */}
              {isEditing ? (
                <textarea
                  rows={4}
                  value={tweet.text}
                  onChange={(e) => handleTweetChange(idx, e.target.value)}
                  className="w-full bg-surface-container p-2.5 rounded-lg border border-surface-container-high text-on-surface/90 font-body-md leading-relaxed"
                />
              ) : (
                <div className="text-on-surface/90 font-body-md text-body-md leading-relaxed whitespace-pre-line">
                  {tweet.text}
                </div>
              )}

              {/* Engagement metrics for the Hook or tweets with metrics */}
              {tweet.metrics && !isEditing && (
                <div className="flex items-center gap-4 text-muted text-[12px] pt-1">
                  <span className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-default">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{tweet.metrics.replies}</span>
                  </span>
                  <span className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-default">
                    <Repeat className="w-3.5 h-3.5" />
                    <span>{tweet.metrics.reposts}</span>
                  </span>
                  <span className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-default">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{tweet.metrics.likes}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
