import { useState, useEffect } from "react";
import axios from "axios";
import { fallbackSummarize, domainFromUrl } from "../../shared/helpers";

export function useStoryData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || "https://reed-jhcj.onrender.com";

        const res = await axios.get(`${apiUrl}/foryou/new?limit=10`);
        const stories = res.data.map((s) => ({
          ...s,
          domain: domainFromUrl(s.url),
          summary: fallbackSummarize(s.title, s.url),
        }));

        setItems(stories);

        const summaryPromises = stories.map(async (story) => {
          if (!story.url) return story;

          try {
            const sumRes = await axios.get(`${apiUrl}/summarize`, {
              params: { url: story.url },
              timeout: 10000,
            });
            return { ...story, summary: sumRes.data.summary };
          } catch (err) {
            console.error("Failed to summarize:", story.url, err);
            return story;
          }
        });

        const storiesWithSummaries = await Promise.all(summaryPromises);
        setItems(storiesWithSummaries);
      } catch (err) {
        console.error("Failed to fetch stories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return { items, loading };
}