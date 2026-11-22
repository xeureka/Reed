import { createHash } from "node:crypto";
import { lookup } from "node:dns/promises";
import axios from "axios";
import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export type SummaryResult = {
    summary: string;
    provider: "gemini" | "extractive";
    cached: boolean;
};
type Article = {
    title: string;
    text: string;
    leadImage?: string;
    readingTime: number;
};
type CachedSummary = {
    summary: string;
    provider: SummaryResult["provider"];
    expiresAt: number;
};

const cache = new Map<string, CachedSummary>();
const inFlight = new Map<string, Promise<SummaryResult>>();
const CACHE_TTL = 24 * 60 * 60_000;
const MAX_CACHE_ENTRIES = 500;
const MAX_TEXT = 4_000;
const MAX_BYTES = 2_000_000;
const USER_AGENT = "Reed/1.0 article-reader (+https://github.com/xeureka/Reed)";
let fallbackLogged = false;
let active = 0;
const queue: Array<() => void> = [];

function runNext() {
    while (active < 3 && queue.length) {
        active += 1;
        const task = queue.shift();
        task?.();
    }
}
function limited<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        queue.push(() => {
            void task()
                .then(resolve, reject)
                .finally(() => {
                    active -= 1;
                    runNext();
                });
        });
        runNext();
    });
}

function isPrivateIp(ip: string): boolean {
    return (
        ip === "127.0.0.1" ||
        ip === "::1" ||
        ip === "0.0.0.0" ||
        ip.startsWith("10.") ||
        ip.startsWith("192.168.") ||
        ip.startsWith("169.254.") ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) ||
        ip.startsWith("fc") ||
        ip.startsWith("fd") ||
        ip.startsWith("fe80:")
    );
}

async function assertSafeUrl(value: string): Promise<URL> {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname)
        throw new Error("Only public http(s) URLs are allowed");
    if (isPrivateIp(url.hostname))
        throw new Error("Private addresses are not allowed");
    const addresses = await lookup(url.hostname, { all: true });
    if (addresses.some((address) => isPrivateIp(address.address)))
        throw new Error("Private addresses are not allowed");
    return url;
}

async function fetchArticle(value: string): Promise<Article> {
    const url = await assertSafeUrl(value);
    const response = await axios.get<string>(url.toString(), {
        timeout: 5_000,
        maxContentLength: MAX_BYTES,
        maxBodyLength: MAX_BYTES,
        maxRedirects: 0,
        responseType: "text",
        headers: {
            Accept: "text/html,application/xhtml+xml",
            "User-Agent": USER_AGENT,
        },
    });
    const contentType = String(response.headers["content-type"] ?? "");
    if (!contentType.includes("html")) throw new Error("Article is not HTML");
    const { document } = parseHTML(response.data);
    const parsed = new Readability(document).parse();
    if (!parsed?.textContent?.trim())
        throw new Error("No readable article text");
    const text = parsed.textContent
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, MAX_TEXT);
    const parsedArticle = parsed as typeof parsed & {
        lead_image?: string;
        leadImage?: string;
    };
    return {
        title: parsed.title ?? "",
        text,
        leadImage: parsedArticle.lead_image ?? parsedArticle.leadImage,
        readingTime: Math.max(1, Math.ceil(text.split(/\s+/).length / 200)),
    };
}

function extractiveSummary(text: string): string {
    const sentences =
        text
            .match(/[^.!?]+[.!?]+/g)
            ?.map((sentence) => sentence.trim())
            .filter((sentence) => sentence.length > 35) ?? [];
    if (!sentences.length) return text.slice(0, 420).trim();
    const frequencies = (text.toLowerCase().match(/[a-z]{4,}/g) ?? []).reduce<
        Record<string, number>
    >((result, word) => {
        result[word] = (result[word] ?? 0) + 1;
        return result;
    }, {});
    return sentences
        .map((sentence, index) => ({
            sentence,
            index,
            score:
                (sentence.toLowerCase().match(/[a-z]{4,}/g) ?? []).reduce(
                    (score, word) => score + (frequencies[word] ?? 0),
                    0,
                ) / sentence.length,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .sort((a, b) => a.index - b.index)
        .map((item) => item.sentence)
        .join(" ")
        .slice(0, 520)
        .trim();
}

async function geminiSummary(text: string): Promise<string | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    try {
        const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash-lite";
        const response = await axios.post<{
            candidates?: Array<{
                content?: { parts?: Array<{ text?: string }> };
            }>;
        }>(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Summarize this article in 2-3 short sentences for developers. Plain text, no fluff.\n\n${text}`,
                            },
                        ],
                    },
                ],
                generationConfig: { maxOutputTokens: 120, temperature: 0.2 },
            },
            { timeout: 8_000 },
        );
        return (
            response.data.candidates?.[0]?.content?.parts
                ?.map((part) => part.text ?? "")
                .join("")
                .trim() || null
        );
    } catch {
        return null;
    }
}

export async function summarizeUrl(
    value: string,
    fallbackText = "",
): Promise<SummaryResult> {
    const key = createHash("sha256").update(value).digest("hex");
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
        cache.delete(key);
        cache.set(key, cached);
        return {
            summary: cached.summary,
            provider: cached.provider,
            cached: true,
        };
    }
    const existing = inFlight.get(key);
    if (existing) return existing;
    const task = limited(async () => {
        let text = fallbackText
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, MAX_TEXT);
        try {
            text = (await fetchArticle(value)).text || text;
        } catch {
            /* use source excerpt */
        }
        if (!text)
            text =
                "This source does not expose a readable preview. Open the original article to continue.";
        const ai = await geminiSummary(text);
        const provider = ai ? "gemini" : "extractive";
        if (!ai && !process.env.GEMINI_API_KEY && !fallbackLogged) {
            console.info(
                "GEMINI_API_KEY is missing; extractive summary fallback is active.",
            );
            fallbackLogged = true;
        }
        const result = {
            summary: ai ?? extractiveSummary(text),
            provider,
            cached: false,
        } satisfies SummaryResult;
        cache.delete(key);
        cache.set(key, {
            summary: result.summary,
            provider,
            expiresAt: Date.now() + CACHE_TTL,
        });
        while (cache.size > MAX_CACHE_ENTRIES)
            cache.delete(cache.keys().next().value as string);
        return result;
    });
    inFlight.set(key, task);
    try {
        return await task;
    } finally {
        inFlight.delete(key);
    }
}
