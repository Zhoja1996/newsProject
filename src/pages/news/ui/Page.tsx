import { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "@/app/appStore";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { NewsDetails } from "@/entities/news";
import type { INews } from "@/entities/news";
import { useGetNewsQuery } from "@/entities/news/api/newsApi";
import { NewsList } from "@/widgets/news";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import { Pagination } from "@/features/pagination";
import styles from "./styles.module.css";

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","to","of","in","on",
  "for","with","at","by","from","is","are","was","were",
]);

const NewsPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const currentNewsFromStore = useAppSelector(state => state.news.currentNews);
  const navigateTo = useNavigateWithElement();

  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);

  const currentNews: INews | null = useMemo(() => {
    if (currentNewsFromStore && currentNewsFromStore.id === id) return currentNewsFromStore;
    if (!id) return null;
    const savedNews = localStorage.getItem(`currentNews:${id}`);
    if (!savedNews) return null;
    try { return JSON.parse(savedNews) as INews; } 
    catch { return null; }
  }, [currentNewsFromStore, id]);

  const searchQuery = useMemo(() => {
    if (!currentNews?.title) return "";
    return currentNews.title
      .toLowerCase()
      .replace(/[^\w\s]/g,"")
      .split(" ")
      .filter(word => word.length > 2 && !STOP_WORDS.has(word))
      .slice(0,4)
      .join(" ");
  }, [currentNews]);

  const primaryCategory = currentNews?.categories?.[0] ?? null;

  // Запрос новостей с учетом пагинации через nextPageToken
  const { data, isLoading } = useGetNewsQuery({
    keywords: searchQuery || "",
    page_size: 3,
    category: primaryCategory,
    nextPageToken: nextPageToken, // <-- правильное имя параметра
  }, { skip: !currentNews });

  useEffect(() => {
    if (data?.nextPage) setNextPageToken(data.nextPage ?? undefined);
  }, [data]);

  if (!currentNews) {
    return (
      <div>
        <h1>{t.news.cannotFind}</h1>
        <Link to="/"><h3 className={styles.title}>{t.news.goHome}</h3></Link>
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
          <p className={styles.similarSubtitle}>{t.news.relatedArticles}</p>
        </div>

        <Pagination
          bottom
          currentPage={currentPage}
          totalPages={10} // Можно вычислять динамически по nextPageToken
          handlePageClick={(page) => setCurrentPage(page)}
          handleNextPage={() => setCurrentPage(prev => prev + 1)}
          handlePreviousPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          {data?.news?.length === 0 && !isLoading ? (
            <p className={styles.emptyText}>{t.news.noSimilar}</p>
          ) : (
            <NewsList
              news={data?.news}
              isLoading={isLoading}
              type="item"
              direction="column"
              onItemClick={navigateTo}
            />
          )}
        </Pagination>
      </section>
    </main>
  );
};

export default NewsPage;