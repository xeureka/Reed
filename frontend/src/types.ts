export interface StoryItem {
  id: number;
  title: string;
  url: string;
  by: string;
  time: number;
  score: number;
  descendants?: number;
  domain?: string;
  summary?: string;
  type?: string;
  kids?: number[];
  parent?: number;
  text?: string;
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
}
