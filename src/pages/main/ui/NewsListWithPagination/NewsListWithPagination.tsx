import { IFilters } from "@/shared/interfaces";
import { INews } from "@/entities/news";
import NewsList from "@/widgets/news/ui/NewsList/NewsList";
import PaginationWrapper from "@/features/pagination/ui/Pagination/Pagination";
import { usePaginationNews } from "../../utils/hooks/usePaginationNews";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import EmptyState from "@/shared/ui/EmptyState/EmptyState";
import ErrorState from "@/shared/ui/ErrorState/ErrorState";

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
      <ErrorState
        title="Failed to load news"
        description="Please try again later."
      />
    );
  }

  if (!isLoading && news.length === 0) {
    return (
      <EmptyState
        title="Nothing found"
        description="Try another category or search query."
      />
    );
  }

  return (
    <PaginationWrapper
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
        onItemClick={navigateTo}
      />
    </PaginationWrapper>
  );
};

export default NewsListWithPagination;