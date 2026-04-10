import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/appStore";
import { setFilters } from "@/entities/news/model/newsSlice";
import { useGetNewsQuery } from "@/entities/news/api/newsApi";
import { useDebounce } from "@/shared/hooks/useDebounce";
import NewsListWithPagination from "../NewsListWithPagination/NewsListWithPagination";
import styles from "./styles.module.css";

const MAX_VISIBLE_PAGES = 10;

const NewsByFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.news.filters);
  const debouncedKeywords = useDebounce(filters.keywords, 500);

  const {
    data: newsResponse,
    isLoading,
    isError,
  } = useGetNewsQuery({
    ...filters,
    keywords: debouncedKeywords,
  });

  const news = newsResponse?.news ?? [];
  const found = newsResponse?.meta?.found ?? 0;
  const limit = newsResponse?.meta?.limit ?? filters.page_size;

  const calculatedPages = Math.max(1, Math.ceil(found / limit));
  const totalPages = Math.min(calculatedPages, MAX_VISIBLE_PAGES);

  useEffect(() => {
    if (!isLoading && filters.page_number > totalPages) {
      dispatch(setFilters({ key: "page_number", value: totalPages }));
    }
  }, [dispatch, filters.page_number, isLoading, totalPages]);

  const heroNews = news[0] ?? null;
  const featuredNews = news.slice(1, 4);
  const restNews = news.slice(4);

  return (
    <section className={styles.section}>
      <NewsListWithPagination
        filters={filters}
        heroNews={heroNews}
        featuredNews={featuredNews}
        news={restNews}
        isLoading={isLoading}
        isError={isError}
        totalPages={totalPages}
      />
    </section>
  );
};

export default NewsByFilters;