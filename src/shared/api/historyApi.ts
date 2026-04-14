import { supabase } from "@/shared/api/supabaseClient";
import { INews } from "@/entities/news";

export const addToHistory = async (userId: string, news: INews) => {
  const { data: existing, error: existingError } = await supabase
    .from("view_history")
    .select("id")
    .eq("user_id", userId)
    .eq("news_id", news.id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing?.id) {
    const { error } = await supabase
      .from("view_history")
      .update({
        title: news.title,
        description: news.description,
        image: news.image,
        source: news.source,
        url: news.url,
        published_at: news.publishedAt,
        viewed_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabase.from("view_history").insert({
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

export const getHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from("view_history")
    .select("*")
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const removeFromHistory = async (userId: string, newsId: string) => {
  const { error } = await supabase
    .from("view_history")
    .delete()
    .eq("user_id", userId)
    .eq("news_id", newsId);

  if (error) {
    throw error;
  }
};