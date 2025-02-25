import { TOTAL_PAGES } from "@/shared/constants/constants";
import { IFilters } from "@/shared/interfaces";
import { INews } from "@/entities/news";
import NewsList from "@/widgets/news/ui/NewsList/NewsList";
import PaginationWrapper from "@/features/pagination/ui/Pagination/Pagination";
import { usePaginationNews } from "../../utils/hooks/usePaginationNews";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";

interface Props {
    filters: IFilters;
    news: INews[];
    isLoading: boolean;
}

const NewsListWithPagination = ({ filters, news, isLoading }: Props) => {

    const navigateTo = useNavigateWithElement();

    const {handleNextPage, handlePreviousPage, handlePageClick} = usePaginationNews(filters);

    return (
        <PaginationWrapper
            top
            bottom
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            handlePageClick={handlePageClick}
            totalPages={TOTAL_PAGES}
            currentPage={filters.page_number}
        >
            <NewsList 
                isLoading={isLoading} 
                news={news} 
                type="item" 
                direction="column"
                viewNewslot={(news : INews) => (
                    <p onClick={() => navigateTo(news)}>view more...</p>
                )} 
            />

        </PaginationWrapper>
    );
};

export default NewsListWithPagination;