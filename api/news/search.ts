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

function normalizeText(value: string) {
  return value.toLowerCase().trim();
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

function articleMatchesQuery(article: NewsItem, query: string) {
  const normalizedQuery = normalizeText(query);

  const searchableText = normalizeText(
    [
      article.title,
      article.description,
      article.source,
      article.categories.join(" "),
    ].join(" ")
  );

  return searchableText.includes(normalizedQuery);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.NEWSDATA_API_KEY?.trim();

  if (!apiKey) {
    return res.status(500).json({
      message: "Server API key is missing",
      envKeys: Object.keys(process.env).filter(key => key.includes("NEWS")),
    });
  }

  try {
    const query = String(req.query.q || "").trim();
    const limit = Number(req.query.limit || "9");

    if (!query) {
      return res.status(400).json({ message: "Query parameter q is required" });
    }

    const params = new URLSearchParams({
      apikey: apiKey,
      language: "uk",
      country: "ua",
      size: "10",
    });

    const requestUrl = `${BASE_URL}?${params.toString()}`;

    console.log("SEARCH REQUEST URL:", requestUrl.replace(apiKey, "HIDDEN_KEY"));

    const response = await fetch(requestUrl);
    const rawText = await response.text();

    console.log("SEARCH EXTERNAL STATUS:", response.status);

    if (!response.ok) {
      return res.status(response.status).json({
        message: "External news API error",
        details: rawText,
      });
    }

    const data = JSON.parse(rawText) as NewsDataApiResponse;

    const allArticles = Array.isArray(data.results)
      ? data.results.map(mapArticle)
      : [];

    const filteredArticles = allArticles
      .filter(article => articleMatchesQuery(article, query))
      .slice(0, limit);

    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");

    return res.status(200).json({
      news: filteredArticles,
      meta: {
        found: filteredArticles.length,
        returned: filteredArticles.length,
        limit,
        page: 1,
      },
      nextPage: data.nextPage ?? null,
    });
  } catch (error) {
    console.error("SEARCH API ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}