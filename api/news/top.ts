import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_URL = "https://api.thenewsapi.com/v1/news/top";

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
    description: article.description || article.snippet || "",
    image: article.image_url || null,
    source: article.source,
    categories: article.categories || [],
    publishedAt: article.published_at,
    url: article.url,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.THENEWSAPI_KEY?.trim();

  console.log("ENV KEY EXISTS:", Boolean(apiKey));
  console.log("ENV KEY LENGTH:", apiKey?.length ?? 0);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!apiKey) {
    return res.status(500).json({
      message: "Server API key is missing",
      envKeys: Object.keys(process.env).filter(key => key.includes("NEWS")),
    });
  }

  try {
    const page = String(req.query.page || "1");
    const limit = String(req.query.limit || "10");
    const category = String(req.query.category || "general");
    const locale = String(req.query.locale || "us");
    const language = String(req.query.language || "en");

    const params = new URLSearchParams({
      api_token: apiKey,
      page,
      limit,
      locale,
      language,
    });

    if (category && category !== "all") {
      params.set("categories", category);
    }

    const requestUrl = `${BASE_URL}?${params.toString()}`;
    console.log("REQUEST URL:", requestUrl);

    const response = await fetch(requestUrl);
    const rawText = await response.text();

    console.log("EXTERNAL STATUS:", response.status);
    console.log("EXTERNAL BODY:", rawText);

    if (!response.ok) {
      return res.status(response.status).json({
        message: "External news API error",
        details: rawText,
      });
    }

    const data = JSON.parse(rawText);
    const articles = Array.isArray(data.data) ? data.data.map(mapArticle) : [];

    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");

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
    console.error("TOP API ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}