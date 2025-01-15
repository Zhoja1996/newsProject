import React from "react";
import { IPaginationProps } from "../../interfaces";
import styles from "./styles.module.css";
import { useTheme } from "../../context/ThemeContext";

const Pagination = ({
    totalPages,
    handlePreviousPage,
    handleNextPage,
    handlePageClick,
    currentPage,
}: IPaginationProps) => {
    const {isDarkMode} = useTheme();
    return (
        <div className={`${styles.pagination} ${isDarkMode ? styles.dark : styles.light}`}>
            <button
                disabled={currentPage <= 1}
                onClick={handlePreviousPage}
                className={styles.arrow}
                >
                {"<"}
            </button>
            <div className={styles.list}>
                {[...Array(totalPages)].map((_, index) => {
                    return (
                        <button
                            onClick={() => handlePageClick(index + 1)}
                            className={styles.pageNumber}
                            disabled={index + 1 === currentPage}
                            key={index}
                            >
                            {index + 1}
                        </button>
                    );
                })}
            </div>

            <button
                disabled={currentPage >= totalPages}
                onClick={handleNextPage}
                className={styles.arrow}
                >
                {">"}
            </button>
        </div>
    );
};

export default Pagination;