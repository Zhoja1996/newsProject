import { useAppSelector } from "@/app/appStore";
import { useGetNewsQuery } from "@/entities/news/api/newsApi";
import { useGetCategoriesQuery } from "@/entities/category/api/categoriesApi";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { NewsFilters } from "@/widgets/news";
import NewsListWithPagination from "../NewsListWithPagination/NewsListWithPagination";
import styles from "./styles.module.css";

const NewsByFilters = () => {
  const filters = useAppSelector(state => state.news.filters);
  const news = useAppSelector(state => state.news.news);
  const debouncedKeywords = useDebounce(filters.keywords, 1500);

  const { isLoading } = useGetNewsQuery({
    ...filters,
    keywords: debouncedKeywords,
  });

  const { data } = useGetCategoriesQuery();

  return (
    <section className={styles.section}>
      <NewsFilters
        filters={filters}
        categories={data?.categories || []}
      />

      <NewsListWithPagination
        filters={filters}
        news={news}
        isLoading={isLoading}
      />
    </section>
  );
};

export default NewsByFilters;