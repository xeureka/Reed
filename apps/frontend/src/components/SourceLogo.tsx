type SourceName = 'Hacker News' | 'Lobsters' | 'DEV Community' | 'Hashnode' | 'Reddit' | 'Stack Overflow' | 'Cloudflare' | 'GitHub' | 'Vercel' | 'Netflix' | 'SO Blog' | 'Mozilla';

const sourceClass: Record<SourceName, string> = {
  'Hacker News': 'source-logo-hn',
  Lobsters: 'source-logo-lobsters',
  'DEV Community': 'source-logo-dev',
  Hashnode: 'source-logo-hashnode',
  Reddit: 'source-logo-reddit',
  'Stack Overflow': 'source-logo-stack-overflow',
  Cloudflare: 'source-logo-cloudflare',
  GitHub: 'source-logo-github',
  Vercel: 'source-logo-vercel',
  Netflix: 'source-logo-netflix',
  'SO Blog': 'source-logo-so-blog',
  Mozilla: 'source-logo-mozilla',
};

function SourceMark({ source }: { source: SourceName }) {
  if (source === 'Hacker News') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="2" fill="#ff6600" /><path d="M7 6h3.1l1.9 4.1L13.9 6H17l-3.6 6.3V18h-2.8v-5.7L7 6Z" fill="#fff" /></svg>;
  if (source === 'Lobsters') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c-2.3 0-3.8 1.7-3.8 3.8 0 1.2.6 2.2 1.5 2.9L7 14.4l-2.2-.8-1.4 1.2 3.4 1.6 2.5-1.1c.1.9.4 1.8 1 2.5l-3 2.1 1 1.2 3.2-1.4 1.5.3 1.5-.3 3.2 1.4 1-1.2-3-2.1c.6-.7.9-1.6 1-2.5l2.5 1.1 3.4-1.6-1.4-1.2-2.2.8-2.7-2.7c.9-.7 1.5-1.7 1.5-2.9C15.8 6.7 14.3 5 12 5Z" fill="currentColor" /><path d="M8 5 5 3M16 5l3-2M9 9H5M15 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
  if (source === 'DEV Community') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="3" fill="#111" /><text x="12" y="15" fill="#fff" fontFamily="Arial,sans-serif" fontSize="6.5" fontWeight="800" textAnchor="middle">DEV</text></svg>;
  if (source === 'Hashnode') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.1 8.1 8.2 4a5.4 5.4 0 0 1 7.6 0l4.1 4.1a5.4 5.4 0 0 1 0 7.6L15.8 20a5.4 5.4 0 0 1-7.6 0l-4.1-4.1a5.4 5.4 0 0 1 0-7.8Z" fill="#2962ff" /><circle cx="12" cy="12" r="3" fill="#fff" /></svg>;
  if (source === 'Reddit') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="7.2" fill="currentColor" /><circle cx="9.4" cy="12.4" r="1" fill="var(--paper)" /><circle cx="14.6" cy="12.4" r="1" fill="var(--paper)" /><path d="M9.5 15c1.4 1 3.6 1 5 0M12 6.2l1-3.2 3.1 1.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="16.4" cy="4.2" r="1.2" fill="currentColor" /></svg>;
  if (source === 'Stack Overflow' || source === 'SO Blog') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16v2H4zM5 15h14v2H5zM6 11h13v2H6zM7 7h12v2H7zM8 3h11v2H8zM17.2 8.2l1.4-1.4 3.4 3.4-1.4 1.4z" fill="currentColor" /></svg>;
  if (source === 'Cloudflare') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15.5a4 4 0 0 1 4-4c.7-2.3 2.8-4 5.3-4 2.8 0 5.1 2.1 5.5 4.8A3.6 3.6 0 0 1 19 19H7.5A3.5 3.5 0 0 1 4 15.5Z" fill="currentColor" /><path d="M7 16h10" stroke="var(--paper)" strokeWidth="1.4" strokeLinecap="round" /></svg>;
  if (source === 'GitHub') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.4 4.6-4.6 4.9.3.3.6.8.6 1.7v2.5c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" fill="currentColor" /></svg>;
  if (source === 'Vercel') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 9 16H3L12 4Z" fill="currentColor" /></svg>;
  if (source === 'Netflix') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h3.2l5.6 12V3H18v18h-3.2L9.2 9v12H6V3Z" fill="#e50914" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V4h3.2v9.4L12 4h3.1v16H12v-9.5L8.1 20H5Z" fill="#ff7139" /></svg>;
}

export function SourceLogo({ source }: { source: SourceName }) {
  return <span className={`source-brand ${sourceClass[source]}`} aria-label={source} title={source}>
    <SourceMark source={source} /><span>{source === 'DEV Community' ? 'DEV' : source}</span>
  </span>;
}
