export function domainFromUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export function fallbackSummarize(title, url) {
  const d = domainFromUrl(url) || "source";
  return `Fetching summary... Open on ${d} or tap Read to view the full article.`;
}

export async function shareLink(_title, url) {
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