import { useAppDispatch } from "@/app/appStore";
import Categories from "@/features/category/ui/Categories/Categories";
import Search from "@/features/search/ui/Search/Search";
import Slider from "@/features/slider/ui/Slider/Slider";
import { IFilters } from "@/shared/interfaces";
import styles from "./styles.module.css";
import { setFilters } from "@/entities/news/model/newsSlice";
import { useTheme } from "@/app/providers/ThemeProvider";
import { CategoriesType } from "@/entities/category";

interface Props {
    filters: IFilters;
    categories: CategoriesType[];
}

const NewsFilters = ({ filters, categories }: Props) => {
    const { isDarkMode } = useTheme();

    const dispatch = useAppDispatch();

    return (
        <div className={styles.filters}>
            {categories ? (
            <Slider isDarkMode={isDarkMode}>
                <Categories
                    categories={categories}
                    selectedCategory={filters.category}
                    setSelectedCategory={(category) =>
                        dispatch(setFilters({key: "category", value: category}))
                    }
                />
            </Slider>
            ) : null}

            <Search
                keywords={filters.keywords}
                setKeywords={(keywords) => dispatch(setFilters({key: "keywords", value: keywords}))}
            />
        </div>
    );
};

export default NewsFilters;