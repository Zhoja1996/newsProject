import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTheme } from "@/app/providers/ThemeProvider";
import { getHistory, removeFromHistory } from "@/shared/api/historyApi";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import { INews, NewsCard } from "@/entities/news";
import { supabase } from "@/shared/api/supabaseClient";
import styles from "./styles.module.css";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";

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
    return <PageLoader text="Loading profile..." />;
  }

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className={styles.wrapper}>
      <section className={`${styles.card} ${isDarkMode ? styles.dark : styles.light}`}>
        <h1 className={styles.title}>History</h1>

        {isError ? (
          <p className={styles.text}>Failed to load history.</p>
        ) : history.length === 0 && !isHistoryLoading ? (
          <p className={styles.text}>You have no viewed news yet.</p>
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