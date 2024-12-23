import { getNews, getСategories } from '../../api/apiNews';
import { PAGE_SIZE, TOTAL_PAGES } from '../../constants/constants';

import { useFetch } from '../../helpers/hooks/useFetch';
import { useFilters } from '../../helpers/hooks/useFilters';
import { useDebounce } from '../../helpers/hooks/useDebounce';

import NewsList from '../../components/NewsList/NewsList';
import NewsBanner from '../../components/NewsBanner/NewsBanner';
import Pagination from '../../components/Pagination/Pagination';
import Categories from '../../components/Categories/Categories';

import styles from './styles.module.css';

const Main = () => {

    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const totalPages = 10;
    const pageSize = 10;

    const fetchNews = async (currentPage) => {
        try {
            setIsLoading(true);
            const response = await getNews({
                page_number: currentPage,
                page_size: pageSize,
                category: selectedCategory === 'ALL' ? null : selectedCategory
            });
            setNews(response.news.filter(item => item.image.length >= 5));
            setIsLoading(false);
            
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await getСategories();
            setCategories(["ALL", ...response.categories]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    useEffect(() => {
        fetchNews(currentPage);
    }, [currentPage, selectedCategory])

    const handleNextPage = () => {
        if(filters.page_number < TOTAL_PAGES) {
            changeFilter('page_number', filters.page_number + 1);
        }
    }

    const handlePreviousPage = () => {
        if(filters.page_number > 1) {
            changeFilter('page_number', filters.page_number - 1);
        }
    }

    const handlePageClick = (pageNumber) => {
        changeFilter('page_number', pageNumber);
    }

    return (
        <main className={styles.main}>
            {dataCategories ? 
            <Categories 
            categories={categories}
            setSelectorCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            />
            {news.length > 0 && !isLoading ? (
                <NewsBanner item={news[0]} />
            ) : (
                <Skeleton type={"banner"} count={1} />
            )}

            <Pagination
                totalPages={TOTAL_PAGES}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                handlePageClick={handlePageClick}
                currentPage={filters.page_number}/>

            <NewsList isLoading={isLoading} news={data?.news} />

            <Pagination
                totalPages={TOTAL_PAGES}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                handlePageClick={handlePageClick}
                currentPage={filters.page_number}/>
        </main>
    )
};

export default Main;