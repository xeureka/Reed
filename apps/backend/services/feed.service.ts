import axios from "axios";
import * as cheerio from "cheerio";

export type Story = {
    id: number;
    title: string;
    url: string;
    source: string;
    author: string;
    publishedAt: string;
    score?: number;
    comments?: number;
    by: string;
    time: number;
    descendants: number;
    domain?: string;
    text?: string;
};

type SourceKey =
    "hacker-news" | "lobsters" | "dev" | "hashnode" | "reddit" | string;
type CacheEntry = { expiresAt: number; stories: Story[]; totalItems: number };

export const RSS_SOURCES = [
    {
        key: "cloudflare",
        name: "Cloudflare",
        url: "https://blog.cloudflare.com/rss/",
    },
    {
        key: "github-blog",
        name: "GitHub Blog",
        url: "https://github.blog/feed/",
    },
    { key: "vercel", name: "Vercel", url: "https://vercel.com/atom" },
    {
        key: "netflix-tech",
        name: "Netflix Tech Blog",
        url: "https://netflixtechblog.com/feed",
    },
    {
        key: "stackoverflow-blog",
        name: "Stack Overflow Blog",
        url: "https://stackoverflow.blog/feed/",
    },
    {
        key: "mozilla-hacks",
        name: "Mozilla Hacks",
        url: "https://hacks.mozilla.org/feed/",
    },
] as const;

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60_000;
const REQUEST_TIMEOUT = 5_000;

const hashId = (value: string): number => {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1)
        hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
    return Math.abs(hash) || Date.now();
};

export function canonicalUrl(value: string): string {
    try {
        const url = new URL(value);
        url.hash = "";
        [...url.searchParams.keys()]
            .filter((key) => key.toLowerCase().startsWith("utm_"))
            .forEach((key) => url.searchParams.delete(key));
        return url.toString().replace(/\/$/, "");
    } catch {
        return value.trim();
    }
}

const domainFromUrl = (value: string): string | undefined => {
    try {
        return new URL(value).hostname.replace(/^www\./, "");
    } catch {
        return undefined;
    }
};
const story = (
    input: Omit<Story, "by" | "time" | "descendants"> & { comments?: number },
): Story => ({
    ...input,
    by: input.author,
    time:
        Math.floor(new Date(input.publishedAt).getTime() / 1000) ||
        Math.floor(Date.now() / 1000),
    descendants: input.comments ?? 0,
});

async function getJson<T>(
    url: string,
    headers?: Record<string, string>,
): Promise<T> {
    return (await axios.get<T>(url, { timeout: REQUEST_TIMEOUT, headers }))
        .data;
}

async function fetchHackerNews(
    kind: "newstories" | "topstories" | "beststories" = "newstories",
): Promise<Story[]> {
    const ids = await getJson<number[]>(
        `https://hacker-news.firebaseio.com/v0/${kind}.json`,
    );
    const results = await Promise.allSettled(
        ids
            .slice(0, 40)
            .map((id) =>
                getJson<{
                    id: number;
                    title?: string;
                    url?: string;
                    by?: string;
                    score?: number;
                    time?: number;
                    descendants?: number;
                    kids?: number[];
                    text?: string;
                }>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`),
            ),
    );
    return results.flatMap((result) => {
        if (result.status !== "fulfilled" || !result.value.title) return [];
        const item = result.value;
        const title = item.title;
        if (!title) return [];
        const url =
            item.url ?? `https://news.ycombinator.com/item?id=${item.id}`;
        return [
            story({
                id: item.id,
                title,
                url,
                source: "Hacker News",
                author: item.by ?? "unknown",
                publishedAt: new Date((item.time ?? 0) * 1000).toISOString(),
                score: item.score ?? 0,
                comments: item.descendants ?? item.kids?.length ?? 0,
                domain: domainFromUrl(url),
                text: item.text,
            }),
        ];
    });
}

async function fetchLobsters(): Promise<Story[]> {
    const items = await getJson<
        Array<{
            short_id: string;
            title: string;
            url: string;
            submitter_user?: string;
            score?: number;
            comment_count?: number;
            created_at: string;
            description?: string;
        }>
    >("https://lobste.rs/hottest.json");
    return items
        .slice(0, 30)
        .map((item) =>
            story({
                id: hashId(`lobsters:${item.short_id}`),
                title: item.title,
                url: item.url,
                source: "Lobsters",
                author: item.submitter_user ?? "lobsters",
                publishedAt: item.created_at,
                score: item.score ?? 0,
                comments: item.comment_count ?? 0,
                domain: domainFromUrl(item.url),
                text: item.description,
            }),
        );
}

async function fetchDev(): Promise<Story[]> {
    const items = await getJson<
        Array<{
            id: number;
            title: string;
            url: string;
            user?: { name?: string };
            positive_reactions_count?: number;
            comments_count?: number;
            published_at: string;
            description?: string;
        }>
    >("https://dev.to/api/articles?per_page=30&top=7");
    return items.map((item) =>
        story({
            id: hashId(`dev:${item.id}`),
            title: item.title,
            url: item.url,
            source: "DEV Community",
            author: item.user?.name ?? "dev.to",
            publishedAt: item.published_at,
            score: item.positive_reactions_count ?? 0,
            comments: item.comments_count ?? 0,
            domain: "dev.to",
            text: item.description,
        }),
    );
}

async function fetchHashnode(): Promise<Story[]> {
    const query = `query { posts(first: 30) { edges { node { id title url brief publishedAt author { username } reactionCount responseCount } } } }`;
    const payload = await axios.post<{
        data?: {
            posts?: {
                edges?: Array<{
                    node: {
                        id: string;
                        title: string;
                        url: string;
                        brief?: string;
                        publishedAt: string;
                        author?: { username?: string };
                        reactionCount?: number;
                        responseCount?: number;
                    };
                }>;
            };
        };
    }>(
        "https://gql.hashnode.com",
        { query },
        {
            timeout: REQUEST_TIMEOUT,
            headers: { "Content-Type": "application/json" },
        },
    );
    return (payload.data.data?.posts?.edges ?? []).map(({ node }) =>
        story({
            id: hashId(`hashnode:${node.id}`),
            title: node.title,
            url: node.url,
            source: "Hashnode",
            author: node.author?.username ?? "Hashnode",
            publishedAt: node.publishedAt,
            score: node.reactionCount ?? 0,
            comments: node.responseCount ?? 0,
            domain: domainFromUrl(node.url),
            text: node.brief,
        }),
    );
}

async function fetchRss(
    config: (typeof RSS_SOURCES)[number],
): Promise<Story[]> {
    const xml = await getJson<string>(config.url, {
        Accept: "application/rss+xml, application/atom+xml, text/xml",
        "User-Agent": "Reed/1.0 feed-reader",
    });
    const $ = cheerio.load(xml, { xmlMode: true });
    return $("item, entry")
        .slice(0, 20)
        .map((index, element) => {
            const node = $(element);
            const url =
                node.find("link").first().attr("href") ??
                node.find("link").first().text().trim();
            const title = node.find("title").first().text().trim();
            const description = node
                .find("description, summary, content\\:encoded")
                .first()
                .text()
                .trim();
            const publishedAt =
                node
                    .find("pubDate, published, updated")
                    .first()
                    .text()
                    .trim() || new Date().toISOString();
            const author =
                node
                    .find("dc\\:creator, author, creator")
                    .first()
                    .text()
                    .trim() || config.name;
            if (!url || !title) return null;
            return story({
                id: hashId(`${config.key}:${url}:${index}`),
                title,
                url,
                source: config.name,
                author,
                publishedAt,
                domain: domainFromUrl(url),
                text: description.replace(/<[^>]+>/g, " "),
            });
        })
        .get()
        .filter((item): item is Story => item !== null);
}

async function fetchReddit(): Promise<Story[]> {
    const payload = await getJson<{
        data?: {
            children?: Array<{
                data: {
                    id: string;
                    title: string;
                    url?: string;
                    permalink: string;
                    author?: string;
                    score?: number;
                    num_comments?: number;
                    created_utc: number;
                    selftext?: string;
                    domain?: string;
                };
            }>;
        };
    }>("https://www.reddit.com/r/programming/hot.json?limit=30", {
        "User-Agent": "Reed/1.0 (+https://github.com/xeureka/Reed)",
    });
    return (payload.data?.children ?? []).map(({ data: item }) => {
        const url = item.url ?? `https://www.reddit.com${item.permalink}`;
        return story({
            id: hashId(`reddit:${item.id}`),
            title: item.title,
            url,
            source: "Reddit",
            author: item.author ?? "reddit",
            publishedAt: new Date(item.created_utc * 1000).toISOString(),
            score: item.score ?? 0,
            comments: item.num_comments ?? 0,
            domain: item.domain ?? domainFromUrl(url),
            text: item.selftext,
        });
    });
}

const adapters: Record<string, () => Promise<Story[]>> = {
    "hacker-news": fetchHackerNews,
    "hacker-news-top": () => fetchHackerNews("topstories"),
    "hacker-news-best": () => fetchHackerNews("beststories"),
    lobsters: fetchLobsters,
    dev: fetchDev,
    hashnode: fetchHashnode,
    reddit: fetchReddit,
    ...Object.fromEntries(
        RSS_SOURCES.map((source) => [source.key, () => fetchRss(source)]),
    ),
};

export const SOURCE_KEYS = ["all", ...Object.keys(adapters)];

export async function getFeed(
    source = "all",
    page = 1,
    limit = 10,
): Promise<{ stories: Story[]; totalItems: number }> {
    const key = `${source}:${page}:${limit}`;
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now())
        return { stories: cached.stories, totalItems: cached.totalItems };
    const selected =
        source === "all"
            ? Object.entries(adapters)
            : [[source, adapters[source]] as const];
    const results = await Promise.allSettled(
        selected.flatMap(([, adapter]) => (adapter ? [adapter()] : [])),
    );
    if (
        results.length === 0 ||
        results.every((result) => result.status === "rejected")
    )
        throw new Error(`No stories available for source: ${source}`);
    const unique = new Map<string, Story>();
    results.forEach((result) => {
        if (result.status === "fulfilled")
            result.value.forEach((item) =>
                unique.set(canonicalUrl(item.url), item),
            );
    });
    const sorted = [...unique.values()].sort(
        (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    );
    const start = Math.max(0, (page - 1) * limit);
    const response = {
        stories: sorted.slice(start, start + limit),
        totalItems: sorted.length,
    };
    cache.set(key, { ...response, expiresAt: Date.now() + CACHE_TTL });
    return response;
}
