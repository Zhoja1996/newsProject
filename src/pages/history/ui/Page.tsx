import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import { getHistory, removeFromHistory } from "@/shared/api/historyApi";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import { INews, NewsCard } from "@/entities/news";
import { supabase } from "@/shared/api/supabaseClient";
import EmptyState from "@/shared/ui/EmptyState/EmptyState";
import ErrorState from "@/shared/ui/ErrorState/ErrorState";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";
import styles from "./styles.module.css";

const HistoryPage = () => {
  const { isDarkMode } = useTheme();
  const navigateTo = useNavigateWithElement();

  const [email, setEmail] = useState<string | null>(null);
  const [history, setHistory] = useState<INews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const userEmail = session?.user?.email ?? null;
        setEmail(userEmail);

        if (!userEmail) {
          setIsLoading(false);
          setIsHistoryLoading(false);
          return;
        }

        const historyData = await getHistory();

        const mappedHistory: INews[] = historyData.map(item => ({
          id: item.news_id,
          title: item.title,
          description: item.description ?? "",
          image: item.image,
          source: item.source ?? "",
          categories: [],
          publishedAt: item.published_at ?? "",
          url: item.url,
        }));

        setHistory(mappedHistory);
      } catch (error) {
        console.error("Failed to load history:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsHistoryLoading(false);
      }
    };

    loadPage();
  }, []);

  const handleRemove = async (
    event: React.MouseEvent<HTMLButtonElement>,
    newsId: string
  ) => {
    event.stopPropagation();

    try {
      await removeFromHistory(newsId);
      setHistory(prev => prev.filter(item => item.id !== newsId));
    } catch (error) {
      console.error("Failed to remove history item:", error);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading history..." />;
  }

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className={styles.wrapper}>
      <section className={`${styles.card} ${isDarkMode ? styles.dark : styles.light}`}>
        <h1 className={styles.title}>History</h1>

        {isError ? (
          <ErrorState
            title="Failed to load history"
            description="Please try again later."
          />
        ) : history.length === 0 && !isHistoryLoading ? (
          <EmptyState
            title="No viewed news yet"
            description="Open a few articles and they will appear here."
          />
        ) : (
          <ul className={styles.list}>
            {history.map(news => (
              <li key={news.id} className={styles.item}>
                <NewsCard item={news} type="item" onClick={navigateTo} />
                <button
                  type="button"
                  onClick={event => handleRemove(event, news.id)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default HistoryPage;