import { useCallback, useEffect, useRef, useState } from 'react';
import { domainFromUrl } from '../../shared/helpers';
import { api } from '../../../lib/api';
import type { StoryItem, StoryDataResponse, SummaryResponse } from '../../../types';

const PAGE_SIZE = 10;
export type FeedSource = 'all' | 'new' | 'lobsters' | 'devto' | 'reddit' | 'stackoverflow' | 'hashnode' | 'cloudflare' | 'github-blog' | 'vercel' | 'netflix-tech' | 'stackoverflow-blog' | 'mozilla-hacks';
const apiSource = (source: FeedSource) => source === 'new' ? 'hacker-news' : source === 'devto' ? 'dev' : source;

export function useStoryData() {
  const [items, setItems] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<FeedSource>('all');
  const requestedSummaries = useRef(new Set<number>());

  const fetchSummaries = useCallback(async (stories: StoryItem[]) => {
    const summaries = await Promise.all(stories.map(async (story) => {
      try {
        const params = { url: story.url, fallback: story.text ?? story.summary ?? '' };
        const response = await api.get<SummaryResponse>('/api/summary', { params, timeout: 12000 });
        return { ...story, summary: response.data.summary || story.summary, summaryProvider: response.data.provider, summaryLoading: false };
      } catch {
        return { ...story, summaryLoading: false };
      }
    }));
    setItems((current) => {
      const updates = new Map(summaries.map((summary) => [summary.id, summary]));
      if (!current.length) return summaries;
      return current.map((story) => updates.get(story.id) ?? story);
    });
  }, []);

  const fetchStories = useCallback(async (page = 1, append = false) => {
    try {
      setError(null);
      if (append) setLoadingMore(true); else setLoading(true);
      const params = { source: apiSource(source), page, limit: PAGE_SIZE };
      const response = await api.get<StoryDataResponse>('/api/feed', { params });
      const { stories, pagination } = response.data;
      const processed = stories.map((story) => ({
        ...story,
        descendants: story.descendants ?? story.comment_count ?? 0,
        domain: story.domain ?? domainFromUrl(story.url),
        summary: undefined,
        summaryLoading: true,
      }));
      setItems((current) => append ? [...current, ...processed] : processed);
      setCurrentPage(page);
      setHasMore(Boolean(pagination.hasNext));
    } catch (requestError) {
      console.error('Failed to fetch stories', requestError);
      if (!append) setError('We couldn’t load the feed right now.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [source]);

  useEffect(() => { void fetchStories(); }, [fetchStories]);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    source,
    requestSummary: (story: StoryItem) => {
      if (requestedSummaries.current.has(story.id) || !story.url) return;
      requestedSummaries.current.add(story.id);
      void fetchSummaries([story]);
    },
    setSource: (nextSource: FeedSource) => { setItems([]); setLoading(true); setCurrentPage(1); setHasMore(true); setSource(nextSource); },
    loadMore: () => { if (!loading && !loadingMore && hasMore) void fetchStories(currentPage + 1, true); },
    refresh: () => void fetchStories(1),
  };
}
