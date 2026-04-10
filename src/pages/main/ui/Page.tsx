import { useAppSelector } from "@/app/appStore";
import {
  useGetLatestNewsQuery,
  useGetNewsQuery,
} from "@/entities/news/api/newsApi";
import { useDebounce } from "@/shared/hooks/useDebounce";
import NewsFeedLoader from "@/shared/ui/NewsFeedLoader/NewsFeedLoader";
import LatestNews from "./LatestNews/LatestNews";
import NewsByFilters from "./NewsByFilters/NewsByFilters";
import styles from "./styles.module.css";
import NewsControls from "./NewsControls/NewsControls";

const MainPage = () => {
  const filters = useAppSelector(state => state.news.filters);
  const debouncedKeywords = useDebounce(filters.keywords, 500);

  const { isLoading: isLatestLoading } = useGetLatestNewsQuery();

  const { isLoading: isNewsLoading } = useGetNewsQuery({
    ...filters,
    keywords: debouncedKeywords,
  });

  const isPageLoading = isLatestLoading || isNewsLoading;

  if (isPageLoading) {
    return (
      <main className={styles.main}>
        <NewsFeedLoader />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <NewsControls />

        <section className={styles.topSection}>
          <div className={styles.content}>
            <NewsByFilters />
          </div>

          <aside className={styles.sidebar}>
            <LatestNews />
          </aside>
        </section>
      </div>
    </main>
  );
};

export default MainPage;