import { IFilters } from "@/shared/interfaces";
import { INews } from "@/entities/news";
import NewsList from "@/widgets/news/ui/NewsList/NewsList";
import PaginationWrapper from "@/features/pagination/ui/Pagination/Pagination";
import { usePaginationNews } from "../../utils/hooks/usePaginationNews";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import styles from "./styles.module.css";

interface Props {
  filters: IFilters;
  news: INews[];
  isLoading: boolean;
  isError: boolean;
  totalPages: number;
}

const NewsListWithPagination = ({
  filters,
  news,
  isLoading,
  isError,
  totalPages,
}: Props) => {
  const navigateTo = useNavigateWithElement();
  const { handleNextPage, handlePreviousPage, handlePageClick } =
    usePaginationNews(filters);

  if (isError) {
    return (
      <div className={styles.empty}>
        <h3>Failed to load news</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (!isLoading && news.length === 0) {
    return (
      <div className={styles.empty}>
        <h3>Nothing found</h3>
        <p>Try another category or search query.</p>
      </div>
    );
  }

  return (
    <PaginationWrapper
      top
      bottom
      handlePreviousPage={handlePreviousPage}
      handleNextPage={handleNextPage}
      handlePageClick={handlePageClick}
      totalPages={totalPages}
      currentPage={filters.page_number}
    >
      <NewsList
        isLoading={isLoading}
        news={news}
        type="item"
        direction="column"
        viewNewslot={(news: INews) => (
          <p onClick={() => navigateTo(news)}>view more...</p>
        )}
      />
    </PaginationWrapper>
  );
};

export default NewsListWithPagination;