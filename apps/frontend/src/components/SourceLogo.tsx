type SourceName = 'Hacker News' | 'Lobsters' | 'DEV Community' | 'Reddit' | 'Stack Overflow';

const sourceClass: Record<SourceName, string> = {
  'Hacker News': 'source-logo-hn',
  Lobsters: 'source-logo-lobsters',
  'DEV Community': 'source-logo-dev',
  Reddit: 'source-logo-reddit',
  'Stack Overflow': 'source-logo-stack-overflow',
};

function SourceMark({ source }: { source: SourceName }) {
  if (source === 'Hacker News') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="2" fill="#ff6600" /><path d="M7 6h3.1l1.9 4.1L13.9 6H17l-3.6 6.3V18h-2.8v-5.7L7 6Z" fill="#fff" /></svg>;
  if (source === 'Lobsters') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c-2.3 0-3.8 1.7-3.8 3.8 0 1.2.6 2.2 1.5 2.9L7 14.4l-2.2-.8-1.4 1.2 3.4 1.6 2.5-1.1c.1.9.4 1.8 1 2.5l-3 2.1 1 1.2 3.2-1.4 1.5.3 1.5-.3 3.2 1.4 1-1.2-3-2.1c.6-.7.9-1.6 1-2.5l2.5 1.1 3.4-1.6-1.4-1.2-2.2.8-2.7-2.7c.9-.7 1.5-1.7 1.5-2.9C15.8 6.7 14.3 5 12 5Z" fill="currentColor" /><path d="M8 5 5 3M16 5l3-2M9 9H5M15 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
  if (source === 'DEV Community') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="3" fill="#111" /><text x="12" y="15" fill="#fff" fontFamily="Arial,sans-serif" fontSize="6.5" fontWeight="800" textAnchor="middle">DEV</text></svg>;
  if (source === 'Reddit') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="7.2" fill="currentColor" /><circle cx="9.4" cy="12.4" r="1" fill="var(--paper)" /><circle cx="14.6" cy="12.4" r="1" fill="var(--paper)" /><path d="M9.5 15c1.4 1 3.6 1 5 0M12 6.2l1-3.2 3.1 1.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="16.4" cy="4.2" r="1.2" fill="currentColor" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16v2H4zM5 15h14v2H5zM6 11h13v2H6zM7 7h12v2H7zM8 3h11v2H8zM17.2 8.2l1.4-1.4 3.4 3.4-1.4 1.4z" fill="currentColor" /></svg>;
}

export function SourceLogo({ source }: { source: SourceName }) {
  return <span className={`source-brand ${sourceClass[source]}`} aria-label={source} title={source}>
    <SourceMark source={source} /><span>{source === 'DEV Community' ? 'DEV' : source}</span>
  </span>;
}
