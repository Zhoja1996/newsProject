import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://api.thenewsapi.com/v1/news/all';

type TheNewsApiItem = {
  uuid: string;
  title: string;
  description: string | null;
  snippet?: string | null;
  url: string;
  image_url: string | null;
  published_at: string;
  source: string;
  categories: string[];
};

type NewsItem = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  source: string;
  categories: string[];
  publishedAt: string;
  url: string;
};

function mapArticle(article: TheNewsApiItem): NewsItem {
  return {
    id: article.uuid,
    title: article.title,
    description: article.description || article.snippet || '',
    image: article.image_url || null,
    source: article.source,
    categories: article.categories || [],
    publishedAt: article.published_at,
    url: article.url,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.THENEWSAPI_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'Server API key is missing' });
  }

  try {
    const query = String(req.query.q || '').trim();
    const page = String(req.query.page || '1');
    const limit = String(req.query.limit || '9');
    const locale = String(req.query.locale || 'us');
    const language = String(req.query.language || 'en');

    if (!query) {
      return res.status(400).json({ message: 'Query parameter q is required' });
    }

    const params = new URLSearchParams({
      api_token: apiKey,
      search: query,
      search_fields: 'title,description,keywords',
      sort: 'published_at',
      page,
      limit,
      locale,
      language,
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: 'External news API error',
        details: errorText,
      });
    }

    const data = await response.json();

    const articles = Array.isArray(data.data) ? data.data.map(mapArticle) : [];

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');

    return res.status(200).json({
      news: articles,
      meta: {
        found: data.meta?.found ?? 0,
        returned: data.meta?.returned ?? articles.length,
        limit: data.meta?.limit ?? Number(limit),
        page: data.meta?.page ?? Number(page),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}