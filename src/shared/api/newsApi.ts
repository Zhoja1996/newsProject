import axios from 'axios';

export type NewsItem = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  source: string;
  categories: string[];
  publishedAt: string;
  url: string;
};

export type NewsResponse = {
  news: NewsItem[];
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
};

type GetTopNewsParams = {
  page?: number;
  limit?: number;
  category?: string;
  locale?: string;
  language?: string;
};

type SearchNewsParams = {
  q: string;
  page?: number;
  limit?: number;
  locale?: string;
  language?: string;
};

export async function getTopNews(params: GetTopNewsParams = {}) {
  const response = await axios.get<NewsResponse>('/api/news/top', {
    params,
  });

  return response.data;
}

export async function searchNews(params: SearchNewsParams) {
  const response = await axios.get<NewsResponse>('/api/news/search', {
    params,
  });

  return response.data;
}