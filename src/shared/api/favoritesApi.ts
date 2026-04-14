import { supabase } from "@/shared/api/supabaseClient";
import { INews } from "@/entities/news";

export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const addFavorite = async (userId: string, news: INews) => {
  const { error } = await supabase.from("favorites").insert({
    user_id: userId,
    news_id: news.id,
    title: news.title,
    description: news.description,
    image: news.image,
    source: news.source,
    url: news.url,
    published_at: news.publishedAt,
  });

  if (error) {
    throw error;
  }
};

export const removeFavorite = async (userId: string, newsId: string) => {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("news_id", newsId);

  if (error) {
    throw error;
  }
};

export const isFavorite = async (userId: string, newsId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("news_id", newsId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
};