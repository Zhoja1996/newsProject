import { useMemo, useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useGetLatestNewsQuery } from "@/entities/news/api/newsApi";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import EmptyState from "@/shared/ui/EmptyState/EmptyState";
import ErrorState from "@/shared/ui/ErrorState/ErrorState";
import styles from "./styles.module.css";

type FeedMode = "latest" | "popular";

const LatestNews = () => {
  const [mode, setMode] = useState<FeedMode>("latest");
  const { t } = useLanguage();
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
        <ErrorState
          title={t.main.failedToLoad}
          description={t.main.tryLater}
        />
      </aside>
    );
  }

  if (!isLoading && displayedNews.length === 0) {
    return (
      <aside className={styles.sidebar}>
        <EmptyState
          title={t.main.noNews}
          description={t.main.tryLater}
        />
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t.main.newsFeed}</h2>

        <div className={styles.tabs}>
          <button
            type="button"
            onClick={() => setMode("latest")}
            className={`${styles.tab} ${mode === "latest" ? styles.activeTab : ""}`}
          >
            {t.main.latest}
          </button>

          <button
            type="button"
            onClick={() => setMode("popular")}
            className={`${styles.tab} ${mode === "popular" ? styles.activeTab : ""}`}
          >
            {t.main.popular}
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
              <span>{item.publishedAt || t.main.recently}</span>
              <span>{item.source || t.main.unknownSource}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
};

export default LatestNews;