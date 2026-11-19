import React, { useState, useCallback } from "react";
import type { ForwardedRef } from "react";
import { ArrowUpRight, BookmarkSimple, ChatCircle, ShareNetwork, Sparkle } from '@phosphor-icons/react';
import { domainFromUrl, fallbackSummarize, shareLink } from "../../shared/helpers";
import { timeAgo } from "../../shared/timeAgo";
import { ActionIcon } from "./ActionIcon";
import type { StoryItem } from "../../../types";

interface StoryCardProps {
  item: StoryItem;
  index: number;
}

const StoryCard = React.forwardRef<HTMLElement, StoryCardProps>(function StoryCard({ item, index }, ref) {
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState(false);
  const hnItemUrl: string = `https://news.ycombinator.com/item?id=${item.id}`;
  const domain: string | undefined = item.domain ?? domainFromUrl(item.url);
  const summary: string = item.summary || fallbackSummarize(item.title, item.url);
  const readTime = Math.max(1, Math.ceil(summary.split(/\s+/).length / 45));

  const onShare = useCallback(async () => {
    const result = await shareLink(item.title, item.url || hnItemUrl);
    if (result.ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  }, [item.title, item.url, hnItemUrl]);

  return (
    <section ref={ref as ForwardedRef<HTMLElement>} className={`story-slide story-slide-${index % 4}`}>
      <div className="story-glow" />
      <div className="story-shell">
        <div className="story-meta"><span className="source-pill">{item.source ?? domain ?? 'link'}</span><span>{domain ?? 'web'} · by {item.by}</span><span>{timeAgo(item.time)}</span><span className="meta-time">ISSUE {String(index + 1).padStart(2, '0')}</span></div>
        <div className="story-content">
          <span className="story-kicker"><Sparkle size={12} weight="fill" aria-hidden="true" /> THE DAILY SIGNAL <i /> {item.score} POINTS</span>
          <h2>{item.title}</h2>
          <div className={item.summaryLoading ? 'story-summary summary-loading' : 'story-summary'}><span className="summary-label">{item.summaryProvider === 'gemini' ? 'AI SUMMARY' : 'QUICK SUMMARY'}</span>{item.summaryLoading ? <span className="summary-skeleton" aria-label="Summary loading" /> : <><span className="drop-cap">{summary.charAt(0)}</span>{summary.slice(1)}</>}</div>
        </div>
        <div className="story-details"><span>{readTime} MIN READ</span><span>{item.descendants ?? 0} COMMENTS</span><span>{item.summaryProvider === 'gemini' ? 'AI SUMMARY' : 'QUICK SUMMARY'}</span></div>
        <div className="story-actions">
            <ActionIcon
              label="Read full story"
              onClick={() => window.open(item.url || hnItemUrl, "_blank")}
            >
              <ArrowUpRight size={22} weight="regular" />
            </ActionIcon>
            <ActionIcon label={copied ? "Copied" : "Share"} onClick={onShare}>
              <ShareNetwork size={22} weight="regular" />
            </ActionIcon>
            <ActionIcon label={saved ? "Saved" : "Save"} onClick={() => setSaved((value) => !value)}>
              <BookmarkSimple size={22} weight={saved ? 'fill' : 'regular'} />
            </ActionIcon>
        </div>
        <div className="story-footer"><span><ChatCircle size={13} /> {item.descendants ?? 0} comments</span><span>{item.url ? 'READ FULL STORY ↗' : 'HACKER NEWS'} <b>↓</b></span></div>
      </div>
    </section>
  );
});

export default StoryCard;
