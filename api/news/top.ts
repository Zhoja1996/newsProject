import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_URL = "https://newsdata.io/api/1/latest";

type NewsDataApiItem = {
  article_id: string;
  title: string | null;
  description: string | null;
  content: string | null;
  link: string | null;
  image_url: string | null;
  source_name: string | null;
  category: string[] | null;
  pubDate: string | null;
};

type NewsDataApiResponse = {
  status: string;
  totalResults?: number;
  results?: NewsDataApiItem[];
  nextPage?: string;
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

const categoryMap: Record<string, string> = {
  general: "top",
  science: "science",
  sports: "sports",
  business: "business",
  health: "health",
  entertainment: "entertainment",
  tech: "technology",
  technology: "technology",
  politics: "politics",
  food: "food",
  travel: "tourism",
  tourism: "tourism",
};

function mapCategory(category: string) {
  return categoryMap[category] ?? category;
}

function mapArticle(article: NewsDataApiItem): NewsItem {
  return {
    id: article.article_id,
    title: article.title || "Без назви",
    description: article.description || "",
    image: article.image_url || null,
    source: article.source_name || "Невідоме джерело",
    categories: article.category || [],
    publishedAt: article.pubDate || "",
    url: article.link || "",
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.NEWSDATA_API_KEY?.trim();

  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  if (!apiKey) return res.status(500).json({ message: "Server API key is missing" });

  try {
    const limit = Number(req.query.limit) || 10;
    const category = String(req.query.category || "all");
    const nextPageToken = String(req.query.nextPage || "");

    const params = new URLSearchParams({
      apikey: apiKey,
      language: "uk",
      country: "ua",
      size: limit > 10 ? "10" : String(limit), // free plan limit
    });

    if (category && category !== "all") params.set("category", mapCategory(category));
    if (nextPageToken) params.set("page", nextPageToken);

    const requestUrl = `${BASE_URL}?${params.toString()}`;
    console.log("TOP REQUEST URL:", requestUrl.replace(apiKey, "HIDDEN_KEY"));

    const response = await fetch(requestUrl);
    const rawText = await response.text();

    if (!response.ok)
      return res.status(response.status).json({ message: "External news API error", details: rawText });

    const data = JSON.parse(rawText) as NewsDataApiResponse;
    const articles = Array.isArray(data.results) ? data.results.map(mapArticle) : [];

    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");

    return res.status(200).json({
      news: articles,
      meta: {
        found: data.totalResults ?? articles.length,
        returned: articles.length,
        limit: limit > 10 ? 10 : limit,
        page: nextPageToken ? Number(nextPageToken) : 1,
      },
      nextPage: data.nextPage ?? null,
    });
  } catch (error) {
    console.error("TOP API ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}