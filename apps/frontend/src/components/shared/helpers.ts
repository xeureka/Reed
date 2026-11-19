import type { ShareResult } from '../../types';

export function domainFromUrl(url: string): string | undefined {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export function fallbackSummarize(title: string, url: string): string {
  const d = domainFromUrl(url) || "source";
  return `A new story from ${d} about ${title.toLowerCase()}. Open the original to read the full piece.`;
}

function cleanText(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
}

export function summarizeStory(title: string, url: string, text?: string): string {
  const articleText = text ? cleanText(text) : '';
  if (articleText.length > 80) {
    const sentences = articleText.match(/[^.!?]+[.!?]+/g)?.slice(0, 2).join(' ').trim();
    if (sentences && sentences.length > 40) return sentences.length > 300 ? `${sentences.slice(0, 297).trim()}…` : sentences;
  }
  return fallbackSummarize(title, url);
}

export async function shareLink(title: string, url: string): Promise<ShareResult> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text: title, url });
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
