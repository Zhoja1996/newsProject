import { useMemo, useState } from "react";
import { useGetLatestNewsQuery } from "@/entities/news/api/newsApi";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import styles from "./styles.module.css";

type FeedMode = "latest" | "popular";

const LatestNews = () => {
  const [mode, setMode] = useState<FeedMode>("latest");
  const { data, isLoading, isError } = useGetLatestNewsQuery("published_at");
  const navigateTo = useNavigateWithElement();

  const news = data?.news ?? [];

  const displayedNews = useMemo(() => {
    if (!news.length) {
      return [];
    }

    if (mode === "latest") {
      return news.slice(0, 5);
    }

    return [...news]
      .sort((a, b) => {
        const scoreA = (a.title?.length ?? 0) + (a.description?.length ?? 0);
        const scoreB = (b.title?.length ?? 0) + (b.description?.length ?? 0);
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }, [mode, news]);

  if (isError) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.empty}>
          <h3>Failed to load news</h3>
          <p>Please try again later.</p>
        </div>
      </aside>
    );
  }

  if (!isLoading && displayedNews.length === 0) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.empty}>
          <h3>No news available</h3>
          <p>Please try again later.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>News feed</h2>

        <div className={styles.tabs}>
          <button
            type="button"
            onClick={() => setMode("latest")}
            className={`${styles.tab} ${mode === "latest" ? styles.activeTab : ""}`}
          >
            Latest
          </button>

          <button
            type="button"
            onClick={() => setMode("popular")}
            className={`${styles.tab} ${mode === "popular" ? styles.activeTab : ""}`}
          >
            Popular
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {displayedNews.map(item => (
          <article
            key={item.id}
            className={styles.item}
            onClick={() => navigateTo(item)}
            role="button"
            tabIndex={0}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === " ") {
                navigateTo(item);
              }
            }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}

            <div className={styles.content}>
              <h3 className={styles.itemTitle}>{item.title}</h3>

              <div className={styles.meta}>
                <span>{item.publishedAt || "Recently"}</span>
                <span>{item.source || "Unknown source"}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
};

export default LatestNews;