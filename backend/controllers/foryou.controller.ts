import type { Request, Response } from "express";
import axios from "axios";

const base_url = "https://hacker-news.firebaseio.com/v0";

type HNItem = {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  time: number;
  kids?: number[];
  descendants?: number;
};

function extractDomain(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
async function fetcher(jsonFileName: string, req: Request, res: Response) {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10; 

  try {
    const { data: storyIds } = await axios.get<number[]>(
      `${base_url}/${jsonFileName}.json`
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const pageIds = storyIds.slice(startIndex, endIndex);

    const stories = await Promise.all(
      pageIds.map(async (id) => {
        const { data } = await axios.get<HNItem>(`${base_url}/item/${id}.json`);
        return {
          id: data.id,
          title: data.title,
          url: data.url ?? `https://news.ycombinator.com/item?id=${data.id}`,
          by: data.by,
          score: data.score,
          time: data.time,
          summary: undefined,
          domain: extractDomain(data.url),
          comment_count: data.descendants ?? data.kids?.length ?? 0,
        };
      })
    );

    res.json({
      stories,
      pagination: {
        page,
        limit,
        totalItems: storyIds.length,
        totalPages: Math.ceil(storyIds.length / limit),
        hasNext: endIndex < storyIds.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching stories: ", error);
    return res.status(500).json({ message: "Error fetching stories." });
  }
}

export const fetchNewStories = async (req: Request, res: Response) => {
  await fetcher("newstories", req, res);
};

export const fetchTopStories = async (req: Request, res: Response) => {
  await fetcher("topstories", req, res);
};

export const fetchBestStories = async (req: Request, res: Response) => {
  await fetcher("beststories", req, res);
};

