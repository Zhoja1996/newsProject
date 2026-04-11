import { useAppDispatch, useAppSelector } from "@/app/appStore";
import {
  useGetLatestNewsQuery,
  useGetNewsQuery,
} from "@/entities/news/api/newsApi";
import { setFilters } from "@/entities/news/model/newsSlice";
import { useDebounce } from "@/shared/hooks/useDebounce";
import NewsFeedLoader from "@/shared/ui/NewsFeedLoader/NewsFeedLoader";
import LatestNews from "./LatestNews/LatestNews";
import NewsByFilters from "./NewsByFilters/NewsByFilters";
import styles from "./styles.module.css";
import NewsControls from "./NewsControls/NewsControls";

const MainPage = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.news.filters);
  const debouncedKeywords = useDebounce(filters.keywords, 500);

  const { isLoading: isLatestLoading } = useGetLatestNewsQuery("published_at");

  const { isLoading: isNewsLoading } = useGetNewsQuery({
    ...filters,
    keywords: debouncedKeywords,
  });

  const isPageLoading = isLatestLoading || isNewsLoading;

  const selectedCategory = filters.category
    ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
    : "All";

  const handleCategoryChange = (category: string) => {
    dispatch(
      setFilters({
        key: "category",
        value: category === "All" ? null : category.toLowerCase(),
      })
    );
    dispatch(setFilters({ key: "page_number", value: 1 }));
  };

  const handleSearchChange = (value: string) => {
    dispatch(setFilters({ key: "keywords", value }));
    dispatch(setFilters({ key: "page_number", value: 1 }));
  };

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
        <NewsControls
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          searchValue={filters.keywords}
          onSearchChange={handleSearchChange}
        />

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