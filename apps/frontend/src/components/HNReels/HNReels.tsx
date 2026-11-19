import React, { useEffect, useRef } from 'react';
import { useStoryData, useArrowKeySnap } from "./hooks";
import type { FeedSource } from './hooks/useStoryData';
import StoryCard from "./StoryCard";
import Header from "./Header";

interface HNReelsProps { onBack: () => void; }

const HNReels = ({ onBack }: HNReelsProps) => {
  const { items, loading, loadingMore, error, hasMore, loadMore, refresh, source, setSource, requestSummary } = useStoryData();
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<React.RefObject<HTMLElement | null>[]>([]);
  cardRefs.current = items.map((_, index) => cardRefs.current[index] ?? React.createRef<HTMLElement>());

  useArrowKeySnap(containerRef, cardRefs.current);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore(); }, { root: containerRef.current, rootMargin: '0px 0px 360px', threshold: 0.01 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = Number((entry.target as HTMLElement).dataset.storyIndex);
      if (items[index]) requestSummary(items[index]);
    }), { root: containerRef.current, rootMargin: '500px 0px', threshold: 0.01 });
    cardRefs.current.forEach((ref, index) => { if (ref.current) { ref.current.dataset.storyIndex = String(index); observer.observe(ref.current); } });
    return () => observer.disconnect();
  }, [items, requestSummary]);

  if (loading && items.length === 0) {
    return <div className="reader-shell"><Header onBack={onBack} /><div className="feed-loading"><div className="skeleton-card"><span /><span /><span /><span /></div><p>Finding something worth your attention…</p></div></div>;
  }

  if (error && items.length === 0) return <div className="reader-shell"><Header onBack={onBack} /><div className="feed-loading"><p>{error}</p><button className="primary-button" onClick={refresh}>Try again</button></div></div>;

  if (!loading && items.length === 0) return <div className="reader-shell"><Header onBack={onBack} /><div className="feed-loading"><p className="empty-kicker">NO STORIES IN THIS EDITION</p><h2>Quiet desk.<br /><em>Try another source.</em></h2><button className="primary-button" onClick={refresh}>Refresh the desk</button></div></div>;

  return (
    <div className="reader-shell">
      <Header onBack={onBack} />
      <div className="feed-controls"><div className="feed-issue">VOL. 1 · NO. 47 <span>THE REED READING DESK</span></div><div className="feed-tabs" role="tablist" aria-label="Filter stories by source">{([['all', 'All'], ['new', 'HN'], ['lobsters', 'Lobsters'], ['devto', 'DEV'], ['hashnode', 'Hashnode'], ['reddit', 'Reddit'], ['stackoverflow', 'Stack Overflow'], ['cloudflare', 'Cloudflare'], ['github-blog', 'GitHub'], ['vercel', 'Vercel'], ['netflix-tech', 'Netflix'], ['stackoverflow-blog', 'SO Blog'], ['mozilla-hacks', 'Mozilla']] as [FeedSource, string][]).map(([value, label]) => <button key={`${value}-${label}`} type="button" role="tab" aria-selected={source === value} className={source === value ? 'feed-tab active' : 'feed-tab'} onClick={() => setSource(value)}>{label}</button>)}</div></div>
      <div ref={containerRef} className="feed-scroller" aria-label="Reed story feed">
        {items.map((item, i) => (
          <StoryCard ref={cardRefs.current[i]} key={item.id} item={item} index={i} />
        ))}
        <div ref={sentinelRef} className="feed-sentinel" aria-live="polite">
          {loadingMore && <><span className="loading-spinner small" /> <span>Loading the next stories…</span></>}
          {!loadingMore && !hasMore && items.length > 0 && <span>You’re all caught up.</span>}
        </div>
      </div>
    </div>
  );
};

export default HNReels;
