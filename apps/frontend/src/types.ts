export interface StoryItem {
  id: number;
  title: string;
  url: string;
  source?: string;
  author?: string;
  publishedAt?: string;
  by: string;
  time: number;
  score: number;
  descendants?: number;
  comment_count?: number;
  domain?: string;
  summary?: string;
  summaryProvider?: 'gemini' | 'extractive';
  summaryLoading?: boolean;
  type?: string;
  kids?: number[];
  parent?: number;
  text?: string;
  comments?: number;
}

export interface ShareResult {
  ok: boolean;
  copied?: boolean;
}

export interface Pagination {
  hasNext: boolean;
  page: number;
  limit: number;
}

export interface StoryDataResponse {
  stories: StoryItem[];
  pagination: Pagination;
}

export interface SummaryResponse {
  summary: string;
  provider?: 'gemini' | 'extractive';
  cached?: boolean;
}
