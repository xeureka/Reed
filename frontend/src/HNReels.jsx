// src/HNReels.js
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";

/* ---------------------------- Helpers ----------------------------- */
function timeAgo(unixSeconds) {
  const diff = Math.max(0, Date.now() - unixSeconds * 1000);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

function domainFromUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function fallbackSummarize(title, url) {
  const d = domainFromUrl(url) || "source";
  return `Fetching summary... Open on ${d} or tap Read to view the full article.`;
}

async function shareLink(_title, url) {
  if (navigator.share) {
    try {
      await navigator.share({ url });
      return { ok: true };
    } catch {
      // user canceled or not available
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return { ok: true, copied: true };
  } catch {
    return { ok: false };
  }
}

/* ---------------------- Keyboard snap helper ---------------------- */
function useArrowKeySnap(containerRef, cardRefs) {
  useEffect(() => {
    function onKeyDown(e) {
      const container = containerRef.current;
      if (!container) return;
      const cards = cardRefs.map((r) => r.current).filter(Boolean);
      if (!cards.length) return;

      const containerTop = container.getBoundingClientRect().top;
      const distances = cards.map((c) =>
        Math.abs(c.getBoundingClientRect().top - containerTop)
      );
      const minDist = Math.min(...distances);
      let currentIndex = distances.indexOf(minDist);
      if (currentIndex === -1) currentIndex = 0;

      const scrollToIndex = (idx) => {
        const el = cards[idx];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, cards.length - 1);
        scrollToIndex(nextIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        scrollToIndex(prevIndex);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [containerRef, cardRefs]);
}

/* --------------------------- Components --------------------------- */
const ActionIcon = ({ label, onClick, children }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 px-2 py-1 rounded-2xl hover:bg-white/10 active:scale-95 transition"
    aria-label={label}
    title={label}
    type="button"
  >
    {children}
    <span className="text-[10px] opacity-70">{label}</span>
  </button>
);

const Icon = {
  External: (props) => (
    <svg viewBox="0 0 24 24" fill="none" width={28} height={28} {...props}>
      <path
        d="M14 3h7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14L21 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 14v7H3V3h7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Share: (props) => (
    <svg viewBox="0 0 24 24" fill="none" width={28} height={28} {...props}>
      <path
        d="M21 12l-8-5v3H3v4h10v3l8-5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Comment: (props) => (
    <svg viewBox="0 0 24 24" fill="none" width={28} height={28} {...props}>
      <path
        d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Points: (props) => (
    <svg viewBox="0 0 24 24" fill="none" width={16} height={16} {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 12h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const StoryCard = React.forwardRef(function StoryCard({ item }, ref) {
  const [copied, setCopied] = useState(false);
  const hnItemUrl = `https://news.ycombinator.com/item?id=${item.id}`;
  const domain = item.domain ?? domainFromUrl(item.url);
  const summary = item.summary || fallbackSummarize(item.title, item.url);

  const onShare = useCallback(async () => {
    const result = await shareLink(item.title, item.url || hnItemUrl);
    if (result.ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  }, [item.title, item.url, hnItemUrl]);

  return (
    <section ref={ref} className="h-screen w-full snap-start relative">
      <div className="absolute inset-0">
        <div className="w-full h-full animate-gradient bg-gradient-to-tr from-purple-700 via-pink-600 to-yellow-500 opacity-40" />
        <img
          src={`https://source.unsplash.com/random/800x1200/?technology,ai,abstract`}
          alt="background"
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-3">
        <div className="relative w-full max-w-[680px] h-[86vh] rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent">
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/10">
              {domain ?? "link"}
            </span>
            <span className="text-xs opacity-80">by {item.by}</span>
            <span className="text-xs opacity-60 ml-auto">
              {timeAgo(item.time)}
            </span>
          </div>
          <div className="absolute top-12 bottom-20 left-0 right-16 overflow-y-auto px-5 py-4 space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold leading-tight">
              {item.title}
            </h2>
            <div className="text-sm bg-white/10 p-3 rounded-xl backdrop-blur-md whitespace-pre-line leading-relaxed">
              {summary}
            </div>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
            <ActionIcon
              label="Read"
              onClick={() => window.open(item.url || hnItemUrl, "_blank")}
            >
              <Icon.External />
            </ActionIcon>
            <ActionIcon label={copied ? "Copied" : "Share"} onClick={onShare}>
              <Icon.Share />
            </ActionIcon>
            <ActionIcon
              label={`${item.descendants ?? 0} Comments`}
              onClick={() => window.open(hnItemUrl, "_blank")}
            >
              <Icon.Comment />
            </ActionIcon>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs opacity-80">
              <Icon.Points />
              <span>{item.score} points</span>
            </div>
            <div className="text-xs opacity-70">Use ↑ / ↓ to flip cards</div>
          </div>
        </div>
      </div>
    </section>
  );
});

/* ----------------------------- Main ------------------------------- */
export default function HNReels() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const cardRefs = useMemo(
    () => items.map(() => React.createRef()),
    [items]
  );

  useArrowKeySnap(containerRef, cardRefs);

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

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        Loading stories...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="font-semibold tracking-wide">Reed</div>
        <div className="text-xs opacity-80">
          TikTok-style feed for HN and Other blogs.
        </div>
      </div>
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {items.map((item, i) => (
          <StoryCard ref={cardRefs[i]} key={item.id} item={item} />
        ))}
        <div className="h-[12vh]" />
      </div>
    </div>
  );
}
