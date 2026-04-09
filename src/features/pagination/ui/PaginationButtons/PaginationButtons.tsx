import { useTheme } from "@/app/providers/ThemeProvider";
import { IPaginationProps } from "../../model/types";
import styles from "./styles.module.css";

const DOTS = "dots";

const PaginationButtons = ({
  totalPages,
  handlePreviousPage,
  handleNextPage,
  handlePageClick,
  currentPage,
}: IPaginationProps) => {
  const { isDarkMode } = useTheme();

  const getPaginationItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, DOTS, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, DOTS, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      DOTS,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      DOTS,
      totalPages,
    ];
  };

  const paginationItems = getPaginationItems();

  return (
    <div className={`${styles.pagination} ${isDarkMode ? styles.dark : styles.light}`}>
      <button
        disabled={currentPage <= 1}
        onClick={handlePreviousPage}
        className={styles.arrow}
        aria-label="Previous page"
      >
        ‹
      </button>

      <div className={styles.list}>
        {paginationItems.map((item, index) => {
          if (item === DOTS) {
            return (
              <span key={`dots-${index}`} className={styles.dots}>
                ...
              </span>
            );
          }

          const page = item as number;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`${styles.pageNumber} ${isActive ? styles.active : ""}`}
              disabled={isActive}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        disabled={currentPage >= totalPages}
        onClick={handleNextPage}
        className={styles.arrow}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
};

export default PaginationButtons;