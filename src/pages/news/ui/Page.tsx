import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "@/app/appStore";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { NewsDetails } from "@/entities/news";
import type { INews } from "@/entities/news";
import { useGetNewsQuery } from "@/entities/news/api/newsApi";
import { NewsList } from "@/widgets/news";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import styles from "./styles.module.css";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "to", "of", "in", "on",
  "for", "with", "at", "by", "from", "is", "are", "was", "were",
]);

const NewsPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const currentNewsFromStore = useAppSelector(state => state.news.currentNews);
  const navigateTo = useNavigateWithElement();

  const currentNews: INews | null = useMemo(() => {
    if (currentNewsFromStore && currentNewsFromStore.id === id) {
      return currentNewsFromStore;
    }

    if (!id) {
      return null;
    }

    const savedNews = localStorage.getItem(`currentNews:${id}`);

    if (!savedNews) {
      return null;
    }

    try {
      return JSON.parse(savedNews) as INews;
    } catch (error) {
      console.error("Failed to parse current news from localStorage:", error);
      return null;
    }
  }, [currentNewsFromStore, id]);

  const searchQuery = useMemo(() => {
    if (!currentNews?.title) {
      return "";
    }

    return currentNews.title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter(word => word.length > 2 && !STOP_WORDS.has(word))
      .slice(0, 4)
      .join(" ");
  }, [currentNews]);

  const primaryCategory = currentNews?.categories?.[0] ?? null;

  const { data: similarByKeywordsResponse, isLoading: isSimilarLoading } =
    useGetNewsQuery(
      {
        keywords: searchQuery,
        page_number: 1,
        page_size: 3,
        category: null,
      },
      {
        skip: !searchQuery,
      }
    );

  const { data: similarByCategoryResponse, isLoading: isCategoryLoading } =
    useGetNewsQuery(
      {
        keywords: "",
        page_number: 1,
        page_size: 3,
        category: primaryCategory,
      },
      {
        skip: !primaryCategory,
      }
    );

  const similarByKeywords = (similarByKeywordsResponse?.news ?? []).filter(
    item => item.id !== currentNews?.id
  );

  const similarByCategory = (similarByCategoryResponse?.news ?? []).filter(
    item => item.id !== currentNews?.id
  );

  const similarNews =
    similarByKeywords.length > 0 ? similarByKeywords : similarByCategory;

  const isLoading = isSimilarLoading || isCategoryLoading;

  if (!currentNews) {
    return (
      <div>
        <h1>{t.news.cannotFind}</h1>
        <Link to="/">
          <h3 className={styles.title}>{t.news.goHome}</h3>
        </Link>
      </div>
    );
  }

  return (
    <main className={styles.news}>
      <h1>{currentNews.title}</h1>

      <NewsDetails item={currentNews} />

      <section className={styles.similarSection}>
        <div className={styles.similarHeader}>
          <h2 className={styles.similarTitle}>{t.news.similarNews}</h2>
          <p className={styles.similarSubtitle}>
            {t.news.relatedArticles}
          </p>
        </div>

        {similarNews.length === 0 && !isLoading ? (
          <p className={styles.emptyText}>{t.news.noSimilar}</p>
        ) : (
          <NewsList
            news={similarNews}
            isLoading={isLoading}
            type="item"
            direction="column"
            onItemClick={navigateTo}
          />
        )}
      </section>
    </main>
  );
};

export default NewsPage;