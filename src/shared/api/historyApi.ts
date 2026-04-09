import { supabase } from "@/shared/api/supabaseClient";
import { INews } from "@/entities/news";

const getCurrentUserId = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user?.id ?? null;
};

export const addToHistory = async (news: INews) => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return;
  }

  const { data: existing } = await supabase
    .from("view_history")
    .select("id")
    .eq("user_id", userId)
    .eq("news_id", news.id)
    .maybeSingle();

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

export const getHistory = async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

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

export const removeFromHistory = async (newsId: string) => {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const { error } = await supabase
    .from("view_history")
    .delete()
    .eq("user_id", userId)
    .eq("news_id", newsId);

  if (error) {
    throw error;
  }
};