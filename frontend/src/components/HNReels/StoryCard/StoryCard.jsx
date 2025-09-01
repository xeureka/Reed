import React, { useState, useCallback } from "react";
import { domainFromUrl, fallbackSummarize, shareLink } from "../../shared/helpers";
import { timeAgo } from "../../shared/timeAgo";
import { ActionIcon } from "./ActionIcon";
import { Icon } from "./Icons";

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

export default StoryCard;