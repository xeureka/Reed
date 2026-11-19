import express, { type Request, type Response } from 'express';
import { SOURCE_KEYS, getFeed } from '../services/feed.service';
import { summarizeUrl } from '../services/summary.service';

const router = express.Router();

// Return a cached, normalized, deduplicated feed page.
router.get('/feed', async (req: Request, res: Response) => {
  const source = typeof req.query.source === 'string' && req.query.source ? req.query.source : 'all';
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 10));
  if (!SOURCE_KEYS.includes(source)) return res.status(400).json({ error: 'Unknown feed source', sources: SOURCE_KEYS });
  try {
    const result = await getFeed(source, page, limit);
    return res.json({ stories: result.stories, pagination: { page, limit, totalItems: result.totalItems, totalPages: Math.ceil(result.totalItems / limit), hasNext: page * limit < result.totalItems, hasPrev: page > 1 }, sources: SOURCE_KEYS });
  } catch (error) {
    console.warn(`Feed source ${source} failed`, error);
    return res.status(502).json({ error: 'All requested feed sources failed', source });
  }
});

// Return a cached Gemini or local extractive summary for one article URL.
router.get('/summary', async (req: Request, res: Response) => {
  const url = typeof req.query.url === 'string' ? req.query.url : '';
  if (!url) return res.status(400).json({ error: 'URL is required' });
  try {
    const result = await summarizeUrl(url, typeof req.query.fallback === 'string' ? req.query.fallback : '');
    return res.json(result);
  } catch (error) {
    console.warn('Summary failed', error);
    return res.status(200).json({ summary: 'This story is ready to read at the original source.', provider: 'extractive', cached: false });
  }
});

export default router;
