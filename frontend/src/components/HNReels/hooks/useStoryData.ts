import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { fallbackSummarize, domainFromUrl } from "../../shared/helpers";
import type { StoryItem, StoryDataResponse, SummaryResponse } from "../../../types";

export function useStoryData() {
  const [items, setItems] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const apiUrl: string = import.meta.env.VITE_API_URL || "https://reed-jhcj.onrender.com";

  // Separate function to fetch summaries (runs in background)
  const fetchSummaries = useCallback(async (stories: StoryItem[], isLoadMore: boolean = false): Promise<void> => {
    try {
      const summaryPromises = stories.map(async (story) => {
        if (!story.url) return story;

        try {
          const sumRes = await axios.get<SummaryResponse>(`${apiUrl}/summarize`, {
            params: { url: story.url },
            timeout: 10000,
          });
          return { ...story, summary: sumRes.data.summary };
        } catch (err) {
          console.error("Failed to summarize:", story.url, err);
          return story;
        }
      });

      const storiesWithSummaries: StoryItem[] = await Promise.all(summaryPromises);

      // Update items with AI summaries
      if (isLoadMore) {
        setItems(prev => {
          const updatedItems = [...prev];
          storiesWithSummaries.forEach((updatedStory, index) => {
            const originalIndex = prev.length - stories.length + index;
            if (updatedItems[originalIndex]?.id === updatedStory.id) {
              updatedItems[originalIndex] = updatedStory;
            }
          });
          return updatedItems;
        });
      } else {
        setItems(storiesWithSummaries);
      }
    } catch (err) {
      console.error("Error in background summary fetch:", err);
    }
  }, [apiUrl]);

  // Function to fetch a specific page
  const fetchStories = useCallback(async (page: number = 1, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await axios.get<StoryDataResponse>(`${apiUrl}/foryou/new`, {
        params: {
          page: page,
          limit: 10  // configurable limit
        }
      });

      // backend returns { stories, pagination }
      const { stories, pagination } = res.data;

      // Process stories - add domain and fallback summary
      const processedStories: StoryItem[] = stories.map((s) => ({
        ...s,
        domain: domainFromUrl(s.url),
        summary: fallbackSummarize(s.title, s.url),
      }));

      // Update items based on whether were loading more or refreshing
      if (isLoadMore) {
        setItems(prev => [...prev, ...processedStories]);
      } else {
        setItems(processedStories);
      }

      // Update pagination state
      setHasMore(pagination.hasNext);
      setCurrentPage(page);

      // Fetch AI summaries for the new stories in background
      if (processedStories.length > 0) {
        fetchSummaries(processedStories, isLoadMore);
      }

    } catch (err) {
      console.error("Failed to fetch stories", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [apiUrl, fetchSummaries]);

  // Load initial page
  useEffect(() => {
    fetchStories(1, false);
  }, [fetchStories]);

  // Function to load next page
  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchStories(currentPage + 1, true);
    }
  }, [loading, loadingMore, hasMore, currentPage, fetchStories]);

  return {
    items,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refresh: (): void => { fetchStories(1, false); }
  };
}
