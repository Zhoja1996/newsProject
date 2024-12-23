import { getNews, getСategories } from '../../api/apiNews';
import { PAGE_SIZE, TOTAL_PAGES } from '../../constants/constants';

import { useFetch } from '../../helpers/hooks/useFetch';
import { useFilters } from '../../helpers/hooks/useFilters';
import { useDebounce } from '../../helpers/hooks/useDebounce';

import NewsList from '../../components/NewsList/NewsList';
import NewsBanner from '../../components/NewsBanner/NewsBanner';
import Pagination from '../../components/Pagination/Pagination';
import Categories from '../../components/Categories/Categories';
import Search from '../../components/Search/Search';

import styles from './styles.module.css';

const Main = () => {
    const { filters, changeFilter } = useFilters({
        page_number: 1,
        page_size: PAGE_SIZE,
        category: null,
        keywords: '',
    });

    const debouncedKeywords = useDebounce(filters.keywords, 1500);

    const { data, isLoading } = useFetch(getNews, {
        ...filters,
        keywords: debouncedKeywords,
    });

    const { data: dataCategories } = useFetch(getСategories);

    const handleNextPage = () => {
        if (filters.page_number < TOTAL_PAGES) {
            changeFilter('page_number', filters.page_number + 1);
        }
    };

    const handlePreviousPage = () => {
        if (filters.page_number > 1) {
            changeFilter('page_number', filters.page_number - 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        changeFilter('page_number', pageNumber);
    };

    return (
        <main className={styles.main}>
            {dataCategories && (
                <Categories
                    categories={dataCategories.categories}
                    selectedCategory={filters.category}
                    setSelectorCategory={(category) => changeFilter('category', category)}
                />
            )}

            <Search
                keywords={filters.keywords}
                setKeywords={(keywords) => changeFilter('keywords', keywords)}
            />

            <NewsBanner isLoading={isLoading} item={data?.news?.[0]} />

            <Pagination
                totalPages={TOTAL_PAGES}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                handlePageClick={handlePageClick}
                currentPage={filters.page_number}
            />

            <NewsList isLoading={isLoading} news={data?.news} />

            <Pagination
                totalPages={TOTAL_PAGES}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                handlePageClick={handlePageClick}
                currentPage={filters.page_number}
            />
        </main>
    );
};

export default Main;
