import { IFilters } from "@/shared/interfaces";
import { INews } from "@/entities/news";
import PaginationWrapper from "@/features/pagination/ui/Pagination/Pagination";
import { usePaginationNews } from "../../utils/hooks/usePaginationNews";
import { useNavigateWithElement } from "@/shared/hooks/useNavigate";
import styles from "./styles.module.css";

interface Props {
  filters: IFilters;
  heroNews: INews | null;
  featuredNews: INews[];
  news: INews[];
  isLoading: boolean;
  isError: boolean;
  totalPages: number;
}

const NewsListWithPagination = ({
  filters,
  heroNews,
  featuredNews,
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

  if (!isLoading && !heroNews && featuredNews.length === 0 && news.length === 0) {
    return (
      <div className={styles.empty}>
        <h3>Nothing found</h3>
        <p>Try another category or search query.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {heroNews && (
        <article
          className={styles.hero}
          onClick={() => navigateTo(heroNews)}
          role="button"
          tabIndex={0}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === " ") {
              navigateTo(heroNews);
            }
          }}
        >
          <div className={styles.heroContent}>
            <div className={styles.heroMetaTop}>
              <span className={styles.badge}>Breaking</span>
              <span className={styles.metaLabel}>News</span>
            </div>

            <h2 className={styles.heroTitle}>{heroNews.title}</h2>

            {heroNews.description && (
              <p className={styles.heroDescription}>{heroNews.description}</p>
            )}

            <div className={styles.meta}>
              <span>{heroNews.pubDate || "Recently"}</span>
              <span>{heroNews.source_id || "Unknown source"}</span>
            </div>
          </div>

          {heroNews.image_url && (
            <div className={styles.heroImageWrapper}>
              <img
                src={heroNews.image_url}
                alt={heroNews.title}
                className={styles.heroImage}
              />
            </div>
          )}
        </article>
      )}

      {featuredNews.length > 0 && (
        <div className={styles.featuredGrid}>
          {featuredNews.map(item => (
            <article
              key={item.article_id}
              className={styles.card}
              onClick={() => navigateTo(item)}
              role="button"
              tabIndex={0}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") {
                  navigateTo(item);
                }
              }}
            >
              {item.image_url && (
                <div className={styles.cardImageWrapper}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className={styles.cardImage}
                  />
                </div>
              )}

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>

                <div className={styles.meta}>
                  <span>{item.pubDate || "Recently"}</span>
                  <span>{item.source_id || "Unknown source"}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {news.length > 0 && (
        <div className={styles.newsGrid}>
          {news.map(item => (
            <article
              key={item.article_id}
              className={styles.card}
              onClick={() => navigateTo(item)}
              role="button"
              tabIndex={0}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") {
                  navigateTo(item);
                }
              }}
            >
              {item.image_url && (
                <div className={styles.cardImageWrapper}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className={styles.cardImage}
                  />
                </div>
              )}

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>

                {item.description && (
                  <p className={styles.cardDescription}>{item.description}</p>
                )}

                <div className={styles.meta}>
                  <span>{item.pubDate || "Recently"}</span>
                  <span>{item.source_id || "Unknown source"}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <PaginationWrapper
        bottom
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handlePageClick={handlePageClick}
        totalPages={totalPages}
        currentPage={filters.page_number}
      >
        <div />
      </PaginationWrapper>
    </div>
  );
};

export default NewsListWithPagination;