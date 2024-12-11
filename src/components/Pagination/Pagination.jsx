import styles from './styles.module.css';

const Pagination = ({
    totalPages,
    handleNextPage,
    handlePageClick,
    handlePreviousPage,
    currentPage
    }) => {
    return (
        <div className={styles.pagination}>
            <button
            onClick={handlePreviousPage}
            className={styles.arrow}
            disabled={currentPage <= 1}>
                {'<'}
            </button>
            <div className={styles.list}>
                {[...Array(totalPages)].map((_, index) => {
                    return <button
                    onClick={() => handlePageClick(index + 1)}
                    className={styles.pageNumber}
                    disabled={index + 1 === currentPage}
                    key={index}
                    >
                        {index + 1}
                    </button>
                })}
            </div>
            <button
            onClick={handleNextPage} 
            className={styles.arrow}
            disabled={currentPage >= totalPages}>
                {'>'}
            </button>
        </div>
    )
};

export default Pagination;