import { useEffect, useState } from 'react';
import { GithubLogo, Star } from '@phosphor-icons/react';

const REPO_URL = 'https://github.com/xeureka/Reed';
const CACHE_KEY = 'reed:github-stars';
const CACHE_TTL = 60 * 60 * 1000;

type CachedStars = { count: number; expiresAt: number };

export function GitHubStar() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cached: CachedStars | null = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as CachedStars | null; } catch { /* storage can be unavailable */ }
    if (cached && cached.expiresAt > Date.now()) { setStars(cached.count); return; }
    fetch('https://api.github.com/repos/xeureka/Reed', { headers: { Accept: 'application/vnd.github+json' } })
      .then((response) => response.ok ? response.json() as Promise<{ stargazers_count?: number }> : null)
      .then((data) => {
        if (typeof data?.stargazers_count !== 'number') return;
        setStars(data.stargazers_count);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ count: data.stargazers_count, expiresAt: Date.now() + CACHE_TTL }));
      })
      .catch(() => undefined);
  }, []);

  return <a className="github-star" href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label={`Star Reed on GitHub${stars === null ? '' : `, ${stars} stars`}`}>
    <GithubLogo className="github-star-github" size={17} weight="fill" aria-hidden="true" />
    <span className="github-star-label">STAR</span>
    <span className="github-star-divider" aria-hidden="true" />
    <Star className="github-star-icon" size={15} weight="fill" aria-hidden="true" />
    {stars !== null && <span className="github-star-count">{stars.toLocaleString()}</span>}
  </a>;
}
