import { useEffect, useState } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { getHistory, removeFromHistory } from "@/shared/api/historyApi";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import { INews, NewsCard } from "@/entities/news";
import EmptyState from "@/shared/ui/EmptyState/EmptyState";
import ErrorState from "@/shared/ui/ErrorState/ErrorState";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";
import styles from "./styles.module.css";

const HistoryPage = () => {
  const { isDarkMode } = useTheme();
  const { session } = useAuth();
  const navigateTo = useNavigateWithElement();

  const userId = session?.user?.id ?? null;

  const [history, setHistory] = useState<INews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      if (!userId) {
        setIsLoading(false);
        setIsHistoryLoading(false);
        return;
      }

      try {
        const historyData = await getHistory(userId);

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
  }, [userId]);

  const handleRemove = async (
    event: React.MouseEvent<HTMLButtonElement>,
    newsId: string
  ) => {
    event.stopPropagation();

    if (!userId) {
      return;
    }

    try {
      await removeFromHistory(userId, newsId);
      setHistory(prev => prev.filter(item => item.id !== newsId));
    } catch (error) {
      console.error("Failed to remove history item:", error);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading history..." />;
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